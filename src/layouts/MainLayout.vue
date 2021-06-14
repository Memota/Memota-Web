<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round icon="menu" />
        <q-toolbar-title>Memota</q-toolbar-title>
        <q-btn v-if="username !== ''" round flat>
          <q-avatar color="purple" text-color="white">{{ username.charAt(0) }}</q-avatar>
          <q-popup-proxy>
            <q-list dense bordered>
              <q-item class="text-center">
                <q-item-section>{{ username }}</q-item-section>
              </q-item>
              <q-item class="text-center q-mb-sm">
                <q-item-section>{{ email }}</q-item-section>
              </q-item>
              <q-separator></q-separator>
              <q-item v-ripple class="text-center" clickable>
                <q-item-section class="q-my-sm" @click="logout">Sign out</q-item-section>
              </q-item>
            </q-list>
          </q-popup-proxy>
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
    if (localStorage.getItem("jwt")) {
      void store.dispatch("user/getProfile")
    } else if (currentPath !== "/login" && currentPath !== "/register") {
      void router.push("login")
    }
    const username = computed((): string => {
      return store.state.user.user.username
    })

    const email = computed((): string => {
      return store.state.user.user.email
    })

    const logout = () => {
      void store.dispatch("user/logout")
      void router.push("login")
    }
    return { username, email, logout }
  },
})
</script>
