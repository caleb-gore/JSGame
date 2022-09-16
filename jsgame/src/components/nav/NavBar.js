import { Link, useNavigate } from "react-router-dom"

export const NavBar = () => {
    const navigate = useNavigate()
    
    return (
        <ul>
            <li>
                <Link to="/assets">Assets</Link>
            </li>
            <li>
                <Link to="/users">Users</Link>
            </li>
            <li>
                <button onClick={()=>{
                    localStorage.removeItem("u_token")
                    localStorage.removeItem("is_staff")
                    navigate('/welcome')
                }}>Logout</button>
            </li>
        </ul>
    )
}