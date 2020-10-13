import { useState } from 'react';

const initialValue: WalletStore = {
    privatekey: '',
    address: '',
    isAccess: false
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

    const setValue = (value: WalletStore) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
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
    const walletstoreObj = JSON.parse(walletstore) as WalletStore;
    
    if(walletstoreObj && walletstoreObj.isAccess) {
        return true;
    }
    return false;
}

export const logoutWallet = () => {
    window.localStorage.removeItem('walletstore');
}

