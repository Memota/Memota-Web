<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round icon="menu" />
        <q-toolbar-title>Memota</q-toolbar-title>
        <q-btn stretch flat label="Login" @click="$router.push('register')" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <router-view name="dialog" />
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
