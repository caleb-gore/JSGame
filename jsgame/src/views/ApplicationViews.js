import { Route, Routes } from "react-router-dom"
import { Admin } from "../components/admin/admin"
import { Assets } from "../components/admin/assets"
import { Users } from "../components/admin/users/users"
import { Game } from "../components/game"
import { LetsPlay } from "../components/letsPlay"

export const ApplicationViews = () => {
    return <> 
    <Routes>
        <Route path="/lets_play" element={<LetsPlay/>} />
        <Route path="/game" element={<Game/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/admin/assets" element={<Assets/>} />
        <Route path="/admin/users" element={<Users/>} />
    </Routes>
    </>
}