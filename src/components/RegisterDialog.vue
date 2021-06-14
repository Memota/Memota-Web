<template>
  <q-dialog v-model="test" persistent :maximized="$q.screen.xs || $q.screen.sm">
    <q-card>
      <div class="top">
        <div><q-btn round flat icon="arrow_back" @click="$router.push('/')"></q-btn></div>
        <div class="nav-text text-h6">Register</div>
      </div>
      <q-form ref="registerForm" @submit="register">
        <q-input
          v-model="email"
          outlined
          type="email"
          label="Email"
          :lazy-rules="true"
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
          outlined
          label="Username"
          :lazy-rules="true"
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter your username',
            (val) => val.length <= 32 || 'Username must be 32 characters or less',
            (val) => val.length >= 3 || 'Username must be at least 3 characters',
            (val) => new RegExp('^[\\w_]+$', 'g').test(val) || 'Username must only contain numbers, letters and _',
          ]"
        />
        <q-input
          v-model="password"
          outlined
          :type="showPwd ? 'text' : 'password'"
          label="Password"
          :lazy-rules="true"
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter your password',
            (val) => val.length <= 64 || 'Password must be 64 characters or less',
            (val) => val.length >= 5 || 'Password must be at least 5 characters',
          ]"
        >
          <template #append>
            <q-icon
              :name="showPwd ? 'o_visibility' : 'o_visibility_off'"
              class="cursor-pointer"
              @click="showPwd = !showPwd"
            />
          </template>
        </q-input>
        <q-btn :loading="registerLoading" class="submit-button" label="Register" type="submit" color="primary" />
      </q-form>
      <div class="bottom">
        <q-separator />
        <q-btn class="switch-button" flat @click="$router.push('login')">
          <div>Already have an account?&nbsp;</div>
          <div class="text-primary">Login</div>
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { api } from "boot/axios"
import { useQuasar, QForm } from "quasar"
import { AxiosError } from "axios"
import { useRouter } from "vue-router"

interface ErrorResponse {
  value: string
  property: string
  constraints: {
    IsUniq: string
  }
}

export default defineComponent({
  name: "RegisterDialog",
  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const registerForm = ref<QForm>()
    const email = ref("")
    const username = ref("")
    const password = ref("")
    const registerLoading = ref(false)

    const register = async () => {
      if (!(await registerForm.value?.validate())) return
      registerLoading.value = true
      let data = { email: email.value, username: username.value, password: password.value }
      api
        .post("/users/register", data)
        .then(() => {
          registerLoading.value = false
          void router.push("verify")
        })
        .catch((e: AxiosError) => {
          if (e.response?.data && e.response.status === 400 && Array.isArray(e.response?.data)) {
            const errors: ErrorResponse[] = e.response.data as ErrorResponse[]
            errors.forEach((e) => {
              if (e.constraints.IsUniq) {
                $q.notify({
                  group: false,
                  color: "negative",
                  position: "top",
                  message: `User with ${e.property} ${e.value} already exists`,
                  icon: "info",
                })
              }
            })
          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: "Something went wrong",
              icon: "report_problem",
            })
          }
          registerLoading.value = false
        })
    }
    return {
      showPwd: ref(false),
      email,
      username,
      password,
      register,
      registerLoading,
      registerForm,
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
