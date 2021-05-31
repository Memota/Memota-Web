<template>
  <q-dialog v-model="test" persistent :maximized="$q.screen.xs || $q.screen.sm">
    <q-card>
      <div class="top">
        <div><q-btn round flat icon="arrow_back" @click="$router.go(-1)"></q-btn></div>
        <div class="nav-text text-h6">Verify</div>
      </div>
      <q-card-section class="text-center">
        <div class="text-h5">Verify your email</div>
        <div>You will need to verify your email to complete registration.</div>
        <div><q-icon name="o_mail" style="font-size: 10em" /></div>
        <q-btn
          :loading="registerLoading"
          class="submit-button"
          label="Resend"
          type="submit"
          color="primary"
          @click="register"
        />
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

export default defineComponent({
  name: "VerifyDialog",
  beforeRouteEnter(to, from, next) {
    console.log(from)
    next()
  },
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
  .q-card__section {
    width: 500px;
    margin: 110px 70px 80px;
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
