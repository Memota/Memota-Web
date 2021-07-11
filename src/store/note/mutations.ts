import { MutationTree } from "vuex"
import { Note, NoteStateInterface } from "./state"

const mutation: MutationTree<NoteStateInterface> = {
  setNotes(state: NoteStateInterface, notes: Note[]) {
    state.notes = notes
    window.dispatchEvent(new CustomEvent("updated-notes"))
    console.log("wd")
  },
  deleteNote(state: NoteStateInterface, id: string) {
    state.notes = state.notes.filter((note) => note.id !== id)
  },
  clearAll(state: NoteStateInterface) {
    // clear all the notes
    state.notes = []
  },
}

export default mutation
