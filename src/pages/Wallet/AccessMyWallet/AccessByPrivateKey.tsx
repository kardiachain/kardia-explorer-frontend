import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, ButtonToolbar, FlexboxGrid, Form, FormControl, FormGroup } from 'rsuite';
import { useWalletStorage } from '../../../service/wallet';
import Wallet from 'ethereumjs-wallet'
import EthUtil from 'ethereumjs-util'

const AccessByPrivateKey = () => {
    const [privateKey, setPrivateKey] = useState('');
    const [walletStored, setWalletStored] = useWalletStorage()
    const [wallet, setWallet] = useState({} as WalletStore)
    let history = useHistory();

    //access wallet
    const accessWallet = () => {
        if(!privateKey) return;

        const privateKeyBuffer = EthUtil.toBuffer(privateKey);
        const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
        setWallet({
            privatekey: wallet.getPrivateKeyString(),
            address: wallet.getAddressString(),
            isAccess: true
        })
        setWalletStored(wallet)
        
        history.push("/dashboard");
    }
    
    return (
        <FlexboxGrid justify="start">
            <div className="note-warning">
                <Form fluid>
                    <FormGroup>
                        <FormControl placeholder="Private key*" name="password" type="text" value={privateKey} onChange={setPrivateKey} />
                    </FormGroup>
                    <FormGroup>
                        <ButtonToolbar>
                            <Button appearance="primary" onClick={accessWallet}>Access</Button>
                        </ButtonToolbar>
                    </FormGroup>
                </Form>
            </div>
        </FlexboxGrid>
    )
}

export default AccessByPrivateKey;