<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round icon="menu" @click="drawerOpen = !drawerOpen" />
        <q-toolbar-title>Memota</q-toolbar-title>
        <q-btn
          class="q-mr-sm"
          flat
          round
          dense
          :icon="$q.dark.isActive ? 'o_light_mode' : 'o_dark_mode'"
          @click="toggleDarkMode"
        ></q-btn>
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
    <q-drawer v-model="drawerOpen" overlay side="left" bordered>
      <q-scroll-area class="fit">
        <q-list>
          <q-item v-ripple clickable @click="$router.push('/')">
            <q-item-section avatar>
              <q-icon name="description" />
            </q-item-section>
            <q-item-section>Notes</q-item-section>
          </q-item>
          <q-item v-ripple clickable @click="$router.push('/images')">
            <q-item-section avatar>
              <q-icon name="perm_media" />
            </q-item-section>
            <q-item-section>Images</q-item-section>
          </q-item>
          <q-item v-ripple clickable @click="$router.push('/backup')">
            <q-item-section avatar>
              <q-icon name="o_cloud_download" />
            </q-item-section>
            <q-item-section>Backup</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <router-view name="dialog" />
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { useQuasar } from "quasar"

import { useStore } from "../store"
import { api } from "boot/axios"

export default defineComponent({
  name: "MainLayout",
  setup() {
    const router = useRouter()
    const store = useStore()
    const $q = useQuasar()
    const currentPath = router.currentRoute.value.path

    const drawerOpen = ref(false)

    let settings = undefined
    const jwt: string = localStorage.getItem("jwt") || ""
    if (jwt) {
      void store.dispatch("user/getProfile").then(() => {
        settings = store.state.user.user.settings
        $q.dark.set(settings.darkMode)
      })
    } else if (
      currentPath !== "/login" &&
      currentPath !== "/register" &&
      currentPath !== "/reset" &&
      !currentPath.startsWith("/auth/reset")
    ) {
      void router.push("login")
    }

    const username = computed((): string => {
      return store.state.user.user.username
    })

    const email = computed((): string => {
      return store.state.user.user.email
    })

    const backgroundImage = computed((): string | undefined => {
      if (store.state.user.user.settings.image) return store.state.user.user.settings.image.id
      return undefined
    })

    watch(backgroundImage, (id) => {
      void setBackground(id)
    })

    const setBackground = async (id: string | undefined) => {
      if (!id) {
        document.body.style.backgroundImage = ""
      } else {
        const jwt: string = localStorage.getItem("jwt") || ""
        const image = await api.get("/images/" + id, {
          responseType: "blob",
          headers: { Authorization: "Bearer " + jwt },
        })
        const backgroundUrl = URL.createObjectURL(image.data)
        document.body.style.backgroundImage = "url('" + backgroundUrl + "')"
      }
    }

    const toggleDarkMode = async () => {
      $q.dark.toggle()
      await store.dispatch("user/toggleDarkMode", $q.dark.isActive)
    }

    const logout = () => {
      void store.dispatch("user/logout")
      void router.push("login")
    }
    return { username, email, logout, toggleDarkMode, drawerOpen }
  },
})
</script>

<style>
.bg {
  position: absolute;
  top: 0;
  height: 100%;
  z-index: -1;
}
</style>
