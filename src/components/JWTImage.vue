<template>
  <q-img :src="imageUrl" style="width: 100%" />
</template>

<script lang="ts">
import { watch, defineComponent, onMounted, ref } from "vue"
import { api } from "../boot/axios"

export default defineComponent({
  name: "EditNoteDialog",
  props: {
    id: {
      type: String,
      default: "0",
    },
  },
  setup(props) {
    const imageUrl = ref()

    const downloadImage = async () => {
      const jwt: string = localStorage.getItem("jwt") || ""
      const response = await api.get("/images/" + String(props.id), {
        responseType: "blob",
        headers: { Authorization: "Bearer " + jwt },
      })
      imageUrl.value = URL.createObjectURL(response.data)
    }

    watch(props, () => {
      void downloadImage()
    })

    onMounted(() => {
      void downloadImage()
    })
    return { imageUrl }
  },
})
</script>

<style scoped></style>
