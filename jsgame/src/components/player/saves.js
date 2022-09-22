/* SAVE GAMES */

//IMPORTS
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
    createSave,
    deleteSave,
    getSaves,
    getSingleSave,
} from "../../managers/SaveManager";

//COMPONENT
export const Saves = () => {
    const navigate = useNavigate();
    const deleteDialog = useRef();
    const confirmDeleteDialog = useRef();
    //SET GAMES FROM DATABASE
    const [saveGames, setSaveGames] = useState([]);
    //HOLD SELECTED OBJECT TO BE DELETED
    const [fileToBeDeleted, setFileToBeDeleted] = useState({});
    // const userId = JSON.parse(localStorage.getItem("u_id"));

    //NEW GAME OBJECT
    const newGame = {
        score: 0,
        level: 1,
        lives: 3,
        game_over: false,
    };

    //GET GAMES FROM DATABASE (INITIAL STATE)
    useEffect(() => {
        getSaves().then(setSaveGames);
        getSaves().then(setSaveGames);
        localStorage.removeItem("saveGame")
    }, []);

    //CREATE SAVE SLOT UI
    const saveSlot = (i) => {
        /* IF INDEX OF SAVE GAME MATCHES ARGUMENT GIVEN
        CREATE RESUME GAME SAVE SLOT
        ELSE CREATE NEW GAME SAVE SLOT
        NAVIGATE TO GAME */
        let saveSlots = []
        if (saveGames[i]) {
            saveSlots.push(
                <SaveSlot key={"saveGame--" + i}>
                    {saveGames[i].game_over ? <Button
                        onClick={() => {
                            // SET OBJECT FOR DELETION
                            setFileToBeDeleted(saveGames[i]);
                            // OPEN CONFIRM DELETE MODAL
                            confirmDeleteDialog.current.showModal();
                        }}
                    >
                        Start Over
                    </Button>: <Button
                        onClick={() => {
                            localStorage.setItem("saveGame", saveGames[i].id);
                            navigate("/game");
                        }}
                    >
                        Play
                    </Button> }
                        <p >Slot {i + 1}</p>
                    <div>
                        <p >Score: {saveGames[i].score}</p>
                        <p >Level: {saveGames[i].level}</p>
                        <p >Lives: {saveGames[i].lives}</p>
                        <p >
                            Trophies: {saveGames[i].awarded_trophies.map((t) => {
                                return <p>{t.type}</p>
                            })}
                        </p>
                    </div>
                </SaveSlot>
            );
        // } else if (saveGames[i]?.game_over === true) {
        //     saveSlots.push(
        //         <SaveSlot key={"saveGame--" + i}>
                    
        //             <div>
        //                 <p >Slot {i + 1}</p>
        //                 <p >Score: {saveGames[i].score}</p>
        //                 <p >Level: {saveGames[i].level}</p>
        //                 <p >Lives: {saveGames[i].lives}</p>
        //                 <p >
        //                     Trophies: {saveGames[i].awarded_trophies}
        //                 </p>
        //             </div>
        //         </SaveSlot>
        //     );
        } else {
            saveSlots.push(
                <SaveSlot key={"saveGame--" + i}>
                    <Button
                        onClick={() => {
                            //CREATE NEW GAME OBJECT TO SEND TO DATABASE
                            createSave(newGame).then(() =>
                                getSaves()
                                    .then(setSaveGames)
                                    .then(() => navigate("/"))
                            );
                        }}
                    >
                        NEW
                    </Button>
                    <div>
                        <p >Slot {i + 1}</p>
                        <p >NEW</p>
                    </div>
                </SaveSlot>
            );
        }
        return saveSlots
    };

    // CREATE 4 SAVE SLOTS
    const saveSlotMaker = () => {
        let saveSlots = [];
        for (let i = 0; i < 4; i++) {
            saveSlots.push(saveSlot(i));
        }
        return saveSlots;
    };

    // CREATE BUTTONS FOR DELETE MODAL
    const deleteButtons = () => {
        let deleteButtons = [];
        saveGames.map((save) => {
            deleteButtons.push(
                <button
                    key={"delete--" + save.id}
                    onClick={() => {
                        // SET OBJECT FOR DELETION
                        setFileToBeDeleted(save);
                        // OPEN CONFIRM DELETE MODAL
                        confirmDeleteDialog.current.showModal();
                    }}
                >
                    Slot {saveGames.indexOf(save) + 1} score: {save.score}
                </button>
            );
        });
        return deleteButtons;
    };

    return (
        <Main>
            {/* DELETE BUTTON MODAL */}
            <dialog
                key={"deleteDialog"}
                className="dialog dialog--delete"
                ref={deleteDialog}
            >
                <div>Choose A File To Delete:</div>
                {/* DISPLAY BUTTONS FOR EACH SAVED GAME */}
                {deleteButtons()}
                <button
                    className="button--close"
                    onClick={(e) => deleteDialog.current.close()}
                >
                    Close
                </button>
            </dialog>

            {/* CONFIRM DELETE MODAL */}
            <dialog
                key={"confirmDeleteDialog"}
                className="dialog dialog--confirmDelete"
                ref={confirmDeleteDialog}
            >
                <div>Delete This File? (This Cannot Be Undone)</div>
                <button
                    onClick={(e) => {
                        confirmDeleteDialog.current.close();
                        deleteDialog.current.close();
                        // DELETE GAME, GET GAMES, CLEAR FILE TO BE DELETED
                        localStorage.removeItem("saveGame") 
                        deleteSave(fileToBeDeleted.id)
                            .then(() => getSaves().then(setSaveGames))
                            .then(() => setFileToBeDeleted({}));
                    }}
                >
                    Delete
                </button>
                <button
                    className="button--close"
                    onClick={(e) => {
                        // CLEAR FILE TO BE DELETED
                        setFileToBeDeleted({});
                        confirmDeleteDialog.current.close();
                    }}
                >
                    Close
                </button>
            </dialog>

            <Title>Save Files</Title>

            {/* SHOW SAVE SLOTS */}
            <SaveContainer>{saveSlotMaker()}</SaveContainer>
            <Div>
                <Button onClick={() => deleteDialog.current.showModal()}>
                    Delete File
                </Button>
                <Button
                    onClick={() => {
                        localStorage.removeItem("u_token");
                        localStorage.removeItem("is_staff");
                        localStorage.removeItem("u_id");
                        navigate("/welcome");
                    }}
                >
                    Logout
                </Button>
            </Div>
        </Main>
    );
};

const Div = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h1`
    text-align: center;
    font-family: "Bungee Spice", cursive;
    font-size: 35px;
    z-index: 2;
`;

const SaveSlot = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: grey;
    border-radius: 10px;
    width: 300px;
    height: 500px;
    margin: 30px 70px;
    padding: 30px;
`;
const SaveContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
`;

const Button = styled.button`
    z-index: 2;
    display: inline-block;
    padding: 0.35em 1.2em;
    border: 0.1em solid #ffffff;
    margin: 0 0.3em 0.3em 0;
    border-radius: 0.12em;
    box-sizing: border-box;
    text-decoration: none;
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 20px;
    color: #ffffff;
    background-color: transparent;
    text-align: center;
    transition: all 0.2s;
    &:hover {
        color: #000000;
        background-color: #ffffff;
    }
`;

const Main = styled.main`
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.2);
    height: 100vh;
    padding: 20px;
    z-index: 2;
`;
