import React from 'react'
import { Loader } from 'rsuite'
import './style.css'

const Button = ({onClick, children, size = "normal", className, style, loading=false}: {
    onClick?: () => void;
    children?: React.Component | string | number | Element;
    size?: "normal" | "big";
    className?: string;
    style?: React.CSSProperties;
    loading?: boolean;
}) => {
    let sizeClass = 'size-normal'
    if (size === "big") sizeClass = 'size-big'

    return (
    <button className={`kai-button ${sizeClass} ${className} ${loading ? 'loading' : ''}`} style={style} onClick={onClick}>
        {
            loading ? <Loader className="button-loading" size="sm"></Loader> : <></>
        }{children}
    </button>
    )
}

export default Button