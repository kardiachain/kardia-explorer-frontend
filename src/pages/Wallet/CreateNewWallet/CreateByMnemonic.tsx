import React, { useEffect, useState } from 'react'
import { Alert, Col, FlexboxGrid, Form, FormControl, FormGroup, Icon, Panel } from 'rsuite'
import { ethers } from "ethers";
import { Link, useHistory } from 'react-router-dom';
import './createWallet.css'
import Button from '../../../common/components/Button';
import { copyToClipboard } from '../../../common/utils/string';
import { isLoggedIn } from '../../../service/wallet';
import { useRecoilValue } from 'recoil';
import languageAtom from '../../../atom/language.atom';
import { getLanguageString } from '../../../common/utils/lang';

const CreateByMnemonic = () => {
    const [mnemonic, setMnemonic] = useState('');
    const [readyAccessNow, setReadyAccessNow] = useState(false)
    let history = useHistory();
    const language = useRecoilValue(languageAtom)

    useEffect(() => {
        if (isLoggedIn()) {
            history.push("/wallet/dashboard")
        }
    }, [history])

    useEffect(() => {
        randomPhrase();
    }, [])

    const createWallet = () => {
        setReadyAccessNow(true)
    }

    const accessWallet = () => {
        history.push('/access-wallet')

    }

    const randomPhrase = () => {
        const wallet = ethers.Wallet.createRandom();
        setMnemonic(wallet.mnemonic.phrase)
    }

    return (
        <div className="show-grid create-container mnemonic">
            <FlexboxGrid justify="center" className="wrap">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={20} xs={24}>
                    <Panel shaded className="panel-bg-gray">
                        <FlexboxGrid justify="start">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <h3 className="title color-white">{getLanguageString(language, 'MNEMONIC_PHRASE', 'TEXT')}</h3>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                        {
                            readyAccessNow ? (
                                <>
                                    <FlexboxGrid justify="center">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                            <div style={{ textAlign: 'center', marginTop: 32 }} className="color-white">
                                                <Icon size="lg" className="icon-check" style={{ verticalAlign: 'middle' }} icon='check-circle' /> {getLanguageString(language, 'CREATE_WITH_MNEMONIC_PHRASE_SUCCESS', 'DESCRIPTION')}
                                            </div>
                                            <div className="button-container">
                                                <Link to="/create-wallet">
                                                    <Button size="big" className="kai-button-gray">
                                                        {getLanguageString(language, 'BACK', 'BUTTON')}
                                                    </Button>
                                                </Link>
                                                <Button className="btn-access" size="big" onClick={accessWallet}>
                                                    {getLanguageString(language, 'ACCESS_NOW', 'BUTTON')}
                                                </Button>
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </>
                            ) : (
                                    <>
                                        <FlexboxGrid justify="center">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} xs={24}>
                                                <div className="color-white" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                    {getLanguageString(language, 'YOUR_12_MNEMONIC_PHRASE', 'TEXT')}
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                        <FlexboxGrid justify="center">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ padding: 0 }}>
                                                <Form fluid>
                                                    <FormGroup>
                                                        <FormControl
                                                            rows={4}
                                                            name="textarea"
                                                            className="input"
                                                            style={{ border: 'none' }}
                                                            componentClass="textarea"
                                                            value={mnemonic}
                                                            readOnly
                                                        />
                                                    </FormGroup>
                                                </Form>
                                                <div style={{ textAlign: 'right', marginTop: 10 }}>
                                                    <Button className="kai-button-gray" style={{ marginBottom: 5 }}
                                                        onClick={() => {
                                                            const onSuccess = () => {
                                                                Alert.success('Copied to clipboard.')
                                                            }
                                                            copyToClipboard(mnemonic, onSuccess)
                                                        }}>{getLanguageString(language, 'COPY', 'BUTTON')} <Icon icon="copy-o" />
                                                    </Button>
                                                    <Button className="kai-button-gray" onClick={() => randomPhrase()} style={{ marginBottom: 5 }}>
                                                    {getLanguageString(language, 'CHANGE_PHRASE', 'BUTTON')} <Icon icon="refresh" />
                                                    </Button>
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                        <div className="color-white">Please make sure you <span className="note">WROTE DOWN </span> and <span className="note">SAVE</span> your mnemonic phrase. You will need it to access your wallet.</div>
                                        <div className="button-container">
                                            <Link to="/create-wallet">
                                                <Button size="big" className="kai-button-gray">
                                                    {getLanguageString(language, 'BACK', 'BUTTON')}
                                                </Button>
                                            </Link>
                                            <Button className="btn-access" size="big" onClick={createWallet}>
                                                {getLanguageString(language, 'CREATE_WALLET', 'BUTTON')}
                                            </Button>
                                        </div>
                                    </>
                                )
                        }

                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default CreateByMnemonic;