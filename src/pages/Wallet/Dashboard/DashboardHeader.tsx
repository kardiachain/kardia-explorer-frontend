import React, { useEffect, useState } from 'react'
import { Alert, Col, Icon, Modal, Panel, Row } from 'rsuite';
import { weiToKAI } from '../../../common/utils/amount';
import { copyToClipboard, renderHashString } from '../../../common/utils/string';
import { getBalance } from '../../../service/kai-explorer';
import { getAccount } from '../../../service/wallet';
import './dashboard.css';
import QRCode from 'qrcode.react';

const DashboardHeader = () => {
    const account: Account = getAccount()
    const [balance, setBalance] = useState(0)
    const [showAddress, setShowAddress] = useState(false)
    const [showPrivateKey, setShowPrivateKey] = useState(false)

    useEffect(() => {
        getBalance(account.publickey).then(setBalance);
    }, [account])

    const onSuccess = () => {
        Alert.success('Copied to clipboard.')
    }

    const reloadBalance = () => {
        getBalance(account.publickey).then(setBalance);
    }

    return (
        <>
            <Row className="wallet-header-container">
                <Col md={12} sm={24} xs={24}>
                    <Panel shaded bordered className="wallet-info-card address">
                        <div className="title"><Icon className="icon" icon="views-authorize" />Address</div>
                        <div className="content">
                            <div style={{ wordBreak: 'break-all' }}>{account.publickey}</div>
                            <div className="action">
                                <Icon icon="qrcode" size="lg" onClick={() => {setShowAddress(true)}} />
                                <Icon icon="copy" size="lg" onClick={() => copyToClipboard(account.publickey, onSuccess)} />
                                <Icon icon="lock" size="lg" onClick={() => {setShowPrivateKey(true)}}/>
                            </div>
                        </div>
                    </Panel>
                </Col>
                <Col md={12} sm={24} xs={24}>
                    <Panel shaded bordered className="wallet-info-card balance">
                        <div className="title"><Icon className="icon" icon="money" />Balance</div>
                        <div className="content">
                            <div>{weiToKAI(balance)} <span style={{fontWeight: 'bold'}}>KAI</span></div>
                        </div>
                        <div className="action">
                            <Icon icon="refresh2" onClick={reloadBalance}>&nbsp;&nbsp;Reload balance</Icon>
                        </div>
                    </Panel>
                </Col>
            </Row>
            {/* Modal show wallet address */}
            <Modal size="sm" show={showAddress} onHide={() => { setShowAddress(false) }}>
                <Modal.Header>
                    <Modal.Title>Your Wallet Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'center' }}>
                        <QRCode
                            id='qrcode'
                            value={account.publickey}
                            size={200}
                            includeMargin={true}
                        />
                        <div style={{ fontSize: '18px' }}>{account.publickey}</div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            {/* Modal show private key */}
            <Modal size="sm" show={showPrivateKey} onHide={() => { setShowPrivateKey(false) }}>
                <Modal.Header>
                    <Modal.Title>Your Private Key</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ textAlign: 'center', wordBreak: 'break-all' }}>
                        <QRCode
                            id='qrcode'
                            value={account.privatekey}
                            size={200}
                            includeMargin={true}
                        />
                        <div style={{ fontSize: '18px', wordBreak: 'break-all' }}>{renderHashString(account.privatekey, 70)}</div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DashboardHeader;