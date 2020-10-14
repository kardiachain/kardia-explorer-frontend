import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, ButtonToolbar, FlexboxGrid, Form, FormControl, FormGroup } from 'rsuite';
import { useWalletStorage } from '../../../service/wallet';
import Wallet from 'ethereumjs-wallet'
import * as EthUtil from 'ethereumjs-util'
import './accessWallet.css'

const AccessByPrivateKey = () => {
    let history = useHistory();
    const [privateKey, setPrivateKey] = useState('');
    const [walletStored, setWalletStored] = useWalletStorage(() => history.push('/dashboard/send-transaction'))

    //access wallet
    const accessWallet = () => {
        if(!privateKey) return;

        const privateKeyBuffer = EthUtil.toBuffer(privateKey);
        const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
        setWalletStored({
            privatekey: wallet.getPrivateKeyString(),
            address: wallet.getAddressString(),
            isAccess: true
        })
    }
    
    return (
        <FlexboxGrid justify="start">
            <div className="access-privatekey-container">
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