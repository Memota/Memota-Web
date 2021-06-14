<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round icon="menu" />
        <q-toolbar-title>Memota</q-toolbar-title>
        <q-btn stretch flat label="Login" @click="$router.push('register')" />
        <q-btn v-if="username !== ''" round flat>
          <q-avatar color="purple" text-color="white">{{ username.charAt(0) }}</q-avatar>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <router-view name="dialog" />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { useStore } from "../store"
import { useRouter } from "vue-router"

export default defineComponent({
  name: "MainLayout",
  setup() {
    const router = useRouter()
    const store = useStore()
    const currentPath = router.currentRoute.value.path
    if (!store.state.user.jwt && currentPath !== "/login" && currentPath !== "/register") {
      void router.push("login")
    }
    const username = computed((): string => {
      return store.state.user.user.username
    })
    return { username }
  },
})
</script>
