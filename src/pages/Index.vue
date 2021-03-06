<template>
  <!-- Pinned  Notes -->
  <div class="background">
    <div v-masonry class="row notes" transition-duration="0.4s" item-selector=".item">
      <div v-for="note in notes" :key="note.id" v-masonry-tile class="item col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <q-card
          v-if="note.options.pinned"
          v-ripple
          class="cursor-pointer note-card"
          :style="'background-color:' + note.color"
          @click="$router.push('/edit/' + note.id)"
        >
          <JWTImage v-if="note.image" :id="note.image.id"></JWTImage>
          <q-card-section>
            <div :class="computeFontColor(note.color)" class="text-h6 note-title">
              {{ note.title }}
            </div>
            <q-icon name="push_pin" :class="computeFontColor(note.color)" class="pin" />
          </q-card-section>

          <q-card-section
            v-if="!note.options.hidden && !note.options.encrypted"
            :class="computeFontColor(note.color)"
            class="q-pt-none"
          >
            {{ note.text }}
          </q-card-section>
          <div v-if="note.options.hidden && !note.options.encrypted" class="text-center" style="margin-bottom: 25px">
            <q-icon name="o_visibility_off" :class="computeFontColor(note.color)" style="font-size: 4rem" />
          </div>
          <div v-if="note.options.encrypted" class="text-center" style="margin-bottom: 25px">
            <q-icon name="o_lock" :class="computeFontColor(note.color)" style="font-size: 4rem" />
          </div>
        </q-card>
      </div>
    </div>
    <div v-if="impostor" v-masonry-tile class="item col-xs-12 col-sm-6 col-md-4 col-lg-3 impostor-card"></div>
    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="accent" @click="createNote" />
    </q-page-sticky>
  </div>

  <div class="background">
    <div v-masonry class="row notes" transition-duration="0.4s" item-selector=".item">
      <div v-for="note in notes" :key="note.id" v-masonry-tile class="item col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <q-card
          v-if="!note.options.pinned"
          v-ripple
          class="cursor-pointer note-card"
          :style="'background-color:' + note.color"
          @click="$router.push('/edit/' + note.id)"
        >
          <JWTImage v-if="note.image" :id="note.image.id"></JWTImage>
          <q-card-section>
            <div :class="computeFontColor(note.color)" class="text-h6 note-title">
              {{ note.title }}
            </div>
          </q-card-section>

          <q-card-section
            v-if="!note.options.hidden && !note.options.encrypted"
            :class="computeFontColor(note.color)"
            class="q-pt-none"
          >
            {{ note.text }}
          </q-card-section>
          <div v-if="note.options.hidden && !note.options.encrypted" class="text-center" style="margin-bottom: 25px">
            <q-icon name="o_visibility_off" :class="computeFontColor(note.color)" style="font-size: 4rem" />
          </div>
          <div v-if="note.options.encrypted" class="text-center" style="margin-bottom: 25px">
            <q-icon name="o_lock" :class="computeFontColor(note.color)" style="font-size: 4rem" />
          </div>
        </q-card>
      </div>
    </div>
    <div v-if="impostor" v-masonry-tile class="item col-xs-12 col-sm-6 col-md-4 col-lg-3 impostor-card"></div>
    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="accent" @click="createNote" />
    </q-page-sticky>
  </div>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onUnmounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"

import { api } from "src/boot/axios"
import { useStore } from "../store"
import { Note } from "../store/note/state"
import JWTImage from "components/JWTImage.vue"

const darkColorMatcher = new RegExp("^#([0-7][0-9a-fA-F]){3}")

export default defineComponent({
  name: "PageIndex",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  components: { JWTImage },
  setup() {
    const store = useStore()
    const router = useRouter()
    const $q = useQuasar()
    if (localStorage.getItem("jwt")) {
      void store.dispatch("note/getNotes")
    }
    const notes = computed((): Note[] => {
      return store.state.note.notes
    })
    let creating = false
    const createNote = async () => {
      const jwt: string = localStorage.getItem("jwt") || ""
      if (creating) return
      creating = true
      try {
        const response = await api.post(
          "/notes/",
          { text: "", title: "", color: "#ffffff" },
          {
            headers: { Authorization: "Bearer " + jwt },
          },
        )
        const note = response.data as Note
        await router.push("/edit/" + note.id)
      } catch (err) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "Something went wrong",
          icon: "report_problem",
        })
      }
      creating = false
    }

    const impostor = ref(true)
    const refreshGrid = () => {
      impostor.value = !impostor.value
    }
    onMounted(() => {
      window.addEventListener("updated-notes", refreshGrid)
    })
    onUnmounted(() => {
      window.removeEventListener("updated-notes", refreshGrid)
    })

    const computeFontColor = (color: string) => {
      return darkColorMatcher.test(color) ? "text-white" : "text-dark"
    }

    return { notes, createNote, impostor, computeFontColor }
  },
})
</script>

<style scoped lang="scss">
.background {
  width: 100%;
  padding: 5px;
}
@media (min-width: $breakpoint-xl-min) {
  .notes {
    margin: 0px 20%;
    padding-top: 20px;
  }
}
.note-card {
  white-space: pre-line;
  overflow: hidden;
  overflow-wrap: break-word;
  margin: 5px;
}
.note-card > .q-card {
  overflow: hidden;
  max-height: 400px;
}
.note-title {
  text-overflow: ellipsis;
  overflow: hidden;
}
.impostor-card {
  height: 0px;
}
.pin {
  font-size: 1.5rem;
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
}
</style>
