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
        window.localStorage.setItem('walletstore', JSON.stringify(storedValue))
    }, [storedValue])
    
    const setValue = async (value: WalletStore) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            await setStoredValue(valueToStore);
            callback && callback()
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

export const getBalanceByAddress = async (address: string) => {
    try {
        const balance = await kardiaApi.balance(address, '', null)
        return balance
    } catch (error) {
        console.log(error)
    }
} 
