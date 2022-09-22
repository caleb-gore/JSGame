import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getAssets } from "../../../managers/AssetManager";
import {
    createAwardedTrophy,
    getSaves,
    getSingleSave,
    updateSaveGame,
} from "../../../managers/SaveManager";
import { getTrophies } from "../../../managers/TrophyManager";

// check if awarded_trophy is empty
//if not empty, save trophy awarded to state
//if !trophy1 and score is >= 20 and lives = 3, award trophy1
//if !trophy2 and score is >= 50 and lives = 3, award trophy2
//if !trophy3 and score is >= 100 and lives = 3, award trophy3
export const SideScroll = () => {
    const navigate = useNavigate();
    const canvas1 = useRef();

    /* asset objects from database */
    const [assets, setAssets] = useState([]);
    const [trophies, setTrophies] = useState([]);
    const [saveGame, setSaveGame] = useState({});
    const [characterAsset, setCharacter] = useState({});
    const [backgroundAsset, setBackground] = useState({});
    const [enemyAsset, setEnemy] = useState({});
    const [saveId, setSaveId] = useState(0);
    const inputs = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", 'Escape ', 'Enter'];

    useEffect(() => {
        setSaveId(JSON.parse(localStorage.getItem("saveGame")));
        getAssets().then(setAssets);
        getTrophies().then(setTrophies);
    }, []);

    useEffect(() => {
        if (saveId > 0) {
            getSingleSave(saveId).then(setSaveGame);
        }
    }, [saveId]);

    useEffect(() => {
        if (saveGame.id > 0) {
            assets.map((asset) => {
                if (asset.name === "red-dragon") {
                    setCharacter(asset);
                } else if (asset.name === "pink") {
                    setBackground(asset);
                } else if (asset.name === "enemy-dragon") {
                    setEnemy(asset);
                }
            });
        }
    }, [assets, saveGame, trophies]);

    /* run game after all assets are set */
    useEffect(() => {
        if (
            characterAsset.id > 0 &&
            backgroundAsset.id > 0 &&
            enemyAsset.id > 0
        ) {
            runGame();
        }
    }, [characterAsset, backgroundAsset, enemyAsset, saveGame]);

    const runGame = () => {
        const canvas = canvas1.current;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth - 2;
        canvas.height = window.innerHeight - 2;
        let enemies = [];
        let score = saveGame.score;
        let lives = saveGame.lives;
        let roundOver = false;
        let level = saveGame.level;
        let trophiesWon = saveGame.awarded_trophies;
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
            8
        }

        class Character {
            constructor(gameWidth, gameHeight) {
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = characterAsset.width;
                this.height = characterAsset.height;
                this.x = 0;
                this.y = this.gameHeight/2 - this.height/2;
                this.image = new Image();
                this.image.src = "http://localhost:8000" + characterAsset.file;
                this.frameX = 0;
                this.maxFrame = 11;
                this.fps = 20;
                this.frameY = 0;
                this.frameTimer = 0;
                this.frameInterval = 1000 / this.fps;
                this.speedX = 0;
                this.speedY = 0;
                this.vy = 0;
                this.weight = 1;
            }
            draw(context) {
                // context.strokeStyle = "white";
                // context.strokeRect(this.x, this.y, this.width, this.height);
                context.fillStyle = 'transparent'
                context.beginPath();
                context.arc(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    this.width / 2,
                    0,
                    Math.PI * 2
                );
                context.stroke();
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
                    if (distance < this.width / 2 + enemy.width / 2 - 150) {
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
                    this.speedX = 8.5;
                } else if (input.keys.includes("ArrowLeft")) {
                    this.speedX = -8.5;
                } else if (input.keys.includes("ArrowUp")) {
                    this.speedY = -8.5;
                } else if (input.keys.includes("ArrowDown")) {
                    this.speedY = 8.5;
                } else if (!input.keys.includes("ArrowRight") || !input.keys.includes("ArrowLeft") || !input.keys.includes("ArrowUp") || !input.keys.includes("ArrowDown")) {
                this.speedX = 0
                this.speedY = 0 
                }
                // horizontal movement
                if (this.x < 0) {
                    this.x = 0;
                } else if (this.x > this.gameWidth - this.width) {
                    this.x = this.gameWidth - this.width;
                }
                this.x += this.speedX;
                
                // vertical movement
                if (this.y < 0) {
                    this.y = 0;
                } else if (this.y > this.gameHeight - this.height * 1.85) {
                    this.y = this.gameHeight - this.height * 1.85;
                }
                this.y += this.speedY;
                // this.y += this.vy;
                // if (!this.onGround()) {
                //     this.vy += this.weight;
                //     this.maxFrame = 5;
                //     this.frameY = 1; // jump
                // } else {
                //     this.vy = 0;
                //     this.maxFrame = 8;
                //     this.frameY = 0; // idle
                // }
                // vertical boundary
                // if (this.y > this.gameHeight - this.height) {
                //     this.y = this.gameHeight - this.height;
                // }
            }
            // onGround() {
            //     return this.y >= this.gameHeight - this.height * 1.85;
            // }
        }

        class Background {
            constructor(gameWidth, gameHeight) {
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.image = new Image();
                this.image.src = "http://localhost:8000" + backgroundAsset.file;
                this.x = 0;
                this.y = 0;
                this.width =
                    backgroundAsset.width *
                    (this.gameHeight / backgroundAsset.height);
                this.height = this.gameHeight;
                this.speed = level+2;
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
                this.y = Math.random(this.gameHeight - this.height * 2.5)
                this.directionX = Math.random() * 3 + 2
                this.directionY = Math.random() * 3 + 2.5;
                this.frameX = 0;
                this.maxFrame = 10;
                this.fps = 20;
                this.frameTimer = 0;
                this.frameInterval = 1000 / this.fps;
                this.speed = 5;
                this.markedForDeletion = false;
            }
            draw(context) {
                context.strokeStyle = "transparent";
                // context.strokeRect(this.x, this.y, this.width, this.height);
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
                if (this.y < 0 || this.y > this.gameHeight - this.height * 2) {
                    this.directionY = this.directionY * -1
                }
                this.x -= this.directionX
                this.y += this.directionY
                if (this.x < -this.width) {
                    this.markedForDeletion = true
                    score++;
                }

                if (this.frameTimer > this.frameInterval) {
                    if (this.frameX >= this.maxFrame) this.frameX = 0;
                    else this.frameX++;
                    this.frameTimer = 0;
                } else {
                    this.frameTimer += deltaTime;
                }

                // this.x -= this.speed;
                // if (this.x < -this.width) {
                //     this.markedForDeletion = true;
                //     score++;
                // }
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
            trophies.forEach(object => {
                const wonTrophy = trophiesWon.find(trophy => trophy.id === object.id) 
                if (!wonTrophy && object.id === 1 && score === 5 && lives === 3) {
                    trophiesWon.push(object)
                    console.log(trophiesWon);
                } else if (!wonTrophy && object.id === 2 && score === 10 && lives === 3) {
                    trophiesWon.push(object)
                    console.log(trophiesWon);
                } else if (!wonTrophy && object.id === 3 && score === 15 && lives === 3) {
                    trophiesWon.push(object)
                    console.log(trophiesWon);
                }
            })
        };

        const displayLevel = (context) => {
            context.font = "40px 'Bungee Spice', cursive";
            context.fillStyle = "white";
            context.fillText(
                `Level ${level}`,
                canvas.width / 2 - 100,
                canvas.height / 2
            );
        };

        const displayStatusText = (context) => {
            context.font = "40px 'Bungee Spice', cursive";
            context.fillStyle = "black";
            context.fillText("Score: " + score, 20, 50);

            context.fillStyle = "black";
            context.fillText("Lives: " + lives, canvas.width - 200, 50);

            if (roundOver && lives > 0) {
                context.textAlign = "center";
                context.fillStyle = "black";
                context.fillText(
                    "You Died! Press [enter] to try again. Press [esc] to quit",
                    canvas.width / 2,
                    200
                    );
                } else if (roundOver && lives == 0) {
                context.textAlign = "center";
                context.fillStyle = "black";
                context.fillText(
                    "Game Over! Press [esc] to quit",
                    canvas.width / 2,
                    200
                    );
            }
        };

        // window.addEventListener("keydown", (event) => {
        //     if (event.key === "Enter") {
        //         const copy = {...saveGame};
        //         copy.score = score;
        //         copy.lives = lives;
        //         copy.level = level;
        //         updateSaveGame(copy)
        //         }
        //     }
        // window.addEventListener("keydown", (event) => {
        //     const copy = { ...saveGame };
        //     copy.score = score;
        //     copy.lives = lives;
        //     copy.level = level;
        //     updateSaveGame(copy, saveId);
        //     if (event.key === " ") {
        //         getSingleSave(saveId).then(setSaveGame)
        //     } else if (event.key === "Escape") {
        //         getSingleSave(saveId).then(setSaveGame).then(() => {navigate('/games')})
        //     }
        // })

        // const handleGameOver = () => {
        //     if (roundOver && lives > 0) {
        //         lives -= 1;
        //         const copy = { ...saveGame };
        //         copy.score = score;
        //         copy.lives = lives;
        //         copy.level = level;
        //         updateSaveGame(copy, saveId)
        //         getSingleSave(saveId).then(setSaveGame);
        //         console.log("saveGame", saveGame);
        //     } else if (roundOver && lives == 0) {
        //         const copy = { ...saveGame };
        //         copy.score = score;
        //         copy.lives = lives;
        //         copy.level = level;
        //         copy.game_over = true
        //         updateSaveGame(copy, saveId);
        //         getSingleSave(saveId).then(setSaveGame).then(navigate('/'));
        //         console.log("saveGame", saveGame);
        //     }
        // }
        
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
        let scoreUpdated = false;

        const animate = (timestamp) => {
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            background.draw(ctx);
            background.update();
            player.draw(ctx);
            player.update(input, deltaTime, enemies);
            handleEnemies(deltaTime);
            if (score === 0 && level === 1) {
                displayLevel(ctx);
            } else if (score % 5 === 0 && score > 0) {
                if (!scoreUpdated) {
                    level++;
                    enemyInterval -= 100;
                    scoreUpdated = true;
                }
                displayLevel(ctx);
            } else {
                scoreUpdated = false;
            }
            displayStatusText(ctx);
            handleTrophies();
            // handleGameOver()
            if (!roundOver) requestAnimationFrame(animate);
            else if (roundOver && lives > 0) {
                lives -= 1;
                const copy = { ...saveGame };
                copy.score = score;
                copy.lives = lives;
                copy.level = level;
                trophiesWon.forEach(trophy => {
                    console.log(trophy.id);
                    
                        createAwardedTrophy({ trophy_id: trophy.id, save_id: saveId }, saveId)
                    
                })
                updateSaveGame(copy, saveId);
                setTimeout(() => {
                    getSingleSave(saveId).then(setSaveGame);
                }, 2000);
                console.log("saveGame", saveGame);
            } else if (roundOver && lives === 0) {
                const copy = { ...saveGame };
                copy.score = score;
                copy.level = level;
                copy.game_over = true;
                trophiesWon.forEach(trophy => {
                    console.log(trophy.id);
                        createAwardedTrophy({ trophy_id: trophy.id, save_id: saveId }, saveId)
                })
                updateSaveGame(copy, saveId);
                setTimeout(() => {
                    getSingleSave(saveId).then(setSaveGame).then(navigate('/'));
                }, 2000);
                console.log("saveGame", saveGame);
            }
        };
        animate(0);



        
    };

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
