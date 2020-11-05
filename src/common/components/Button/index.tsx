import React from 'react'
import './style.css'

const Button = ({onClick, children, size = "normal"}: {
    onClick?: () => void;
    children?: React.Component | string | number;
    size?: "normal" | "big"
}) => {
    let sizeClass = 'size-normal'
    if (size === "big") sizeClass = 'size-big'

    return (
        <button className={`kai-button ${sizeClass}`} onClick={onClick}>{children}</button>
    )
}

export default Button