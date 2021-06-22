<template>
  <q-dialog v-model="test" persistent :maximized="$q.screen.xs || $q.screen.sm">
    <q-card>
      <div class="top">
        <div>
          <q-btn round flat icon="arrow_back" @click="$router.push('/login')"></q-btn>
        </div>
        <div class="nav-text text-h6">Password Reset</div>
      </div>
      <q-form ref="resetForm" @submit="reset">
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
        <q-btn :loading="resetLoading" class="submit-button" label="Reset Password" type="submit" color="primary" />
      </q-form>
      <div class="bottom">
        <q-separator />
        <q-btn class="switch-button" flat @click="$router.push('/login')">
          <div>Remembered your password again?&nbsp;</div>
          <div class="text-primary">Login</div>
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { QForm, useQuasar } from "quasar"
import { useRouter, useRoute } from "vue-router"
import { useStore } from "../store"
import { api } from "boot/axios"
import { AxiosError } from "axios"

export default defineComponent({
  name: "SendResetPasswordDialog",
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const $q = useQuasar()

    const resetForm = ref<QForm>()
    const email = ref("")
    const resetLoading = ref(false)

    const reset = async () => {
      if (!(await resetForm.value?.validate())) return
      resetLoading.value = true

      let data = { email: email.value }
      void api
        .post("/auth/send-reset", data)
        .then(() => {
          resetLoading.value = false
          $q.notify({
            color: "info",
            position: "top",
            message: "Email has been sent",
            icon: "info",
          })
        })
        .catch((e: AxiosError) => {
          let message = "Something went wrong"
          if (e.response?.status === 401 || e.response?.status === 429) {
            message = e.response.data as string
          }
          $q.notify({
            color: "negative",
            position: "top",
            message: message,
            icon: "report_problem",
          })
          resetLoading.value = false
        })
    }

    return {
      email,
      reset,
      resetLoading,
      resetForm,
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
