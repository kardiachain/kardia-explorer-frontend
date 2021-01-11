import { useEffect, useState } from 'react';
import { kardiaApi, kardiaCommon } from '../plugin/kardia-tool';
import { cellValue } from '../common/utils/amount';
import { toChecksum } from 'kardia-tool/lib/common/lib/account';
import CryptoJS from 'crypto-js';

const initialValue: WalletStore = {
    privatekey: '',
    address: '',
    isAccess: false
}

export const useWalletStorage = (callback?: () => void) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const walletstore = window.localStorage.getItem('walletstore');
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
            window.localStorage.setItem('walletstore', encodeVal)
            callback && callback();
        }

    }, [storedValue, callback])
    
    const setValue = (value: WalletStore, password: string) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            const pkStr =  valueToStore && valueToStore.privatekey ? valueToStore.privatekey : '';
            const encryptPk = CryptoJS.AES.encrypt(pkStr.toString(), password).toString();
            valueToStore.privatekey = encryptPk;
            setStoredValue(valueToStore);
        } catch (err) {
            console.error(err);
        }
    }
    return [storedValue, setValue]
}

export const getPkByPassword = (password: string): string => {
    try {
        // Get wallet store from local store
        const walletstore = window.localStorage.getItem('walletstore') || '{}';
        const walletstoreDecode = window.atob(walletstore || '')
        const walletstoreObj = JSON.parse(walletstoreDecode ) as WalletStore;
        const encryptedPk = walletstoreObj.privatekey
        // Using password decrypt pk
        const decrypted = CryptoJS.AES.decrypt(encryptedPk, password).toString(CryptoJS.enc.Utf8)
        
        return decrypted
    } catch (error) {
        return ''
    }
}

export const useBalanceStorage = () => {
    const [storedBalance, setStoredBalance] = useState(() => {
        try {
            const balance = window.localStorage.getItem(window.btoa("kaibalance"))
            const balanceDecode = window.atob(balance || '');
            return balanceDecode || 0;
        } catch (error) {
            console.error(error)
            return 0;
        }
    })

    useEffect(() => {
        const balanceEncode = window.btoa(storedBalance.toString())
        window.localStorage.setItem(window.btoa("kaibalance"), balanceEncode)
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
        const balance = window.localStorage.getItem(window.btoa("kaibalance"))
        const balanceDecode = window.atob(balance || '');
        return Number(balanceDecode) || 0;
    } catch (error) {
        console.error(error)
        return 0;
    }
}

export const isLoggedIn = () => {
    try {
        const walletstore = window.localStorage.getItem('walletstore') || '{}';
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
}

export const getBalanceByAddress = async (address: string) => {
    try {
        const balance = await kardiaApi.balance(address, '', null)
        return balance
    } catch (error) {
        console.error(error)
    }
} 

export const getAccount = (): Account => {
    const walletstoreStr = window.localStorage.getItem('walletstore') || '{}';
    try {
        const walletstoreDecode = window.atob(walletstoreStr || '')
        const walletstoreJson = JSON.parse(walletstoreDecode) || initialValue;
        return {
            publickey: walletstoreJson.address ? toChecksum(walletstoreJson.address.toLowerCase()) : '',
            privatekey: walletstoreJson.privatekey
        } as Account
    } catch (error) {
        return {} as Account
    }
}

export const generateTx = async (fromAccount: Account, toAddr: string, amount: number, gasLimit: number, gasPrice: number) => {
    const cellAmount = cellValue(amount);
    let nonce = await kardiaApi.accountNonce(fromAccount.publickey);
    const tx = await kardiaCommon.txGenerator(
        toAddr,
        cellAmount,
        nonce,
        gasPrice || 1,
        gasLimit,
    );
    
    const signedTx = await kardiaCommon.sign(tx, fromAccount.privatekey);
    const txHash = await kardiaApi.sendSignedTransaction(signedTx.rawTransaction);
    return txHash
};
