import { useNavigate } from "react-router-dom";

export const Welcome = () => {
    const navigate = useNavigate()
    
    return (
        <>
            <h1>Welcome Page</h1>
            <button onClick={()=> navigate("/register")}>New Player</button>
            <button onClick={()=> navigate("/login")}>Returning Player</button>
        </>
    );
};
