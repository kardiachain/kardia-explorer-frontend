import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Col, FlexboxGrid, Panel, Icon } from 'rsuite';
import languageAtom from '../../atom/language.atom';
import { getLanguageString } from '../../common/utils/lang';
import { useViewport } from '../../context/ViewportContext';
import { isLoggedIn } from '../../service/wallet';
import './wallet.css';

const Wallet = () => {
    let history = useHistory();
    const { isMobile } = useViewport()
    const language = useRecoilValue(languageAtom)

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
                                            isMobile ? <h3>{getLanguageString(language, 'CREATE_A_NEW_WALLET', 'TEXT')}</h3> : <h2>{getLanguageString(language, 'CREATE_A_NEW_WALLET', 'TEXT')}</h2>
                                        }
                                        <p>{getLanguageString(language, 'CREATE_A_NEW_WALLET_DES', 'DESCRIPTION')}</p>
                                        <div className="move">{getLanguageString(language, 'GET_STARTED', 'BUTTON')} &nbsp;&nbsp;&nbsp; <Icon icon="long-arrow-right" /></div>
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
                                            isMobile ? <h3>{getLanguageString(language, 'ACCESS_MY_WALLET', 'TEXT')}</h3> : <h2>{getLanguageString(language, 'ACCESS_MY_WALLET', 'TEXT')}</h2>
                                        }
                                        <p>{getLanguageString(language, 'ACCESS_MY_WALLET_DES', 'DESCRIPTION')}</p>
                                        <div className="move">{getLanguageString(language, 'ACCESS_NOW', 'BUTTON')} &nbsp;&nbsp;&nbsp; <Icon icon="long-arrow-right" /></div>
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