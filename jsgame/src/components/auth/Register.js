/* REGISTER NEW USER */

// IMPORTS
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../managers/AuthManager";

// COMPONENT
export const Register = () => {
    const username = useRef();
    const password = useRef();
    const verifyPassword = useRef();
    const passwordDialog = useRef();
    const navigate = useNavigate();

    /* SAVE REGISTRATION DATA AS NEW USER OBJECT
    CALL REGISTER USER FUNCTION
    SHOW MODAL IF PASSWORDS DON'T MATCH */
    const handleRegister = (e) => {
        e.preventDefault();

        if (password.current.value === verifyPassword.current.value) {
            const newUser = {
                username: username.current.value,
                password: password.current.value,
            };

            registerUser(newUser).then((res) => {
                if ("token" in res) {
                    localStorage.setItem("u_token", res.token);
                    localStorage.setItem("is_staff", res.is_staff);
                    navigate("/");
                }
            });
        } else {
            passwordDialog.current.showModal();
        }
    };

    return (
        <main style={{ textAlign: "center" }}>
            {/* PASSWORD MISMATCH MODAL */}
            <dialog className="dialog dialog--password" ref={passwordDialog}>
                <div>Passwords do not match</div>
                <button
                    className="button--close"
                    onClick={(e) => passwordDialog.current.close()}
                >
                    Close
                </button>
            </dialog>

            <section className="columns is-centered">
                <form
                    className="column is-two-thirds"
                    onSubmit={handleRegister}
                >
                    <h1 className="title">GAME TITLE</h1>
                    <p className="subtitle">Create an account</p>
                    <div className="field">
                        <label className="label">Username</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                ref={username}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Password</label>
                        <div className="field-body">
                            <div className="field">
                                <p className="control is-expanded">
                                    <input
                                        className="input"
                                        type="password"
                                        placeholder="Password"
                                        ref={password}
                                    />
                                </p>
                            </div>

                            <div className="field">
                                <p className="control is-expanded">
                                    <input
                                        className="input"
                                        type="password"
                                        placeholder="Verify Password"
                                        ref={verifyPassword}
                                    />
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="field is-grouped">
                        <div className="control">
                            <button className="button is-link" type="submit">
                                Submit
                            </button>
                        </div>
                        <div className="control">
                            <Link
                                to="/"
                                className="button is-link is-light"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </section>

        </main>
    );
};
