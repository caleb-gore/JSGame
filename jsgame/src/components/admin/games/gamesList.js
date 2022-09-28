import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getAssets } from "../../../managers/AssetManager";
import { deleteGame, getGames } from "../../../managers/GameManager";

export const GamesList = () => {
    const editGame = useRef();
    const [games, setGames] = useState([]);
    const [openGame, updateOpenGame] = useState({});
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        getGames().then(setGames);
        getAssets().then(setAssets);
    }, []);

    return (
        <Main>
            <dialog ref={editGame}>
                <h2>edit game</h2>
                <form>
                    <label htmlFor="name">Name</label>
                    <input placeholder="Name" value={openGame.name} />
                    <label htmlFor="background">Background</label>
                    <select>
                       {assets.map(asset => {
                        if (asset.type === "background" && asset.id === openGame.background_asset) {
                            return <option value={asset.id} selected>{asset.name}</option>;
                        } else if (asset.type === "background") {
                            return <option value={asset.id}>{asset.name}</option>;
                        }
                       })};
                    </select>
                    <label htmlFor="character">Character</label>
                    <select>
                       {assets.map(asset => {
                        if (asset.type === "character" && asset.id === openGame.character_asset) {
                            return <option value={asset.id} selected>{asset.name}</option>;
                        } else if (asset.type === "character") {
                            return <option value={asset.id}>{asset.name}</option>;
                        }
                       })};
                    </select>
                    <label htmlFor="enemy">Enemy</label>
                    <select>
                       {assets.map(asset => {
                        if (asset.type === "enemy" && asset.id === openGame.enemy_asset) {
                            return <option value={asset.id} selected>{asset.name}</option>;
                        } else if (asset.type === "enemy") {
                            return <option value={asset.id}>{asset.name}</option>;
                        }
                       })};
                    </select>
                </form>
                <button onClick={() => editGame.current.close()}>close</button>
            </dialog>
            <ul>
                {games.map((game) => {
                    return (
                        <li key={`game--${game.id}`}>
                            {game.name}
                            <button
                                key={`manage-game--${game.id}`}
                                onClick={() => {
                                    updateOpenGame(game);
                                    editGame.current.showModal();
                                }}
                            >
                                manage game
                            </button>
                            {games.length > 1 ? (
                                <button
                                    key={`delete-game--${game.id}`}
                                    onClick={() => {
                                        deleteGame(game.id).then(() => {
                                            getGames().then(setGames);
                                        });
                                    }}
                                >
                                    delete game
                                </button>
                            ) : null}
                        </li>
                    );
                })}
            </ul>
        </Main>
    );
};

const Main = styled.main`
    margin-top: 100px;
`;
