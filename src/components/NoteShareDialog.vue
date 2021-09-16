<template>
  <q-card class="card">
    <q-card-section>
      <q-toggle v-model="sharing" label="Sharing" />
      <q-input v-if="sharing" v-model="sharedUrl" class="q-mt-sm" outlined readonly>
        <template #append>
          <q-btn flat round icon="o_copy" @click="copy" />
        </template>
      </q-input>
      <q-toggle v-if="sharing" v-model="expiring" class="q-py-sm" label="Expiring" />
      <q-input v-if="sharing && expiring" v-model="date" filled mask="date" :rules="['date']" @blur="share">
        <template #append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="date" @update:model-value="share">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue"
import { useQuasar, copyToClipboard } from "quasar"

import { api } from "src/boot/axios"
import { SharedNote, Note } from "src/store/note/state"

export default defineComponent({
  name: "NoteShareDialog",
  props: {
    noteId: {
      type: String,
      default: "",
    },
  },
  async setup(props) {
    const $q = useQuasar()

    const sharing = ref<boolean>()
    const sharedNote = ref<SharedNote>()

    const expiring = ref<boolean>(false)
    const date = ref<string>()
    const oldDate = ref<string>()

    const jwt: string = localStorage.getItem("jwt") || ""

    let setup = true

    watch(expiring, async (value) => {
      if (value) {
        oldDate.value = undefined
      }
      await share()
    })

    watch(sharing, async (value) => {
      // fix call on opening
      if (setup) {
        setup = false
        return
      }

      if (value) {
        await share()
      } else {
        await unshare()
      }
    })

    const share = async () => {
      try {
        let data
        if (expiring.value && date.value) {
          let expiryDate: Date = new Date(date.value)
          expiryDate.setDate(expiryDate.getDate() + 1)
          data = { expiresAt: expiryDate }

          if (oldDate.value == date.value) {
            return
          }
        } else {
          data = {}
        }

        const response = await api.post("/notes/" + props.noteId + "/shared", data, {
          headers: { Authorization: "Bearer " + jwt },
        })
        sharedNote.value = response.data as SharedNote
        oldDate.value = date.value
      } catch (err) {
        sharing.value = false
        $q.notify({
          color: "negative",
          position: "top",
          message: "Something went wrong",
          icon: "report_problem",
        })
      }
    }

    const unshare = async () => {
      try {
        const response = await api.delete("/notes/" + props.noteId + "/shared", {
          headers: { Authorization: "Bearer " + jwt },
        })
        sharedNote.value = response.data as SharedNote
        oldDate.value = undefined
      } catch (err) {
        sharing.value = false
        $q.notify({
          color: "negative",
          position: "top",
          message: "Something went wrong",
          icon: "report_problem",
        })
      }
    }

    try {
      const response = await api.get("/notes/" + props.noteId, {
        headers: { Authorization: "Bearer " + jwt },
      })
      sharedNote.value = (response.data as Note).sharedNote
      sharing.value = sharedNote.value != undefined
      if (sharedNote.value?.expiresAt != undefined) {
        expiring.value = true
        date.value = new Date(sharedNote.value?.expiresAt).toISOString().split("T")[0].replace(/-/g, "/")
        oldDate.value = date.value
      }
    } catch (err) {
      $q.notify({
        color: "negative",
        position: "top",
        message: "Something went wrong",
        icon: "report_problem",
      })
    }

    const sharedUrl = computed((): string => {
      if (sharedNote.value?.id) return `${String(process.env.BASE_URL)}/shared/${String(sharedNote.value?.id)}`
      else return ""
    })

    const copy = () => {
      void copyToClipboard(sharedUrl.value)
    }

    return { sharing, sharedNote, sharedUrl, copy, expiring, date, share }
  },
})
</script>

<style lang="scss">
.card {
  width: 400px !important;
  height: auto !important;
}
</style>
