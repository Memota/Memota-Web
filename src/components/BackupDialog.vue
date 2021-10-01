<template>
  <q-dialog v-model="test" :maximized="$q.screen.xs || $q.screen.sm" @before-hide="goBack">
    <q-card>
      <q-card-section class="top">
        <div>
          <q-btn round flat icon="arrow_back" @click="goBack"></q-btn>
        </div>
        <div class="nav-text text-h6">Download PDF Backup</div>
      </q-card-section>
      <q-card-section class="options">
        <div>
          <q-tooltip>Displays the note images on the document</q-tooltip>
          <q-checkbox v-model="withImages" label="Images" />
        </div>
        <div>
          <q-tooltip>Colors the document pages according to the note colors</q-tooltip>
          <q-checkbox v-model="noteColors" label="Colored Pages" />
        </div>
        <q-btn class="download-button" label="Download" color="primary" @click="downloadBackup" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { useQuasar } from "quasar"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "../store"
import { downloadFile } from "src/utils/download"

export default defineComponent({
  name: "BackupDialog",
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()

    const StringFormat = (str: string, ...args: string[]) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      str.replace(/{(\d+)}/g, (match, index) => args[index] || "")

    const withImages = ref(true)
    const noteColors = ref(true)

    const downloadBackup = async () => {
      const imageParam = withImages.value ? "true" : "false"
      const colorParam = noteColors.value ? "true" : "false"
      const urlTemplate = "/notes/download?images={0}&colors={1}"
      const url = StringFormat(urlTemplate, imageParam, colorParam)
      const fileName =
        store.state.user.user.username.toLocaleLowerCase() + "-memota-backup-" + new Date().toLocaleDateString("fr-CA")
      await downloadFile(url, fileName + ".zip")
    }

    const goBack = () => {
      void router.push("/")
    }

    return {
      test: ref(true),
      withImages,
      noteColors,
      downloadBackup,
      goBack,
    }
  },
})
</script>
<style lang="scss" scoped>
.top {
  display: flex;
  padding-top: 5px;
  padding-left: 5px;
  width: 100%;
  padding-bottom: 0px;
}

.nav-text {
  margin-top: 5px;
}

.download-button {
  float: right;
  margin-top: 10px;
  margin-bottom: 15px;
}
</style>
