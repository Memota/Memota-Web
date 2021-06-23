import mitt from "mitt"
import { boot } from "quasar/wrappers"
import { VueMasonryPlugin } from "vue-masonry/src/masonry-vue3.plugin"

export default boot(({ app }) => {
  const emitter = mitt()
  app.config.globalProperties.emitter = emitter
  app.use(VueMasonryPlugin)
})
