/* LOGIN EXISTING USER */

// IMPORTS
import React, { useEffect, useRef, useState } from "react"
import { Link, useHistory, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { loginUser } from "../../managers/AuthManager"
import background from '../welcome/background2.jpg'


// COMPONENT
export const Login = () => {
    const canvas1 = useRef()
    const username = useRef()
    const password = useRef()
    const invalidDialog = useRef()
    const navigate = useNavigate()
    const [user, setUser] = useState({
        username: "brandnewplayer",
        password: "brandnewplayer"
    })


    useEffect(()=>{
        const canvas = canvas1.current
        const ctx = canvas.getContext('2d')
        const width = canvas.width = window.innerWidth
        const height = canvas.height = window.innerHeight

        class Background {
            constructor(width, height) {
                this.image = new Image()
                this.image.src = background
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
    },[])



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
                localStorage.setItem("u_id", res.id)
                navigate("/") 
            } else {
                invalidDialog.current.showModal()
            }
        })
    }


    return (
        <>
            <Canvas ref={canvas1}></Canvas>
        <Main>
                    <Title>Your Game Here</Title>
                <Form className="form--login" onSubmit={handleLogin}>
                    <H2>Please sign in</H2>
                    <span>
                        <Input ref={username} onChange={
                            ()=>{
                                const copy = {...user}
                                copy.username = username.current.value
                                setUser(copy)
                            }
                        } value={user.username} type="username" id="username" className="form-control" placeholder="Username" required autoFocus />

                    </span>
                    <span>

                        <Input ref={password} onChange={
                            ()=>{
                                const copy = {...user}
                                copy.password = password.current.value
                                setUser(copy)
                            }
                        } value={user.password} type="password" id="password" className="form-control" placeholder="Password" required />
                    </span>
                        <Button className="btn btn-1 btn-sep icon-send" type="submit">Sign In</Button>
                </Form>
            <section className="link--register">
                <Button onClick={()=>navigate('/register')} to="/register">Not a member yet?</Button>
            </section>

            <dialog className="dialog dialog--auth" ref={invalidDialog}>
                <div>Username or password was not valid.</div>
                <button className="button--close" onClick={e => invalidDialog.current.close()}>Close</button>
            </dialog>
                        
            
        </Main>
        <main className="container--login" style={{ textAlign: "center" }}>
            {/* INVALID LOGIN MODAL */}


        </main>
        </>
    )
}

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