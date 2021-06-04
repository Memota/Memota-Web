<template>
  <q-dialog v-model="test" persistent :maximized="$q.screen.xs || $q.screen.sm">
    <q-spinner color="primary" size="3em" />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { api } from "boot/axios"
import { useQuasar } from "quasar"
import { useRoute, useRouter } from "vue-router"

export default defineComponent({
  name: "VerifySpinnerDialog",
  setup() {
    const $q = useQuasar()
    const route = useRoute()
    const router = useRouter()
    if (route?.params.token) {
      void api
        .post("/user/verify/" + route?.params.token.toString())
        .then(() => {
          $q.notify({
            color: "info",
            position: "top",
            message: "Successfully verified",
            icon: "info",
          })
          void router.push("/")
        })
        .catch(() => {
          $q.notify({
            color: "negative",
            position: "top",
            message: "Token was not found. Try resending",
            icon: "report_problem",
          })
          void router.push("/verify")
        })
    }

    return {
      test: ref(true),
    }
  },
})
</script>
