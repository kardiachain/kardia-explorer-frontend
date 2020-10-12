import  React, { useState } from 'react';
import { Col, FlexboxGrid, Nav, Panel } from 'rsuite';
import CreateByKeystore from './CreateByKeystore';
import CreateByMnemonic from './CreateByMnemonic';
import CreateByPrivateKey from './CreateByPrivateKey';
import './createWallet.css'

const CreateWalletOption = (props: any) => {
    return props.type === 'privatekey' ? (
            <CreateByPrivateKey />
        ) : props.type === 'keystore' ? (
            <CreateByKeystore />
        ) : (
            <CreateByMnemonic />
        )
}

const CreateNewWallet = () => {
    const [activeKey, setActiveKey] = useState("privatekey");
    return (
        <div className="create-wallet-container">
            <div className="show-grid">
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={14}>
                        <Panel shaded>
                            <Nav appearance="tabs" justified onSelect={setActiveKey}  >
                                <Nav.Item eventKey="privatekey" active={ activeKey === "privatekey" }>Create by private key</Nav.Item>
                                <Nav.Item eventKey="keystore" active={ activeKey === "keystore" }>Create by keystore file</Nav.Item>
                                <Nav.Item eventKey="mnemonic" active={ activeKey === "mnemonic" }>Create by mnemonic</Nav.Item>
                            </Nav>
                            <div className="child-tab">
                                <CreateWalletOption type={activeKey} />
                            </div>
                        </Panel>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        </div>
    );
}


export default CreateNewWallet;