const onlyNumber = (value: any) => {
    const re = /^[0-9\b]+$/;
    if (value === '' || re.test(value)) {
        return true
    }
    return false
}

export {onlyNumber}