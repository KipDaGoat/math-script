import { useNavigate, useParams } from "react-router-dom"
import MathScriptEditor from "../components/MathScriptEditor"
import MathScriptPreview from "../components/MathScriptPreview"
import { useContext, useDeferredValue, useEffect, useState } from "react"
import "./EditNote.css"
import NotesContext from "../context/NotesContext"
import Button from "../components/micro/Button"
import { BookmarkIcon } from "lucide-react"

export default function EditNote(): React.JSX.Element {
    const { id } = useParams()
    const { getNote, updateNote } = useContext(NotesContext)!
    const [script, setScript] = useState("")
    const deferredScript = useDeferredValue(script)
    const navigate = useNavigate()

    useEffect(() => {
        if (id == null) {
            navigate("/")
            return
        }

        const note = getNote(id)
        if (note == null) {
            navigate("/")
            return
        }

        setScript(note.getContent())
    })

    const saveNote = () => {
        const note = getNote(id!)!
    }

    return (
        <main className="EDIT-NOTE">
            <section className="EDIT-NOTE__section">
                <div>
                    <Button size="xs" isIcon aria-label="Save" onClick={saveNote}>
                        <BookmarkIcon />
                    </Button>
                </div>
                <MathScriptEditor script={script} setScript={setScript} />
            </section>
            <section className="EDIT-NOTE__section">
                <MathScriptPreview script={deferredScript} />
            </section>
        </main>
    )
}
