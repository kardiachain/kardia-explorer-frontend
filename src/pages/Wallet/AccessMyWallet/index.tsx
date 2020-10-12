import React, { useState } from 'react';
import { Col, FlexboxGrid, Nav, Panel } from 'rsuite';
import AccessByKeyStore from './AccessByKeyStore';
import AccessByMnemonicPhrase from './AccessByMnemonic';
import AccessByPrivateKey from './AccessByPrivateKey';

const AccessWalletOption = (props: any) => {
    return props.type === 'privatekey' ? (
            <AccessByPrivateKey />
        ) : props.type === 'keystore' ? (
            <AccessByKeyStore />
        ) : (
            <AccessByMnemonicPhrase />
        )
}

const AccessMyWallet = () => {
    const [activeKey, setActiveKey] = useState("privatekey");
    return (
        <div className="create-wallet-container">
            <div className="show-grid">
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={14}>
                        <Panel shaded>
                            <Nav appearance="tabs" justified onSelect={setActiveKey}  >
                                <Nav.Item eventKey="privatekey" active={ activeKey === "privatekey" }>Access by private key</Nav.Item>
                                <Nav.Item eventKey="keystore" active={ activeKey === "keystore" }>Access by keystore file</Nav.Item>
                                <Nav.Item eventKey="mnemonic" active={ activeKey === "mnemonic" }>Access by mnemonic</Nav.Item>
                            </Nav>
                            <div className="child-tab">
                                <AccessWalletOption type={activeKey} />
                            </div>
                        </Panel>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        </div>
    );
}

export default AccessMyWallet;