import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUser } from "../../managers/UserManager"

export const Dashboard = () => {
    const navigate = useNavigate()
    const gameCodeDialog = useRef()
    const playerId = JSON.parse(localStorage.getItem("u_id"))
    const [user, setUser] = useState({})

    useEffect(()=>{getUser(playerId).then(setUser)},[])
    console.log();

    return <>
    <h3>Hello {user.username}</h3>
    <button onClick={()=>{
        localStorage.removeItem("u_token")
        localStorage.removeItem("is_staff")
        localStorage.removeItem("u_id")
        navigate('/')
    }}>logout</button>

    <h4>Your Games</h4>
    <p>Have a game code? enter it <button onClick={()=>gameCodeDialog.current.showModal()}>here</button></p>
    <ul>
        <li>Game Title <button>play</button></li>
        <li>Game Title <button>play</button></li>
        <li>Game Title <button>play</button></li>
    </ul>

    <dialog ref={gameCodeDialog}>
        <form>
            <label>Enter Game Code</label>
            <input />
            <button>Submit</button>
            <button onClick={()=>gameCodeDialog.current.close()}>Cancel</button>
        </form>
    </dialog>

    </>
}