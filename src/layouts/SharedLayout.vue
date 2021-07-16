<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Memota</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <suspense>
        <router-view />
      </suspense>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "MainLayout",
  setup() {
    return {}
  },
})
</script>
