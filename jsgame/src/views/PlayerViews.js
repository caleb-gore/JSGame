import { Outlet, Route, Routes } from "react-router-dom"
import { Game } from "../components/game"
import { LetsPlay } from "../components/letsPlay"

export const PlayerViews = () => {
    
    return <> 
    <Routes>
        <Route path="/" element={<>
        Game view
        <Outlet />
        </>}>
            <Route path="lets_play" element={<LetsPlay/>} />
            <Route path="game" element={<Game/>} />
        </Route>
    </Routes>
    </>
}