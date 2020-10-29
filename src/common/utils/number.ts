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

const numberFormat = (value: number) => {
    return new Intl.NumberFormat('en', { maximumFractionDigits: 18 }).format(value);
}

export {onlyNumber, numberFormat, verifyAmount}