export const createSave = (save) => {
    return fetch("http://localhost:8000/saves", {
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        },
        body: JSON.stringify(save)
    })
        .then(response => response.json())
}

export const getSaves = () => {
    return fetch("http://localhost:8000/saves", {
        headers:{
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
        .then(response => response.json())
}

export const getSingleSave = (id) => {
    return fetch(`http://localhost:8000/saves/${id}`, {
        headers:{
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
        .then(response => response.json())
}

export const updateSaveGame = (save, id) => {
    return fetch(`http://localhost:8000/saves/${id}`, {
        method: 'PUT',
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        },
        body: JSON.stringify(save)
    })
        .then(response => response.json())
}

export const deleteSave = (saveId) => {
    return fetch(`http://localhost:8000/saves/${saveId}`, {
        method: 'DELETE',
        headers:{
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
}