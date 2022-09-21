import { useEffect, useState } from "react"
import styled from "styled-components"
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
        <Main>
            <ul>
                {listOfUsers()}
                
            </ul>
        </Main>
    )
}

const Main = styled.main`
margin-top: 100px;
`