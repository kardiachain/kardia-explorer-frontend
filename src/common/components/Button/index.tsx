import React from 'react'
import './style.css'

const Button = ({onClick, children, size = "normal", className, style, loading=false}: {
    onClick?: () => void;
    children?: React.Component | string | number;
    size?: "normal" | "big";
    className?: string;
    style?: React.CSSProperties;
    loading?: boolean;
}) => {
    let sizeClass = 'size-normal'
    if (size === "big") sizeClass = 'size-big'

    return (
        <button className={`kai-button ${sizeClass} ${className}`} style={style} onClick={onClick}>{children}</button>
    )
}

export default Button