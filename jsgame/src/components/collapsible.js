import { useState } from "react";

export const Collapsible = (props) => {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    return (
        <div>
            <button onClick={toggle}>{props.label}</button>
            {open && <div>{props.children}</div>}
        </div>
    )
}
