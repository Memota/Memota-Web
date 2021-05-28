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
  <q-dialog v-model="login" persistent>
    <q-card class="login">
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel class="bg-primary" name="login">
          <div class="text-h6 text-white">Login</div>
        </q-tab-panel>
        <q-tab-panel class="bg-primary" name="register">
          <div class="text-h6 text-white">Register</div>
        </q-tab-panel>
      </q-tab-panels>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="login" label="Login" />
        <q-tab name="register" label="Register" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login"> </q-tab-panel>
        <q-tab-panel name="register">
          <q-form class="q-gutter-md">
            <q-input
              v-model="email"
              filled
              type="email"
              label="Email"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter your mail address',
                (val) => val.length <= 64 || 'Email must be 64 characters or less',
                (val) =>
                  new RegExp('^([A-Za-z0-9_\\-.])+@([A-Za-z0-9_\\-.])+\\.([A-Za-z]{2,15})$').test(val) ||
                  'Mail address must be valid',
              ]"
            />
            <q-input
              v-model="username"
              filled
              label="Username"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter your username',
                (val) => val.length <= 32 || 'Username must be 32 characters or less',
                (val) => val.length >= 3 || 'Username must be at least 3 characters',
                (val) => new RegExp('^[\\w_]+$', 'g').test(val) || 'Username must only contain numbers, letters and _',
              ]"
            />
            <q-input
              v-model="password"
              filled
              :type="showPwd ? 'text' : 'password'"
              label="Password"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter your password',
                (val) => val.length <= 64 || 'Password must be 64 characters or less',
                (val) => val.length >= 5 || 'Username must be at least 5 characters',
              ]"
            >
              <template #append>
                <q-icon
                  :name="showPwd ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showPwd = !showPwd"
                />
              </template>
            </q-input>
            <div>
              <q-btn :loading="registerLoading" label="Register" type="submit" color="primary" @click="register" />
              <q-btn label="Cancel" type="reset" color="primary" flat class="q-ml-sm" @click="login = false" />
            </div>
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { api } from "boot/axios"
import { useQuasar } from "quasar"

export default defineComponent({
  name: "MainLayout",
  setup() {
    const $q = useQuasar()

    const email = ref("")
    const username = ref("")
    const password = ref("")
    const registerLoading = ref(false)

    const register = async () => {
      registerLoading.value = true
      let data = { email: email.value, username: username.value, password: password.value }
      await api.post("/user/register", data).catch((e) => {
        console.log(e)
        $q.notify({
          color: "negative",
          position: "top",
          message: "Loading failed",
          icon: "report_problem",
        })
      })
      registerLoading.value = false
    }
    return {
      login: ref(false),
      tab: ref("login"),
      showPwd: ref(false),
      email,
      username,
      password,
      register,
      registerLoading,
    }
  },
})
</script>

<style lang="scss" scoped>
.login {
  width: 50%;
}
@media (max-width: $breakpoint-sm-max) {
  .login {
    width: 90%;
  }
}
</style>
