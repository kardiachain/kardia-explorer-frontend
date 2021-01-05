import React from 'react';
import { Button } from 'rsuite';
import { useHistory } from 'react-router-dom';
import { useWalletStorage } from '../../../service/wallet';
// import { store } from '../../../service/store';
import Web3 from 'web3';

declare global {
    interface Window {
        ethereum: any;
        web3: any;
    }
}

const WalletExtensionConnect = () => {

    const history = useHistory();
    const setWalletStored = useWalletStorage(() => history.push('/wallet/dashboard'))[1];

    // const newContext = React.createContext({ color: 'black' });
    // const value = useContext(newContext);


    const ethEnabled = () => {
        console.log("window", window);
        
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            return true;
        }
        return false;
    }

    const metamaskConnect = async () => {
        if (!ethEnabled()) {
            alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!");
        } else {
            const accounts = await window.web3.eth.getAccounts();
            setWalletStored({
                privatekey: '',
                address: accounts[0],
                isAccess: true,
                externalWallet: true,
                walletType: 'webExtensionWallet'
            });
        }
    }

    return (
        <Button size="lg" block onClick={metamaskConnect}>
            Metamask Connect
        </Button>
    )
}

export default WalletExtensionConnect;