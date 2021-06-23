<template>
  <q-dialog v-model="test" persistent :maximized="$q.screen.xs || $q.screen.sm">
    <q-card>
      <q-card-section class="top">
        <div>
          <q-btn round flat icon="arrow_back"></q-btn>
        </div>
        <div class="nav-text text-h6">Edit Note</div>
      </q-card-section>
      <q-card-section class="title"> <input v-model="title" /> </q-card-section>
      <q-card-section class="text"><textarea v-model="text" /></q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue"
import { QForm } from "quasar"
import { useRouter } from "vue-router"
import { useStore } from "../store"

export default defineComponent({
  name: "EditNoteDialog",
  setup() {
    const router = useRouter()
    const store = useStore()

    const title = ref("Title")

    return {
      test: ref(true),
      title,
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
</style>
