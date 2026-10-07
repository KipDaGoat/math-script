import { useDeferredValue, useEffect, useState } from "react"
import MathScriptPreview from "./components/MathScriptPreview"
import MathScriptEditor from "./components/MathScriptEditor"
import "./App.css"
import useLocalStorage from "./hooks/useLocalStorage"
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes } from "react-router-dom"
import Notes from "./pages/Notes"
import MainNav from "./components/macro/MainNav"
import useIndexedDB from "./hooks/useIndexedDB"

export default function App(): React.JSX.Element {
    const [script, setScript] = useLocalStorage("MATH_SCRIPT", "")
    const deferredScript = useDeferredValue(script)

    const [data, setData] = useIndexedDB<number>("DATA", 0)

    for (let i = 1; i < 5; i++) setData(i)

    return (
        <BrowserRouter>
            <MainNav />
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
        </BrowserRouter>
    )
}
