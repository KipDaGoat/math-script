import { useContext, useState } from "react"
import NotesContext from "../context/NotesContext"
import Button from "../components/micro/Button"
import Note from "../utils/Note"
import NotePreview from "../components/NotePreview"

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
            <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                {getAllNotes().map(entry => (
                    <NotePreview note={entry.data} id={entry.id} />
                ))}
            </section>
        </main>
    )
}
