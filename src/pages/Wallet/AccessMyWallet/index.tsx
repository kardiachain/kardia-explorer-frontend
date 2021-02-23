import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Col, FlexboxGrid, Icon, Panel, Button } from 'rsuite';
import languageAtom from '../../../atom/language.atom';
import { getLanguageString } from '../../../common/utils/lang';
import { isLoggedIn } from '../../../service/wallet';
import WalletExtensionConnect from './WalletExtensionConnect';

const AccessMyWallet = () => {
    let history = useHistory();
    useEffect(() => {
        if (isLoggedIn()) {
            history.push("/wallet/dashboard")
        }
    }, [history])
    const language = useRecoilValue(languageAtom)

    return (
        <div className="access-wallet-container">
            <FlexboxGrid justify="center" align="middle" className="wrap">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={10} sm={20} xs={24}>
                    <Panel className="shadow">
                        <h2 className="title" style={{marginBottom: 20}}>{getLanguageString(language, 'ACCESS_WALLET', 'TEXT')}</h2>
                        <div className="panel-body">
                            <WalletExtensionConnect />
                            <hr/>
                            <Button size="lg" block onClick={() => { history.push('/access-private-key') }}>
                                <Icon size={"lg"} icon="unlock-alt" style={{ color: 'white' }} />{getLanguageString(language, 'PRIVATE_KEY', 'BUTTON')}
                                </Button>
                            <Button size="lg" block onClick={() => { history.push('/access-keystore') }}>
                                <Icon size={"lg"} icon="file-code-o" style={{ color: 'white' }} />{getLanguageString(language, 'KEYSTORE_FILE', 'BUTTON')}
                                </Button>
                            <Button size="lg" block onClick={() => { history.push('./access-mnemonic-phrase') }}>
                                <Icon size={"lg"} icon="list" style={{ color: 'white' }} />{getLanguageString(language, 'MNEMONIC_PHRASE', 'BUTTON')}
                                </Button>
                        </div>
                        <hr />
                        <div style={{ color: 'white' }} className="text-link">
                            {getLanguageString(language, 'DO_NOT_HAVE_WALLET', 'TEXT')}
                            <Link to="/create-wallet" className="creatOne"> {getLanguageString(language, 'CREATE_ONE', 'BUTTON')}</Link>
                        </div>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    );
}

export default AccessMyWallet;