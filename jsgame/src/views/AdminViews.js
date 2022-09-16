import { Outlet, Route, Routes } from "react-router-dom"
import { Assets } from "../components/admin/assets"
import { Users } from "../components/admin/users/users"

export const AdminViews = () => {
    return <> 
    <Routes>
        <Route path="/" element={<>
        Admin View
        <Outlet />
        </>}>
            <Route path="assets" element={<Assets/>} />
            <Route path="users" element={<Users/>} />
        </Route>
    </Routes>
    </>
}