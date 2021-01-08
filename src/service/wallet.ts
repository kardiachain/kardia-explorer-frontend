import { useEffect, useState } from 'react';
import { kardiaApi, kardiaCommon } from '../plugin/kardia-tool';
import { cellValue } from '../common/utils/amount';
import { toChecksum } from 'kardia-tool/lib/common/lib/account';

const initialValue: WalletStore = {
    privatekey: '',
    address: '',
    isAccess: false,
    externalWallet: false,
    walletType: ''
}

export const useWalletStorage = (callback?: () => void) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const walletstore = window.sessionStorage.getItem('walletstore');
            const walletstoreDecode = window.atob(walletstore || '')
            return walletstoreDecode ? JSON.parse(walletstoreDecode) : initialValue;
        } catch (err) { 
            console.error(err)
            return initialValue;
        }
    });

    useEffect(() => {
        if(storedValue.isAccess) {
            const encodeVal = window.btoa(JSON.stringify(storedValue))
            window.sessionStorage.setItem('walletstore', encodeVal)
            callback && callback();
        }

    }, [storedValue, callback])
    
    const setValue = (value: WalletStore) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
        } catch (err) {
            console.error(err);
        }
    }

    return [storedValue, setValue]
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
        const walletstore = window.sessionStorage.getItem('walletstore') || '{}';
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
    window.sessionStorage.removeItem('walletstore');
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
    const walletstoreStr = window.sessionStorage.getItem('walletstore') || '{}';
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
