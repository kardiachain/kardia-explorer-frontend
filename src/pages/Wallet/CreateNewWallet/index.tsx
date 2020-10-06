import  React, { useState } from 'react';
import { Col, FlexboxGrid, Icon, Nav, Panel } from 'rsuite';
import CreateByKeystore from './CreateByKeystore';
import CreateByMnemonicPhrase from './CreateByMnemonicPhrase';
import CreateByPrivateKey from './CreateByPrivateKey';
import './createWallet.css'

const CreateNewWallet = () => {

    const [activeKey, setActiveKey] = useState(0);

    const handleSelect = (activeK: any) => {
        setActiveKey(activeK);
    }


    return (
        <React.Fragment>
            <div className="create-wallet-container">
                <div className="show-grid">
                    <FlexboxGrid justify="center">
                        <FlexboxGrid.Item componentClass={Col} colspan={22} md={14}>
                            <Panel shaded>
                                <Nav appearance="tabs" justified onSelect={(eventKey) => handleSelect(eventKey)}  >
                                    <Nav.Item eventKey="0" active={ activeKey == 0 ? true : false}>Create by private key</Nav.Item>
                                    <Nav.Item eventKey="1" active={ activeKey == 1 ? true : false}>Create by keystore file</Nav.Item>
                                    <Nav.Item eventKey="2" active={ activeKey == 2 ? true : false}>Create by mnemonic phrase</Nav.Item>
                                </Nav>
                                <div className="child-tab">
                                    {
                                        activeKey == 0 ? <CreateByPrivateKey /> : activeKey == 1 ? <CreateByKeystore /> : <CreateByMnemonicPhrase />
                                    }
                                </div>
                            </Panel>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </div>
            </div>
        </React.Fragment>
    );
}


export default CreateNewWallet;