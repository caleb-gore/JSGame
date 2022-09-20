import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getAssets } from "../../../managers/AssetManager";

export const PointAndShoot = () => {
    const [assets, setAssets] = useState([])
    const [enemyAsset, setEnemyAsset] = useState("")
    const [explosionAsset, setExplosionAsset] = useState("")
    const [selectedEnemy, setSelectedEnemy] = useState("")
    const [selectedExplosion, setSelectedExplosion] = useState("")
    const canvas1 = useRef();
    const canvas2 = useRef();
    const navigate = useNavigate()

    useEffect(() => {
        getAssets().then(setAssets)
    }, []);

    useEffect(()=>{
        assets.map(asset => {
            if (asset.name === 'raven') {
                setEnemyAsset(asset)
            } else if (asset.name === 'explosion') {
                setExplosionAsset(asset)
            }
        })
    },[assets])

    useEffect(() => {
        
        const canvas = canvas1.current;
        const collisionCanvas = canvas2.current;

        const ctx = canvas.getContext("2d");
        const collisionCtx = collisionCanvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        collisionCanvas.width = window.innerWidth;
        collisionCanvas.height = window.innerHeight;

        let score = 0;
        let gameOver = false;
        ctx.font = "50px impact";
        let timeToNextEnemy = 0;
        let enemyInterval = 2000;
        let lastTime = 0;

        let enemies = [];
        class Enemy {
            constructor() {
                this.spriteWidth = enemyAsset.width;
                this.spriteHeight = enemyAsset.height;
                this.sizeModifier = Math.random() * 0.6 + 0.4;
                this.width = this.spriteWidth * this.sizeModifier;
                this.height = this.spriteHeight * this.sizeModifier;
                this.x = canvas.width;
                this.y = Math.random() * (canvas.height - this.height);
                this.directionX = Math.random() * 5 + 2;
                this.directionY = Math.random() * 5 - 2.5;
                this.markedForDeletion = false;
                this.image = new Image();
                this.image.src = `http://localhost:8000${enemyAsset.file}`;
                this.frame = 0;
                this.maxFrame = 4;
                this.timeSinceAnimation = 0;
                this.animationInterval = Math.random() * 50 + 50;
                this.randomColors = [
                    Math.floor(Math.random() * 255),
                    Math.floor(Math.random() * 255),
                    Math.floor(Math.random() * 255),
                ];
                this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`;
            }
            update(deltaTime) {
                if (this.y < 0 || this.y > canvas.height - this.height) {
                    this.directionY = this.directionY * -1;
                }
                this.x -= this.directionX;
                this.y += this.directionY;
                if (this.x < 0 - this.width) this.markedForDeletion = true;
                this.timeSinceAnimation += deltaTime;
                if (this.timeSinceAnimation > this.animationInterval) {
                    if (this.frame > this.maxFrame) this.frame = 0;
                    else this.frame++;
                    this.timeSinceAnimation = 0;
                    // particles.push(new Particle(this.x, this.y, this.width, this.color))
                }
                if (this.x < 0 - this.width) gameOver = true;
            }
            draw() {
                collisionCtx.fillStyle = this.color;
                collisionCtx.fillRect(this.x, this.y, this.width, this.height);
                ctx.drawImage(
                    this.image,
                    this.frame * this.spriteWidth,
                    0,
                    this.spriteWidth,
                    this.spriteHeight,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );
            }
        }
        let explosions = [];
        class Explosion {
            constructor(x, y, size) {
                this.image = new Image();
                this.image.src = `http://localhost:8000${explosionAsset.file}`;
                this.spriteWidth = explosionAsset.width;
                this.spriteHeight = explosionAsset.height;
                this.size = size;
                this.x = x;
                this.y = y;
                this.frame = 0;
                // this.sound = new Audio();
                // this.sound.src = "../media/explosions/boom.wav";
                this.timeSinceLastFrame = 0;
                this.frameInterval = 200;
                this.markedForDeletion = false;
            }
            update(deltaTime) {
                // if (this.frame === 0) this.sound.play();
                this.timeSinceLastFrame += deltaTime;
                if (this.timeSinceLastFrame > this.frameInterval) {
                    this.frame++;
                    this.timeSinceLastFrame = 0;
                    if (this.frame > 5) this.markedForDeletion = true;
                }
            }
            draw() {
                ctx.drawImage(
                    this.image,
                    this.frame * this.spriteWidth,
                    0,
                    this.spriteWidth,
                    this.spriteHeight,
                    this.x,
                    this.y - this.size / 4,
                    this.size,
                    this.size
                );
            }
        }

        // let particles = []
        // class Particle {
        //     constructor(x, y, size, color) {
        //         this.size = size
        //         this.x = x + this.size/2
        //         this.y = y + this.size/2
        //         this.radius = Math.random() * this.size/10
        //         this.maxRadius = Math.random() * 20 + 35
        //         this.markedForDeletion = false
        //         this.speedX = Math.random() * 1 + 0.5
        //         this.color = color
        //     }
        //     update(){
        //         this.x =+ this.speedX
        //         this.radius += 0.2
        //         if (this.radius > this.maxRadius) this.markedForDeletion = true
        //     }
        //     draw(){
        //         ctx.beginPath()
        //         ctx.fillStyle = this.color
        //         ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        //         ctx.fill()
        //     }
        // }

        function drawScore() {
            ctx.fillStyle = "black";
            ctx.fillText("Score: " + score, 50, 75);
            ctx.fillStyle = "white";
            ctx.fillText("Score: " + score, 55, 80);
        }

        function drawEndGame() {
            ctx.fillStyle = "black";
            ctx.fillText("[ESC] to exit", 50, 140);
            ctx.fillStyle = "white";
            ctx.fillText("[ESC] to exit", 55, 145);
        }
        function drawGameOver() {
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText(
                `GAME OVER, your score is ${score}`,
                canvas.width / 2,
                canvas.height / 2
            );
            ctx.fillStyle = "white";
            ctx.fillText(
                `GAME OVER, your score is ${score}`,
                canvas.width / 2 + 5,
                canvas.height / 2 + 5
            );
        }

        window.addEventListener("click", function (e) {
            const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
            console.log(detectPixelColor);
            const pc = detectPixelColor.data;
            enemies.forEach((object) => {
                if (
                    object.randomColors[0] === pc[0] &&
                    object.randomColors[1] === pc[1] &&
                    object.randomColors[2] === pc[2]
                ) {
                    object.markedForDeletion = true;
                    score++;
                    explosions.push(
                        new Explosion(object.x, object.y, object.width)
                    );
                    enemyInterval -= 25;
                }
            });
        });

        function animate(timestamp) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
            let deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            timeToNextEnemy += deltaTime;
            if (timeToNextEnemy > enemyInterval) {
                enemies.push(new Enemy());
                timeToNextEnemy = 0;
                enemies.sort(function (a, b) {
                    return a.width - b.width;
                });
            }
            drawScore();
            drawEndGame();
            [...enemies, ...explosions]?.forEach((object) =>
                object.update(deltaTime)
            );
            [...enemies, ...explosions]?.forEach((object) => object.draw());
            enemies = enemies.filter((object) => !object.markedForDeletion);
            explosions = explosions.filter(
                (object) => !object.markedForDeletion
            );
            if (!gameOver) requestAnimationFrame(animate);
            else drawGameOver();
        }
        animate(0);

    },[enemyAsset, explosionAsset])

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            navigate('/')
        }
    })  
    return (
        <Main >
            <Canvas ref={canvas1}></Canvas>
            <Canvas style={{"opacity": 0}}ref={canvas2}></Canvas>
        </Main>
    );
};

const Main = styled.div`
    background: linear-gradient(125deg, red, green, blue);
    width: 100%;
    height: 100vh;
    overflow: hidden;
`;
const Canvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;
