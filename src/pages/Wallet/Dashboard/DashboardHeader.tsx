import React, { useEffect, useState } from 'react'
import { ButtonGroup, Col, Icon, IconButton, Message, Modal, Panel, Row, SelectPicker } from 'rsuite';
import { convertValueFollowDecimal, weiToKAI, copyToClipboard, numberFormat, onSuccess, toFraction, fractionAdd, toFixed } from '../../../common';
import { getAccount, useBalanceStorage, isExtensionWallet, getHolderAccount, getValidatorByDelegator, getTokens } from '../../../service';
import './dashboard.css';
import QRCode from 'qrcode.react';
import { TIME_INTERVAL_MILISECONDS } from '../../../config';
import { useRecoilValue } from 'recoil';
import walletState from '../../../atom/wallet.atom';

const DashboardHeader = () => {
    const account: Account = getAccount()
    const [showAddress, setShowAddress] = useState(false)
    const [showPrivateKey, setShowPrivateKey] = useState(false)
    const [hidePrivKey, setHidePrivKey] = useState(true)
    const [balance, setBalance] = useBalanceStorage()
    const walletLocalState = useRecoilValue(walletState)
    const [tokens, setTokens] = useState([]);
    const [yourStakedAmount, setYourStakedAmount] = useState('0')

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

    useEffect(() => {
        if (!account.publickey) {
            return;
        }
        calculateTotalStaked(account.publickey)

        // eslint-disable-next-line
    }, [account.publickey])

    useEffect(() => {
        (async () => {
            if (!account.publickey) {
                return;
            }
            const listTokens = await getTokens(account.publickey)
            setTokens(listTokens.tokens);
        })();

    }, [account.publickey])

    const calculateTotalStaked = async (addr: string) => {
        if (!addr) {
            return;
        }
        const validator = await getValidatorByDelegator(account.publickey);
        let totalStaked = toFraction('0')
        if (validator && validator.length > 0) {
            validator.forEach((item: YourValidator) => {
                if (item.yourStakeAmount && item.yourStakeAmount !== '0') {
                    totalStaked = fractionAdd(totalStaked, toFraction(String(item.yourStakeAmount)))
                }
                if (item.unbondedAmount && item.unbondedAmount !== '0') {
                    totalStaked = fractionAdd(totalStaked, toFraction(String(item.unbondedAmount)))
                }
                if (item.withdrawableAmount && item.withdrawableAmount !== '0') {
                    totalStaked = fractionAdd(totalStaked, toFraction(String(item.withdrawableAmount)))
                }
            });
        }
        setYourStakedAmount(toFixed(totalStaked))
    }


    const reloadBalance = async () => {
        if (!account.publickey) {
            return;
        }
        const holder = await getHolderAccount(account.publickey);
        setBalance(weiToKAI(holder.balance));
        calculateTotalStaked(account.publickey)
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
            onSuccess()
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
                            <div className="title color-white"><Icon className="icon gray-highlight" icon="views-authorize" />Address</div>
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
                        <div className="card-body balanceSection">
                            <div>
                                <div className="title color-white"><Icon className="icon gray-highlight" icon="money" />Balance</div>
                                <div className="content color-white" style={{ paddingLeft: '42px' }}>
                                    <span style={{marginRight: 5}}>Available:</span>
                                    <span style={{ fontWeight: 'bold' }}>{numberFormat(balance)}</span> KAI
                                </div>
                                <div className="content color-white" style={{ paddingLeft: '42px' }}>
                                    <span style={{marginRight: 5}}>Staking:</span>
                                    <span style={{ fontWeight: 'bold' }}>{numberFormat(weiToKAI(yourStakedAmount))}</span> KAI
                                </div>
                            </div>

                            {tokens != null && tokens.length > 0 ? <SelectPicker
                                placeholder="Your KRC20 token"
                                className="dropdown-custom balanceSelect"
                                data={tokens}
                                virtualized={false}
                                renderMenuItem={(label, item: any) => {
                                    return (
                                        <div className="rowToken">
                                            <div className="flex">
                                                <img src={item.logo} alt="logo" width="12px" height="12px" style={{ marginRight: '4px' }} />
                                                <p>{item.tokenSymbol}</p>
                                            </div>
                                            <span>{numberFormat(convertValueFollowDecimal(item.balance, item.tokenDecimals), 4)}</span>
                                        </div>
                                    );
                                }}
                            />
                                : <></>
                            }
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