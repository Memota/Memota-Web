<template>
  <div class="background">
    <div v-masonry class="row notes" transition-duration="0.4s" item-selector=".item">
      <div
        v-for="note in notes"
        :key="note.id"
        v-masonry-tile
        class="item col-xs-12 col-sm-6 col-md-4 col-lg-3 note-card"
      >
        <q-card v-ripple class="cursor-pointer" @click="$router.push('/edit/' + note.id)">
          <q-card-section>
            <div class="text-h6">{{ note.title }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none"> {{ note.text }} </q-card-section>
        </q-card>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn fab icon="add" color="accent" />
    </q-page-sticky>
  </div>
  <router-view />
</template>

<script lang="ts">
import { useStore } from "../store"
import { defineComponent, computed } from "vue"
import { Note } from "../store/note/state"

export default defineComponent({
  name: "PageIndex",
  setup() {
    const store = useStore()
    void store.dispatch("note/getNotes")
    const notes = computed((): Note[] => {
      return store.state.note.notes
    })
    return { notes }
  },
})
</script>

<style scoped lang="scss">
.background {
  background-color: #fafafa;
  width: 100%;
  height: 100%;
}
@media (min-width: $breakpoint-xl-min) {
  .notes {
    margin: 0px 20%;
    padding-top: 20px;
  }
}
.note-card {
  padding: 8px;
}
.note-card > .q-card {
  overflow: hidden;
  max-height: 400px;
}
</style>
