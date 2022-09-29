export const getGames = () => {
    return fetch("http://localhost:8000/games", {
        headers:{
            // "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
        .then(response => response.json())
}

export const deleteGame = (gameId) => {
    return fetch(`http://localhost:8000/games/${gameId}`, {
        method: 'DELETE',
        headers:{
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
}

export const updateGame = (game, id) => {
    return fetch(`http://localhost:8000/games/${id}`, {
        method: 'PUT',
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        },
        body: JSON.stringify(game)
    })
}