import { Module } from "vuex"
import { StateInterface } from "../index"
import state, { NoteStateInterface } from "./state"
import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

const noteModule: Module<NoteStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

export default noteModule
