import { MutationTree } from "vuex"
import { User, UserStateInterface } from "./state"

const mutation: MutationTree<UserStateInterface> = {
  setProfile(state: UserStateInterface, user: User) {
    state.user = user
  },
}

export default mutation
