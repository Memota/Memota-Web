<template>
  <q-dialog persistent :maximized="$q.screen.xs || $q.screen.sm">
    <q-card>
      <div class="top">
        <div><q-btn round flat icon="arrow_back" @click="$emit('close')"></q-btn></div>
        <div class="nav-text text-h6">Register</div>
      </div>
      <q-form v-if="card === 'register'" ref="registerForm">
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
            (val) => val.length >= 5 || 'Username must be at least 5 characters',
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
        <q-btn
          :loading="registerLoading"
          class="submit-button"
          label="Register"
          type="submit"
          color="primary"
          @click="register"
        />
      </q-form>
      <div class="bottom">
        <q-separator />
        <q-btn class="switch-button" flat @click="card = 'login'">
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

export default defineComponent({
  name: "LoginDialog",
  emits: ["close"],
  setup() {
    const $q = useQuasar()

    const registerForm = ref<QForm>()
    const email = ref("")
    const username = ref("")
    const password = ref("")
    const registerLoading = ref(false)

    const register = async () => {
      if (!(await registerForm.value?.validate())) return
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
      card: ref("register"),
      showPwd: ref(false),
      email,
      username,
      password,
      register,
      registerLoading,
      registerForm,
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
