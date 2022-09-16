import { useEffect, useRef, useState } from "react"
import { getUser } from "../../managers/UserManager"

export const Dashboard = () => {
    const gameCodeDialog = useRef()
    const playerId = JSON.parse(localStorage.getItem("u_id"))
    const [user, setUser] = useState({})

    useEffect(()=>{getUser(playerId).then(setUser)},[])
    console.log();

    return <>
    <h3>Hello {user.username}</h3>

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