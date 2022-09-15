import { useEffect, useState } from "react"
import { getAllUsers } from "../../../managers/UserManager"
import { UserDetails } from "./userDetails"


export const Users = () => {
    const [allUsers, setAllUsers] = useState([])
    const [openUser, updateOpenUser] = useState(0)
    useEffect(()=>{
        getAllUsers().then(setAllUsers)
    },[])

    const listOfUsers = () => {
        return allUsers.map(user => {

            return (
                <li key={`user--${user.id}`}>
                    {user.username}
                    {openUser === user.id 
                    ? <>
                        <button onClick={()=>updateOpenUser(0)}>close</button>
                        <UserDetails user={user}/> 
                    </>
                    : <button onClick={()=>updateOpenUser(user.id)}>manage user</button>}
                    
                </li>
            )
            
        })
    }

    return (
        <>
            <ul>
                {listOfUsers()}
                
            </ul>
        </>
    )
}