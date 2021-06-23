import { MutationTree } from "vuex"
import { Note, NoteStateInterface } from "./state"

const mutation: MutationTree<NoteStateInterface> = {
  setNotes(state: NoteStateInterface, notes: Note[]) {
    state.notes = notes
  },
}

export default mutation
