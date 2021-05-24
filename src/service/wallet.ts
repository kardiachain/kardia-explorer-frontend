import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { kardiaAccount, kardiaTx } from '../plugin/kardia-dx';
import { KardiaUtils } from 'kardia-js-sdk';

const initialValue: WalletStore = {
    privatekey: '',
    address: '',
    isAccess: false,
    externalWallet: false
}

export const useWalletStorage = (callback?: () => void) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const walletstore = window.localStorage.getItem('walletstore') ? window.localStorage.getItem('walletstore') : window.sessionStorage.getItem('walletstore');
            const walletstoreDecode = window.atob(walletstore || '')
            return walletstoreDecode ? JSON.parse(walletstoreDecode) : initialValue;
        } catch (err) { 
            console.error(err)
            return initialValue;
        }
    });

    useEffect(() => {
        if(storedValue.privatekey && storedValue.isAccess) {
            const encodeVal = window.btoa(JSON.stringify(storedValue))

            if (storedValue.externalWallet) {
                window.sessionStorage.setItem('walletstore', encodeVal)
            } else {
                window.localStorage.setItem('walletstore', encodeVal)
            }
            callback && callback();
        }

    }, [storedValue, callback])
    
    const setValue = (value: WalletStore, passcode: string) => {
        try {
            const passcodeHash = CryptoJS.SHA256(passcode).toString(CryptoJS.enc.Hex);
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            const pkStr =  valueToStore && valueToStore.privatekey ? valueToStore.privatekey : '';
            const encryptPk = CryptoJS.AES.encrypt(pkStr.toString(), passcodeHash).toString();
            valueToStore.privatekey = encryptPk;
            setStoredValue(valueToStore);
        } catch (err) {
            console.error(err);
        }
    }
    return [storedValue, setValue]
}

export const getPkByPassword = (passcode: string): string => {
    try {
        // Get wallet store from local store
        const walletstore = window.localStorage.getItem('walletstore') || '{}';
        const walletstoreDecode = window.atob(walletstore || '')
        const walletstoreObj = JSON.parse(walletstoreDecode ) as WalletStore;
        const encryptedPk = walletstoreObj.privatekey;
        const passcodeHash = CryptoJS.SHA256(passcode).toString(CryptoJS.enc.Hex);
        // Using password decrypt pk
        const pk = CryptoJS.AES.decrypt(encryptedPk, passcodeHash).toString(CryptoJS.enc.Utf8)        
        return pk
    } catch (error) {
        return ''
    }
}

export const isExtensionWallet = (): boolean => {
    try {

        const walletstore = window.sessionStorage.getItem('walletstore') || '{}';
        
        if (walletstore === '{}') return false

        const walletstoreDecode = window.atob(walletstore || '')
        const walletstoreObj = JSON.parse(walletstoreDecode) as WalletStore;
        if (walletstoreObj && walletstoreObj.externalWallet) {
            return true
        }

        return false;
    } catch (error) {
        return false
    }
}

export const useBalanceStorage = () => {
    const [storedBalance, setStoredBalance] = useState(() => {
        try {
            const balance = window.sessionStorage.getItem(window.btoa("kaibalance"))
            const balanceDecode = window.atob(balance || '');
            return balanceDecode || 0;
        } catch (error) {
            console.error(error)
            return 0;
        }
    })

    useEffect(() => {
        const balanceEncode = window.btoa(storedBalance.toString())
        window.sessionStorage.setItem(window.btoa("kaibalance"), balanceEncode)
    }, [storedBalance])
    
    const setBalance = (balance: number) => {
        try {
            setStoredBalance(balance);
        } catch (error) {
            console.error(error);
        }
    }

    return [storedBalance, setBalance] as any[]
}

export const getStoredBalance = (): number => {
    try {
        const balance = window.sessionStorage.getItem(window.btoa("kaibalance"))
        const balanceDecode = window.atob(balance || '');
        return Number(balanceDecode) || 0;
    } catch (error) {
        console.error(error)
        return 0;
    }
}

export const isLoggedIn = () => {
    try {
        const walletstore = window.localStorage.getItem('walletstore') ? window.localStorage.getItem('walletstore') : window.sessionStorage.getItem('walletstore') || '{}';
        const walletstoreDecode = window.atob(walletstore || '')
        const walletstoreObj = JSON.parse(walletstoreDecode ) as WalletStore;
        if(walletstoreObj && walletstoreObj.isAccess) {
            return true;
        }
        return false;
    } catch (error) {
        return false
    }
}

export const logoutWallet = () => {
    window.localStorage.removeItem('walletstore');
    window.sessionStorage.removeItem('walletstore');
}

export const getBalanceByAddress = async (address: string) => {
    try {
        const balance = await kardiaAccount.getBalance(address)
        return balance
    } catch (error) {
        console.error(error)
    }
} 

export const getAccount = (): Account => {
    const walletstoreStr = window.localStorage.getItem('walletstore') ? window.localStorage.getItem('walletstore') : window.sessionStorage.getItem('walletstore') || '{}';
    try {
        const walletstoreDecode = window.atob(walletstoreStr || '')
        const walletstoreJson = JSON.parse(walletstoreDecode) || initialValue;
        return {
            publickey: walletstoreJson.address ? KardiaUtils.toChecksum(walletstoreJson.address) : '',
            privatekey: walletstoreJson.privatekey
        } as Account
    } catch (error) {
        return {} as Account
    }
}

export const generateTx = async (fromAccount: Account, toAddr: string, amount: number, gasLimit: number, gasPrice: number) => {
    const nonce = await kardiaAccount.getNonce(fromAccount.publickey)
    const txHash = await kardiaTx.sendTransaction({
        nonce,
        to: toAddr,
        gasPrice: KardiaUtils.toHydro(gasPrice, 'oxy'),
        gas: gasLimit,
        value: KardiaUtils.toHydro(amount, 'kai'),
    }, fromAccount.privatekey, true)
    return txHash
};
