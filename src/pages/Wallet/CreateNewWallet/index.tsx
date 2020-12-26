import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Panel } from 'rsuite';
import './createWallet.css'

const CreateNewWallet = () => {
    let history = useHistory();
    return (
        <div className="create-wallet-container">
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={6}>
                    <div className="panel-container private-key">
                        <Panel shaded onClick={() => { history.push('/create-private-key') }}>
                            <div className="title">CREATE WITH PRIVATE KEY</div>
                            <div className="icon">
                                <Icon icon="key" size="lg" />
                            </div>
                            <div> A unique private key will be generate for you </div>
                            <div>Remember to save your private key! If you lose your private key, you will not able to recover your wallet</div>
                            <div className="move-next-step">Go &nbsp;<Icon icon="arrow-circle-o-right" /></div>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={6}>
                    <div className="panel-container keystore-file">
                        <Panel shaded onClick={() => { history.push('/create-keystore-file') }}>
                            <div className="title">CREATE WITH KEYSTORED FILE</div>
                            <div className="icon">
                                <Icon icon="file-download" size="lg" />
                            </div>
                            <div>You must be DOWNLOAD and SAVE the following Keystore File. You will need it and your password to access your wallet.</div>
                            <div className="move-next-step">Go &nbsp;<Icon icon="arrow-circle-o-right" /></div>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={6}>
                    <div className="panel-container mnemonic-phrase">
                        <Panel shaded onClick={() => { history.push('/create-mnemonic-phrase') }}>
                            <div className="title">CREATE WITH MNEMONIC PHRASE</div>
                            <div className="icon">
                                <Icon icon="paragraph" size="lg" />
                            </div>
                            <div>REMEMBER to save your mnemonic phrase. You will need this to access your wallet</div>
                            <div className="move-next-step">Go &nbsp;<Icon icon="arrow-circle-o-right" /></div>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <div style={{textAlign: 'center'}}>
                <span className="color-white">You already have a wallet. </span>
                <Link to="/access-wallet" className="orange-highlight" style={{ fontWeight: 600 }}> Access Now.</Link>
            </div>
        </div>
    );
}


export default CreateNewWallet;