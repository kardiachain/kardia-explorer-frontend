import React from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Panel, Icon, Content } from 'rsuite';
import './wallet.css';

const Wallet = () => {
    let history = useHistory();
    return (
        <div className="wallet-container">
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
                                        <h2>Create a new wallet</h2>
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
                                    <FlexboxGrid.Item componentClass={Col} colspan={22} className="text-container">
                                        <div className="icon-container">
                                            <Icon icon="character-area" size="lg" />
                                        </div>
                                        <h2>Access my wallet</h2>
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