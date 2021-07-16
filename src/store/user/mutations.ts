import { MutationTree } from "vuex"
import { User, UserStateInterface } from "./state"

const emptyUser: User = {
  id: "",
  username: "",
  email: "",
  verified: false,
  role: "",
  noteColors: ["#ffffff"],
  settings: { darkMode: false },
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
  setDarkMode(state: UserStateInterface, dark: boolean) {
    state.user.settings.darkMode = dark
  },
}

export default mutation
