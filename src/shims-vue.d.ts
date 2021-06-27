// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module "*.vue" {
  import { ComponentOptions } from "vue"
  const component: ComponentOptions
  export default component
}

import Vue from "vue"

declare module "vue" {
  export type PluginFunction = (app: Vue.App, ...options: unknown[]) => unknown
}
