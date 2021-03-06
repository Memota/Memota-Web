<template>
  <q-dialog v-model="test" :maximized="$q.screen.xs || $q.screen.sm" @before-hide="goBack">
    <q-card :style="'background-color:' + color">
      <q-card-section class="top">
        <div>
          <q-btn round flat icon="arrow_back" :color="darkFont ? 'black' : 'white'" @click="goBack"></q-btn>
        </div>
        <div class="nav-text text-h6" :class="darkFont ? 'text-black' : 'text-white'">Edit Note</div>
        <div class="buttons">
          <q-btn
            flat
            round
            :icon="pinned ? 'push_pin' : 'o_push_pin'"
            :color="darkFont ? 'black' : 'white'"
            @click="togglePinnedState"
          />
          <q-btn
            v-if="!encrypted"
            flat
            round
            :icon="hidden ? 'o_visibility_off' : 'o_visibility'"
            :color="darkFont ? 'black' : 'white'"
            @click="toggleHiddenState"
          />
          <q-btn
            flat
            round
            :icon="encrypted ? 'o_lock' : 'o_lock_open'"
            :color="darkFont ? 'black' : 'white'"
            @click="toggleEncryption"
          />
          <q-btn flat round icon="o_image" :color="darkFont ? 'black' : 'white'" @click="imageDialog = !imageDialog" />
          <q-btn
            v-if="!encrypted"
            flat
            round
            icon="o_share"
            :color="darkFont ? 'black' : 'white'"
            @click="shareDialog = !shareDialog"
          />
          <q-btn
            v-if="!encrypted"
            flat
            round
            icon="o_save_alt"
            :color="darkFont ? 'black' : 'white'"
            @click="downloadNote"
          />
          <q-btn flat round icon="o_palette" :color="darkFont ? 'black' : 'white'">
            <color-picker @onColorChange="updateColor"></color-picker>
          </q-btn>
          <q-btn flat round icon="o_delete" color="negative" @click="deleteNote" />
        </div>
      </q-card-section>
      <q-card-section class="title">
        <input v-model="title" maxlength="50" :class="darkFont ? 'text-black' : 'text-white'" placeholder="Title" />
      </q-card-section>
      <q-card-section class="text">
        <textarea v-model="text" :class="darkFont ? 'text-black' : 'text-white'" maxlength="10000" />
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="shareDialog">
    <Suspense>
      <NoteShareDialog :note-id="$route.params.id"></NoteShareDialog>
    </Suspense>
  </q-dialog>
  <q-dialog v-model="imageDialog">
    <Suspense>
      <ImageSelectDialog :note-id="$route.params.id" @select="selectImage"></ImageSelectDialog>
    </Suspense>
  </q-dialog>
  <PasswordDialog v-if="askPassword" button-text="Submit" @password="enteredPassword"> </PasswordDialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue"
import { useQuasar } from "quasar"
import { useRouter, useRoute } from "vue-router"

import { api } from "src/boot/axios"
import { Note } from "src/store/note/state"
import { useStore } from "../store"
import ColorPicker from "src/components/ColorPicker.vue"
import NoteShareDialog from "components/NoteShareDialog.vue"
import ImageSelectDialog from "components/ImageSelectDialog.vue"
import { downloadFile } from "src/utils/download"
import PasswordDialog from "components/PasswordDialog.vue"
import { NoteSecurity } from "../utils/security"

const darkColorMatcher = new RegExp("^#([0-7][0-9a-fA-F]){3}")

export default defineComponent({
  name: "EditNoteDialog",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  components: { ColorPicker, NoteShareDialog, ImageSelectDialog, PasswordDialog },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()

    const title = ref<string>()
    const text = ref<string>()
    const color = ref<string>()
    const darkFont = ref<boolean>(false)
    const shareDialog = ref<boolean>(false)
    const imageDialog = ref(false)
    const passwordDialog = ref(false)
    const pinned = ref<boolean>(false)
    const hidden = ref<boolean>(false)
    const encrypted = ref<boolean>(false)
    const askPassword = ref<boolean>(false)
    const password = ref<string>()

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
      if (!note?.options.encrypted) text.value = note?.text
      title.value = note?.title
      color.value = note?.color
      pinned.value = note?.options.pinned || false
      hidden.value = note?.options.hidden || false
      encrypted.value = note?.options.encrypted || false
      askPassword.value = note?.options.encrypted || false
      if (color.value) updateColor(color.value)
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

    const selectImage = async (id: string) => {
      const jwt: string = localStorage.getItem("jwt") || ""
      if (id === "clear") {
        await api.delete("/notes/" + (route.params.id as string) + "/image", {
          headers: { Authorization: "Bearer " + jwt },
        })
      } else {
        await api.put(
          "/notes/" + (route.params.id as string) + "/image",
          { image: id },
          {
            headers: { Authorization: "Bearer " + jwt },
          },
        )
      }
      imageDialog.value = false
      await store.dispatch("note/getNotes")
    }

    const patchNote = async () => {
      // Note not loaded yet
      if (note == undefined) {
        return
      }
      const jwt: string = localStorage.getItem("jwt") || ""
      try {
        let content = text.value

        if (encrypted.value) {
          // Should never happen - just in case
          if (password.value == undefined) {
            throw new Error("no password set")
          }
          // Encrypt content
          content = NoteSecurity.encryptText(text.value || "", password.value)
        }

        await api.patch(
          "/notes/" + (route.params.id as string),
          {
            text: content,
            title: title.value,
            color: color.value,
            options: { pinned: pinned.value, hidden: hidden.value, encrypted: encrypted.value },
          },
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

    const updateColor = (newColor: string) => {
      color.value = newColor
      const useDarkFont = !darkColorMatcher.test(newColor)
      darkFont.value = useDarkFont
    }

    const downloadNote = async () => {
      await patchNote()
      const url = "/notes/" + (route.params.id as string) + "/download"
      const fileName = (title.value || "untitled").toLocaleLowerCase().replace(/ /g, "-")
      await downloadFile(url, fileName + ".pdf")
    }

    const togglePinnedState = () => {
      if (note != undefined) {
        pinned.value = !pinned.value
        void patchNote()
      }
    }

    const toggleHiddenState = () => {
      if (note != undefined) {
        hidden.value = !hidden.value
        void patchNote()
      }
    }

    const enteredPassword = (newPass: string) => {
      askPassword.value = false

      if (note != undefined) {
        if (encrypted.value) {
          // try to decrypt note content using the given password
          try {
            text.value = NoteSecurity.decryptContent(note, newPass)
            password.value = newPass
          } catch (err) {
            void router.push("/")

            // password wrong?
            $q.notify({
              color: "negative",
              position: "top",
              message: "Wrong password",
              icon: "report_problem",
            })
          }
        } else {
          // set encryption to true
          encrypted.value = true
          password.value = newPass
          void patchNote()
        }
      }
    }

    const toggleEncryption = () => {
      if (!encrypted.value) {
        // invoke password prompt
        askPassword.value = true
      } else {
        // decrypt remotely
        encrypted.value = false
        void patchNote()
      }
    }

    return {
      test: ref(true),
      title,
      text,
      color,
      deleteNote,
      patchNote,
      goBack,
      updateColor,
      downloadNote,
      darkFont,
      shareDialog,
      note,
      imageDialog,
      selectImage,
      pinned,
      togglePinnedState,
      hidden,
      toggleHiddenState,
      passwordDialog,
      encrypted,
      toggleEncryption,
      askPassword,
      enteredPassword,
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
