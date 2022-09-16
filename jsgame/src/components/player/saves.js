/* SAVE GAMES */

//IMPORTS
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createGame,
    deleteGame,
    getGames,
    getSingleGame,
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

    //NEW GAME OBJECT
    const newGame = {
        score: 0,
        level: 1,
        lives: 3,
        game_over: false,
    };

    //GET GAMES FROM DATABASE (INITIAL STATE)
    useEffect(() => {
        getGames().then(setSaveGames);
    }, []);

    //CREATE SAVE SLOT UI
    const saveSlot = (i) => {
        /* IF INDEX OF SAVE GAME MATCHES ARGUMENT GIVEN
        CREATE RESUME GAME SAVE SLOT
        ELSE CREATE NEW GAME SAVE SLOT
        NAVIGATE TO GAME */
        if (saveGames[i - 1]) {
            return (
                <section>
                    <button
                        onClick={() => {
                            localStorage.setItem(
                                "saveGame",
                                saveGames[i - 1].id
                            );
                            navigate("/game");
                        }}
                    >
                        Play
                    </button>
                    <div>
                        <p>Slot {i}</p>
                        <p>Score: {saveGames[i - 1].score}</p>
                    </div>
                </section>
            );
        } else {
            return (
                <section>
                    <button
                        onClick={() => {
                            //CREATE NEW GAME OBJECT TO SEND TO DATABASE
                            createGame(newGame).then(() =>
                                getGames()
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
                    </button>
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
        <>
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
                        deleteGame(fileToBeDeleted.id)
                            .then(() => getGames().then(setSaveGames))
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

            <h2>Save Files</h2>

            {/* SHOW SAVE SLOTS */}
            {saveSlotMaker()}
            <button onClick={() => deleteDialog.current.showModal()}>
                Delete File
            </button>
        </>
    );
};
