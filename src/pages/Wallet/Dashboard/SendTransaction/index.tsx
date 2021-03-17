import React, { useEffect, useState } from 'react'
import './sendTxs.css'
import { Panel, Form, FormGroup, FormControl, FlexboxGrid, Col, Icon, ControlLabel, Modal, SelectPicker, List, Nav } from 'rsuite'
import { ErrorMessage, InforMessage, NotifiMessage } from '../../../../common/constant/Message'
import { numberFormat } from '../../../../common/utils/number'
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage'
import { addressValid } from '../../../../common/utils/validate'
import { getAccount, generateTx, getStoredBalance, isExtensionWallet } from '../../../../service/wallet'
import Button from '../../../../common/components/Button'
import { gasLimitSendTx, gasPriceOption, gasLimitSendTxKRC20 } from '../../../../common/constant'
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification'
import NumberInputFormat from '../../../../common/components/FormInput'
import { renderHashString } from '../../../../common/utils/string'
import { useRecoilValue } from 'recoil';
import walletState from '../../../../atom/wallet.atom'
import { generateTxForEW, sendKRC20ByExtension } from '../../../../service/extensionWallet'
import { convertValueFollowDecimal, weiToKAI } from '../../../../common/utils/amount'
import { getTokens } from '../../../../service/kai-explorer/transaction'
import kardiaClient from '../../../../plugin/kardia-dx'

