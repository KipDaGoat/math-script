import { createContext } from "react"
import useIndexedDB, { type DataReducerArgs, type Entry } from "../hooks/useIndexedDB"
import type Note from "../utils/Note"

type NotesProviderProps = { children: React.ReactNode }

type NotesContextValue = { notes: Entry<Note>[]; setNotes: React.ActionDispatch<[args: DataReducerArgs<Note>]> }

const NotesContext = createContext<NotesContextValue | null>(null)

export function NotesProvider({ children }: NotesProviderProps): React.JSX.Element {
    const [notes, setNotes] = useIndexedDB<Note>("NOTES")

    return <NotesContext.Provider value={{ notes, setNotes }}>{children}</NotesContext.Provider>
}

export default NotesContext
