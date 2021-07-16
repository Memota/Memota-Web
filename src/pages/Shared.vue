<template>
  <q-dialog persistent v-model="test" :maximized="$q.screen.xs || $q.screen.sm">
    <q-card :style="'background-color:' + sharedNote.note.color">
      <q-card-section class="title">
        <div :class="darkFont ? 'text-black' : 'text-white'">{{ sharedNote.note.title }}</div>
      </q-card-section>
      <q-card-section class="text">
        <div :class="darkFont ? 'text-black' : 'text-white'">{{ sharedNote.note.text }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { api } from "boot/axios"
import { SharedNote } from "src/store/note/state"

const darkColorMatcher = new RegExp("^#([0-7][0-9a-fA-F]){3}")

export default defineComponent({
  name: "EditNoteDialog",
  async setup() {
    const route = useRoute()
    const router = useRouter()

    const sharedNote = ref<SharedNote>()
    const darkFont = ref<boolean>(true)

    const updateColor = (color: string) => {
      darkFont.value = !darkColorMatcher.test(color)
    }

    try {
      const jwt: string = localStorage.getItem("jwt") || ""
      const response = await api.get("/notes/shared/" + (route.params.id as string), {
        headers: { Authorization: "Bearer " + jwt },
      })
      sharedNote.value = response.data as SharedNote
      sharedNote.value = response.data as SharedNote
      updateColor(sharedNote.value.note.color)
    } catch (err) {
      await router.push("/404")
    }

    return {
      test: ref(true),
      sharedNote,
      darkFont,
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

.nav-text {
  margin-top: 5px;
}

.title {
  padding-top: 10px;
  padding-bottom: 0px;
}

.title div {
  background-color: transparent;
  width: 100%;
  border-width: 0px;
  border: none;
  font-size: 24px;
  font-weight: bold;
}

.text {
  padding-top: 0px;
  height: 100%;
  padding-right: 0px;
  flex-grow: 1;
  padding-bottom: 0px;
}

.text div {
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
