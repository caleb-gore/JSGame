import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getUser } from "../../managers/UserManager"

export const NavBar = () => {
    const [user, setUser] = useState({})
    const userId = JSON.parse(localStorage.getItem("u_id"))
    useEffect(()=>{getUser(userId).then(setUser)},[])
    const navigate = useNavigate()
    console.log(user);
    return (

        <ul>
            <li>
                <Link to="/assets">Assets</Link>
            </li>
            <li>
                <Link to="/games">Games</Link>
            </li>
            {user.is_superuser ? <li>
                <Link to="/users">Users</Link>
            </li> : ""}
            
            <li>
                <button onClick={()=>{
                    localStorage.removeItem("u_token")
                    localStorage.removeItem("is_staff")
                    localStorage.removeItem("u_id")
                    navigate('/welcome')
                }}>Logout</button>
            </li>
        </ul>
    )
}