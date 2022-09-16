
export const getAllUsers = () => {
    return fetch("http://localhost:8000/users", {
        headers:{
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
        .then(response => response.json())
}

export const getUser = (id) => {
    return fetch(`http://localhost:8000/users/${id}`, {
        headers:{
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
        .then(response => response.json())
}