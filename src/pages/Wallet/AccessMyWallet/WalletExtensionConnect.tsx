import React from 'react';
import { Button } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { useWalletStorage } from '../../../service/wallet';
import { kardiaExtensionWalletEnabled } from '../../../service/extensionWallet';

declare global {
    interface Window {
        ethereum: any;
        web3: any;
    }
}

const WalletExtensionConnect = () => {
    
    const history = useHistory();
    const setWalletStored = useWalletStorage(() => history.push('/wallet/dashboard'))[1];

    const metamaskConnect = async () => {
        if (!kardiaExtensionWalletEnabled()) {
            alert("Please install the Kardia Extension Wallet to access.");
        } else {
            const accounts = await window.web3.eth.getAccounts();
            console.log(accounts[0]);
            if (accounts && accounts[0]) {
                setWalletStored({
                    privatekey: '',
                    address: accounts[0],
                    isAccess: true,
                    externalWallet: true,
                    walletType: 'webExtensionWallet'
                });
            } else {
                alert("Please login Kardia Extension Wallet")
            }
        }
    }

    return (
        <Button size="lg" block onClick={metamaskConnect}>
            Kardia Extenion Wallet Connect
        </Button>
    )
}

export default WalletExtensionConnect;