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
                navigate("/") 
            } else {
                invalidDialog.current.showModal()
            }
        })
    }


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

        </main>
    )
}