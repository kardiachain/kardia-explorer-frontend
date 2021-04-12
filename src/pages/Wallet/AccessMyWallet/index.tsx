import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Panel, Button } from 'rsuite';
import { isLoggedIn } from '../../../service';
import WalletExtensionConnect from './WalletExtensionConnect';

const AccessMyWallet = () => {
    let history = useHistory();
    useEffect(() => {
        if (isLoggedIn()) {
            history.push("/wallet/dashboard")
        }
    }, [history])

    return (
        <div className="access-wallet-container">
            <FlexboxGrid justify="center" align="middle" className="wrap">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={20} xs={24}>
                    <Panel className="shadow">
                        <h2 className="title" style={{marginBottom: 20}}>Access wallet</h2>
                        <div className="panel-body">
                            <WalletExtensionConnect />
                            <hr/>
                            <Button size="lg" block onClick={() => { history.push('/access-private-key') }}>
                                <Icon size={"lg"} icon="unlock-alt" style={{ color: 'white' }} />Private Key
                                </Button>
                            <Button size="lg" block onClick={() => { history.push('/access-keystore') }}>
                                <Icon size={"lg"} icon="file-code-o" style={{ color: 'white' }} />Keystore File
                                </Button>
                            <Button size="lg" block onClick={() => { history.push('./access-mnemonic-phrase') }}>
                                <Icon size={"lg"} icon="list" style={{ color: 'white' }} />Mnemonic Phrase
                                </Button>
                        </div>
                        <hr />
                        <div style={{ color: 'white' }} className="text-link">
                            Do not have a wallet? <Link to="/create-wallet" className="creatOne"> Create one</Link>
                        </div>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    );
}

export default AccessMyWallet;