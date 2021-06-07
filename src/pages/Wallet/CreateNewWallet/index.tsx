import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Panel } from 'rsuite';
import { isLoggedIn } from '../../../service';
import './createWallet.css'
import { useTranslation } from 'react-i18next';

const CreateNewWallet = () => {
    let history = useHistory();
    const { t } = useTranslation()
    useEffect(() => {
        if (isLoggedIn()) {
            history.push("/wallet/dashboard")
        }
    }, [history])
    
    return (
        <div className="create-wallet-container">
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={6}>
                    <div className="panel-container private-key">
                        <Panel shaded onClick={() => { history.push('/create-private-key') }}>
                            <div className="title">{t('createWalletByPrivateKey.createWithPrivateKey')}</div>
                            <div className="icon">
                                <Icon icon="key" size="lg" />
                            </div>
                            <div>{t('createWalletByPrivateKey.generate')}</div>
                            <div>{t('createWalletByPrivateKey.rememberToSave')}</div>
                            <div className="move-next-step">Go &nbsp;<Icon icon="arrow-circle-o-right" /></div>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={6}>
                    <div className="panel-container keystore-file">
                        <Panel shaded onClick={() => { history.push('/create-keystore-file') }}>
                            <div className="title">{t('createWalletByKeystoreFile.title')}</div>
                            <div className="icon">
                                <Icon icon="file-download" size="lg" />
                            </div>
                            <div>{t('createWalletByKeystoreFile.content')}</div>
                            <div className="move-next-step">Go &nbsp;<Icon icon="arrow-circle-o-right" /></div>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={6}>
                    <div className="panel-container mnemonic-phrase">
                        <Panel shaded onClick={() => { history.push('/create-mnemonic-phrase') }}>
                            <div className="title">{t('createWalletByMnemonic.title')}</div>
                            <div className="icon">
                                <Icon icon="paragraph" size="lg" />
                            </div>
                            <div>{t('createWalletByMnemonic.content')}</div>
                            <div className="move-next-step">Go &nbsp;<Icon icon="arrow-circle-o-right" /></div>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <div style={{textAlign: 'center'}}>
                <span className="color-white">{t('alreadyHave')}</span>
                <Link to="/access-wallet" className="orange-highlight" style={{ fontWeight: 600 }}> {t('accessNow')}</Link>
            </div>
        </div>
    );
}


export default CreateNewWallet;