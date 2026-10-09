import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Notes from "./pages/Notes"
import MainNav from "./components/macro/MainNav"
import { NotesProvider } from "./context/NotesContext"
import EditNote from "./pages/EditNote"

export default function App(): React.JSX.Element {
    return (
        <BrowserRouter>
            <MainNav />
            <NotesProvider>
                <Routes>
                    <Route path="/" element={<Notes />} />
                    <Route path="/notes/:id">
                        <Route index element={<h1>Read</h1>} />
                        <Route path="edit" element={<EditNote />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </NotesProvider>
        </BrowserRouter>
    )
}
