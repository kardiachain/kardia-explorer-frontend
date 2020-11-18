import React, { useEffect, useState } from 'react'
import { Alert, ButtonGroup, Col, Icon, IconButton, Modal, Panel, Row } from 'rsuite';
import { weiToKAI } from '../../../common/utils/amount';
import { copyToClipboard } from '../../../common/utils/string';
import { getBalance } from '../../../service/kai-explorer';
import { getAccount, useBalanceStorage } from '../../../service/wallet';
import './dashboard.css';
import QRCode from 'qrcode.react';
import { numberFormat } from '../../../common/utils/number';
import { TIME_INTERVAL_MILISECONDS } from '../../../config/api';

const DashboardHeader = () => {
    const account: Account = getAccount()
    const [showAddress, setShowAddress] = useState(false)
    const [showPrivateKey, setShowPrivateKey] = useState(false)
    const [hidePrivKey, setHidePrivKey] = useState(true)
    const [balance, setBalance] = useBalanceStorage()
    useEffect(() => {
        (async() => {
            const balance = await getBalance(account.publickey);
            setBalance(Number(weiToKAI(balance)))
        })();

        const fetchBalance = setInterval(async () => {
            const balance = await getBalance(account.publickey);
            setBalance(Number(weiToKAI(balance)))
        }, TIME_INTERVAL_MILISECONDS)

        return () => clearInterval(fetchBalance);
    }, [account.publickey, setBalance])
    
    const onSuccess = () => {
        Alert.success('Copied to clipboard.')
    }

    const reloadBalance = async () => {
        const balance = await getBalance(account.publickey);
        setBalance(Number(weiToKAI(balance)));
    }

    const renderCredential = () => {
        if (!account.privatekey) return '';
        if (!hidePrivKey) {
            return account.privatekey;
        } else {
            return account.privatekey.split('').map(() => '*').join('');
        }
    }

    const copy = () => {
        copyToClipboard(account.privatekey, () => {
            Alert.success('Copied to clipboard.')
        })
    }

    return (
        <>
            <Row className="wallet-header-container">
                <Col md={12} sm={24} xs={24}>
                    <Panel shaded bordered className="wallet-info-card address">
                        <div className="card-body">
                            <div className="title"><Icon className="icon highlight" icon="views-authorize" />Address</div>
                            <div className="content" style={{ wordBreak: 'break-all', fontWeight: 'bold' }}>{account.publickey}</div>
                        </div>
                        <div className="card-footer">
                            <Icon className="icon" icon="qrcode" size="lg" onClick={() => { setShowAddress(true) }} />
                            <Icon className="icon" icon="copy" size="lg" onClick={() => copyToClipboard(account.publickey, onSuccess)} />
                            <Icon className="icon" icon="lock" size="lg" onClick={() => { setShowPrivateKey(true) }} />
                        </div>
                    </Panel>
                </Col>
                <Col md={12} sm={24} xs={24}>
                    <Panel shaded bordered className="wallet-info-card balance">
                        <div className="card-body">
                            <div className="title"><Icon className="icon highlight" icon="money" />Balance</div>
                            <div className="content"><span style={{ fontWeight: 'bold' }}>{numberFormat(balance)}</span> KAI</div>
                        </div>
                        <div className="card-footer">
                            <Icon className="icon" icon="refresh2" onClick={reloadBalance} style={{ marginRight: '5px' }} />Reload balance
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
                        <div style={{ fontSize: '18px', wordBreak: 'break-all' }}>
                            {renderCredential()}
                        </div>
                        <ButtonGroup>
                            <IconButton
                                style={{ marginRight: 10, borderRadius: 3 }}
                                icon={<Icon icon={hidePrivKey ? 'eye-slash' : 'eye'} />}
                                onClick={() => setHidePrivKey(!hidePrivKey)} />
                            <IconButton
                                style={{ borderRadius: 3 }}
                                icon={<Icon icon="copy" />}
                                onClick={copy} />
                        </ButtonGroup>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DashboardHeader;