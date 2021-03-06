import { ActionTree } from "vuex"
import { StateInterface } from "../index"
import { Settings, UserStateInterface } from "./state"
import { api } from "boot/axios"
import { Notify } from "quasar"
import { AxiosError } from "axios"

interface Response {
  token: string
}

interface ColorResponse {
  noteColors: string[]
}

const actions: ActionTree<UserStateInterface, StateInterface> = {
  login({ dispatch }, user) {
    void api
      .post("/auth/login", user)
      .then(async (response) => {
        const responseData = response.data as Response
        localStorage.setItem("jwt", responseData.token)
        await dispatch("getProfile")
        window.dispatchEvent(new CustomEvent("logged-in"))
        await dispatch("note/getNotes", null, { root: true })
      })
      .catch((e: AxiosError) => {
        let message = "Something went wrong"
        if (e.response?.status === 400) {
          message = "Username/Email was not found or password is invalid"
        }
        Notify.create({
          color: "negative",
          position: "top",
          message: message,
          icon: "report_problem",
        })
      })
  },
  logout({ commit }) {
    localStorage.clear()
    commit("clearAll")
    commit("note/clearAll", null, { root: true })
  },
  getProfile({ commit }) {
    const jwt: string = localStorage.getItem("jwt") || ""
    return api.get("/users/profile", { headers: { Authorization: "Bearer " + jwt } }).then((response) => {
      commit("setProfile", response.data)
    })
  },
  patchNoteColors({ commit }, colors: string[]) {
    const jwt: string = localStorage.getItem("jwt") || ""
    void api
      .patch("/users/profile", { noteColors: colors }, { headers: { Authorization: "Bearer " + jwt } })
      .then((response) => {
        const colorResponse = response.data as ColorResponse
        commit("setColors", colorResponse.noteColors)
      })
  },
  toggleDarkMode({ commit }, dark: boolean) {
    const jwt: string = localStorage.getItem("jwt") || ""
    void api
      .patch(
        "users/settings",
        { darkMode: dark },
        {
          headers: { Authorization: "Bearer " + jwt },
        },
      )
      .then((response) => {
        const settingsResponse = response.data as Settings
        commit("setDarkMode", settingsResponse.darkMode)
      })
  },
  addBackgroundImage({ commit }, id: string) {
    const jwt: string = localStorage.getItem("jwt") || ""
    void api
      .patch(
        "users/settings",
        { image: id },
        {
          headers: { Authorization: "Bearer " + jwt },
        },
      )
      .then((response) => {
        const settingsResponse = response.data as Settings
        commit("setBackgroundImage", settingsResponse.image)
      })
  },
}

export default actions
