<template>
  <q-popup-proxy @before-hide="saveColors">
    <div class="color-picker">
      <div class="row">
        <div v-for="(color, index) in noteColors" :key="index" class="col-2">
          <q-btn round flat @click="selectColor(index)">
            <q-avatar :style="'background: ' + color"></q-avatar>
          </q-btn>
        </div>
        <div class="col-2">
          <q-btn round flat @click="addColor">
            <q-avatar> <q-icon name="o_add"></q-icon></q-avatar>
          </q-btn>
        </div>
      </div>
      <q-color v-if="selectedColor" v-model="noteColors[selectedColor]" no-footer class="my-picker" />
    </div>
  </q-popup-proxy>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { api } from "src/boot/axios"
import { useQuasar, QForm } from "quasar"
import { AxiosError } from "axios"
import { useRouter } from "vue-router"
import { useStore } from "../store"

interface ColorResponse {
  noteColors: string[]
}

export default defineComponent({
  name: "ColorPicker",
  setup() {
    const store = useStore()
    const selectedColor = ref<number>()
    const noteColors = ref<string[]>(["#ffffff"]) // default to white
    const jwt: string = localStorage.getItem("jwt") || ""

    void api
      .get("users/profile", {
        headers: { Authorization: "Bearer " + jwt },
      })
      .then((response) => {
        const colorResponse = response.data as ColorResponse
        noteColors.value = colorResponse.noteColors
      })

    const selectColor = (index: number) => {
      if (selectedColor.value == index && index != 0) {
        noteColors.value.splice(index, 1)
        selectedColor.value = 0
      } else {
        selectedColor.value = index
        console.log(index)
      }
    }

    const addColor = () => {
      noteColors.value.push("#ffffff") // default to white
    }

    const saveColors = () => {
      console.log("Save Colors")
      void store.dispatch("user/patchNoteColors", noteColors.value)
      selectedColor.value = undefined
    }

    return { noteColors, addColor, selectColor, selectedColor, saveColors }
  },
})
</script>

<style lang="scss" scoped>
+ .color-picker {
  max-width: 300px;
  width: 300px;
}

@media (min-width: $breakpoint-md-min) {
  .color-picker {
    max-width: 300px;
    width: 300px;
  }
}
</style>
