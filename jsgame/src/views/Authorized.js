import { Navigate, useLocation } from "react-router-dom"

export const Authorized = ({ children }) => {
    const location = useLocation()

    if (localStorage.getItem("u_token")) {
        return children
    } else {
        return <Navigate
            to={`/${location.search}`}
            replace
            state={{ location }} />
    }
}