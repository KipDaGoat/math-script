import { useDeferredValue, useEffect, useState } from "react"
import MathScriptPreview from "./components/MathScriptPreview"
import MathScriptEditor from "./components/MathScriptEditor"
import "./App.css"
import useLocalStorage from "./hooks/useLocalStorage"
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes } from "react-router-dom"
import Notes from "./pages/Notes"
import MainNav from "./components/macro/MainNav"
import useIndexedDB from "./hooks/useIndexedDB"
import Button from "./components/micro/Button"

export default function App(): React.JSX.Element {
    const [script, setScript] = useLocalStorage("MATH_SCRIPT", "")
    const deferredScript = useDeferredValue(script)

    const [data, setData] = useIndexedDB<string>("notes")

    return (
        <BrowserRouter>
            <Button onClick={() => setData({ operation: "add", newData: "Some data" })}>Add</Button>
            <Button onClick={() => setData({ operation: "delete", id: data.at(-1)!.id })}>Remove last</Button>
            <Button
                onClick={() =>
                    setData({ operation: "update", newData: { id: data.at(-1)!.id, data: "Some updated data" } })
                }
            >
                Edit first
            </Button>
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
