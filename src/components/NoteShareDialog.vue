<template>
  <q-card class="card">
    <q-card-section>
      <q-toggle v-model="sharing" label="Sharing" />
      <q-input class="q-mt-sm" v-if="sharing" v-model="sharedUrl" outlined readonly>
        <template #append>
          <q-btn flat round icon="o_copy" @click="copy" />
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue"
import { useQuasar, copyToClipboard } from "quasar"
import { useRouter, useRoute } from "vue-router"

import { api } from "src/boot/axios"
import { useStore } from "../store"
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
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()

    const sharing = ref<boolean>(false)
    const sharedNote = ref<SharedNote>()

    const jwt: string = localStorage.getItem("jwt") || ""

    watch(sharing, async (value) => {
      if (value) {
        try {
          const response = await api.post(
            "/notes/" + props.noteId + "/shared",
            {},
            {
              headers: { Authorization: "Bearer " + jwt },
            },
          )
          sharedNote.value = response.data as SharedNote
        } catch (err) {
          sharing.value = false
          $q.notify({
            color: "negative",
            position: "top",
            message: "Something went wrong",
            icon: "report_problem",
          })
        }
      } else {
        try {
          const response = await api.delete("/notes/" + props.noteId + "/shared", {
            headers: { Authorization: "Bearer " + jwt },
          })
          sharedNote.value = response.data as SharedNote
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
    })

    try {
      const response = await api.get("/notes/" + props.noteId, {
        headers: { Authorization: "Bearer " + jwt },
      })
      sharedNote.value = (response.data as Note).sharedNote
      sharing.value = sharedNote.value != undefined
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

    return { sharing, sharedNote, sharedUrl, copy }
  },
})
</script>

<style lang="scss">
.card {
  width: 400px !important;
  height: auto !important;
}
</style>
