export interface NoteStateInterface {
  notes: Note[]
}

export interface Note {
  id: string
  title: string
  text: string
  color: string
  createdat: Date
  updatedat: Date
  sharedNote: SharedNote
}

export interface SharedNote {
  id: string
  note: Note
  createdAt: Date
}

function state(): NoteStateInterface {
  return {
    notes: [],
  }
}

export default state
