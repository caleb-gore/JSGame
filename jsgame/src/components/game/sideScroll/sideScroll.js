import { FormControlUnstyledContext, TabsContext } from "@mui/base";
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { getAssets } from "../../../managers/AssetManager";
import { createSave, updateSaveGame } from "../../../managers/SaveManager";

export const SideScroll = () => {
    const canvas1 = useRef();

    /* asset objects from database */
    const [assets, setAssets] = useState([]);
    const [characterAsset, setCharacter] = useState({});
    const [backgroundAsset, setBackground] = useState({});
    const [enemyAsset, setEnemy] = useState({});
    const [save, updateSave] = useState({
        score: 0,
        level: 1,
        lives: 3,
        game_over: false,
    });

    const inputs = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    useEffect(() => {
        getAssets().then(setAssets);
    }, []);

    useEffect(() => {
        assets.map((asset) => {
            if (asset.name === "dog") {
                setCharacter(asset);
            } else if (asset.name === "forest") {
                setBackground(asset);
            } else if (asset.name === "worm") {
                setEnemy(asset);
            }
        });
    }, [assets]);

    /* run game after all assets are set */
    useEffect(() => {
        const canvas = canvas1.current;
        const ctx = canvas.getContext("2d");
        canvas.width = 800;
        canvas.height = 720;
        let enemies = [];
        let score = save.score;
        let lives = save.lives;
        let roundOver = false;
        let gameOver = save.game_over;
        /* handles keypress events */
        class InputHandler {
            constructor() {
                this.keys = [];
                window.addEventListener("keydown", (e) => {
                    if (inputs.includes(e.key) && !this.keys.includes(e.key)) {
                        this.keys.push(e.key);
                    }
                });
                window.addEventListener("keyup", (e) => {
                    if (inputs.includes(e.key)) {
                        this.keys.splice(this.keys[e.key], 1);
                    }
                });
            }
        }

        class Character {
            constructor(gameWidth, gameHeight) {
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = characterAsset.width;
                this.height = characterAsset.height;
                this.x = 0;
                this.y = this.gameHeight - this.height;
                this.image = new Image();
                this.image.src = "http://localhost:8000" + characterAsset.file;
                this.frameX = 0;
                this.maxFrame = 8;
                this.fps = 20;
                this.frameY = 0;
                this.frameTimer = 0;
                this.frameInterval = 1000 / this.fps;
                this.speed = 0;
                this.vy = 0;
                this.weight = 1;
            }
            draw(context) {
                context.strokeStyle = "white";
                context.strokeRect(this.x, this.y, this.width, this.height);
                context.beginPath();
                context.arc(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    this.width / 2,
                    0,
                    Math.PI * 2
                );
                context.stroke();
                // context.fillStyle = 'white'
                // context.fillRect(this.x, this.y, this.width, this.height)
                context.drawImage(
                    this.image,
                    this.frameX * this.width,
                    this.frameY * this.height,
                    this.width,
                    this.height,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );
            }
            update(input, deltaTime, enemies) {
                // collision detection
                enemies.forEach((enemy) => {
                    const dx = enemy.x - this.x;
                    const dy = enemy.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < this.width / 2 + enemy.width / 2) {
                        roundOver = true;
                    
                    
                    }
                });

                // sprite animation
                if (this.frameTimer > this.frameInterval) {
                    if (this.frameX >= this.maxFrame) this.frameX = 0;
                    else this.frameX++;
                    this.frameTimer = 0;
                } else {
                    this.frameTimer += deltaTime;
                }

                // controls
                if (input.keys.includes("ArrowRight")) {
                    this.speed = 5;
                } else if (input.keys.includes("ArrowLeft")) {
                    this.speed = -5;
                } else if (input.keys.includes("ArrowUp") && this.onGround()) {
                    this.vy -= 32;
                } else {
                    this.speed = 0;
                }

                // horizontal movement
                if (this.x < 0) {
                    this.x = 0;
                } else if (this.x > this.gameWidth - this.width) {
                    this.x = this.gameWidth - this.width;
                }
                this.x += this.speed;

                // vertical movement
                this.y += this.vy;
                if (!this.onGround()) {
                    this.vy += this.weight;
                    this.maxFrame = 5;
                    this.frameY = 1; // jump
                } else {
                    this.vy = 0;
                    this.maxFrame = 8;
                    this.frameY = 0; // idle
                }
                // vertical boundary
                if (this.y > this.gameHeight - this.height) {
                    this.y = this.gameHeight - this.height;
                }
            }
            onGround() {
                return this.y >= this.gameHeight - this.height;
            }
        }

        class Background {
            constructor(gameWidth, gameHeight) {
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.image = new Image();
                this.image.src = "http://localhost:8000" + backgroundAsset.file;
                this.x = 0;
                this.y = 0;
                this.width = backgroundAsset.width;
                this.height = backgroundAsset.height;
                this.speed = 20;
            }
            draw(context) {
                context.drawImage(
                    this.image,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );
                context.drawImage(
                    this.image,
                    this.x + this.width - this.speed,
                    this.y,
                    this.width,
                    this.height
                );
            }
            update() {
                this.x -= this.speed;
                if (this.x < -this.width) {
                    this.x = 0;
                }
            }
        }

        class Enemy {
            constructor(gameWidth, gameHeight) {
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = enemyAsset.width;
                this.height = enemyAsset.height;
                this.image = new Image();
                this.image.src = "http://localhost:8000" + enemyAsset.file;
                this.x = this.gameWidth;
                this.y = this.gameHeight - this.height;
                this.frameX = 0;
                this.maxFrame = 5;
                this.fps = 20;
                this.frameTimer = 0;
                this.frameInterval = 1000 / this.fps;
                this.speed = 5;
                this.markedForDeletion = false;
            }
            draw(context) {
                context.strokeStyle = "white";
                context.strokeRect(this.x, this.y, this.width, this.height);
                context.beginPath();
                context.arc(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    this.width / 2,
                    0,
                    Math.PI * 2
                );
                context.stroke();
                context.drawImage(
                    this.image,
                    this.frameX * this.width,
                    0,
                    this.width,
                    this.height,
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );
            }
            update(deltaTime) {
                if (this.frameTimer > this.frameInterval) {
                    if (this.frameX >= this.maxFrame) this.frameX = 0;
                    else this.frameX++;
                    this.frameTimer = 0;
                } else {
                    this.frameTimer += deltaTime;
                }

                this.x -= this.speed;
                if (this.x < -this.width) {
                    this.markedForDeletion = true;
                    score++;
                }
            }
        }

        const handleEnemies = (deltaTime) => {
            if (enemyTimer > enemyInterval + randomEnemyInterval) {
                enemies.push(new Enemy(canvas.width, canvas.height));
                randomEnemyInterval = Math.random() * 3000 + 1000;
                enemyTimer = 0;
            } else {
                enemyTimer += deltaTime;
            }
            enemies.forEach((enemy) => {
                enemy.draw(ctx);
                enemy.update(deltaTime);
            });
            enemies = enemies.filter((enemy) => !enemy.markedForDeletion);
        };

        const displayStatusText = (context) => {
            context.font = "40px Helvetica";
            context.fillStyle = "black";
            context.fillText("Score: " + score, 20, 50);
            context.fillStyle = "white";
            context.fillText("Score: " + score, 22, 52);
            context.fillStyle = "black";
            context.fillText("Lives: " + lives, canvas.width - 150, 50);
            context.fillStyle = "white";
            context.fillText("Lives: " + lives, canvas.width - 152, 52);
            if (roundOver) {
                context.textAlign = "center";
                context.fillStyle = "black";
                context.fillText("try again", canvas.width / 2, 200);
                context.fillStyle = "white";
                context.fillText("try again", canvas.width / 2 + 2, 202);
            }
        };

        const input = new InputHandler();
        const player = new Character(canvas.width, canvas.height);
        const background = new Background(canvas.width, canvas.height);

        let lastTime = 0;
        let enemyTimer = 0;
        let enemyInterval = 1000;
        let randomEnemyInterval = Math.random() * 3000 + 1000;

        const animate = (timestamp) => {
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            background.draw(ctx);
            // background.update()
            player.draw(ctx);
            player.update(input, deltaTime, enemies);
            handleEnemies(deltaTime);
            displayStatusText(ctx);
            if (!roundOver) requestAnimationFrame(animate);
        };
        animate(0);

        window.addEventListener('click', (e) => {
            if (roundOver && lives > 0) {
                const copy = {...save}
                copy.score = score
                copy.lives = lives - 1
                updateSave(copy)

            } else if (roundOver && lives <= 0) {
                const copy = {...save}
                copy.score = score
                copy.gameOver = true
                updateSave(copy)

                
            }
        })
    }, [characterAsset, backgroundAsset, enemyAsset, save]);

    return (
        <Main>
            <Canvas ref={canvas1}></Canvas>
            {/* <Img
                ref={characterImage}
                src={`http://localhost:8000${characterAsset.file}`}
            ></Img>
            <Img
                ref={backgroundImage}
                src={`http://localhost:8000${backgroundAsset.file}`}
            ></Img>
            <Img
                ref={enemyImage}
                src={`http://localhost:8000${enemyAsset.file}`}
            ></Img> */}
        </Main>
    );
};

const Main = styled.div`
    background: black;
    width: 100vw;
    height: 100vh;
`;
const Canvas = styled.canvas`
    border: 1px solid white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const Img = styled.img`
    display: none;
`;
