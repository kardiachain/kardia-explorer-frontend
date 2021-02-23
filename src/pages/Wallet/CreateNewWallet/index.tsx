import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Col, FlexboxGrid, Icon, Panel } from 'rsuite';
import languageAtom from '../../../atom/language.atom';
import { getLanguageString } from '../../../common/utils/lang';
import { isLoggedIn } from '../../../service/wallet';
import './createWallet.css'

const CreateNewWallet = () => {
    let history = useHistory();
    const language = useRecoilValue(languageAtom)

    useEffect(() => {
        if (isLoggedIn()) {
            history.push("/wallet/dashboard")
        }
    }, [history])
    
    return (
        <div className="create-wallet-container">
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={6}>
                    <div className="panel-container private-key">
                        <Panel shaded onClick={() => { history.push('/create-private-key') }}>
                            <div className="title">{getLanguageString(language, 'CREATE_WITH_PRIVATE_KEY', 'TEXT')}</div>
                            <div className="icon">
                                <Icon icon="key" size="lg" />
                            </div>
                            <div>{getLanguageString(language, 'CREATE_WITH_PRIVATE_KEY_DES_P1', 'DESCRIPTION')}</div>
                            <div>{getLanguageString(language, 'CREATE_WITH_PRIVATE_KEY_DES_P2', 'DESCRIPTION')}</div>
                            <div className="move-next-step">{getLanguageString(language, 'GO', 'BUTTON')} &nbsp;<Icon icon="arrow-circle-o-right" /></div>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={6}>
                    <div className="panel-container keystore-file">
                        <Panel shaded onClick={() => { history.push('/create-keystore-file') }}>
                            <div className="title">{getLanguageString(language, 'CREATE_WITH_KEYSTORED_FILE', 'TEXT')}</div>
                            <div className="icon">
                                <Icon icon="file-download" size="lg" />
                            </div>
                            <div>{getLanguageString(language, 'CREATE_WITH_KEYSTORED_FILE_DES', 'DESCRIPTION')}</div>
                            <div className="move-next-step">{getLanguageString(language, 'GO', 'BUTTON')} &nbsp;<Icon icon="arrow-circle-o-right" /></div>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={22} md={6}>
                    <div className="panel-container mnemonic-phrase">
                        <Panel shaded onClick={() => { history.push('/create-mnemonic-phrase') }}>
                            <div className="title">{getLanguageString(language, 'CREATE_WITH_MNEMONIC_PHRASE', 'TEXT')}</div>
                            <div className="icon">
                                <Icon icon="paragraph" size="lg" />
                            </div>
                            <div>{getLanguageString(language, 'CREATE_WITH_MNEMONIC_PHRASE_DES', 'DESCRIPTION')}</div>
                            <div className="move-next-step">{getLanguageString(language, 'GO', 'BUTTON')} &nbsp;<Icon icon="arrow-circle-o-right" /></div>
                        </Panel>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <div style={{textAlign: 'center'}}>
                <span className="color-white">{getLanguageString(language, 'YOU_ALREADY_HAVE_WALLET', 'TEXT')} </span>
                <Link to="/access-wallet" className="orange-highlight" style={{ fontWeight: 600 }}> {getLanguageString(language, 'ACCESS_NOW', 'BUTTON')}.</Link>
            </div>
        </div>
    );
}

export default CreateNewWallet;