const onlyNumber = (value: any) => {
    const re = /^[0-9\b]+$/;
    if (value === '' || re.test(value)) {
        return true
    }
    return false
}

const numberFormat = (value: number) => {
    if(value < 1) return value
    return new Intl.NumberFormat().format(value);
}

export {onlyNumber, numberFormat}