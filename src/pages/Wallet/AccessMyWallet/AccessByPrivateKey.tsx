import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Button, Col, FlexboxGrid, Form, FormControl, FormGroup, Panel, Alert } from 'rsuite';
import { useWalletStorage } from '../../../service/wallet';
import Wallet from 'ethereumjs-wallet'
import * as EthUtil from 'ethereumjs-util'
import './accessWallet.css'
import ErrMessage from '../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../common/constant/Message';
import { privateKeyValid } from '../../../common/utils/validate';

const AccessByPrivateKey = () => {
    let history = useHistory();
    const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false)
    const [privateKey, setPrivateKey] = useState('');
    const [privateKeyErr, setPrivateKeyErr] = useState('')
    const setWalletStored = useWalletStorage(() => history.push('/wallet/send-transaction'))[1];

    //access wallet
    const accessWallet = () => {
        if (!validatePrivatekey(privateKey)){
            return;
        } 
        setLoadingBtnSubmit(true)
        try {
            const privateKeyBuffer = EthUtil.toBuffer(privateKey);
            const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
            setWalletStored({
                privatekey: wallet.getPrivateKeyString(),
                address: wallet.getAddressString(),
                isAccess: true
            })
            setLoadingBtnSubmit(false)
        } catch (error) {
            setLoadingBtnSubmit(false)
            Alert.error(`Access wallet Error: ${error.message}`);
        }

    }

    const validatePrivatekey = (privKey: string) => {
        if(!privKey) {
            setPrivateKeyErr(ErrorMessage.Require)
            return false
        }
        
        if (!privateKeyValid(privKey)) {
            setPrivateKeyErr(ErrorMessage.PrivateKeyInvalid)
            return false;
        }
        setPrivateKeyErr('')
        return true
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
                                        <FormControl placeholder="Private key*"
                                            name="password"
                                            type="password"
                                            value={privateKey}
                                            onChange={(value) => {
                                                validatePrivatekey(value)
                                                setPrivateKey(value)
                                            }} />
                                            <ErrMessage message={privateKeyErr} />
                                    </FormGroup>
                                </Form>
                                <div className="button-container">
                                    <Link to="/access-wallet">
                                        <Button appearance="ghost" color="violet">Back</Button>
                                    </Link>
                                    <Button loading={loadingBtnSubmit} appearance="primary" color="violet" className="submit-buttom" onClick={accessWallet}>Access Now</Button>
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