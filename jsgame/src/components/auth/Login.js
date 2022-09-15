/* LOGIN EXISTING USER */

// IMPORTS
import React, { useRef, useState } from "react"
import { Link, useHistory, useNavigate } from "react-router-dom"
import { loginUser } from "../../managers/AuthManager"

// COMPONENT
export const Login = () => {
    const username = useRef()
    const password = useRef()
    const invalidDialog = useRef()
    const navigate = useNavigate()


    /* USER OBJECT TO HOLD USERNAME AND PASSWORD 
    UNTIL LOGIN IS COMPLETED */
    // const [userObj, setUserObj] = useState({
    //     username: "admin",
    //     password: "admin"
    // })

    /* ARRAY USED TO KEEP TRACK OF "PAGES" OF LOGIN PROMPTS 
    (PAGE IN "TRUE" POSITION IS DISPLAYED) */
    // const [currentPage, setCurrentPage] = useState([true, false])

    /* LOGIN USER USING DATA FROM USER OBJ
    SHOW MODAL IF INVALID LOGIN */

    const handleLogin = (e) => {
        e.preventDefault()

        const user = {
            username: username.current.value,
            password: password.current.value
        }

        loginUser(user).then(res => {
            if ("valid" in res && res.valid) {
                console.log(res);
                localStorage.setItem("u_token", res.token)
                localStorage.setItem("is_staff", res.is_staff)
                if (res.is_staff) {
                    navigate("/admin")
                } else {
                    navigate("/lets_play")
                } 
            } else {
                invalidDialog.current.showModal()
            }
        })
    }

    
    
    // /* SHOW PAGE 1 */
    // const page1 = () => {
    //     return (
    //         <>
    //             <h3>
    //                 Hi There! Don't I recognize you? You look familiar! What was your name?
    //             </h3>
    //             <input
    //                 value={userObj.username}
    //                 onChange={(e) => {
    //                     let copy = { ...userObj };
    //                     copy.username = e.target.value;
    //                     setUserObj(copy);
    //                 }}
    //             />
    //             <button onClick={()=>{
    //                 setCurrentPage([false,true])
    //             }}>next</button>
    //         </>
    //     );
    // };

    // /* SHOW PAGE 2 */
    // const page2 = () => {
    //     return (
    //         <>
    //             <h3>
    //                 Great to see you again, {userObj.username}! What was that password of yours? Gotta make sure you're actually you!
    //             </h3>
    //             <input
    //                 type="password"
    //                 value={userObj.password}
    //                 onChange={(e) => {
    //                     let copy = { ...userObj };
    //                     copy.password = e.target.value;
    //                     setUserObj(copy);
    //                 }}
    //             />
    //             <button onClick={(e)=>{handleLogin(e)}}>next</button>
    //         </>
    //     );
    // };

    return (
        <main className="container--login" style={{ textAlign: "center" }}>
            {/* INVALID LOGIN MODAL */}
            <dialog className="dialog dialog--auth" ref={invalidDialog}>
                <div>Username or password was not valid.</div>
                <button className="button--close" onClick={e => invalidDialog.current.close()}>Close</button>
            </dialog>

            <section>
                <form className="form--login" onSubmit={handleLogin}>
                    <h1>DEFAULT GAME NAME TEXT</h1>
                    <h2>Please sign in</h2>
                    <fieldset>
                        <label htmlFor="inputUsername"> Username address </label>
                        <input ref={username} type="username" id="username" className="form-control" placeholder="Username address" required autoFocus />
                    </fieldset>
                    <fieldset>
                        <label htmlFor="inputPassword"> Password </label>
                        <input ref={password} type="password" id="password" className="form-control" placeholder="Password" required />
                    </fieldset>
                    <fieldset style={{
                        textAlign: "center"
                    }}>
                        <button className="btn btn-1 btn-sep icon-send" type="submit">Sign In</button>
                    </fieldset>
                </form>
            </section>
            <section className="link--register">
                <Link to="/register">Not a member yet?</Link>
            </section>

            {/* PAGES
            {currentPage[0] ? page1() : <></>}
            {currentPage[1] ? page2() : <></>} */}
        </main>
    )
}