const SendTransaction = () => {
    const [amount, setAmount] = useState('')
    const [toAddress, setToAddress] = useState('')
    const [gasLimit, setGasLimit] = useState(gasLimitSendTx)
    const [amountErr, setAmountErr] = useState('')
    const [toAddressErr, setToAddressErr] = useState('')
    const [gasLimitErr, serGasLimitErr] = useState('')
    const myAccount: Account = getAccount();
    const [sendBntLoading, setSendBntLoading] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const [gasPrice, setGasPrice] = useState(1)
    const [gasPriceErr, setGasPriceErr] = useState('')

    const walletLocalState = useRecoilValue(walletState)
    const [activeKey, setActiveKey] = useState('native')


    const validateAmount = (amount: any): boolean => {

        if (!amount) {
            setAmountErr(ErrorMessage.Require)
            return false
        }

        if (Number(amount) <= 0) {
            setAmountErr(ErrorMessage.AmountNotZero)
            return false
        }
        const balance = getStoredBalance();

        if (balance === 0 || balance < Number(amount)) {
            setAmountErr(ErrorMessage.BalanceNotEnough)
            return false
        }
        if (!amount) {
            setAmountErr(ErrorMessage.Require)
            return false
        }
        setAmountErr('')
        return true
    }

    const validateToAddress = (addr: string): boolean => {
        if (!addr) {
            setToAddressErr(ErrorMessage.Require)
            return false
        }
        if (!addressValid(addr)) {
            setToAddressErr(ErrorMessage.AddressInvalid)
            return false
        }
        if (myAccount.publickey && addr.toLocaleLowerCase() === myAccount.publickey.toLocaleLowerCase()) {
            setToAddressErr(ErrorMessage.CannotSendKAIToYourSelf)
            return false;
        }
        setToAddressErr('')
        return true
    }

    const validateGasLimit = (number: number): boolean => {
        if (!number) {
            serGasLimitErr(ErrorMessage.Require)
            return false
        }
        serGasLimitErr('')
        return true
    }

    const validateGasPrice = (gasPrice: any): boolean => {
        if (!Number(gasPrice)) {
            setGasPriceErr(ErrorMessage.Require)
            return false
        }
        setGasPriceErr('')
        return true
    }

    const resetFrom = () => {
        setAmount('');
        setToAddress('');
        setGasLimit(gasLimitSendTx);
        setGasPrice(1);
        setToAddressErr('');
        setAmountErr('');
    }

    const submitSend = async () => {
        if (!validateToAddress(toAddress) || !validateAmount(amount) || !validateGasLimit(gasLimit) || !validateGasPrice(gasPrice)) {
            return
        }
        if (isExtensionWallet()) {
            // Case: Send transaction interact with Kai Extension Wallet
            try {
                if (addressKRC20) {
                    await sendKRC20ByExtension(toAddress, Number(amount), gasPrice, gasLimit, addressKRC20.contractAddress, addressKRC20.tokenDecimals);
                } else {
                    await generateTxForEW(toAddress, Number(amount), gasPrice, gasLimit);
                }
            } catch (error) {
                try {
                    const errJson = JSON.parse(error?.message);
                    NotificationError({
                        description: `${NotifiMessage.TransactionError} Error: ${errJson?.error?.message}`
                    })
                } catch (error) {
                    NotificationError({
                        description: NotifiMessage.TransactionError
                    });
                }
            }
            resetFrom()
        } else {
            setShowConfirmModal(true)
        }
    }

    const transferKRC20 = async () => {
        const privateKey = walletLocalState.account.privatekey;
        const krc20 = kardiaClient.krc20;
        krc20.address = addressKRC20.contractAddress;
        krc20.decimals = addressKRC20.tokenDecimals;

        try {
            const response = await krc20.transfer(privateKey, toAddress, Number(amount), {});
            NotificationSuccess({
                description: NotifiMessage.TransactionSuccess,
                callback: () => { window.open(`/tx/${response.transactionHash}`) },
                seeTxdetail: true
            });

        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                NotificationError({
                    description: `${NotifiMessage.TransactionError} Error: ${errJson?.error?.message}`
                })
            } catch (error) {
                NotificationError({
                    description: NotifiMessage.TransactionError
                });
            }
        }

        setShowConfirmModal(false)
        resetFrom()
        setSendBntLoading(false)

    }

    const confirmSend = async () => {
        if (!validateToAddress(toAddress) || !validateAmount(amount) || !validateGasLimit(gasLimit) || !validateGasPrice(gasPrice)) {
            return
        }

        setSendBntLoading(true)

        if (addressKRC20) {
            transferKRC20();
        } else {
            try {
                const txHash = await generateTx(walletLocalState.account, toAddress, Number(amount), gasLimit, gasPrice)
                if (txHash) {
                    NotificationSuccess({
                        description: NotifiMessage.TransactionSuccess,
                        callback: () => { window.open(`/tx/${txHash}`) },
                        seeTxdetail: true
                    });
                } else {
                    NotificationError({
                        description: NotifiMessage.TransactionError,
                        callback: () => { window.open(`/tx/${txHash}`) },
                        seeTxdetail: true
                    });
                }
            } catch (error) {
                try {
                    const errJson = JSON.parse(error?.message);
                    NotificationError({
                        description: `${NotifiMessage.TransactionError} Error: ${errJson?.error?.message}`
                    })
                } catch (error) {
                    NotificationError({
                        description: NotifiMessage.TransactionError
                    });
                }
            }

            setShowConfirmModal(false)
            resetFrom()
            setSendBntLoading(false)
        }

    }

    const setMaximumAmount = () => {
        try {
            const balance = getStoredBalance();
            const maxFee = weiToKAI(gasLimit * gasPrice * 10 ** 9);
            const validableBalance = balance > Number(maxFee) ? balance - Number(maxFee) : 0;
            setAmount(String(validableBalance))
            validateAmount(validableBalance)
        } catch (error) {
            console.error(error)
        }
    }

    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        (async () => {
            if (!myAccount.publickey) {
                return;
            }
            const listTokens = await getTokens(myAccount.publickey)
            setTokens(listTokens.tokens);
        })();

    }, [myAccount.publickey])

    const [addressKRC20, setAddressKRC20] = useState(null as any)

    return (
        <div className="send-txs-container">
            <div style={{ marginBottom: 16 }}>
                <div className="title header-title">
                    Transactions
                </div>
            </div>
            <Panel shaded className="panel-bg-gray">


                <div className="custom-nav">
                    <Nav
                        appearance="subtle"
                        activeKey={activeKey}
                        onSelect={(event) => {
                            if(event == 'krc20') {
                                setGasLimit(gasLimitSendTxKRC20);
                            } else {
                                setGasLimit(gasLimitSendTx);
                            }
                            setActiveKey(event)
                        }}
                        style={{ marginBottom: 20 }}>
                        <Nav.Item eventKey="native">
                            {`Native KAI Token`}
                        </Nav.Item>
                        <Nav.Item eventKey="krc20">
                            {`KRC20 Token`}
                        </Nav.Item>
                    </Nav>
                </div>
                {
                    (() => {
                        switch (activeKey) {
                            case 'native':
                                return (
                                    <Form fluid>
                                        <FormGroup>
                                            <FlexboxGrid>
                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                                    <FlexboxGrid>
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24}>
                                                            <ControlLabel className="color-white">To Address (required)</ControlLabel>
                                                            <FormControl
                                                                placeholder="Ex. 0x..."
                                                                name="toAddress"
                                                                className="input"
                                                                value={toAddress}
                                                                onChange={(value) => {
                                                                    validateToAddress(value)
                                                                    setToAddress(value)
                                                                }}
                                                            />
                                                            <ErrMessage message={toAddressErr} />
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24}>
                                                            <FlexboxGrid justify="space-between" align="middle">
                                                                <ControlLabel className="color-white">Amount (required)</ControlLabel>
                                                                <span
                                                                    className="maximum-amount"
                                                                    onClick={() => {
                                                                        setMaximumAmount()
                                                                    }}>Maximum</span>
                                                            </FlexboxGrid>
                                                            <NumberInputFormat
                                                                value={amount}
                                                                placeholder="Ex. 1000"
                                                                className="input"
                                                                onChange={(event) => {
                                                                    setAmount(event.value)
                                                                    validateAmount(event.value)
                                                                }} />
                                                            <ErrMessage message={amountErr} />
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                                            <ControlLabel className="color-white">Gas Limit (required)</ControlLabel>
                                                            <NumberInputFormat
                                                                value={gasLimit}
                                                                placeholder="Gas limit"
                                                                className="input"
                                                                onChange={(event) => {
                                                                    setGasLimit(event.value);
                                                                    validateGasLimit(event.value)
                                                                }} />
                                                            <ErrMessage message={gasLimitErr} />
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                                            <ControlLabel className="color-white">Gas Price (required)</ControlLabel>
                                                            <SelectPicker
                                                                className="dropdown-custom"
                                                                data={gasPriceOption}
                                                                searchable={false}
                                                                value={gasPrice}
                                                                onChange={(value) => {
                                                                    setGasPrice(value)
                                                                    validateGasPrice(value)
                                                                }}
                                                                style={{ width: '100%' }}
                                                            />
                                                            <ErrMessage message={gasPriceErr} />
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginTop: 30 }}>
                                                            <Button size="big" style={{ margin: 0 }} onClick={submitSend} >Send KAI<Icon icon="space-shuttle" style={{ marginLeft: '10px' }} /></Button>
                                                        </FlexboxGrid.Item>
                                                    </FlexboxGrid>
                                                </FlexboxGrid.Item>
                                            </FlexboxGrid>
                                        </FormGroup>
                                    </Form>
                                );

                            case 'krc20':
                                return (
                                    <Form fluid>
                                        <FormGroup>
                                            <FlexboxGrid>
                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                                    <FlexboxGrid>
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24}>
                                                            <ControlLabel className="color-white">Select token KRC20 (optional)</ControlLabel>
                                                            <SelectPicker
                                                                placeholder="Your KRC20 token"
                                                                className="dropdown-custom balanceSelect"
                                                                data={tokens}
                                                                value={addressKRC20}
                                                                onChange={(value) => {
                                                                    setAddressKRC20(value)
                                                                }}
                                                                renderMenuItem={(label, item: any) => {
                                                                    return (
                                                                        <div className="rowToken">
                                                                            <div className="flex">
                                                                                <img src={`${item.logo}`} alt="logo" width="12px" height="12px" style={{ marginRight: '4px' }} />
                                                                                <p>{item.tokenSymbol}</p>
                                                                            </div>
                                                                            <span>{numberFormat(convertValueFollowDecimal(item.balance, item.tokenDecimals))}</span>
                                                                        </div>
                                                                    );
                                                                }}
                                                            />
                                                        </FlexboxGrid.Item>

                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24}>
                                                            <ControlLabel className="color-white">To Address (required)</ControlLabel>
                                                            <FormControl
                                                                placeholder="Ex. 0x..."
                                                                name="toAddress"
                                                                className="input"
                                                                value={toAddress}
                                                                onChange={(value) => {
                                                                    validateToAddress(value)
                                                                    setToAddress(value)
                                                                }}
                                                            />
                                                            <ErrMessage message={toAddressErr} />
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} sm={24}>
                                                            <FlexboxGrid justify="space-between" align="middle">
                                                                <ControlLabel className="color-white">Amount (required)</ControlLabel>
                                                                <span
                                                                    className="maximum-amount"
                                                                    onClick={() => {
                                                                        setMaximumAmount()
                                                                    }}>Maximum</span>
                                                            </FlexboxGrid>
                                                            <NumberInputFormat
                                                                value={amount}
                                                                placeholder="Ex. 1000"
                                                                className="input"
                                                                onChange={(event) => {
                                                                    setAmount(event.value)
                                                                    validateAmount(event.value)
                                                                }} />
                                                            <ErrMessage message={amountErr} />
                                                            {addressKRC20 ? <p style={{ marginTop: '8px' }} className="property-content">Available: {numberFormat(convertValueFollowDecimal(addressKRC20.balance, addressKRC20.tokenDecimals))} {addressKRC20.tokenSymbol}</p> : <></>}
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                                            <ControlLabel className="color-white">Gas Limit (required)</ControlLabel>
                                                            <NumberInputFormat
                                                                value={gasLimit}
                                                                placeholder="Gas limit"
                                                                className="input"
                                                                onChange={(event) => {
                                                                    setGasLimit(event.value);
                                                                    validateGasLimit(event.value)
                                                                }} />
                                                            <ErrMessage message={gasLimitErr} />
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                                            <ControlLabel className="color-white">Gas Price (required)</ControlLabel>
                                                            <SelectPicker
                                                                className="dropdown-custom"
                                                                data={gasPriceOption}
                                                                searchable={false}
                                                                value={gasPrice}
                                                                onChange={(value) => {
                                                                    setGasPrice(value)
                                                                    validateGasPrice(value)
                                                                }}
                                                                style={{ width: '100%' }}
                                                            />
                                                            <ErrMessage message={gasPriceErr} />
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginTop: 30 }}>
                                                            <Button size="big" style={{ margin: 0 }} onClick={submitSend} >Send KAI<Icon icon="space-shuttle" style={{ marginLeft: '10px' }} /></Button>
                                                        </FlexboxGrid.Item>
                                                    </FlexboxGrid>
                                                </FlexboxGrid.Item>
                                            </FlexboxGrid>
                                        </FormGroup>
                                    </Form>
                                );
                        }
                    })()
                }
            </Panel>
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmModal} onHide={() => { setShowConfirmModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm-letter">{InforMessage.SendTxConfirm}</div>
                    <List>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                    <div className="property-title">From</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                    <div className="property-content">
                                        {
                                            renderHashString(
                                                myAccount?.publickey || '',
                                                45,
                                                4
                                            )
                                        }
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                    <div className="property-title">To</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                    <div className="property-content">
                                        {
                                            renderHashString(
                                                toAddress || '',
                                                45,
                                                4
                                            )
                                        }
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} xs={24}>
                                    <div className="property-title">Value</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} xs={24}>
                                    <div className="property-content">
                                        {numberFormat(amount)} {addressKRC20 == null ? 'KAI' : addressKRC20.tokenSymbol}
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                    </List>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="kai-button-gray" onClick={() => { setShowConfirmModal(false) }}>
                        Cancel
                    </Button>
                    <Button loading={sendBntLoading} onClick={confirmSend}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default SendTransaction;