import { MutationTree } from "vuex"
import { Note, NoteStateInterface } from "./state"

const mutation: MutationTree<NoteStateInterface> = {
  setNotes(state: NoteStateInterface, notes: Note[]) {
    state.notes = notes
  },
  deleteNote(state: NoteStateInterface, id: string) {
    state.notes = state.notes.filter((note) => note.id !== id)
  },
}

export default mutation
