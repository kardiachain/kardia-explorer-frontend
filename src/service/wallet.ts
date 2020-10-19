import { useEffect, useState } from 'react';
import { kardiaApi } from '../plugin/kardia-tool';

const initialValue: WalletStore = {
    privatekey: '',
    address: '',
    isAccess: false
}

export const useWalletStorage = (callback?: () => void) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem('walletstore');
            return item ? JSON.parse(item) : initialValue;
        } catch (err) { 
            console.log(err)
            return initialValue;
        }
    });

    useEffect(() => {
        if(storedValue !== initialValue) {
            window.localStorage.setItem('walletstore', JSON.stringify(storedValue))
            callback && callback();
        }

    }, [storedValue, callback])
    
    const setValue = (value: WalletStore) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
        } catch (err) {
            console.log(err);
        }
    }

    return [storedValue, setValue]
}

export const isLoggedIn = () => {
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

export const getBalanceByAddress = async (address: string) => {
    try {
        const balance = await kardiaApi.balance(address, '', null)
        return balance
    } catch (error) {
        console.log(error)
    }
} 

export const getAccount = (): Account => {
    const walletstoreStr = window.localStorage.getItem('walletstore') || '';
    const walletstoreJson = JSON.parse(walletstoreStr) || initialValue;
    return {
        publickey: walletstoreJson.address,
        privatekey: walletstoreJson.privatekey
    } as Account
}