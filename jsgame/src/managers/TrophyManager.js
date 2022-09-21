export const createTrophy = (trophy) => {
    return fetch("http://localhost:8000/trophies", {
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        },
        body: JSON.stringify(trophy)
    })
        .then(response => response.json())
}

export const getTrophies = () => {
    return fetch("http://localhost:8000/trophies", {
        headers:{
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
        .then(response => response.json())
}