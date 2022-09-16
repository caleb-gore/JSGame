import { NavBar } from "../components/nav/NavBar"
import { AdminViews } from "./AdminViews"
import { PlayerViews } from "./PlayerViews"

export const ApplicationViews = () => {
    const is_staff = JSON.parse(localStorage.getItem("is_staff"))

    if (is_staff) {
        return (
            <>
                <NavBar />
                <AdminViews />
            </>
        )
    } else {
        return <PlayerViews />
    }
}