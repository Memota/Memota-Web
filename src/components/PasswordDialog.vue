<template>
  <q-dialog v-model="test" persistent :maximized="$q.screen.xs || $q.screen.sm">
    <q-card>
      <div class="top">
        <div>
          <q-btn round flat icon="arrow_back" @click="$router.push('/')"></q-btn>
        </div>
        <div class="nav-text text-h6">Enter password</div>
      </div>
      <q-form ref="passwordForm" @submit="submit">
        <q-input
          v-model="password"
          outlined
          :type="showPwd ? 'text' : 'password'"
          autocomplete="off"
          label="Note Password"
        >
          <template #append>
            <q-icon
              :name="showPwd ? 'o_visibility' : 'o_visibility_off'"
              class="cursor-pointer"
              @click="showPwd = !showPwd"
            />
          </template>
        </q-input>
        <q-btn class="submit-button" :label="buttonText" type="submit" color="primary" />
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
  name: "PasswordDialog",
  props: {
    buttonText: {
      default: "Done",
      type: String,
    },
  },
  emits: ["password"],
  setup(props, { emit }) {
    const password = ref("")

    const submit = () => {
      emit("password", password.value)
    }
    return {
      showPwd: ref(false),
      password,
      test: ref(true),
      submit,
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
