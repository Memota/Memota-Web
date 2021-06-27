import { RouteRecordRaw } from "vue-router"

const MainLayout = () => import("layouts/MainLayout.vue")
const Index = () => import("pages/Index.vue")
const RegisterDialog = () => import("components/RegisterDialog.vue")
const LoginDialog = () => import("components/LoginDialog.vue")
const VerifyDialog = () => import("components/VerifyDialog.vue")
const VerifySpinnerDialog = () => import("components/VerifySpinnerDialog.vue")
const ResetPasswordDialog = () => import("components/ResetPasswordDialog.vue")
const SendResetPasswordDialog = () => import("components/SendResetPasswordDialog.vue")
const EditNoteDialog = () => import("components/EditNoteDialog.vue")

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
        path: "login",
        components: {
          default: Index,
          dialog: LoginDialog,
        },
      },
      {
        path: "verify",
        components: {
          default: Index,
          dialog: VerifyDialog,
        },
      },
      {
        path: "auth/verify/:token",
        components: {
          default: Index,
          dialog: VerifySpinnerDialog,
        },
      },
      {
        path: "auth/reset/:token",
        components: {
          default: Index,
          dialog: ResetPasswordDialog,
        },
      },
      {
        path: "reset",
        components: {
          default: Index,
          dialog: SendResetPasswordDialog,
        },
      },
      {
        path: "edit/:id",
        components: {
          default: Index,
          dialog: EditNoteDialog,
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
