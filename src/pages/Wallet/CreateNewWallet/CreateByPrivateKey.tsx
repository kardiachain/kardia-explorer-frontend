import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Input, InputGroup, Panel } from 'rsuite';
import EtherWallet from 'ethereumjs-wallet'
import './createWallet.css'
import { copyToClipboard, Button, onSuccess } from '../../../common';
import { isLoggedIn } from '../../../service';
import { useTranslation } from 'react-i18next';

const CreateByPrivateKey = () => {
    const { t } = useTranslation()

    const [showPrivKey, setShowPrivKey] = useState(false)
    const [wallet, setWallet] = useState({} as WalletStore)
    let history = useHistory();

    useEffect(() => {
        if (isLoggedIn()) {
            history.push("/wallet/dashboard")
        }
    }, [history])

    const handleGenerate = () => {
        let wallet = EtherWallet.generate();
        setWallet({
            privatekey: wallet.getPrivateKeyString(),
            address: wallet.getChecksumAddressString(),
            isAccess: false,
            externalWallet: false,
        })
    }

    const renderCredential = () => {
        if (showPrivKey) {
            return wallet.privatekey;
        } else {
            return wallet.privatekey.split('').map(() => '*').join('');
        }
    }

    const accessWalletNow = () => {
        history.push('/access-wallet')
    }

    return (
        <div className="show-grid create-container private-key">
            <FlexboxGrid justify="center" className="wrap">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={20} xs={24}>
                    <Panel shaded className="panel-bg-gray">
                        <FlexboxGrid justify="start">
                            <h3 className="color-white">{t('privateKey')}</h3>
                        </FlexboxGrid>
                        {
                            !wallet.privatekey ? (
                                <FlexboxGrid justify="start">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ padding: 0 }}>
                                        <div className="color-white"> {t('aUnique')} </div>
                                        <div className="color-white"> <span className="note">{t('createWalletByPrivateKey.remember')}</span> {t('createWalletByPrivateKey.toSaveYour')} <span className="note">{t('privateKey')}</span>! {t('createWalletByPrivateKey.ifYou')} <span className="note">{t('createWalletByPrivateKey.lose')}</span> {t('createWalletByPrivateKey.yourPrivateKeyYouWill')} <span className="note">{t('createWalletByPrivateKey.not')}</span> {t('createWalletByPrivateKey.beAbleTo')} <span className="note">{t('createWalletByPrivateKey.recover')}</span> {t('createWalletByPrivateKey.yourWallet')}</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginTop: '20px' }}>
                                        <div className="button-container">
                                            <Link to="/create-wallet">
                                                <Button size="big" className="kai-button-gray">{t('back')}</Button>
                                            </Link>
                                            <Button
                                                className="btn-access"
                                                size="big"
                                                onClick={handleGenerate}>
                                                {t('createWallet')}
                                            </Button>
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            ) : (
                                <FlexboxGrid justify="center">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 10, padding: 0 }}>
                                        <div className="color-white"><b>{t('createWalletByPrivateKey.please')} <span className="note">{t('createWalletByPrivateKey.copy')}</span>  {t('createWalletByPrivateKey.and')} <span className="note">{t('createWalletByPrivateKey.save')}</span>  {t('createWalletByPrivateKey.theFollowing')} {t('privateKey')}:</b></div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ padding: 0 }}>
                                        <div style={{ wordBreak: 'break-all' }}>
                                            <InputGroup style={{ width: '100%' }} className="privatekey-input-container">
                                                <Input className="input" value={renderCredential()} />
                                                <InputGroup.Button onClick={() => setShowPrivKey(!showPrivKey)}>
                                                    <Icon icon={showPrivKey ? 'eye-slash' : 'eye'} />
                                                </InputGroup.Button>
                                                <InputGroup.Button onClick={() => copyToClipboard(wallet.privatekey, onSuccess)}>
                                                    <Icon icon="copy" />
                                                </InputGroup.Button>
                                            </InputGroup>
                                        </div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ padding: 0 }}>
                                        <div className="button-container">
                                            <Link to="/create-wallet">
                                                <Button size="big" className="kai-button-gray">{t('back')}</Button>
                                            </Link>
                                            <Button className="btn-access" size="big" onClick={accessWalletNow}>{t('accessNow')}</Button>
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            )
                        }
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default CreateByPrivateKey;