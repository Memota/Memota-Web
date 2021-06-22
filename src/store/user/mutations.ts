import { MutationTree } from "vuex"
import { User, UserStateInterface } from "./state"

const emptyUser: User = {
  id: "",
  username: "",
  email: "",
  verified: false,
  role: "",
}

const mutation: MutationTree<UserStateInterface> = {
  setProfile(state: UserStateInterface, user: User) {
    state.user = user
  },
  clearAll(state: UserStateInterface) {
    Object.assign(state.user, emptyUser)
  },
}

export default mutation
