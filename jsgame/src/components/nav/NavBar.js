import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getUser } from "../../managers/UserManager";
import "./NavBar.css";

export const NavBar = () => {
    const [user, setUser] = useState({});
    const [games, setGames] = useState([]);
    const userId = JSON.parse(localStorage.getItem("u_id"));
    useEffect(() => {
        getUser(userId).then(setUser);
    }, []);

    
    const navigate = useNavigate();
    console.log(user);
    return (
        <Main>
            <nav className="navMenu">
                <Link to="/welcome">
                    <Title>Your Game Here</Title>
                </Link>
                <Link to="/assets">Assets</Link>
                <Link to="/games">Games</Link>
                <Link to="/users">Users</Link>
                
                <Link to="/trophies">Trophies</Link>
                <Link
                    to="/welcome"
                    onClick={() => {
                        localStorage.removeItem("u_token");
                        localStorage.removeItem("is_staff");
                        localStorage.removeItem("u_id");
                        navigate("/welcome");
                    }}
                >
                    Logout
                </Link>

                <div className="dot"></div>
            </nav>
        </Main>

        // <ul>
        //     <li>
        //     </li>
        //     <li>
        //     </li>
        //     <li>
        //     </li>
        //     {user.is_superuser ? (
        //         <li>
        //         </li>
        //     ) : (
        //         ""
        //     )}

        //     <li>
        //     </li>
        // </ul>
    );
};

const Title = styled.h1`
    font-family: "Bungee Spice", cursive;
    font-size: 25px;
    z-index: 2;
`;

const Main = styled.main`
position: fixed;
top: 0;
width: 100%;
    margin: 0;
    padding: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #272727;
    font-family: "Montserrat", sans-serif;
`;
