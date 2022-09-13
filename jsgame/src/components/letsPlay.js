
import { useState } from "react"
import { Saves } from "./saves"

export const LetsPlay = () => {
    const username = localStorage.getItem("username")
    

    const [showSaves, setShowSaves] = useState(false)
    return <> 
    {!showSaves ?
    <section>
    <h3>OK {username}, Let's Play</h3>
    <button onClick={() => {setShowSaves(true)}}>Play</button>
    </section>
    : 
    <Saves/>
    }
    </>
}