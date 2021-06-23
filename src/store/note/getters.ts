import { GetterTree } from "vuex"
import { StateInterface } from "../index"
import { NoteStateInterface } from "./state"

const getters: GetterTree<NoteStateInterface, StateInterface> = {
  someAction(/* context */) {
    // your code
  },
}

export default getters
