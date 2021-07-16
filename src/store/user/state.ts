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
  settings: Settings
}

export interface Settings {
  darkMode: boolean
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
      settings: { darkMode: false },
    },
  }
}

export default state
