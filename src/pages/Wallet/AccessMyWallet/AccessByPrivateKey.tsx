import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Button, Col, FlexboxGrid, Form, FormControl, FormGroup, Panel } from 'rsuite';
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
        if (!privateKey) return;

        const privateKeyBuffer = EthUtil.toBuffer(privateKey);
        const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
        setWalletStored({
            privatekey: wallet.getPrivateKeyString(),
            address: wallet.getAddressString(),
            isAccess: true
        })
    }

    return (
        <div className="show-grid access-container">
            <FlexboxGrid justify="center">
                <Panel shaded>
                    <FlexboxGrid justify="center">
                        <div className="title">ACCESS WALLET KEYSTORED FILE</div>
                    </FlexboxGrid>
                    <FlexboxGrid justify="center">
                        <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                            <div className="text-container">
                                <Form fluid>
                                    <FormGroup>
                                        <FormControl placeholder="Private key*" name="password" type="text" value={privateKey} onChange={setPrivateKey} />
                                    </FormGroup>
                                </Form>
                            </div>
                            <div className="button-container">
                                <Link to="/access-wallet">
                                    <Button appearance="ghost">Back</Button>
                                </Link>
                                <Button appearance="primary" className="submit-buttom" onClick={accessWallet}>Access Now</Button>
                            </div>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Panel>
            </FlexboxGrid>
        </div>
    )
}

export default AccessByPrivateKey;