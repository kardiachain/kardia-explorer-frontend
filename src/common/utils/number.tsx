import React from 'react'
import NumberFormat from 'react-number-format'

const onlyNumber = (value: any) => {
    const re = /^(0|[1-9]\d*)(.\d*)?$/;
    if (value === '' || re.test(String(Number(value)))) {
        return true
    }
    return false
}

const onlyInteger = (amount: any) => {
    const re = /^[0-9]+$/;
    if (amount === '' || re.test(amount)) {
        return true
    }
    return false
}

const numberFormat = (amount: any, fractionDigits = 18) => {
    return (
        <NumberFormat value={amount ? amount.toString() : '0'} displayType={'text'} thousandSeparator={true} decimalScale={fractionDigits} />
    )
}

export {onlyNumber, numberFormat, onlyInteger}