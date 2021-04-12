import React from 'react';
import { Button, Alert } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { useWalletStorage, kardiaExtensionWalletEnabled } from '../../../service';
import kardiaIcon from '../../../resources/kardia_logo_icon.png';
import './accessWallet.css';

const WalletExtensionConnect = () => {

    const history = useHistory();
    const setWalletStored = useWalletStorage(() => history.push('/wallet/dashboard'))[1];

    const walletConnect = async () => {
        if (!kardiaExtensionWalletEnabled()) {
            Alert.error("Please install the Kardia Extension Wallet to access.", 5000)
        } else {
            const accounts = await window.web3.eth.getAccounts();
            if (accounts && accounts[0]) {
                setWalletStored({
                    privatekey: '',
                    address: accounts[0],
                    isAccess: true,
                    externalWallet: true
                });
            } else {
                Alert.error("Please login Kardia Extension Wallet.", 5000)
            }
        }
    }

    return (
        <Button size="lg" block onClick={walletConnect} style={{whiteSpace: 'break-spaces'}} >
            <img src={kardiaIcon} className="kardia-extension-wallet-icon" alt="Kardia block explorer" /> 
            <span>Kardia Extension Wallet Connect</span>
        </Button>
    )
}

export default WalletExtensionConnect; 