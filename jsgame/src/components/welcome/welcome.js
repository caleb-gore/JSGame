import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import background from './background2.jpg'







export const Welcome = () => {
    const [audio] = useState(new Audio("https://www.chosic.com/wp-content/uploads/2020/07/the-epic-2-by-rafael-krux.mp3"));

    const canvas1 = useRef()
    const navigate = useNavigate()
    

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
            audio.play()
        }
        animate()
    },[])
    
    return (
        <>
            <Canvas ref={canvas1}></Canvas>
        <Main>
            <Title>Your Game Here</Title>
            <Div>
            <Button onClick={()=> navigate("/register")}>New Player</Button>
            <Button onClick={()=> navigate("/login")}>Returning Player</Button>
            </Div>
            
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
z-index: 3;
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