import { useDeferredValue, useEffect, useState } from "react"
import MathScriptPreview from "./components/MathScriptPreview"
import MathScriptEditor from "./components/MathScriptEditor"
import "./App.css"
import MathScript from "./utils/MathScript"
import FeedbackBtn from "./components/FeedbackBtn"

export default function App(): React.JSX.Element {
    const [script, setScript] = useState("")
    const deferredScript = useDeferredValue(script)

    return (
        <main className="APP">
            <section className="APP__section">
                <FeedbackBtn
                    defaultText="Quick Save"
                    successText="Save successful!"
                    errorText="Save failed"
                    onClick={() => true}
                />
                <MathScriptEditor script={script} setScript={setScript} />
            </section>
            <section className="APP__section">
                <MathScriptPreview script={deferredScript} />
            </section>
        </main>
    )
}
