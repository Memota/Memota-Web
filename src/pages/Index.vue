<template>
  <p>Index {{ test }}</p>
  <button @click="login">TestButton</button>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"

export default defineComponent({
  name: "PageIndex",
  setup() {
    return {}
  },
})
</script>
