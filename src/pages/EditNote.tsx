import { useParams } from "react-router-dom"
import MathScriptEditor from "../components/MathScriptEditor"
import MathScriptPreview from "../components/MathScriptPreview"
import useLocalStorage from "../hooks/useLocalStorage"
import { useDeferredValue } from "react"
import "./EditNote.css"

export default function EditNote(): React.JSX.Element {
    const { id } = useParams()
    const [script, setScript] = useLocalStorage("MATH_SCRIPT", "")
    const deferredScript = useDeferredValue(script)

    return (
        <main className="EDIT-NOTE">
            <section className="EDIT-NOTE__section">
                <MathScriptEditor script={script} setScript={setScript} />
            </section>
            <section className="EDIT-NOTE__section">
                <MathScriptPreview script={deferredScript} />
            </section>
        </main>
    )
}
