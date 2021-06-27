export interface NoteStateInterface {
  notes: Note[]
}

export interface Note {
  id: string
  title: string
  text: string
  createdat: Date
  updatedat: Date
}

function state(): NoteStateInterface {
  return {
    notes: [],
  }
}

export default state
