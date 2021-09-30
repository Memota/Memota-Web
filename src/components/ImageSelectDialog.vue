<template>
  <q-card class="card">
    <q-card-actions vertical align="right">
      <q-btn flat icon="o_delete" @click="$emit('select', 'clear')"></q-btn>
    </q-card-actions>
    <div class="row notes">
      <div v-for="(imageID, index) in imageIDs" :key="index" v-masonry-tile class="col-4">
        <q-card v-ripple class="cursor-pointer" @click="$emit('select', imageID)">
          <JWTImage :id="imageID" class="image"></JWTImage>
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue"
import { useQuasar, copyToClipboard } from "quasar"

import { api } from "src/boot/axios"
import JWTImage from "components/JWTImage.vue"

export default defineComponent({
  name: "NoteShareDialog",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  components: { JWTImage },
  emits: ["select"],
  props: {
    noteId: {
      type: String,
      default: "",
    },
  },
  async setup() {
    const imageIDs = ref<string[]>()

    const jwt: string = localStorage.getItem("jwt") || ""
    const response = await api.get("/images", {
      headers: { Authorization: "Bearer " + jwt },
    })
    console.log(response.data)
    imageIDs.value = response.data as string[]

    return { imageIDs }
  },
})
</script>

<style lang="scss">
.card {
  width: 400px !important;
  height: 50% !important;
}

.image {
  height: 140px !important;
}
</style>
