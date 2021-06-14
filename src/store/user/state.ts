export interface UserStateInterface {
  user: User
  jwt: string
}

export interface User {
  id: string
  username: string
  email: string
  verified: boolean
  role: string
}

function state(): UserStateInterface {
  return {
    user: {
      id: "",
      username: "",
      email: "",
      verified: false,
      role: "",
    },
    jwt: "",
  }
}

export default state
