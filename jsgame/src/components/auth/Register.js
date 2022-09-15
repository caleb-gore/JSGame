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

    // /* USER OBJECT TO HOLD USERNAME AND PASSWORD
    // UNTIL REGISTRATION IS COMPLETED */
    // const [userObj, setUserObj] = useState({
    //     username: "",
    //     password: "",
    //     verifyPassword: "",
    // });

    // /* ARRAY USED TO KEEP TRACK OF "PAGES" OF REGISTRATION PROMPTS
    // (PAGE IN "TRUE" POSITION IS DISPLAYED) */
    // const [currentPage, setCurrentPage] = useState([true, false, false]);

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
                    navigate("/lets_play");
                }
            });
        } else {
            passwordDialog.current.showModal();
        }
    };

    // /* SHOW PAGE 1 */
    // const page1 = () => {
    //     return (
    //         <>
    //             <h3>
    //                 Hi There! I don't think i've seen you around before. What
    //                 should I call you?
    //             </h3>
    //             <input
    //                 value={userObj.username}
    //                 onChange={(e) => {
    //                     let copy = { ...userObj };
    //                     copy.username = e.target.value;
    //                     setUserObj(copy);
    //                 }}
    //             />
    //             <button
    //                 onClick={() => {
    //                     setCurrentPage([false, true, false]);
    //                 }}
    //             >
    //                 next
    //             </button>
    //         </>
    //     );
    // };

    // /* SHOW PAGE 2 */
    // const page2 = () => {
    //     return (
    //         <>
    //             <h3>
    //                 Nice to meet you, {userObj.username}! Say, we're kind of
    //                 exclusive around here. We only let people in with a
    //                 password. You can chose whatever password you want. We'll
    //                 remember, promise! What do you want to use as a password?
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
    //             <button
    //                 onClick={() => {
    //                     setCurrentPage([false, false, true]);
    //                 }}
    //             >
    //                 next
    //             </button>
    //         </>
    //     );
    // };

    // /* SHOW PAGE 3 */
    // const page3 = () => {
    //     return (
    //         <>
    //             <h3>
    //                 ...I'm so sorry, I'm a little hard of hearing. Wanna make
    //                 sure I got that right. Can you repeat that?
    //             </h3>
    //             <input
    //                 type="password"
    //                 value={userObj.verifyPassword}
    //                 onChange={(e) => {
    //                     let copy = { ...userObj };
    //                     copy.verifyPassword = e.target.value;
    //                     setUserObj(copy);
    //                 }}
    //             />
    //             <button
    //                 onClick={(e) => {
    //                     handleRegister(e);
    //                 }}
    //             >
    //                 next
    //             </button>
    //         </>
    //     );
    // };

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

            {/* PAGES
            {currentPage[0] ? page1() : <></>}
            {currentPage[1] ? page2() : <></>}
            {currentPage[2] ? page3() : <></>} */}
        </main>
    );
};
