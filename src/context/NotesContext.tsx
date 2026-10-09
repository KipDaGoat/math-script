import { createContext } from "react"
import useIndexedDB, { type Entry } from "../hooks/useIndexedDB"
import Note from "../utils/Note"
import type { SimplifiedNote } from "../utils/Note"

type NotesProviderProps = { children: React.ReactNode }

type NotesContextValue = {
    getAllNotes: () => Entry<Note>[]
    getNote: (id: string) => Note | null
    addNote: (note: SimplifiedNote) => void
    deleteNote: (noteId: string) => void
    updateNote: (noteId: string, note: SimplifiedNote) => void
}

const NotesContext = createContext<NotesContextValue | null>(null)

export function NotesProvider({ children }: NotesProviderProps): React.JSX.Element {
    const [notes, setNotes] = useIndexedDB<SimplifiedNote>("NOTES")

    const getAllNotes = () => notes.map(note => ({ id: note.id, data: Note.parse(note.data) }))
    const getNote = (id: string) => {
        const entry = notes.find(noteEntry => noteEntry.id === id)

        if (entry == null) return null
        return Note.parse(entry.data)
    }
    const addNote = (note: SimplifiedNote) => setNotes({ operation: "add", newData: note })
    const deleteNote = (noteId: string) => setNotes({ operation: "delete", id: noteId })
    const updateNote = (noteId: string, note: SimplifiedNote) =>
        setNotes({ operation: "update", newData: { id: noteId, data: note } })

    return (
        <NotesContext.Provider value={{ getAllNotes, getNote, addNote, deleteNote, updateNote }}>
            {children}
        </NotesContext.Provider>
    )
}

export default NotesContext
