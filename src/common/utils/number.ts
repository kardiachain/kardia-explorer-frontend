const onlyNumber = (value: any) => {
    const re = /^(0|[1-9]\d*)(.\d*)?$/;
    if (value === '' || re.test(value)) {
        return true
    }
    return false
}

const verifyAmount = (amount: any) => {
    const re = /^(0|[1-9]\d*)(.\d+)?$/;
    if (amount === '' || re.test(amount)) {
        return true
    }
    return false
}

const numberFormat = (value: number, fractionDigits = 18) => {
    return new Intl.NumberFormat('en', { maximumFractionDigits: fractionDigits }).format(value);
}

export {onlyNumber, numberFormat, verifyAmount}