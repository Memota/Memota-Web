import { ActionTree } from "vuex"
import { StateInterface } from "../index"
import { UserStateInterface } from "./state"
import { api } from "boot/axios"
import { Notify } from "quasar"

interface Response {
  token: string
}

const actions: ActionTree<UserStateInterface, StateInterface> = {
  login({ commit, dispatch }, user) {
    void api
      .post("/users/login", user)
      .then((response) => {
        const responseData = response.data as Response
        commit("setJwt", responseData.token)
        void dispatch("getProfile")
      })
      .catch(() => {
        Notify.create({
          color: "negative",
          position: "top",
          message: "Something went wrong",
          icon: "report_problem",
        })
      })
  },
  getProfile({ commit, state }) {
    void api.get("/users/profile", { headers: { Authorization: "Bearer " + state.jwt } }).then((response) => {
      commit("setProfile", response.data)
    })
  },
}

export default actions
