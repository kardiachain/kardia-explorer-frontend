import { useState } from 'react';

const initialValue = {
    wallet : {
        privatekey: '',
        publickey: '',
        isAccess: false
    }
}

export const useWalletStorage = () => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem('walletstore');
            return item ? JSON.parse(item) : initialValue;
        } catch (err) { 
            console.log(err)
            return initialValue;
        }
    });

    const setValue = (value: any) => {
        try {
            const valueToStore = value instanceof Function ? {wallet: value(storedValue)} : {wallet: value};
            setStoredValue(valueToStore);
            window.localStorage.setItem('walletstore', JSON.stringify(valueToStore))
        } catch (err) {
            console.log(err);
        }
    }

    return [storedValue, setValue]
}

export const isAccessWallet = () => {
    const walletstore = window.localStorage.getItem('walletstore') || '{}';
    const walletstoreObj = JSON.parse(walletstore)
    console.log("walletstoreObj", walletstoreObj);
    
    if(walletstoreObj && walletstoreObj.wallet && walletstoreObj.wallet.isAccess) {
        return true;
    }
    return false;
}

export const logoutWallet = () => {
    window.localStorage.removeItem('walletstore');
}

