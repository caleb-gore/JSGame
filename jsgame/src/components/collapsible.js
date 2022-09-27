import { useState } from "react";
import styled from "styled-components";

export const Collapsible = (props) => {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    return (
        <div style={{"justify-content": "center"}}>
            <Button onClick={toggle}>{props.label}</Button>
            {open && <div>{props.children}</div>}
        </div>
    )
}

const Button = styled.button`
    width: 100%;
    background-color: #f2f2f2;
    border: 1px solid #f2f2f2;
    border-radius: 5px;
    color: #000;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    margin: 0.5rem;
    padding: 0.5rem 1rem;
    transition: all 0.2s ease-in-out;
    &:hover {
        background-color: #e6e6e6;
        border: 1px solid #e6e6e6;
        }`