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
    const setWalletStored = useWalletStorage(() => history.push('/dashboard/send-transaction'))[1];

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
        <div className="show-grid access-privatekey-container">
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={20} xs={24}>
                    <Panel shaded>
                        <FlexboxGrid justify="center">
                        <div className="title">ACCESS WALLET BY PRIVATE KEY</div>
                    </FlexboxGrid>
                        <FlexboxGrid justify="center">
                            <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                                    <Form fluid>
                                        <FormGroup>
                                            <FormControl placeholder="Private key*" name="password" type="password" value={privateKey} onChange={setPrivateKey} />
                                        </FormGroup>
                                    </Form>
                                <div className="button-container">
                                    <Link to="/access-wallet">
                                        <Button appearance="ghost" color="violet">Back</Button>
                                    </Link>
                                    <Button appearance="primary" color="violet" className="submit-buttom" onClick={accessWallet}>Access Now</Button>
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default AccessByPrivateKey;