import { useState } from "react";

export const Assets = () => {
    const [newAsset, updateNewAsset] = useState({
        name:"",
        width:"",
        height:"",
        file: "",
        type: ""

    })

    const handleInputChange = (e, inputName) => {
        const copy = {...newAsset}
        copy[inputName] = e.target.value
        updateNewAsset(copy)
    }
    return (
        <>
            <h3>Assets</h3>
            <h3>Upload New Asset</h3>
            <form>
                <fieldset>
                <label>
                    Name: 
                </label>
                    <input 
                        name="name" 
                        value={newAsset.name} 
                        onChange={(e)=>handleInputChange(e,"name")} type="text"/>
                </fieldset>
                <fieldset>
                <label>
                    Width (in pixels): 
                </label>
                    <input 
                        type="number"
                        name="width"
                        onChange={(e)=>handleInputChange(e,"width")}
                    />
                </fieldset>
                <fieldset>
                <label>
                    Height (in pixels): 
                </label>
                    <input 
                        type="number"
                        name="height"
                        onChange={(e)=>handleInputChange(e,"height")}
                    />
                </fieldset>
                <fieldset>
                <label>
                    type: 
                </label>
                    <select name="type" onChange={(e)=>handleInputChange(e,"type")}>
                        <option>Choose</option>
                        <option value="background">Background</option>
                        <option value="trophy">Trophy</option>
                        <option value="character">Character</option>
                        <option value="enemy">Enemy</option>
                        <option value="collectable">Collectable</option>
                    </select>
                </fieldset>
                <fieldset>
                    <input type="file"/>
                </fieldset>
                <button>Save</button>
            </form>
        </>
    );
};
