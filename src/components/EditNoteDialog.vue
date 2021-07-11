<template>
  <q-dialog v-model="test" :maximized="$q.screen.xs || $q.screen.sm" @before-hide="goBack">
    <q-card :style="'background-color:' + color">
      <q-card-section class="top">
        <div>
          <q-btn round flat icon="arrow_back" @click="goBack"></q-btn>
        </div>
        <div class="nav-text text-h6">Edit Note</div>
        <div class="buttons">
          <q-btn flat round icon="o_palette">
            <q-popup-proxy>
              <div class="color-picker">
                <q-color
                  v-model="color"
                  no-header
                  no-footer
                  default-view="palette"
                  :palette="[
                    '#FFFFFF',
                    '#ff9999',
                    '#ffcc99',
                    '#ffff99',
                    '#99ff99',
                    '#99ffff',
                    '#99ccff',
                    '#9999ff',
                    '#cc99ff',
                    '#ff99ff',
                  ]"
                  class="color-picker"
                />
              </div>
            </q-popup-proxy>
          </q-btn>
          <q-btn flat round icon="o_delete" color="negative" @click="deleteNote" />
        </div>
      </q-card-section>
      <q-card-section class="title"> <input v-model="title" maxlength="50" placeholder="Title" /> </q-card-section>
      <q-card-section class="text"><textarea v-model="text" maxlength="10000" /></q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useRouter, useRoute } from "vue-router"

import { api } from "src/boot/axios"
import { Note } from "src/store/note/state"
import { useStore } from "../store"

export default defineComponent({
  name: "EditNoteDialog",
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()

    const title = ref<string>()
    const text = ref<string>()
    const color = ref<string>()

    let note = store.state.note.notes.find((note) => note.id === route.params.id)

    onMounted(async () => {
      if (!note) {
        const jwt: string = localStorage.getItem("jwt") || ""
        try {
          const response = await api.get("/notes/" + (route.params.id as string), {
            headers: { Authorization: "Bearer " + jwt },
          })
          note = response.data as Note
        } catch (err) {
          void router.push("/404")
        }
      }
      title.value = note?.title
      text.value = note?.text
      color.value = note?.color
    })

    const deleteNote = async () => {
      const jwt: string = localStorage.getItem("jwt") || ""
      try {
        await api.delete("/notes/" + (route.params.id as string), {
          headers: { Authorization: "Bearer " + jwt },
        })
        store.commit("note/deleteNote", route.params.id)
        void router.push("/")
      } catch (err) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "Something went wrong",
          icon: "report_problem",
        })
      }
    }

    const patchNote = async () => {
      const jwt: string = localStorage.getItem("jwt") || ""
      try {
        await api.patch(
          "/notes/" + (route.params.id as string),
          { text: text.value, title: title.value, color: color.value },
          {
            headers: { Authorization: "Bearer " + jwt },
          },
        )
        await store.dispatch("note/getNotes")
      } catch (err) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "Something went wrong",
          icon: "report_problem",
        })
      }
    }

    const goBack = async () => {
      if ((text.value === "" || text.value == undefined) && (title.value === "" || title.value == undefined)) {
        await deleteNote()
      } else if (text.value !== note?.text || title.value !== note?.title || color.value !== note?.color) {
        void patchNote()
      }
      void router.push("/")
    }

    return {
      test: ref(true),
      title,
      text,
      color,
      deleteNote,
      patchNote,
      goBack,
    }
  },
})
</script>

<style lang="scss" scoped>
.color-picker {
  max-width: 350px;
  width: 350px;
}

@media (min-width: $breakpoint-md-min) {
  .q-card {
    width: 800px;
    max-width: 800px;
    height: 60%;
  }
  .color-picker {
    max-width: 500px;
    width: 500px;
  }
}

.q-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
}

.top {
  display: flex;
  padding-top: 5px;
  padding-left: 5px;
  width: 100%;
  padding-bottom: 0px;
}

.nav-text {
  margin-top: 5px;
}

.title {
  padding-top: 0px;
  padding-bottom: 0px;
}

.title input {
  background-color: transparent;
  width: 100%;
  border-width: 0px;
  border: none;
  font-size: 24px;
  font-weight: bold;
}

.title input:focus,
.text textarea:focus {
  outline: none;
}

.text {
  padding-top: 0px;
  height: 100%;
  padding-right: 0px;
  flex-grow: 1;
  padding-bottom: 0px;
}

.text textarea {
  border-width: 0px;
  width: 100%;
  border: none;
  font-size: 18px;
  resize: none;
  height: 100%;
  background-color: transparent;
}

.buttons {
  margin-left: auto;
}
</style>
