import React, { useEffect, useState } from 'react'
import { Col, FlexboxGrid, Form, FormControl, FormGroup, Icon, Panel } from 'rsuite'
import { ethers } from "ethers";
import { Link, useHistory } from 'react-router-dom';
import './createWallet.css'
import { copyToClipboard, Button, onSuccess } from '../../../common';
import { isLoggedIn } from '../../../service';
import { useTranslation } from 'react-i18next';

const CreateByMnemonic = () => {
    const [mnemonic, setMnemonic] = useState('');
    const [readyAccessNow, setReadyAccessNow] = useState(false)
    let history = useHistory();
    const { t } = useTranslation()

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
                                <h3 className="title color-white">{t('createWalletByMnemonic.mnemonic')}</h3>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                        {
                            readyAccessNow ? (
                                <>
                                    <FlexboxGrid justify="center">
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                            <div style={{ textAlign: 'center', marginTop: 32 }} className="color-white">
                                                <Icon size="lg" className="icon-check" style={{ verticalAlign: 'middle' }} icon='check-circle' /> {t('createWalletByMnemonic.success')}
                                            </div>
                                            <div className="button-container">
                                                <Link to="/create-wallet">
                                                    <Button size="big" className="kai-button-gray">{t('back')}</Button>
                                                </Link>
                                                <Button className="btn-access" size="big" onClick={accessWallet}>{t('accessNow')}</Button>
                                            </div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </>
                            ) : (
                                    <>
                                        <FlexboxGrid justify="center">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} xs={24}>
                                                <div className="color-white" style={{ fontSize: '16px', fontWeight: 'bold' }}>{t('createWalletByMnemonic.12')}</div>
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
                                                            copyToClipboard(mnemonic, onSuccess)
                                                        }}>{t('createWalletByMnemonic.copy')} <Icon icon="copy-o" />
                                                    </Button>
                                                    <Button className="kai-button-gray" onClick={() => randomPhrase()} style={{ marginBottom: 5 }}>
                                                    {t('createWalletByMnemonic.changePhrase')} <Icon icon="refresh" />
                                                    </Button>
                                                </div>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                        <div className="color-white">{t('createWalletByMnemonic.please')} <span className="note">{t('createWalletByMnemonic.writeDown')} </span> {t('and')} <span className="note">{t('save')}</span> {t('createWalletByMnemonic.your')}</div>
                                        <div className="button-container">
                                            <Link to="/create-wallet">
                                                <Button size="big" className="kai-button-gray">{t('back')}</Button>
                                            </Link>
                                            <Button className="btn-access" size="big" onClick={createWallet}>{t('createWallet')}</Button>
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