export const saveAsset = (asset) => {
    return fetch("http://localhost:8000/assets", {
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        },
        body: JSON.stringify(asset)
    })
        .then(response => response.json())
}

export const getAssets = () => {
    return fetch("http://localhost:8000/assets", {
        headers:{
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
        .then(response => response.json())
}

export const getSingleAsset = (id) => {
    return fetch(`http://localhost:8000/assets/${id}`, {
        headers:{
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
        .then(response => response.json())
}

export const deleteAsset = (assetId) => {
    return fetch(`http://localhost:8000/assets/${assetId}`, {
        method: 'DELETE',
        headers:{
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
}