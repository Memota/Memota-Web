import { ActionTree } from "vuex"
import { StateInterface } from "../index"
import { NoteStateInterface } from "./state"
import { api } from "boot/axios"
import { Notify } from "quasar"

const actions: ActionTree<NoteStateInterface, StateInterface> = {
  getNotes({ commit }) {
    const jwt: string = localStorage.getItem("jwt") || ""
    void api
      .get("/notes", { headers: { Authorization: "Bearer " + jwt } })
      .then((response) => {
        commit("setNotes", response.data)
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
}

export default actions
