<template>
  <q-dialog v-model="test" persistent :maximized="$q.screen.xs || $q.screen.sm">
    <q-card>
      <q-card-section class="top">
        <div>
          <q-btn round flat icon="arrow_back"></q-btn>
        </div>
        <div class="nav-text text-h6">Edit Note</div>
        <div class="buttons"><q-btn flat round icon="o_delete" class="delete-note" @click="deleteNote" /></div>
      </q-card-section>
      <q-card-section class="title"> <input v-model="title" /> </q-card-section>
      <q-card-section class="text"><textarea v-model="text" /></q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from "vue"
import { QForm, useQuasar } from "quasar"
import { useRouter, useRoute } from "vue-router"
import { useStore } from "../store"
import { route } from "quasar/wrappers"
import { Note } from "src/store/note/state"
import { GetterTree } from "vuex"
import router from "src/router"
import { api } from "src/boot/axios"
import { AxiosError } from "axios"

export default defineComponent({
  name: "EditNoteDialog",
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()

    const title = ref()
    const text = ref()

    onMounted(async () => {
      let note = store.state.note.notes.find((note) => note.id === route.params.id)
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
    })

    const deleteNote = async () => {
      const jwt: string = localStorage.getItem("jwt") || ""
      try {
        await api.delete("/notes/" + (route.params.id as string), {
          headers: { Authorization: "Bearer " + jwt },
        })
        // void store.dispatch("note/getNotes")
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

    return {
      test: ref(true),
      title,
      text,
      deleteNote,
    }
  },
})
</script>

<style lang="scss" scoped>
@media (min-width: $breakpoint-md-min) {
  .q-card {
    width: 800px;
    max-width: 800px;
    height: 60%;
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
}
.buttons {
  margin-left: auto;
}
.delete-note {
}
</style>
