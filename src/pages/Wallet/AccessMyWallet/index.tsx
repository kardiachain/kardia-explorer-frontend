import React from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Panel } from 'rsuite';

const AccessMyWallet = () => {
    let history = useHistory();
    return (
        <div className="access-wallet-container">
            <div className="show-grid">
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={6}>
                        <div className="panel-container private-key">
                            <Panel shaded onClick={() => { history.push('/access-private-key') }}>
                                <div className="title">ACCESS BY PRIVATE KEY</div>
                                <div className="icon">
                                    <Icon icon="unlock-alt" size="lg" />
                                </div>
                                <div> You would be input private key to access your wallet</div>
                                <div className="move-next-step">Access &nbsp;<Icon icon="arrow-circle-o-right" /></div>
                            </Panel>
                        </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={6}>
                        <div className="panel-container keystore-file">
                            <Panel shaded onClick={() => {}}>
                                <div className="title">ACCESS BY KEYSTORED FILE</div>
                                <div className="icon">
                                    <Icon icon="file-code-o" size="lg" />
                                </div>
                                <div>You would be provide Keystore File and Password to access your wallet.</div>
                                <div className="move-next-step">Access &nbsp;<Icon icon="arrow-circle-o-right" /></div>
                            </Panel>
                        </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={6}>
                        <div className="panel-container mnemonic-phrase">
                            <Panel shaded>
                                <div className="title">ACCESS BY MNEMONIC PHRASE</div>
                                <div className="icon">
                                    <Icon icon="list" size="lg" />
                                </div>
                                <div>Using mnemonic phrase to access your wallet</div>
                                <div className="move-next-step">Access &nbsp;<Icon icon="arrow-circle-o-right" /></div>
                            </Panel>
                        </div>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        </div>
    );
}

export default AccessMyWallet;