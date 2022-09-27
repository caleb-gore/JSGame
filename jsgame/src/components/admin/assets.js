import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { deleteAsset, getAssets, saveAsset } from "../../managers/AssetManager";
import { Collapsible } from "../collapsible";

export const Assets = () => {
    //const navigate = useNavigate();
    const [newAsset, updateNewAsset] = useState({
        name: "",
        width: "",
        height: "",
        file: "",
        type: "",
    });
    const [assets, setAssets] = useState([]);
    const categories = [
        "background",
        "trophy",
        "character",
        "enemy",
        "collectable",
        "other",
    ];
    useEffect(() => {
        getAssets().then(setAssets);
    }, []);

    const handleInputChange = (e, inputName) => {
        const copy = { ...newAsset };
        copy[inputName] = e.target.value;
        updateNewAsset(copy);
    };

    const handleFileSelect = (e) => {
        getBase64(e.target.files[0], (base64ImageString) => {
            const copy = { ...newAsset };
            copy.file = base64ImageString;
            updateNewAsset(copy);
        });
    };

    const getBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(file);
    };

    const listCurrentAssets = () => {
        return categories.map((cat) => {
            let categoryAssets = assets.filter((asset) => asset.type === cat);
            if (!categoryAssets[0]) {
                return (
                    <Collapsible label={cat} key={cat}>
                        <p>No assets in this category</p>
                    </Collapsible>
                );
            } else {
                return (
                    <Collapsible label={cat} key={cat}>
                        <Table>
                            <thead>
                                <TheadTr>
                                    <Th>Name</Th>
                                    <Th>Width</Th>
                                    <Th>Height</Th>
                                    <Th>File</Th>
                                    <Th>Type</Th>
                                    <Th>Actions</Th>
                                </TheadTr>
                            </thead>
                            <tbody>
                                {categoryAssets.map((asset) => {
                                    return (
                                        <TbodyTr key={asset.id}>
                                            <Td>{asset.name}</Td>
                                            <Td>{asset.width}</Td>
                                            <Td>{asset.height}</Td>
                                            <Td>
                                                <img

                                                    src={`http://localhost:8000${asset.file}`}
                                                    height="100px"
                                                maxWidth="500px"
                                                alt={asset.name}/>
                                            </Td>
                                            <Td>{asset.type}</Td>
                                            <Td>
                                                <button

                                                    onClick={() => {
                                                        deleteAsset(asset.id).then(
                                                            () => {
                                                                getAssets().then(
                                                                    setAssets
                                                                );
                                                            }
                                                        );
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </Td>
                                        </TbodyTr>
                                    );
                                })}
                            </tbody>

                        </Table>
                        
                    </Collapsible>
                );
            }
        });
    };



    return (
        <Main>
            {/* <div className="App">
    <Collapsible label="Introduction">
    <h1>introduction</h1>
  <p>
    The collapsible component puts long sections of the information under a
    block enabling users to expand or collapse to access its details.
  </p>
    </Collapsible>

    <hr />
    <Collapsible label="Prerequesite"/>
    <hr />
    <Collapsible label="Goals"/>
    </div> */}
        <>
            <h3>Assets</h3>

            {listCurrentAssets()}

            <h3>Upload New Asset</h3>
            <form>
                <fieldset key="name">
                    <label>Name:</label>
                    <input
                        required
                        name="name"
                        value={newAsset.name}
                        onChange={(e) => handleInputChange(e, "name")}
                        type="text"
                    />
                </fieldset>
                <fieldset key="width">
                    <label>Width (in pixels):</label>
                    <input
                        required
                        type="number"
                        name="width"
                        onChange={(e) => handleInputChange(e, "width")}
                    />
                </fieldset>
                <fieldset key="height">
                    <label>Height (in pixels):</label>
                    <input
                        required
                        type="number"
                        name="height"
                        onChange={(e) => handleInputChange(e, "height")}
                    />
                </fieldset>
                <fieldset key="type">
                    <label>type:</label>
                    <select
                        required
                        name="type"
                        onChange={(e) => handleInputChange(e, "type")}
                    >
                        <option value={"DEFAULT"} disabled="disabled">
                            Choose
                        </option>
                        {categories.map((cat) => {
                            return (
                                <option key={`select--${cat}`} value={cat}>
                                    {cat}
                                </option>
                            );
                        })}
                    </select>
                </fieldset>
                <fieldset key="file">
                    <input
                        required
                        type="file"
                        onChange={(e) => handleFileSelect(e)}
                    />
                </fieldset>
                <button
                    onClick={(e) => {
                        e.preventDefault();

                        saveAsset(newAsset).then(() =>
                            getAssets().then(setAssets)
                        );
                    }}
                >
                    Save
                </button>
            </form>
        </>
        </Main>
    );
};

const Main = styled.main`
margin-top: 100px;
`
const Table = styled.table`
border-spacing: 1; 
  border-collapse: collapse; 
  background:white;
  border-radius:6px;
  overflow:hidden;
  max-width:800px; 
  width:100%;
  margin:0 auto;
  position:relative;
`

const Td = styled.td`padding-left:8px;
text-align:left;
		&.l 					{ text-align:right }
		&.c 					{ text-align:center }
		&.r 					{ text-align:center }`
const Th = styled.th`padding-left:8px;
text-align:left;
		&.l 					{ text-align:right }
		&.c 					{ text-align:center }
		&.r 					{ text-align:center }`
const TheadTr = styled.tr`height:60px;
background:#FFED86;
font-size:16px;`
const TbodyTr = styled.tr`height:48px; border-bottom:1px solid #E3F1D5 ;
&:last-child  { border:0; }`

