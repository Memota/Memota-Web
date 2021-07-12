<template>
  <q-popup-proxy style="background-color: #8886" @before-hide="saveColors">
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
      <q-color
        v-if="selectedColor"
        v-model="noteColors[selectedColor]"
        no-footer
        class="my-picker"
        @update:model-value="updateColor"
      />
    </div>
  </q-popup-proxy>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { api } from "src/boot/axios"
import { useStore } from "../store"

interface ColorResponse {
  noteColors: string[]
}

export default defineComponent({
  name: "ColorPicker",
  emits: { onColorChange: String },

  setup(props, { emit }) {
    const store = useStore()
    const selectedColor = ref<number>()
    const noteColors = ref<string[]>(["#ffffff"]) // default to white
    const jwt: string = localStorage.getItem("jwt") || ""

    // Get the colors from the backend
    void api
      .get("users/profile", {
        headers: { Authorization: "Bearer " + jwt },
      })
      .then((response) => {
        const colorResponse = response.data as ColorResponse
        noteColors.value = colorResponse.noteColors
      })

    // Emits the color to the current note
    const updateColor = (color: string) => {
      emit("onColorChange", color)
    }

    // Select a color by it's id
    const selectColor = (index: number) => {
      if (selectedColor.value == index && index != 0) {
        noteColors.value.splice(index, 1)
        selectedColor.value = 0
      } else {
        selectedColor.value = index
        console.log(index)
      }
      // send to note
      const color = noteColors.value[index]
      updateColor(color)
    }

    // Add a new color
    const addColor = () => {
      noteColors.value.push("#ffffff") // default to white
    }

    // Save the colors to the backend
    const saveColors = () => {
      console.log("Save Colors")
      void store.dispatch("user/patchNoteColors", noteColors.value)
      selectedColor.value = undefined
    }

    return { noteColors, addColor, selectColor, selectedColor, saveColors, updateColor }
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
