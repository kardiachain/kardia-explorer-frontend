import React, { useContext } from 'react';
import { Button } from 'rsuite';
import Web3 from 'web3';
import { useHistory } from 'react-router-dom';
import { useWalletStorage } from '../../../service/wallet';
import { store } from '../../../service/store';

declare global {
    interface Window {
        ethereum: any;
        web3: any;
    }
}

const MetamaskConnect = () => {

    const history = useHistory();
    const setWalletStored = useWalletStorage(() => history.push('/wallet/dashboard'))[1];

    // const newContext = React.createContext({ color: 'black' });
    // const value = useContext(newContext);

    const globalState = useContext(store);
    


    const ethEnabled = () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            return true;
        }
        return false;
    }

    const metamaskConnect = async () => {
        const { dispatch }: any = globalState;
        await dispatch({ type: 'create', value: 'test' });
        if (!ethEnabled()) {
            alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!");
        } else {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setWalletStored({
                privatekey: '0xxxxxxxx',
                address: accounts[0],
                isAccess: true
            }) 
            
        }
    }

    return (
        <Button size="lg" block onClick={metamaskConnect}>
            Metamask Connect
        </Button>
    )
}

export default MetamaskConnect;