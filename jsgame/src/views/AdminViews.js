import { useEffect, useState } from "react"
import { Outlet, Route, Routes } from "react-router-dom"
import { Assets } from "../components/admin/assets"
import { GamesList } from "../components/admin/games/gamesList"
import { Trophies } from "../components/admin/trophies"
import { Users } from "../components/admin/users/users"
import { getUser } from "../managers/UserManager"

export const AdminViews = () => {
    const [user, setUser] = useState()
    const userId = JSON.parse(localStorage.getItem('u_id'))
    useEffect(()=>{getUser(userId).then(setUser)},[])

    return <> 
    <Routes>
        <Route path="/" element={<>
        <Outlet />
        </>}>
            <Route path="assets" element={<Assets/>} />
            <Route path="games" element={<GamesList/>} />
            <Route path="trophies" element={<Trophies/>} />
            {user?.is_superuser ? 
            <Route path="users" element={<Users/>} /> : ""
            }
        </Route>
    </Routes>
    </>
}