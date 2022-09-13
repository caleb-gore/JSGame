/* SAVE GAMES */

//IMPORTS
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGame, getGames } from "../managers/SaveManager";

//COMPONENT
export const Saves = () => {
    const navigate = useNavigate()
    
    //SET GAMES FROM DATABASE
    const [saveGames, setSaveGames] = useState([]);

    //GET GAMES FROM DATABASE (INITIAL STATE)
    useEffect(() => {
        getGames().then(setSaveGames);
    }, []);

    //CREATE NEW GAME OBJECT TO SEND TO DATABASE
    const createGameObj = () => {
        //NEW GAME OBJECT
        const newGame = {
            score: 0,
            level: 1,
            lives: 3,
            game_over: false,
        };

        //FETCH CALL
        createGame(newGame);
    };

    //CREATE SAVE SLOT UI
    const saveSlot = (i) => {
        /* IF INDEX OF SAVE GAME MATCHES ARGUMENT GIVEN
        CREATE RESUME GAME SAVE SLOT
        ELSE CREATE NEW GAME SAVE SLOT */
        if (saveGames[i-1]) {
            return (
                <section>
                    <button onClick={()=>navigate('/game')}>Play</button>
                    <div>
                        <p>Slot {i}</p>
                        <p>Score: {saveGames[i-1].score}</p>
                    </div>
                </section>
            );
        } else {
            return (
                <section>
                    <button onClick={()=>{
                        createGameObj()
                        navigate('/game')}}>NEW</button>
                    <div>
                        <p>Slot {i}</p>
                        <p>NEW</p>
                    </div>
                </section>
            );
        }
    };

    // CREATE 4 SAVE SLOTS
    const saveSlotMaker = () => {
        let saveSlots = []
        for (let i = 1; i < 5; i++) {
            saveSlots.push(saveSlot(i))
        } 
        return saveSlots
    }

    return (
        <>
            <h2>Save Files</h2>

            {/* SHOW SAVE SLOTS */}
            {saveSlotMaker()}

            <button>Erase</button>
            <button>Delete</button>
        </>
    );
};
