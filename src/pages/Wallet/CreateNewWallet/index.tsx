import  React, { useState } from 'react';
import { Col, FlexboxGrid, Nav, Panel } from 'rsuite';
import CreateByKeystore from './CreateByKeystore';
import CreateByMnemonicPhrase from './CreateByMnemonicPhrase';
import CreateByPrivateKey from './CreateByPrivateKey';
import './createWallet.css'

const CreateNewWallet = () => {

    const [activeKey, setActiveKey] = useState("private-key");


    return (
        <div className="create-wallet-container">
            <div className="show-grid">
                <FlexboxGrid justify="center">
                    <FlexboxGrid.Item componentClass={Col} colspan={22} md={14}>
                        <Panel shaded>
                            <Nav appearance="tabs" justified onSelect={setActiveKey}  >
                                <Nav.Item eventKey="private-key" active={ activeKey === "private-key" ? true : false}>Create by private key</Nav.Item>
                                <Nav.Item eventKey="keystore" active={ activeKey === "keystore" ? true : false}>Create by keystore file</Nav.Item>
                                <Nav.Item eventKey="mnemonic" active={ activeKey === "mnemonic" ? true : false}>Create by mnemonic phrase</Nav.Item>
                            </Nav>
                            <div className="child-tab">
                                {
                                    activeKey === "private-key" ? <CreateByPrivateKey /> : activeKey === "keystore" ? <CreateByKeystore /> : <CreateByMnemonicPhrase />
                                }
                            </div>
                        </Panel>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        </div>
    );
}


export default CreateNewWallet;