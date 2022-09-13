import { Route, Routes } from "react-router-dom"
import { Game } from "../components/game"
import { LetsPlay } from "../components/letsPlay"

export const ApplicationViews = () => {
    return <> 
    <Routes>
        <Route path="/lets_play" element={<LetsPlay/>} />
        <Route path="/game" element={<Game/>} />
    </Routes>
    </>
}