import { useEffect, useState } from "react"
import styled from "styled-components"
import { getAssets } from "../../managers/AssetManager"
import { createTrophy, getTrophies } from "../../managers/TrophyManager"

export const Trophies = () => {
    const [trophies, setTrophies] = useState([])
    const [assets, setAssets] = useState([])
    const [newTrophy, setNewTrophy] = useState({
        type: "",
        asset: 0,
    })

    useEffect(() => {
        getTrophies().then(setTrophies)
        getAssets().then(setAssets)
    }, [])


    return (
        <Main>

        <>
        <h3>Trophies</h3>
        <ul>
            {trophies?.map(trophy => {
                const asset = assets?.find(asset => asset.id === trophy.asset)
                return <li key={trophy.id}>{asset?.name} - {trophy.type} - <img src={"http://localhost:8000" + asset?.file} height="100px"/></li>
            })}
        </ul>

        <form>
            <fieldset>
                <label htmlFor="asset">Asset</label>
                <select onChange={
                    (event) => {
                        const copy = {...newTrophy}
                        copy.asset = parseInt(event.target.value)
                        setNewTrophy(copy)
                    }
                } name="asset" id="asset">
                    {assets.map(asset => <option key={asset.id} value={asset.id}>{asset.name}</option>)}
                </select>
            </fieldset>
            <fieldset>  
                <label htmlFor="type">Type</label>
                <input onChange={
                    (event) => {
                        const copy = {...newTrophy}
                        copy.type = event.target.value
                        setNewTrophy(copy)
                    }
                } type="text" name="type" id="type" />
            </fieldset>
            <button type="submit" onClick={
                evt => {
                    evt.preventDefault()
                    createTrophy(newTrophy).then(() => {
                        getTrophies().then(setTrophies)
                    })
                }
            }>Add Trophy</button>
        </form>
        </>
        </Main>
    
    )
}

const Main = styled.main`
margin-top: 100px;
`