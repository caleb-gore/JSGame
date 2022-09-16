import { Outlet, Route, Routes } from "react-router-dom"
import { Dashboard } from "../components/player/dashboard"
import { Game } from "../components/player/game"
import { LetsPlay } from "../components/player/letsPlay"

export const PlayerViews = () => {
    
    return <> 
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="lets_play" element={<LetsPlay/>} />
        <Route path="game" element={<Game/>} />
    </Routes>
    </>
}