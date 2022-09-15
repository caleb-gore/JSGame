import { useNavigate } from "react-router-dom"

export const Admin = () => {
    const is_staff = JSON.parse(localStorage.getItem("is_staff"))
    const username = localStorage.getItem("username")
    const navigate = useNavigate()

    return (
        <>
            {is_staff ? 
            <>
                <h1>Welcome {username}</h1>
                <button onClick={()=>navigate('/admin/assets')}>Assets</button>
                <button onClick={()=>navigate('/admin/users')}>Users</button>
            </> 
            : 
            <>You are not authorized to view this page</>}
        </>
    )
}