const privateKeyValid = (privateKey: string) : boolean => {

    if (privateKey.length === 66 && privateKey.startsWith('0x')) {
        return true
    }
    return false;
}

const addressValid = (address: string) : boolean => {

    if (address.length === 42 && address.startsWith('0x')) {
        return true
    }
    return false;
}

export {
    privateKeyValid,
    addressValid
}