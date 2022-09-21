import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getAssets } from "../../../managers/AssetManager";
import { getSaves, getSingleSave, updateSaveGame } from "../../../managers/SaveManager";
import { getTrophies } from "../../../managers/TrophyManager";

export const SideScroll = () => {
    const navigate = useNavigate();
    const canvas1 = useRef();
    const saveId = JSON.parse(localStorage.getItem("saveGame"));

    /* asset objects from database */
    const [assets, setAssets] = useState([]);
    const [trophies, setTrophies] = useState([]);
    const [saveGame, setSaveGame] = useState({});
    const [characterAsset, setCharacter] = useState({});
    const [backgroundAsset, setBackground] = useState({});
    const [enemyAsset, setEnemy] = useState({});

    const inputs = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    useEffect(() => {
        getAssets().then(setAssets);
        getTrophies().then(setTrophies)
        getSingleSave(saveId).then(setSaveGame);
    }, []);

    

    useEffect(() => {
        assets.map((asset) => {
            if (asset.name === "dog") {
                setCharacter(asset);
            } else if (asset.name === "autumn") {
                setBackground(asset);
            } else if (asset.name === "ghost") {
                setEnemy(asset);
            }
        });

    }, [assets, saveGame, trophies]);

    /* run game after all assets are set */
    useEffect(() => {
        if (saveGame.score) {

        
        const canvas = canvas1.current;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth - 2;
        canvas.height = window.innerHeight - 2
        let enemies = [];
        let score = saveGame.score;
        let lives = saveGame.lives;
        let roundOver = false;
        let level = saveGame.level
        let gameOver = saveGame.game_over;
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
                this.width = backgroundAsset.width * (this.gameHeight / backgroundAsset.height);
                this.height = this.gameHeight;
                this.speed = 10;
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
                context.drawImage(
                    this.image,
                    this.x + this.width * 2 - this.speed,
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
                this.maxFrame = 10;
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

        const handleTrophies = () => {
            // if a player reaches 20 points without losing a life, they win trophy 1
            if (score =
                + 20 && !saveGame?.awarded_trophies?.includes(1)) {
               
            }
        }

        const displayLevel = (context) => {
            context.font = "40px 'Bungee Spice', cursive"
            context.fillStyle = "white";
            context.fillText(`Level ${level}`, canvas.width / 2 - 100, canvas.height / 2);
        }

        const displayStatusText = (context) => {
            context.font = "40px 'Bungee Spice', cursive";
            context.fillStyle = "black";
            context.fillText("Score: " + score, 20, 50);
           
            context.fillStyle = "black";
            context.fillText("Lives: " + lives, canvas.width - 200, 50);
            
            if (roundOver && lives > 0) {
                context.textAlign = "center";
                context.fillStyle = "black";
                context.fillText("try again", canvas.width / 2, 200);
                
            } else if (roundOver && lives == 0) {
                context.textAlign = "center";
                context.fillStyle = "black";
                context.fillText("game over", canvas.width / 2, 200);
                
            }
        };

        const input = new InputHandler();
        const player = new Character(canvas.width, canvas.height);
        const background = new Background(canvas.width, canvas.height);

        let lastTime = 0;
        let enemyTimer = 0;
        let enemyInterval = 1000;
        let randomEnemyInterval = Math.random() * 3000 + 1000;
        
        // if (score % 20 === 0 && score > 0) {
        //     level++;
        //     enemyInterval -= 100;
        // }
        let scoreUpdated = false

        const animate = (timestamp) => {
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            background.draw(ctx);
            background.update()
            player.draw(ctx);
            player.update(input, deltaTime, enemies);
            handleEnemies(deltaTime);
            if (score === 0 && level === 1) {
               displayLevel(ctx)
            } else if (score % 5 === 0 && score > 0) {
                if (!scoreUpdated) {
                    level++;
                    enemyInterval -= 100;
                    scoreUpdated = true;
                }
                displayLevel(ctx)
            } else {
                scoreUpdated = false
            }
            displayStatusText(ctx);
            if (!roundOver) requestAnimationFrame(animate);
            else if (roundOver && lives > 0) {
                lives -= 1;
                const copy = { ...saveGame };
                copy.score = score;
                copy.lives = lives;
                copy.level = level;
                updateSaveGame(copy, saveId);
                setTimeout(() => {
                    roundOver = false;
                }, 2000);
            } else {
                const copy = { ...saveGame };
                copy.score = score;
                copy.level = level;
                copy.game_over = true;
                updateSaveGame(copy, saveId)
                    setTimeout(() => {
                        navigate("/");
                    }, 2000)
            }
        };
        animate(0);
    }
    }, [characterAsset, backgroundAsset, enemyAsset]);

    return (
            <Canvas ref={canvas1}></Canvas>
        // <Main>
        // </Main>
    );
};

const Main = styled.div`
box-sizing: border-box;
    background: black;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;
const Canvas = styled.canvas`
    border: 1px solid white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
`;

const Img = styled.img`
    display: none;
`;
const TryAgain = styled.button`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: transparent;
    border: none;
    color: white;
    font-size: 40px;
    font-family: Helvetica;
`;
