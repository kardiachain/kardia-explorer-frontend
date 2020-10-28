import React, { useEffect, useState } from 'react'
import { Alert, Col, Icon, Panel, Row } from 'rsuite';
import { weiToKAI } from '../../../common/utils/amount';
import { copyToClipboard } from '../../../common/utils/string';
import { getBalance } from '../../../service/kai-explorer';
import { getAccount } from '../../../service/wallet';
import './dashboard.css';

const DashboardHeader = () => {
    const account: Account = getAccount()
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        getBalance(account.publickey).then(setBalance);
    }, [account])

    const onSuccess = () => {
        Alert.success('Copied to clipboard.')
    }

    return (
        <Row className="wallet-header-container">
            <Col md={12} sm={24} xs={24}>
                <Panel shaded bordered className="wallet-info-card address">
                    <div className="title"><Icon className="icon" icon="views-authorize" />Address</div>
                    <div className="content">
                        <div style={{ wordBreak: 'break-all' }}>{account.publickey}</div>
                        <div className="action">
                            <Icon icon="qrcode" size="lg" />
                            <Icon icon="copy" size="lg" onClick={() => copyToClipboard(account.publickey, onSuccess)} />
                            <Icon icon="print" size="lg" />
                        </div>
                    </div>
                </Panel>
            </Col>
            <Col md={12} sm={24} xs={24}>
                <Panel shaded bordered className="wallet-info-card balance">
                    <div className="title"><Icon className="icon" icon="money" />Balance</div>
                    <div className="content">
                        <div>{weiToKAI(balance)} KAI</div>
                    </div>
                    <div className="action">
                        <Icon icon="refresh2">&nbsp;&nbsp;Reload balance</Icon>
                    </div>
                </Panel>
            </Col>
        </Row>
    )
}

export default DashboardHeader;