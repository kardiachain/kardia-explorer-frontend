import React from 'react'
import NumberFormat from 'react-number-format'
import './style.css'

export const NumberInputFormat = ({ onChange, value, placeholder, className, style, decimalScale }: {
    onChange?: (event?: any) => void;
    value: any;
    placeholder?: any;
    className?: string;
    style?: React.CSSProperties;
    decimalScale?: number
}) => {
    return (
        <NumberFormat
            decimalScale={decimalScale}
            value={value}
            className={`kai-number-input ${className ? className : ''}`}
            style={style}
            placeholder={placeholder}
            onValueChange={onChange}
            thousandSeparator={true} />
    )
}