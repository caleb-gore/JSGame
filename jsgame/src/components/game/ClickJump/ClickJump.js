import { useEffect, useState } from "react";
import styled from "styled-components";
import { getAssets } from "../../../managers/AssetManager";

const BIRD_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

export const ClickJump = () => {
    const [birdPosition, setBirdPosition] = useState(250);
    const [gameHasStarted, setGameHasStarted] = useState(false);
    const [obstacleHeight, setObstacleHeight] = useState(150);
    const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH);
    const [score, setScore] = useState(-1);
    const [obstacleSpeed, setObstacleSpeed] = useState(5);
    const [character, setCharacter] = useState("");
    const [obstacle, setObstacle] = useState("");
    const [assets, setAssets] = useState([]);
    const bottomObstacleHeight = GAME_HEIGHT - obstacleHeight - OBSTACLE_GAP;

    /* GET ASSETS */
    useEffect(() => {
        getAssets().then(setAssets)
    }, [])

    /* SET CHARACTER IMAGE */
    useEffect(() => {
        const characterAsset = assets.find(asset => asset.name === "flappy")
        if (characterAsset) {setCharacter(`http://localhost:8000${characterAsset.file}`)}
        const obstacleAsset = assets.find(asset => asset.name === "tree")
        if (obstacleAsset) {setObstacle(`http://localhost:8000${obstacleAsset.file}`)}


    }, [assets])

    /* BIRD FALLING */
    useEffect(() => {
        let timeId;
        if (gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
            timeId = setInterval(() => {
                setBirdPosition((birdPosition) => birdPosition + GRAVITY);
            }, 24);
        }

        return () => {
            clearInterval(timeId);
        };
    }, [birdPosition, gameHasStarted]);

    /* OBSTACLE MOVEMENT */
    useEffect(() => {
        let obstacleId;
        if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
            obstacleId = setInterval(() => {
                setObstacleLeft((obstacleLeft) => obstacleLeft - obstacleSpeed)
                setObstacleSpeed((obstacleSpeed) => obstacleSpeed + 0.01);
            }, 24);
            return () => {
                clearInterval(obstacleId);
            };
        } else {
            setObstacleLeft(GAME_WIDTH);
            setObstacleHeight(
                Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
            );
            setScore(score + 1);
        }
    }, [gameHasStarted, obstacleLeft]);

    /* COLLISION DETECTION */
    useEffect(() => {
        const hasCollidedWithTopObstacle =
            birdPosition >= 0 && birdPosition < obstacleHeight;
        const hasColliedWithBottomObstacle =
            birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight;

        if (
            obstacleLeft >= 0 &&
            obstacleLeft <= OBSTACLE_WIDTH &&
            (hasCollidedWithTopObstacle || hasColliedWithBottomObstacle)
        ) {
            setGameHasStarted(false);
        }
    }, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft]);

    /* GAME START */
    const handleClick = () => {
        let newBirdPosition = birdPosition - JUMP_HEIGHT;
        if (!gameHasStarted) {
            setGameHasStarted(true);
            setScore(0);
            setObstacleSpeed(5);
            setBirdPosition(250);
        } else if (newBirdPosition < 0) {
            newBirdPosition = 0;
        } else {
            setBirdPosition(newBirdPosition);
        }
    };

    
    return (
        <Div onClick={handleClick}>
            <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
                <Obstacle
                    top={0}
                    width={OBSTACLE_WIDTH}
                    height={obstacleHeight}
                    left={obstacleLeft}
                >
                    <img style={{"transform":"rotate(180deg)"}} src={obstacle} alt="obstacle" height={obstacleHeight}/>
                </Obstacle>
                <Obstacle
                    top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
                    width={OBSTACLE_WIDTH}
                    height={bottomObstacleHeight}
                    left={obstacleLeft}
                ><img src={obstacle} alt="obstacle" height={bottomObstacleHeight}/></Obstacle>
                <Bird size={BIRD_SIZE} top={birdPosition}>
                    <img src={character} height={BIRD_SIZE * 1.5}/>
                </Bird>
            </GameBox>
            <span> {score} </span>
        </Div>
    );
};

const Bird = styled.div`
    position: absolute;
    color: red;
    height: ${(props) => props.size}px;
    width: ${(props) => props.size}px;
    top: ${(props) => props.top}px;
    border-radius: 50%;
`;

const Div = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    & span {
        color: white;
        font-size: 24px;
        position: absolute;
    }
`;

const GameBox = styled.div`
    height: ${(props) => props.height}px;
    width: ${(props) => props.width}px;
    background-color: blue;
    overflow: hidden;
`;

const Obstacle = styled.div`
    position: relative;
    top: ${(props) => props.top}px;
    background-color: green;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    left: ${(props) => props.left}px;
`;
