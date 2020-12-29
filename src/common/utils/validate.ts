const privateKeyValid = (privateKey: string) : boolean => {

    if (privateKey.length === 66 && privateKey.startsWith('0x')) {
        return true
    } else if (privateKey.length === 64) {
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

const hashValid = (txHash: string) : boolean => {
    if (txHash.length === 66 && txHash.startsWith('0x')) {
        return true
    }
    return false;
}

const jsonValid = (value: any): boolean => {
    try {
        JSON.parse(value);
    } catch (error) {
        return false
    }
    return true;
}

export {
    privateKeyValid,
    addressValid,
    hashValid,
    jsonValid
}