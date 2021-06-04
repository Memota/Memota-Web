<template>
  <q-dialog v-model="test" persistent :maximized="$q.screen.xs || $q.screen.sm">
    <q-card>
      <div class="top">
        <div><q-btn round flat icon="arrow_back" @click="$router.go(-1)"></q-btn></div>
        <div class="nav-text text-h6">Verify</div>
      </div>
      <q-card-section class="text-center">
        <div class="text-h5">Verify your email</div>
        <div>You will need to verify your email to complete your registration.</div>
        <div><q-icon name="o_mail" style="font-size: 10em" /></div>
        <q-form ref="resendForm" @submit="resend">
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
          >
          </q-input>
          <q-btn :loading="registerLoading" class="submit-button" label="Resend" type="submit" color="primary" />
        </q-form>
      </q-card-section>
      <div class="bottom">
        <q-separator />
        <q-btn class="switch-button" flat @click="$router.push('login')">
          <div>Already verified?&nbsp;</div>
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

export default defineComponent({
  name: "VerifyDialog",
  setup() {
    const $q = useQuasar()

    const resendForm = ref<QForm>()
    const email = ref("")
    const registerLoading = ref(false)

    const resend = async () => {
      if (!(await resendForm.value?.validate())) return
      registerLoading.value = true
      let data = { email: email.value }
      await api
        .post("/user/resend", data)
        .then(() => {
          $q.notify({
            color: "info",
            position: "top",
            message: "Email has been resent",
            icon: "info",
          })
        })
        .catch((e: AxiosError) => {
          let message = "Loading failed"

          if (e.response?.data) {
            if (e.response.status === 400 && !Array.isArray(e.response?.data)) {
              message = "Email was not found or user is already verified"
            } else if (e.response.status === 429) {
              console.log(e.response?.data)
              message = "You can only resend your verification email every 15 minutes"
            }
          }
          $q.notify({
            color: "negative",
            position: "top",
            message: message,
            icon: "report_problem",
          })
        })
      registerLoading.value = false
    }
    return {
      showPwd: ref(false),
      email,
      resend,
      registerLoading,
      resendForm,
      test: ref(true),
    }
  },
})
</script>

<style lang="scss" scoped>
@media (min-width: $breakpoint-md-min) {
  .q-card__section {
    width: 550px;
    margin: 110px 50px 80px;
  }
}

@media (max-width: $breakpoint-sm-max) {
  .q-card__section {
    width: 100%;
    margin: 50px 20px 40px;
  }
}

.q-card__section > * {
  padding: 4px 0;
}

.q-card__section img {
  width: 150px;
}

.q-card__section .q-btn {
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
