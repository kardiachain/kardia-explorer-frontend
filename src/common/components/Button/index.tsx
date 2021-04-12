import React from 'react'
import { Loader } from 'rsuite'
import './style.css'

export const Button = ({onClick, children, size = "normal", className, style, loading=false, disable=false}: {
    onClick?: () => void;
    children?: any;
    size?: "normal" | "big";
    className?: string;
    style?: React.CSSProperties;
    loading?: boolean;
    disable?: boolean;
}) => {
    let sizeClass = 'size-normal'
    if (size === "big") sizeClass = 'size-big'

    return (
    <button className={`kai-button ${sizeClass} ${className} ${loading ? 'loading' : ''} ${disable ? 'disable' : ''}`} style={style} onClick={onClick} disabled={disable}>
        {
            loading ? <Loader className="button-loading" size="sm"></Loader> : <></>
        } <span className="text">{children}</span>
    </button>
    )
}