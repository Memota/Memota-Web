import { RouteRecordRaw } from "vue-router"

const MainLayout = () => import("layouts/MainLayout.vue")
const SharedLayout = () => import("layouts/SharedLayout.vue")
const Index = () => import("pages/Index.vue")
const Shared = () => import("pages/Shared.vue")
const RegisterDialog = () => import("components/RegisterDialog.vue")
const LoginDialog = () => import("components/LoginDialog.vue")
const VerifyDialog = () => import("components/VerifyDialog.vue")
const VerifySpinnerDialog = () => import("components/VerifySpinnerDialog.vue")
const ResetPasswordDialog = () => import("components/ResetPasswordDialog.vue")
const SendResetPasswordDialog = () => import("components/SendResetPasswordDialog.vue")
const EditNoteDialog = () => import("components/EditNoteDialog.vue")
const Images = () => import("pages/Images.vue")
const BackupDialog = () => import("components/BackupDialog.vue")

const routes: RouteRecordRaw[] = [
  {
    path: "/shared",
    component: SharedLayout,
    children: [
      {
        path: ":id",
        component: Shared,
      },
    ],
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        component: Index,
      },
      {
        path: "/images",
        component: Images,
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
      {
        path: "backup",
        components: {
          default: Index,
          dialog: BackupDialog,
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
