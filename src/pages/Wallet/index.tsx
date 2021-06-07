import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Panel, Icon } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import { isLoggedIn } from '../../service';
import './wallet.css';
import { useTranslation } from 'react-i18next';

const Wallet = () => {
    const { t } = useTranslation()

    let history = useHistory();
    const { isMobile } = useViewport()

    useEffect(() => {
        if (isLoggedIn()) {
            history.push("/wallet/dashboard")
        }
    }, [history])

    return (
        <div className="wallet-container" style={{ marginTop: isMobile ? 40 : 80 }}>
            <div className="show-grid">
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={9} sm={24}>
                        <div className="panel-container create">
                            <Panel shaded onClick={() => { history.push('/create-wallet') }}>
                                <FlexboxGrid justify="center">
                                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={24} className="text-container">
                                        <div className="icon-container">
                                            <Icon icon="cogs" size="lg" />
                                        </div>
                                        {
                                            isMobile ? <h3>{t('createANewWallet')}</h3> : <h2>{t('createANewWallet')}</h2>
                                        }
                                        <p>{t('createANewWalletContent')}</p>
                                        <div className="move">{t('getStarted')} &nbsp;&nbsp;&nbsp; <Icon icon="long-arrow-right" /></div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </Panel>
                        </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={9} sm={24}>
                        <div className="panel-container access">
                            <Panel shaded onClick={() => { history.push('/access-wallet') }}>
                                <FlexboxGrid justify="center">
                                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={24} className="text-container">
                                        <div className="icon-container">
                                            <Icon icon="character-area" size="lg" />
                                        </div>
                                        {
                                            isMobile ? <h3>{t('accessMyWallet')}</h3> : <h2>{t('accessMyWallet')}</h2>
                                        }
                                        <p>{t('accessMyWalletContent')}</p>
                                        <div className="move">{t('getStarted')} &nbsp;&nbsp;&nbsp; <Icon icon="long-arrow-right" /></div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </Panel>
                        </div>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        </div>
    )
}

export default Wallet;