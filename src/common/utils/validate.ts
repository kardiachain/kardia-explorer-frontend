const privateKeyValid = (privateKey: string) : boolean => {

    if (privateKey.length === 66 && privateKey.startsWith('0x')) {
        return true
    }
    return false;
}

export {
    privateKeyValid
}