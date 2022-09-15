
export const getAllUsers = () => {
    return fetch("http://localhost:8000/users", {
        headers:{
            "Authorization": `Token ${localStorage.getItem("u_token")}`
        }
    })
        .then(response => response.json())
}