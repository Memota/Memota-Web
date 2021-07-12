export interface UserStateInterface {
  user: User
}

export interface User {
  id: string
  username: string
  email: string
  verified: boolean
  role: string
  noteColors: string[]
}

function state(): UserStateInterface {
  return {
    user: {
      id: "",
      username: "",
      email: "",
      verified: false,
      role: "",
      noteColors: ["#ffffff"],
    },
  }
}

export default state
