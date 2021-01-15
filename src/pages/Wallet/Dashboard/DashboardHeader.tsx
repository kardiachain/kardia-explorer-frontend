import React, { useEffect, useState } from 'react'
import { Alert, ButtonGroup, Col, Icon, IconButton, Message, Modal, Panel, Row } from 'rsuite';
import { weiToKAI } from '../../../common/utils/amount';
import { copyToClipboard } from '../../../common/utils/string';
import { getHolderAccount } from '../../../service/kai-explorer';
import { getAccount, useBalanceStorage, useWalletStorage } from '../../../service/wallet';
import './dashboard.css';
import QRCode from 'qrcode.react';
import { numberFormat } from '../../../common/utils/number';
import { TIME_INTERVAL_MILISECONDS } from '../../../config/api';

const DashboardHeader = () => {
    let account: Account = getAccount()
    const [showAddress, setShowAddress] = useState(false)
    const [showPrivateKey, setShowPrivateKey] = useState(false)
    const [hidePrivKey, setHidePrivKey] = useState(true)
    const [balance, setBalance] = useBalanceStorage()
    const setWalletStored = useWalletStorage()[1];

    // Handle Kardia Extension Wallet change account
    // window.ethereum.on('accountsChanged', (accounts: any) => {
    //     if (accounts && accounts[0]) {
    //         setWalletStored({
    //             privatekey: '',
    //             address: accounts[0],
    //             isAccess: true,
    //             externalWallet: true,
    //             walletType: 'webExtensionWallet'
    //         });
    //     }
    // })

    useEffect(() => {
        (async() => {
            const holder = await getHolderAccount(account.publickey);
            setBalance(weiToKAI(holder.balance))
        })();

        const fetchBalance = setInterval(async () => {
            const holder = await getHolderAccount(account.publickey);
            setBalance(weiToKAI(holder.balance))
        }, TIME_INTERVAL_MILISECONDS)
        
        return () => clearInterval(fetchBalance);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account.publickey])
     
    
    const onSuccess = () => {
        Alert.success('Copied to clipboard.')
    }

    const reloadBalance = async () => {
        const holder = await getHolderAccount(account.publickey);
        setBalance(weiToKAI(holder.balance));
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
            <Row style={{marginBottom: 12}}>
                <Col md={24} sm={24} xs={24}>
                    <Message type="warning" description={
                        <p>Warning: <strong>DO NOT</strong> send KAI Token from <strong>ERC20 Wallet</strong> or <strong>Exchange</strong> to this Wallet. We're <strong>NOT</strong> responsible for any token lost.</p>
                    }/>
                </Col>
            </Row>
            <Row className="wallet-header-container">
                <Col md={12} sm={24} xs={24}>
                    <Panel shaded className="wallet-info-card address panel-bg-gray">
                        <div className="card-body">
                            <div className="title color-white"><Icon className="icon gray-highlight" icon="views-authorize" />Address</div>
                            <div className="content color-white" style={{ wordBreak: 'break-all', fontWeight: 'bold', paddingLeft:'42px' }}>{account.publickey}</div>
                        </div>
                        <div className="card-footer">
                            <Icon className="icon" icon="qrcode" size="lg" onClick={() => { setShowAddress(true) }} />
                            <Icon className="icon" icon="copy" size="lg" onClick={() => copyToClipboard(account.publickey, onSuccess)} />
                            <Icon className="icon" icon="lock" size="lg" onClick={() => { setShowPrivateKey(true) }} />
                        </div>
                    </Panel>
                </Col>
                <Col md={12} sm={24} xs={24}>
                    <Panel shaded className="wallet-info-card balance panel-bg-gray">
                        <div className="card-body">
                            <div className="title color-white"><Icon className="icon gray-highlight" icon="money" />Balance</div>
                            <div className="content color-white" style={{paddingLeft:'42px'}}><span style={{ fontWeight: 'bold' }}>{numberFormat(balance)}</span> KAI</div>
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
                <Modal.Body style={{display:'flex', justifyContent:'center'}}>
                        <QRCode
                            id='qrcode'
                            value={account.publickey}
                            size={300}
                            includeMargin={true}
                        />
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
                        <div className="color-white" style={{ fontSize: '18px', wordBreak: 'break-all' }}>
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