import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import kardiaClient, { kardiaAccount, kardiaTx } from '../plugin/kardia-dx';
import { KardiaUtils } from 'kardia-js-sdk';
import { calGasprice, privateKeyValid } from '../common';
import { GasMode } from '../enum';

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

export const generateTx = async (fromAccount: Account, toAddr: string, amount: string, gasLimit: number, gasPrice: GasMode) => {
    const nonce = await kardiaAccount.getNonce(fromAccount.publickey)
    const calGasPrice = await calGasprice(gasPrice)
    const txHash = await kardiaTx.sendTransaction({
        nonce,
        to: toAddr,
        gasPrice: calGasPrice,
        gas: gasLimit,
        value: KardiaUtils.toHydro(amount, 'kai'),
    }, fromAccount.privatekey, true)
    return txHash
};

export const transferKrc20Token = async ({fromAccount, token, toAddress, amount, gasLimit, gasPrice}: {
    fromAccount: Account;
    token: Krc20Token;
    toAddress: string;
    amount: number;
    gasLimit: number;
    gasPrice: GasMode;
}) => {
    if (!fromAccount || !fromAccount.privatekey || !privateKeyValid(fromAccount.privatekey)) throw new Error("Pk invalid")
    const krc20 = kardiaClient.krc20;
    krc20.address = token.address;
    krc20.decimals = token.decimals;
    const toAddressChecksum = toAddress ? KardiaUtils.toChecksum(toAddress) : '';
    const promiseArr = await Promise.all([
        calGasprice(gasPrice),
        kardiaAccount.getNonce(fromAccount.publickey)
    ])
    const calGasPrice = promiseArr[0]
    const nonce = promiseArr[1]
    return await krc20.transfer(
        fromAccount.privatekey, 
        toAddressChecksum, 
        amount,
        {
            nonce,
            gas: gasLimit,
            gasPrice: calGasPrice,
        }, true);
}