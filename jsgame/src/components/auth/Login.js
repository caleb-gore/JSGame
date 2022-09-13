import React, { useRef, useState } from "react"
import { Link, useHistory, useNavigate } from "react-router-dom"


export const Login = () => {
    const username = useRef()
    const password = useRef()
    const invalidDialog = useRef()
    const navigate = useNavigate()

    const [userObj, setUserObj] = useState({
        username: "",
        password: ""
    })
    const [currentPage, setCurrentPage] = useState([true, false])

    const handleLogin = (e) => {
        e.preventDefault()

        return fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                username: userObj.username,
                password: userObj.password
            })
        })
            .then(res => res.json())
            .then(res => {
                if ("valid" in res && res.valid && "token" in res) {
                    localStorage.setItem("u_token", res.token)
                    localStorage.setItem("username", userObj.username)
                    navigate("/lets_play")
                }
                else {
                    invalidDialog.current.showModal()
                }
            })
    }

    /* SHOW PAGE 1 */
    const page1 = () => {
        return (
            <>
                <h3>
                    Hi There! Don't I recognize you? You look familiar! What was your name?
                </h3>
                <input
                    value={userObj.username}
                    onChange={(e) => {
                        let copy = { ...userObj };
                        copy.username = e.target.value;
                        setUserObj(copy);
                    }}
                />
                <button onClick={()=>{
                    setCurrentPage([false,true])
                }}>next</button>
            </>
        );
    };

    /* SHOW PAGE 2 */
    const page2 = () => {
        return (
            <>
                <h3>
                    Great to see you again, {userObj.username}! What was that password of yours? Gotta make sure you're actually you!
                </h3>
                <input
                    type="password"
                    value={userObj.password}
                    onChange={(e) => {
                        let copy = { ...userObj };
                        copy.password = e.target.value;
                        setUserObj(copy);
                    }}
                />
                <button onClick={(e)=>{handleLogin(e)}}>next</button>
            </>
        );
    };

    return (
        <main className="container--login">
            <dialog className="dialog dialog--auth" ref={invalidDialog}>
                <div>Username or password was not valid.</div>
                <button className="button--close" onClick={e => invalidDialog.current.close()}>Close</button>
            </dialog>

            {currentPage[0] ? page1() : <></>}
            {currentPage[1] ? page2() : <></>}
            
            {/* <section>
                <form className="form--login" onSubmit={handleLogin}>
                    <h1>Level Up</h1>
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
            </section> */}
        </main>
    )
}