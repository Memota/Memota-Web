import { RouteRecordRaw } from "vue-router"

const MainLayout = () => import("layouts/MainLayout.vue")
const Index = () => import("pages/Index.vue")
const RegisterDialog = () => import("components/RegisterDialog.vue")
const VerifyDialog = () => import("components/VerifyDialog.vue")

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        component: Index,
      },
      {
        path: "register",
        components: {
          default: Index,
          dialog: RegisterDialog,
        },
      },
      {
        path: "verify",
        components: {
          default: Index,
          dialog: VerifyDialog,
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
]

export default routes
