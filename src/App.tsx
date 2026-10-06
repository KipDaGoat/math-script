import { useDeferredValue, useEffect, useState } from "react"
import MathScriptPreview from "./components/MathScriptPreview"
import MathScriptEditor from "./components/MathScriptEditor"
import "./App.css"
import MathScript from "./utils/MathScript"
import FeedbackBtn from "./components/FeedbackBtn"
import useLocalStorage from "./hooks/useLocalStorage"

export default function App(): React.JSX.Element {
    const [script, setScript] = useLocalStorage("MATH_SCRIPT", "")
    const deferredScript = useDeferredValue(script)

    return (
        <main className="APP">
            <section className="APP__section">
                <MathScriptEditor script={script} setScript={setScript} />
            </section>
            <section className="APP__section">
                <MathScriptPreview script={deferredScript} />
            </section>
        </main>
    )
}
