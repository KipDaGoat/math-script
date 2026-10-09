import { useContext, useState } from "react"
import NotesContext from "../context/NotesContext"
import Button from "../components/micro/Button"
import Note from "../utils/Note"

export default function Notes(): React.JSX.Element {
    const { getAllNotes, addNote } = useContext(NotesContext)!
    const [content, setContent] = useState("")

    return (
        <main>
            <h1>Notes</h1>
            <textarea value={content} onChange={event => setContent(event.target.value)} />
            <Button
                size="s"
                onClick={() => {
                    if (content === "") return
                    addNote(new Note(content).simplifyNote())
                }}
            >
                Add Note
            </Button>
            {getAllNotes().map(note => (
                <Button variant="primary">{note.data.title}</Button>
            ))}
        </main>
    )
}
