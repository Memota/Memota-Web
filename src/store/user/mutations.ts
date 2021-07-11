import { MutationTree } from "vuex"
import { User, UserStateInterface } from "./state"

const emptyUser: User = {
  id: "",
  username: "",
  email: "",
  verified: false,
  role: "",
  noteColors: ["#ffffff"],
}

const mutation: MutationTree<UserStateInterface> = {
  setProfile(state: UserStateInterface, user: User) {
    state.user = user
  },
  clearAll(state: UserStateInterface) {
    Object.assign(state.user, emptyUser)
  },
  setColors(state: UserStateInterface, colors: string[]) {
    state.user.noteColors = colors
  },
}

export default mutation
