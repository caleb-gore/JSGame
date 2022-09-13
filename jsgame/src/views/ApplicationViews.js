import { Route, Routes } from "react-router-dom"
import { LetsPlay } from "../components/letsPlay"

export const ApplicationViews = () => {
    return <> 
    <Routes>
        <Route path="/lets_play" element={<LetsPlay/>} />
    </Routes>
    </>
}