import React, { useEffect, useState } from 'react'
import './sendTxs.css'
import { Panel, Nav } from 'rsuite'
import { getAccount, getTokens } from '../../../../service'
import SendKaiNative from './sendKaiNative'
import SendKrc20Token from './sendKrc20Token'
import { useTranslation } from 'react-i18next';

const SendTransaction = () => {
    const myAccount: Account = getAccount();
    const [activeKey, setActiveKey] = useState('native')

    const [tokens, setTokens] = useState([]);
    const { t } = useTranslation()

    useEffect(() => {
        (async () => {
            if (!myAccount.publickey) {
                return;
            }
            const listTokens = await getTokens(myAccount.publickey)
            setTokens(listTokens.tokens);
        })();
    }, [myAccount.publickey])

    const fetchListKrc20Token = async () => {
        if (!myAccount.publickey) {
            return;
        }
        const listTokens = await getTokens(myAccount.publickey)
        setTokens(listTokens.tokens);
    }

    return (
        <div className="send-txs-container">
            <div style={{ marginBottom: 16 }}>
                <div className="title header-title">
                    {t('dashboard_page.transactions')}
                </div>
            </div>
            <Panel shaded className="panel-bg-gray">


                <div className="custom-nav">
                    <Nav
                        appearance="subtle"
                        activeKey={activeKey}
                        onSelect={(event) => {
                            setActiveKey(event)
                        }}
                        style={{ marginBottom: 20 }}>
                        <Nav.Item eventKey="native">
                            {t('native')}
                        </Nav.Item>
                        <Nav.Item eventKey="krc20">
                            {t('krc20')}
                        </Nav.Item>
                    </Nav>
                </div>
                {
                    (() => {
                        switch (activeKey) {
                            case 'native':
                                return (
                                    <SendKaiNative />
                                );
                            case 'krc20':
                                return (
                                    <SendKrc20Token tokens={tokens} fetchKrc20Token={fetchListKrc20Token} />
                                );
                        }
                    })()
                }
            </Panel>
        </div>
    )
}

export default SendTransaction;