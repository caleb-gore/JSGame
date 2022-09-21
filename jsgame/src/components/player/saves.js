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
    }, []);

    //CREATE SAVE SLOT UI
    const saveSlot = (i) => {
        /* IF INDEX OF SAVE GAME MATCHES ARGUMENT GIVEN
        CREATE RESUME GAME SAVE SLOT
        ELSE CREATE NEW GAME SAVE SLOT
        NAVIGATE TO GAME */
        if (saveGames[i - 1]) {
            return (
                <SaveSlot>
                    <Button
                        onClick={() => {
                            localStorage.setItem(
                                "saveGame",
                                saveGames[i - 1].id
                            );
                            navigate("/game");
                        }}
                    >
                        Play
                    </Button>
                    <div>
                        <p>Slot {i}</p>
                        <p>Score: {saveGames[i - 1].score}</p>
                    </div>
                </SaveSlot>
            );
        } else {
            return (
                <SaveSlot>
                    <Button
                        onClick={() => {
                            //CREATE NEW GAME OBJECT TO SEND TO DATABASE
                            createSave(newGame).then(() =>
                                getSaves()
                                    .then(setSaveGames)
                                    .then(() =>
                                        localStorage.setItem(
                                            "saveGame",
                                            saveGames[saveGames.length - 1].id
                                        )
                                    )
                                    .then(() => navigate("/game"))
                            );
                        }}
                    >
                        NEW
                    </Button>
                    <div>
                        <p>Slot {i}</p>
                        <p>NEW</p>
                    </div>
                </SaveSlot>
            );
        }
    };

    // CREATE 4 SAVE SLOTS
    const saveSlotMaker = () => {
        let saveSlots = [];
        for (let i = 1; i < 5; i++) {
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
            <dialog className="dialog dialog--delete" ref={deleteDialog}>
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
                className="dialog dialog--confirmDelete"
                ref={confirmDeleteDialog}
            >
                <div>Delete This File? (This Cannot Be Undone)</div>
                <button
                    onClick={(e) => {
                        confirmDeleteDialog.current.close();
                        deleteDialog.current.close();
                        // DELETE GAME, GET GAMES, CLEAR FILE TO BE DELETED
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
            <SaveContainer>
            {saveSlotMaker()}
            </SaveContainer>
            <Div>

            <Button onClick={() => deleteDialog.current.showModal()}>
                Delete File
            </Button>
            <Button onClick={() => {
               localStorage.removeItem("u_token")
               localStorage.removeItem("is_staff")
               localStorage.removeItem("u_id")
                navigate("/welcome");
            }}>Logout</Button>
            </Div>
        </Main>
    );
};

const Div = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

const Title = styled.h1`
text-align: center;
font-family: 'Bungee Spice', cursive;
font-size: 35px;
z-index: 2;
`

const SaveSlot = styled.section`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
background-color: grey;
border-radius: 10px;
width: 200px;
height: 200px;
margin: 30px 100px;
`
const SaveContainer = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: center;
align-items: center;
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

const Main = styled.main`
display: flex;
flex-direction: column;
background-color: rgba(0,0,0,0.2);
height: 100vh;
padding: 20px;
z-index: 2;    

`