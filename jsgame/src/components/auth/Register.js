/* REGISTER NEW USER */

// IMPORTS
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getAssets } from "../../managers/AssetManager";
import { registerUser } from "../../managers/AuthManager";
import { getGames } from "../../managers/GameManager";


// COMPONENT
export const Register = () => {
    const [game, setGame] = useState({})
    const [assets, setAssets] = useState([])
    const [background, setBackground] = useState({})
    const canvas1 = useRef()
    const username = useRef();
    const password = useRef();
    const verifyPassword = useRef();
    const passwordDialog = useRef();
    const navigate = useNavigate();
    // const [is_staff, setIsStaff] = useState("")
    
    useEffect(
        () => {
            getGames().then(games => {setGame(games[0])})
            getAssets().then(assets => {setAssets(assets)})
        }
    ,[])
    
    useEffect(
        () => {
            if (assets.length > 0) {

                assets?.forEach(asset => {
                    if (asset.id === game.background_asset) {
                        setBackground(asset)
                    }
                })
            }
        }, [game, assets])
    
    useEffect(()=>{
        const canvas = canvas1.current
        const ctx = canvas.getContext('2d')
        const width = canvas.width = window.innerWidth
        const height = canvas.height = window.innerHeight

        class Background {
            constructor(width, height) {
                this.image = new Image()
                this.image.src = "http://localhost:8000" + background.file
                this.imageWidth = 7087
                this.imageHeight = 3986
                this.height = height
                this.width = this.imageWidth * (this.height / this.imageHeight)
                this.x = 0
                this.y = 0
                this.speed = 1
            }
            draw(context) {
                context.drawImage(this.image, this.x, this.y, this.width, this.height)
                context.drawImage(this.image, this.x + this.width - 1 - .2, this.y, this.width, this.height)
                context.drawImage(this.image, this.x + this.width * 2 - 1 - .2 , this.y, this.width, this.height)
            }
            update() {
                this.x-= this.speed
                if (this.x < -this.width) {
                    this.x = 0
                }
            }
        }

        const backgroundImage = new Background(width, height)

        const animate = () => {
            ctx.clearRect(0, 0, width, height)
            backgroundImage.draw(ctx)
            backgroundImage.update()
            requestAnimationFrame(animate)
        }
        animate()
    },[background])
    
    
    /* SAVE REGISTRATION DATA AS NEW USER OBJECT
    CALL REGISTER USER FUNCTION
    SHOW MODAL IF PASSWORDS DON'T MATCH */
    const handleRegister = (e) => {
        e.preventDefault();

        if (password.current.value === verifyPassword.current.value) {
            const newUser = {
                username: username.current.value,
                password: password.current.value,
                is_staff: false
            };

            registerUser(newUser).then((res) => {
                if ("token" in res) {
                    navigate("/login");
                }
            });
        } else {
            passwordDialog.current.showModal();
        }
    };

    return (
        <>
            <Canvas ref={canvas1}></Canvas>
        <Main>
            <>
                <Title className="title">{game?.name}</Title>
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
                <Form
                    className="column is-two-thirds"
                    onSubmit={handleRegister}
                    >
                    <H2 className="subtitle">Create an account</H2>
                    <div className="field">
                
                        <div className="control">
                            <Input
                                placeholder="Username"
                                className="input"
                                type="text"
                                ref={username}
                                />
                        </div>
                    </div>

                    <div className="field">
                       
                        <div className="field-body">
                            <div className="field">
                                <p className="control is-expanded">
                                    <Input
                                        className="input"
                                        type="password"
                                        placeholder="Password"
                                        ref={password}
                                        />
                                </p>
                            </div>

                            <div className="field">
                                <p className="control is-expanded">
                                    <Input
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
                            <Button className="button is-link" type="submit">
                                Submit
                            </Button>
                        </div>
                    </div>
                </Form>
            </section>
                        <div className="control">
                            <Button
                                onClick={()=>navigate("/")}
                                className="button is-link is-light"
                            >
                                Cancel
                            </Button>
                        </div>
            </>
            {/* } */}

        </Main>
    </>
    );
};

const Main = styled.main`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background-color: rgba(0,0,0,0.2);
border-radius: 10px;
padding: 20px;
z-index: 2;    

`

const Title = styled.h1`
font-family: 'Bungee Spice', cursive;
font-size: 70px;
z-index: 2;
`

const Div = styled.div`
z-index: 2;
`
const Button = styled.button`
z-index: 2;
display:inline-block;
padding:0.35em 1.2em;
border:0.1em solid #FFFFFF;
margin:0 0.3em 0.3em 0;
border-radius:0.12em;
box-sizing: border-box;
text-decoration:none;
font-family:'Roboto',sans-serif;
font-weight:300;
font-size: 20px;
color:#FFFFFF;
background-color:transparent;
text-align:center;
transition: all 0.2s;
&:hover{
    color:#000000;
    background-color:#FFFFFF;
}
`

const Canvas = styled.canvas`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
z-index: 1;
`

const Form = styled.form`
z-index: 2;
border-radius: 10px;
padding: 30px;
margin-top:20px;
display:flex;
flex-direction: column;
align-items: center;
border: 1px solid white;
margin-bottom: 20px;

`

const Input = styled.input`
border:none;
outline:none;
display:inline-block;
height:34px;
vertical-align:middle;
position:relative;
bottom:14px;

margin:5px;
border-radius:22px;
width:220px;
box-sizing:border-box;
padding:0 18px; 
`

const H2 = styled.h2`
z-index: 2;
font-family: 'Montserrat', sans-serif;
color: white;    

`