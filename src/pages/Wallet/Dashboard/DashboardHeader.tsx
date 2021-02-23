import React, { useEffect, useState } from 'react'
import { Alert, ButtonGroup, Col, Icon, IconButton, Message, Modal, Panel, Row } from 'rsuite';
import { weiToKAI } from '../../../common/utils/amount';
import { copyToClipboard } from '../../../common/utils/string';
import { getHolderAccount } from '../../../service/kai-explorer';
import { getAccount, useBalanceStorage, isExtensionWallet } from '../../../service/wallet';
import './dashboard.css';
import QRCode from 'qrcode.react';
import { numberFormat } from '../../../common/utils/number';
import { TIME_INTERVAL_MILISECONDS } from '../../../config/api';
import { useRecoilValue } from 'recoil';
import walletState from '../../../atom/wallet.atom';
import languageAtom from '../../../atom/language.atom';
import { getLanguageString } from '../../../common/utils/lang';

const DashboardHeader = () => {
    const account: Account = getAccount()
    const [showAddress, setShowAddress] = useState(false)
    const [showPrivateKey, setShowPrivateKey] = useState(false)
    const [hidePrivKey, setHidePrivKey] = useState(true)
    const [balance, setBalance] = useBalanceStorage()
    const walletLocalState = useRecoilValue(walletState)
    const language = useRecoilValue(languageAtom)
    useEffect(() => {
        (async () => {
            if (!account.publickey) {
                return;
            }
            const holder = await getHolderAccount(account.publickey);
            setBalance(weiToKAI(holder.balance))
        })();

        const fetchBalance = setInterval(async () => {
            if (!account.publickey) {
                return;
            }
            const holder = await getHolderAccount(account.publickey);
            setBalance(weiToKAI(holder.balance))
        }, TIME_INTERVAL_MILISECONDS)

        return () => clearInterval(fetchBalance);
    }, [account.publickey, setBalance])

    const onSuccess = () => {
        Alert.success('Copied to clipboard.')
    }

    const reloadBalance = async () => {
        if (!account.publickey) {
            return;
        }
        const holder = await getHolderAccount(account.publickey);
        setBalance(weiToKAI(holder.balance));
    }

    const renderCredential = () => {
        if (!walletLocalState?.account?.privatekey) return '';
        if (!hidePrivKey) {
            return walletLocalState?.account?.privatekey;
        } else {
            return walletLocalState?.account?.privatekey.split('').map(() => '*').join('');
        }
    }

    const copy = () => {
        copyToClipboard(walletLocalState?.account?.privatekey, () => {
            Alert.success('Copied to clipboard.')
        })
    }

    return (
        <>
            <Row style={{ marginBottom: 12 }}>
                <Col md={24} sm={24} xs={24}>
                    <Message type="warning" description={
                        <>
                            <p>Only send or withdraw KAI Token from the Exchanges support <strong>native KAI Token</strong>.</p>
                            <p><strong>DO NOT</strong> send or withdraw KAI Token from <strong>ERC20 Wallet</strong> to this Wallet. We're <strong>NOT</strong> responsible for any token lost.</p>
                        </>
                    } />
                </Col>
            </Row>
            <Row className="wallet-header-container">
                <Col md={12} sm={24} xs={24}>
                    <Panel shaded className="wallet-info-card address panel-bg-gray">
                        <div className="card-body">
                            <div className="title color-white"><Icon className="icon gray-highlight" icon="views-authorize" />
                                {getLanguageString(language, 'ADDRESS', 'TEXT')}
                            </div>
                            <div className="content color-white" style={{ wordBreak: 'break-all', fontWeight: 'bold', paddingLeft: '42px' }}>{account.publickey}</div>
                        </div>
                        <div className="card-footer">
                            <Icon className="icon" icon="qrcode" size="lg" onClick={() => { setShowAddress(true) }} />
                            <Icon className="icon" icon="copy" size="lg" onClick={() => copyToClipboard(account.publickey, onSuccess)} />

                            {
                                !isExtensionWallet() ? (
                                    <Icon className="icon"
                                        icon="lock"
                                        size="lg"
                                        onClick={() => { setShowPrivateKey(true) }} />
                                ) : <></>
                            }
                        </div>
                    </Panel>
                </Col>
                <Col md={12} sm={24} xs={24}>
                    <Panel shaded className="wallet-info-card balance panel-bg-gray">
                        <div className="card-body">
                            <div className="title color-white"><Icon className="icon gray-highlight" icon="money" />
                                {getLanguageString(language, 'BALANCE', 'TEXT')}
                            </div>
                            <div className="content color-white" style={{ paddingLeft: '42px' }}><span style={{ fontWeight: 'bold' }}>{numberFormat(balance)}</span> KAI</div>
                        </div>
                        <div className="card-footer">
                            <Icon className="icon" icon="refresh2" onClick={reloadBalance} style={{ marginRight: '5px' }} />{getLanguageString(language, 'RELOAD_BALANCE', 'BUTTON')}
                        </div>
                    </Panel>
                </Col>
            </Row>
            {/* Modal show wallet address */}
            <Modal size="sm" show={showAddress} onHide={() => { setShowAddress(false) }}>
                <Modal.Header>
                    <Modal.Title>{getLanguageString(language, 'YOUR_WALLET_ADDRESS', 'TEXT')}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
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
                    <Modal.Title>{getLanguageString(language, 'YOUR_PRIVATE_KEY', 'TEXT')}</Modal.Title>
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