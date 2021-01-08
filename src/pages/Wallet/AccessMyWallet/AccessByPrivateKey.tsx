import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Form, FormControl, FormGroup, Panel, Alert } from 'rsuite';
import { useWalletStorage } from '../../../service/wallet';
import Wallet from 'ethereumjs-wallet'
import * as EthUtil from 'ethereumjs-util'
import './accessWallet.css'
import ErrMessage from '../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../common/constant/Message';
import { privateKeyValid } from '../../../common/utils/validate';
import Button from '../../../common/components/Button';
import { ControlLabel } from 'rsuite';

const AccessByPrivateKey = () => {
    let history = useHistory();
    const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false)
    const [privateKey, setPrivateKey] = useState('');
    const [privateKeyErr, setPrivateKeyErr] = useState('')
    const setWalletStored = useWalletStorage(() => history.push('/wallet/dashboard'))[1];

    const accessWallet = () => {
        if (!validatePrivatekey(privateKey)){
            return;
        } 
        setLoadingBtnSubmit(true)
        try {
            const _privateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
            const privateKeyBuffer = EthUtil.toBuffer(_privateKey);
            const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
            setWalletStored({
                privatekey: wallet.getPrivateKeyString(),
                address: wallet.getChecksumAddressString(),
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
            <FlexboxGrid justify="center" className="wrap">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={20} xs={24}>
                    <Panel shaded className="panel-bg-gray">
                        <FlexboxGrid justify="start">
                            <h3 className="color-white">ACCESS WALLET</h3>
                        </FlexboxGrid>
                        <FlexboxGrid justify="center">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{padding:0}}>
                                <Form fluid>
                                    <FormGroup>
                                        <ControlLabel className="color-white">Private Key (required)</ControlLabel>
                                        <FormControl placeholder="Ex. 0x..."
                                            name="password"
                                            type="password"
                                            className="input"
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
                                        <Button size="big" className="kai-button-gray" >Back</Button>
                                    </Link>
                                    <Button className="btn-access" loading={loadingBtnSubmit} size="big" onClick={accessWallet}>Access Now</Button>
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