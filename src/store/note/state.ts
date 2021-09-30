export interface NoteStateInterface {
  notes: Note[]
}

export interface Note {
  id: string
  title: string
  text: string
  color: string
  createdAt: Date
  updatedAt: Date
  sharedNote: SharedNote
  image: Image
}

export interface SharedNote {
  id: string
  note: Note
  expiresAt: Date
  createdAt: Date
}

export interface Image {
  id: string
  mimetype: string
  createdAt: Date
  updatedAt: Date
}

function state(): NoteStateInterface {
  return {
    notes: [],
  }
}

export default state
