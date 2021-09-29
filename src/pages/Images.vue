<template>
  <div class="background">
    <div v-masonry class="row notes" transition-duration="0.4s" item-selector=".item">
      <div
        v-for="(imageID, index) in imageIDs"
        :key="index"
        v-masonry-tile
        class="item col-xs-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card v-ripple class="cursor-pointer">
          <q-card-actions vertical align="right">
            <q-btn flat icon="o_delete"></q-btn>
          </q-card-actions>
          <JWTImage :id="imageID"></JWTImage>
        </q-card>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn :loading="uploading" fab icon="upload" color="accent" @click="$refs.file.click()" />
    </q-page-sticky>
    <input ref="file" @change="uploadFile" style="display: none" type="file" accept="image/jpeg, image/png" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import JWTImage from "components/JWTImage.vue"
import { api } from "../boot/axios"

export default defineComponent({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  components: { JWTImage },
  name: "Images",
  setup() {
    const imageIDs = ref<string[]>()

    const uploading = ref(false)

    const uploadFile = async (event: any) => {
      if (uploading.value) return

      const formData = new FormData()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      formData.append("image", event.target.files[0])

      uploading.value = true
      const jwt: string = localStorage.getItem("jwt") || ""
      const response = await api.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: "Bearer " + jwt },
      })
      imageIDs.value?.push(response.data)
      uploading.value = false
    }

    onMounted(async () => {
      const jwt: string = localStorage.getItem("jwt") || ""
      const response = await api.get("/images", {
        headers: { Authorization: "Bearer " + jwt },
      })
      imageIDs.value = response.data as string[]
    })
    return { imageIDs, uploading, uploadFile }
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
  padding: 5px;
}
.note-card > .q-card {
  overflow: hidden;
  max-height: 400px;
  white-space: pre-wrap;
}
.note-title {
  text-overflow: ellipsis;
  overflow: hidden;
}
.impostor-card {
  height: 0px;
}
</style>
