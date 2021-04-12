import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Panel } from 'rsuite'
import * as Bip39 from 'bip39';
import { ethers } from "ethers";
import { isLoggedIn, useWalletStorage } from '../../../service';
import {ErrMessage, Button, ErrorMessage} from '../../../common';
import { useRecoilValue } from 'recoil';
import walletState from '../../../atom/wallet.atom';
import CreateNewPassword from '../CreateNewPassword';

const AccessByMnemonicPhrase = () => {

    const history = useHistory()
    const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false);
    const [wordPhrase, setWordPhrase] = useState('');
    const [wordPhraseErr, setWordPhraseErr] = useState('')
    const setWalletStored = useWalletStorage(() => history.push('/wallet/dashboard'))[1]

    const walletLocalState: WalletState = useRecoilValue(walletState);

    const [createNewPassCode, setCreateNewPassCode] = useState(true)

    useEffect(() => {
        if (isLoggedIn()) {
            history.push("/wallet/dashboard")
        }
    }, [history])

    const validateWordPhrase = (value: string): boolean => {
        if (!value) {
            setWordPhraseErr(ErrorMessage.Require);
            return false
        }
        const mnemonicValid = Bip39.validateMnemonic(value.trim());

        if (value && !mnemonicValid) {
            setWordPhraseErr(ErrorMessage.MnemonicPhraseInvalid);
            return false
        }
        setWordPhraseErr('');
        return true
    }

    const accessWallet = async () => {
        if (!validateWordPhrase(wordPhrase)) {
            return
        }
        setLoadingBtnSubmit(true)
        try {
            const wallet = ethers.Wallet.fromMnemonic(wordPhrase.trim());
            const privateKey = wallet.privateKey;
            const addressStr = wallet.address;
            const storedWallet = {
                privatekey: privateKey,
                address: addressStr,
                isAccess: true
            }
            setWalletStored(storedWallet, walletLocalState.password);
        } catch (error) {
            Alert.error("Access wallet failed. Something wrong! Please try again.")
            setLoadingBtnSubmit(false)
        }
    }
    return (
        <div className="show-grid access-mnemonic-container">
            {
                createNewPassCode ? <CreateNewPassword show={createNewPassCode} setShow={setCreateNewPassCode} /> :
                (
                    <FlexboxGrid justify="center" className="wrap">
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={10} sm={20} xs={24}>
                            <Panel shaded>
                                <FlexboxGrid justify="start">
                                    <h3 className="color-white">ACCESS WALLET</h3>
                                </FlexboxGrid>
                                <FlexboxGrid justify="center">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ padding: 0 }}>
                                        <Form fluid>
                                            <FormGroup>
                                                <ControlLabel className="color-white">Enter your secret 12 or 24 words phrase (required)</ControlLabel>
                                                <FormControl
                                                    rows={5}
                                                    name="textarea"
                                                    className="input"
                                                    style={{ border: 'none' }}
                                                    componentClass="textarea"
                                                    placeholder="Separate each word with a single space"
                                                    value={wordPhrase}
                                                    onChange={(value) => {
                                                        setWordPhrase(value);
                                                        validateWordPhrase(value)
                                                    }}
                                                />
                                                <ErrMessage message={wordPhraseErr} />
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
                )
            }
        </div>
    )
}

export default AccessByMnemonicPhrase;