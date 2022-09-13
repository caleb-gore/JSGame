/* REGISTER NEW USER */

// IMPORTS
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../managers/AuthManager";

// COMPONENT
export const Register = () => {
    const passwordDialog = useRef();
    const navigate = useNavigate();

    /* USER OBJECT TO HOLD USERNAME AND PASSWORD 
    UNTIL REGISTRATION IS COMPLETED */
    const [userObj, setUserObj] = useState({
        username: "",
        password: "",
        verifyPassword: "",
    });

    /* ARRAY USED TO KEEP TRACK OF "PAGES" OF REGISTRATION PROMPTS 
    (PAGE IN "TRUE" POSITION IS DISPLAYED) */
    const [currentPage, setCurrentPage] = useState([true, false, false]);

    /* SAVE REGISTRATION DATA AS NEW USER OBJECT
    CALL REGISTER USER FUNCTION
    SHOW MODAL IF PASSWORDS DON'T MATCH */
    const handleRegister = (e) => {
        e.preventDefault();

        if (userObj.password === userObj.verifyPassword) {
            const newUser = {
                username: userObj.username,
                password: userObj.password,
            };

            registerUser(newUser).then((res) => {
                if ("token" in res) {
                    localStorage.setItem("u_token", res.token);
                    localStorage.setItem("username", userObj.username);
                    navigate("/lets_play");
                }
            });
        } else {
            passwordDialog.current.showModal();
        }
    };

    /* SHOW PAGE 1 */
    const page1 = () => {
        return (
            <>
                <h3>
                    Hi There! I don't think i've seen you around before. What
                    should I call you?
                </h3>
                <input
                    value={userObj.username}
                    onChange={(e) => {
                        let copy = { ...userObj };
                        copy.username = e.target.value;
                        setUserObj(copy);
                    }}
                />
                <button
                    onClick={() => {
                        setCurrentPage([false, true, false]);
                    }}
                >
                    next
                </button>
            </>
        );
    };

    /* SHOW PAGE 2 */
    const page2 = () => {
        return (
            <>
                <h3>
                    Nice to meet you, {userObj.username}! Say, we're kind of
                    exclusive around here. We only let people in with a
                    password. You can chose whatever password you want. We'll
                    remember, promise! What do you want to use as a password?
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
                <button
                    onClick={() => {
                        setCurrentPage([false, false, true]);
                    }}
                >
                    next
                </button>
            </>
        );
    };

    /* SHOW PAGE 3 */
    const page3 = () => {
        return (
            <>
                <h3>
                    ...I'm so sorry, I'm a little hard of hearing. Wanna make
                    sure I got that right. Can you repeat that?
                </h3>
                <input
                    type="password"
                    value={userObj.verifyPassword}
                    onChange={(e) => {
                        let copy = { ...userObj };
                        copy.verifyPassword = e.target.value;
                        setUserObj(copy);
                    }}
                />
                <button
                    onClick={(e) => {
                        handleRegister(e);
                    }}
                >
                    next
                </button>
            </>
        );
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

            {/* PAGES */}
            {currentPage[0] ? page1() : <></>}
            {currentPage[1] ? page2() : <></>}
            {currentPage[2] ? page3() : <></>}
        </main>
    );
};
