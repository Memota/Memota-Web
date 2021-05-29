<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round icon="menu" />
        <q-toolbar-title>Memota</q-toolbar-title>
        <q-btn stretch flat label="Login" @click="login = true" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <LoginDialog v-model="login" @close="login = false"></LoginDialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

import LoginDialog from "../components/LoginDialog.vue"

export default defineComponent({
  components: { LoginDialog },
  name: "MainLayout",
  setup() {
    return {
      login: ref(false),
    }
  },
})
</script>
