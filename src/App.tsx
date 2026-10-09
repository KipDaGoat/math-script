import { useDeferredValue } from "react"
import MathScriptPreview from "./components/MathScriptPreview"
import MathScriptEditor from "./components/MathScriptEditor"
import "./App.css"
import useLocalStorage from "./hooks/useLocalStorage"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Notes from "./pages/Notes"
import MainNav from "./components/macro/MainNav"
import { NotesProvider } from "./context/NotesContext"

export default function App(): React.JSX.Element {
    const [script, setScript] = useLocalStorage("MATH_SCRIPT", "")
    const deferredScript = useDeferredValue(script)

    return (
        <BrowserRouter>
            <MainNav />
            <NotesProvider>
                <Routes>
                    <Route path="/" element={<Notes />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <main className="APP">
                    <section className="APP__section">
                        <MathScriptEditor script={script} setScript={setScript} />
                    </section>
                    <section className="APP__section">
                        <MathScriptPreview script={deferredScript} />
                    </section>
                </main>
            </NotesProvider>
        </BrowserRouter>
    )
}
