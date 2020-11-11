import React from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Panel, Button } from 'rsuite';

const AccessMyWallet = () => {
    let history = useHistory();
    return (
        <div className="access-wallet-container">
            <div className="show-grid">
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={20} xs={24}>
                        <Panel header={<div className="header">Access Wallet</div>} shaded>
                            <div className="panel-body">
                                <Button className="access-button" size="lg" block onClick={() => { history.push('/access-private-key') }}>
                                    <Icon icon="unlock-alt" /> By Private Key
                                </Button>
                                <Button className="access-button" size="lg" block onClick={() => { history.push('/access-keystore') }}>
                                    <Icon icon="file-code-o" /> By Keystore File
                                </Button>
                                <Button className="access-button" size="lg" block onClick={() => { history.push('./access-mnemonic-pharse')}}>
                                    <Icon icon="list" /> By Mnemonic Phrase
                                </Button>
                            </div>
                        </Panel>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        </div>
    );
}

export default AccessMyWallet;