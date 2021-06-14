<template>
  <q-dialog v-model="test" persistent :maximized="$q.screen.xs || $q.screen.sm">
    <q-card>
      <div class="top">
        <div>
          <q-btn round flat icon="arrow_back"></q-btn>
        </div>
        <div class="nav-text text-h6">Login</div>
      </div>
      <q-form ref="loginForm" @submit="login">
        <q-input v-model="email" outlined type="email" label="Email" />
        <q-input v-model="password" outlined :type="showPwd ? 'text' : 'password'" label="Password">
          <template #append>
            <q-icon
              :name="showPwd ? 'o_visibility' : 'o_visibility_off'"
              class="cursor-pointer"
              @click="showPwd = !showPwd"
            />
          </template>
        </q-input>
        <q-btn :loading="loginLoading" class="submit-button" label="Login" type="submit" color="primary" />
      </q-form>
      <div class="bottom">
        <q-separator />
        <q-btn class="switch-button" flat @click="$router.push('register')">
          <div>Don't have an Account yet?&nbsp;</div>
          <div class="text-primary">Register</div>
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue"
import { QForm } from "quasar"
import { useRouter } from "vue-router"
import { useStore } from "../store"

export default defineComponent({
  name: "LoginDialog",
  setup() {
    const router = useRouter()
    const store = useStore()

    const loginForm = ref<QForm>()
    const email = ref("")
    const username = ref("")
    const password = ref("")
    const loginLoading = ref(false)

    onMounted(() => {
      window.addEventListener("logged-in", push)
    })
    onUnmounted(() => {
      window.removeEventListener("logged-in", push)
    })
    const push = () => {
      void router.push("/")
    }
    const login = async () => {
      loginLoading.value = true
      await store.dispatch("user/login", { email: email.value, password: password.value })
      loginLoading.value = false
    }
    return {
      showPwd: ref(false),
      email,
      username,
      password,
      login,
      loginLoading,
      loginForm,
      test: ref(true),
    }
  },
})
</script>

<style lang="scss" scoped>
@media (min-width: $breakpoint-md-min) {
  .q-form {
    width: 500px;
    margin: 110px 100px 80px;
  }
}

@media (max-width: $breakpoint-sm-max) {
  .q-form {
    width: 100%;
    margin: 50px 20px 40px;
  }
}

.q-form > .q-btn {
  width: 100%;
}

.q-card {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}

.top {
  top: 0;
  display: flex;
  padding-top: 5px;
  padding-left: 5px;
  height: 50px;
}

.nav-text {
  font-weight: normal;
  padding-top: 5px;
  padding-left: 20px;
}

.bottom {
  bottom: 0;
}

.bottom,
.top {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.q-separator {
  width: 100%;
}

.q-input {
  margin: 0;
  padding-bottom: 28px;
}

.switch-button {
  width: 100%;
  text-transform: none;
  font-weight: normal;
}
</style>
