import { MutationTree } from "vuex"
import { User, UserStateInterface } from "./state"

const mutation: MutationTree<UserStateInterface> = {
  setJwt(state: UserStateInterface, jwt: string) {
    state.jwt = jwt
  },
  setProfile(state: UserStateInterface, user: User) {
    state.user = user
  },
}

export default mutation
