import React from 'react';
import './style.css'

const StakingIcon = ({character, className='', style, size = "normal", color}: {
    character: string;
    className?: string;
    style?: React.CSSProperties;
    size?: string;
    color?: string; 
}) => {
    const classSize = size;
    const classColor = color;
    return (
        <span className={`staking-icon ${className} ${classSize} ${classColor}`} style={style}>{character}</span>
    )
}

export {
    StakingIcon
}