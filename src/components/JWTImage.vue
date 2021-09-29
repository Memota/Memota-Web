<template>
  <q-img :src="imageUrl" style="width: 100%" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import { api } from "../boot/axios"

export default defineComponent({
  name: "EditNoteDialog",
  props: {
    id: String,
  },
  setup(props) {
    const imageUrl = ref()

    onMounted(async () => {
      const jwt: string = localStorage.getItem("jwt") || ""
      const response = await api.get("/images/" + (props.id as string), {
        responseType: "blob",
        headers: { Authorization: "Bearer " + jwt },
      })
      imageUrl.value = URL.createObjectURL(response.data)
    })
    return { imageUrl }
  },
})
</script>

<style scoped></style>
