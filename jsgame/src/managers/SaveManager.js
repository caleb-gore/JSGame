export const createGame = (game) => {
    return fetch("http://localhost:8000/games", {
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        },
        body: JSON.stringify(game)
    })
        .then(response => response.json())
}

export const getGames = () => {
    return fetch("http://localhost:8000/games", {
        headers:{
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
        .then(response => response.json())
}