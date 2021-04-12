import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Panel, Icon } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import { isLoggedIn } from '../../service';
import './wallet.css';

const Wallet = () => {
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
                                            isMobile ? <h3>Create a new wallet</h3> : <h2>Create a new wallet</h2>
                                        }
                                        <p>Our user-friendly application will enable wallet creation and user's interaction with Kardiachain</p>
                                        <div className="move">Get Started &nbsp;&nbsp;&nbsp; <Icon icon="long-arrow-right" /></div>
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
                                            isMobile ? <h3>Access my wallet</h3> : <h2>Access my wallet</h2>
                                        }
                                        <p>Send your KAI and interact with Kardiachain blockchain platform</p>
                                        <div className="move">Access Now &nbsp;&nbsp;&nbsp; <Icon icon="long-arrow-right" /></div>
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