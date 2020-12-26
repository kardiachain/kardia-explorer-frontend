import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Panel } from 'rsuite'
import Button from '../../../common/components/Button';
import * as Bip39 from 'bip39';
import { hdkey } from 'ethereumjs-wallet'
import { useWalletStorage } from '../../../service/wallet';
import { ErrorMessage } from '../../../common/constant/Message';
import ErrMessage from '../../../common/components/InputErrMessage/InputErrMessage';

const AccessByMnemonicPhrase = () => {

    const history = useHistory()
    const [loadingBtnSubmit, setLoadingBtnSubmit] = useState(false);
    const [wordPhrase, setWordPhrase] = useState('');
    const [wordPhraseErr, setWordPhraseErr] = useState('')
    const setWalletStored = useWalletStorage(() => history.push('/wallet/dashboard'))[1]

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
            const seed = await Bip39.mnemonicToSeed(wordPhrase.trim())
            const root = hdkey.fromMasterSeed(seed)
            const masterWallet = root.getWallet()
            const privateKey = masterWallet.getPrivateKeyString();
            const addressStr = masterWallet.getAddressString();
            const storedWallet = {
                privatekey: privateKey,
                address: addressStr,
                isAccess: true
            }
            setWalletStored(storedWallet);
        } catch (error) {
            Alert.error("Access wallet failed. Something wrong! Please try again.")
            return false
        }
        setLoadingBtnSubmit(false)
    }
    return (
        <div className="show-grid access-mnemonic-container">
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={20} xs={24}>
                    <Panel shaded>
                        <FlexboxGrid justify="center">
                            <div className="title">ACCESS WALLET BY MNEMONIC PHARSE</div>
                        </FlexboxGrid>
                        <FlexboxGrid justify="center">
                            <FlexboxGrid.Item componentClass={Col} colspan={22} md={24}>
                                <Form fluid>
                                    <FormGroup>
                                        <ControlLabel>Enter your secret twelve or twenty-four words phrase here to access your wallet <span className="required-mask">(*)</span></ControlLabel>
                                        <FormControl
                                            rows={5}
                                            name="textarea"
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
                                    <Button loading={loadingBtnSubmit} size="big" onClick={accessWallet}>Access Now</Button>
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default AccessByMnemonicPhrase;