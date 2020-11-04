import { useEffect, useState } from 'react';
import { kardiaApi, kardiaCommon } from '../plugin/kardia-tool';
import { cellValue } from '../common/utils/amount';
import { Alert } from 'rsuite';
import { toChecksum } from 'kardia-tool/lib/common/lib/account'

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
            console.log(err)
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
        const balance = await kardiaApi.balance(toChecksum(address), '', null)
        return balance
    } catch (error) {
        console.log(error)
    }
} 

export const getAccount = (): Account => {
    const walletstoreStr = window.localStorage.getItem('walletstore') || '{}';
    try {
        const walletstoreDecode = window.atob(walletstoreStr || '')
        const walletstoreJson = JSON.parse(walletstoreDecode) || initialValue;
        return {
            publickey: toChecksum(walletstoreJson.address),
            privatekey: walletstoreJson.privatekey
        } as Account
    } catch (error) {
        return {} as Account
    }
}

export const generateTx = async (fromAccount: Account, toAddr: string, amount: number, gasLimit: number) => {
    try {
        const cellAmount = cellValue(amount);
        let nonce = await kardiaApi.accountNonce(fromAccount.publickey);
        const tx = await kardiaCommon.txGenerator(
            toAddr,
            cellAmount,
            nonce,
            1,
            gasLimit,
        );
        const signedTx = await kardiaCommon.sign(tx, fromAccount.privatekey);
        const txHash = await kardiaApi.sendSignedTransaction(signedTx.rawTransaction);
        return txHash
    }
    catch (err) {
        Alert.error(`Create Transaction Failed: ${err.message}`)
    }
};
