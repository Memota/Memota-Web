<template>
  <div class="background">
    <div v-masonry class="row images" transition-duration="0.4s" item-selector=".item">
      <div
        v-for="(imageID, index) in imageIDs"
        :key="index"
        v-masonry-tile
        class="item col-xs-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card v-ripple class="cursor-pointer image-card">
          <q-card-actions vertical align="right">
            <q-btn-group push>
              <q-btn flat icon="o_wallpaper" @click="() => setBackground(index)"></q-btn>
              <q-btn flat icon="o_delete" @click="() => deleteImage(index)"></q-btn>
            </q-btn-group>
          </q-card-actions>
          <JWTImage :id="imageID"></JWTImage>
        </q-card>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn :loading="uploading" fab icon="upload" color="accent" @click="$refs.file.click()" />
    </q-page-sticky>
    <input
      ref="file"
      v-if="!uploading"
      style="display: none"
      type="file"
      accept="image/jpeg, image/png"
      @change="uploadFile"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import JWTImage from "components/JWTImage.vue"
import { api } from "../boot/axios"
import { useStore } from "src/store"

export default defineComponent({
  name: "Images",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  components: { JWTImage },
  setup() {
    const store = useStore()

    const imageIDs = ref<string[]>()
    const uploading = ref(false)

    const uploadFile = async (event: any | unknown) => {
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

    const setBackground = async (index: number) => {
      if (!imageIDs.value) return
      const id = imageIDs.value[index]

      await store.dispatch("user/addBackgroundImage", id)
    }

    const deleteImage = async (index: number) => {
      if (!imageIDs.value) return
      const id = imageIDs.value[index]
      const jwt: string = localStorage.getItem("jwt") || ""
      const response = await api.delete("/images/" + id, {
        headers: { "Content-Type": "multipart/form-data", Authorization: "Bearer " + jwt },
      })
      if (response.status == 200) {
        imageIDs.value?.splice(index, 1)
      }
    }

    onMounted(async () => {
      const jwt: string = localStorage.getItem("jwt") || ""
      const response = await api.get("/images", {
        headers: { Authorization: "Bearer " + jwt },
      })
      imageIDs.value = response.data as string[]
    })
    return { imageIDs, uploading, uploadFile, deleteImage, setBackground }
  },
})
</script>

<style scoped lang="scss">
.background {
  width: 100%;
  padding: 5px;
}
@media (min-width: $breakpoint-xl-min) {
  .images {
    margin: 0px 20%;
    padding-top: 20px;
  }
}
.image-card {
  margin: 5px;
}
</style>
