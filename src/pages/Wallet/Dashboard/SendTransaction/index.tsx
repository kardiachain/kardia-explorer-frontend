import React, { useState } from 'react'
import './sendTxs.css'
import { Panel, Form, FormGroup, FormControl, FlexboxGrid, Col, Icon, ControlLabel, Modal, SelectPicker, List } from 'rsuite'
import { ErrorMessage, NotifiMessage } from '../../../../common/constant/Message'
import { numberFormat } from '../../../../common/utils/number'
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage'
import { addressValid } from '../../../../common/utils/validate'
import { getAccount, generateTx, getStoredBalance } from '../../../../service/wallet'
import Button from '../../../../common/components/Button'
import { gasPriceOption } from '../../../../common/constant'
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification'
import NumberInputFormat from '../../../../common/components/FormInput'
import { renderHashString } from '../../../../common/utils/string'

const SendTransaction = () => {
    const [amount, setAmount] = useState('')
    const [toAddress, setToAddress] = useState('')
    const [gasLimit, setGasLimit] = useState(21000)
    const [amountErr, setAmountErr] = useState('')
    const [toAddressErr, setToAddressErr] = useState('')
    const [gasLimitErr, serGasLimitErr] = useState('')
    const myAccount = getAccount() as Account
    const [sendBntLoading, setSendBntLoading] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const [gasPrice, setGasPrice] = useState(1)
    const [gasPriceErr, setGasPriceErr] = useState('')


    const validateAmount = (amount: any): boolean => {
        if (Number(amount) === 0) {
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
        if (addr.toLocaleLowerCase() === myAccount.publickey.toLocaleLowerCase()) {
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
        setGasLimit(21000);
        setGasPrice(1);
        setAmountErr('');
    }

    const submitSend = () => {
        if (!validateAmount(amount) || !validateToAddress(toAddress) || !validateGasLimit(gasLimit) || !validateGasPrice(gasPrice)) {
            return
        }
        setShowConfirmModal(true)
    }

    const confirmSend = async () => {
        setSendBntLoading(true)
        try {
            const txHash = await generateTx(myAccount, toAddress, Number(amount), gasLimit, gasPrice)
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

        resetFrom()
        setShowConfirmModal(false)
        setSendBntLoading(false)
    }

    return (
        <div className="send-txs-container">
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="gray-highlight" icon="exchange" size={"lg"} />
                    <p style={{ marginLeft: '12px' }} className="title color-white">Transactions</p>
                </div>
            </div>
            <Panel shaded className="panel-bg-gray">
                <Form fluid>
                    <FormGroup>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24}>
                                <ControlLabel className="color-white">Amount <span className="required-mask">(*)</span></ControlLabel>
                                <NumberInputFormat
                                    value={amount}
                                    placeholder="Amount"
                                    onChange={(event) => {
                                        setAmount(event.value);
                                        validateAmount(event.value)
                                    }} />
                                <ErrMessage message={amountErr} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                <ControlLabel className="color-white">To Address  <span className="required-mask">(*)</span></ControlLabel>
                                <FormControl
                                    placeholder="Please enter the address"
                                    name="toAddress"
                                    value={toAddress}
                                    onChange={(value) => {
                                        validateToAddress(value)
                                        setToAddress(value)
                                    }}
                                />
                                <ErrMessage message={toAddressErr} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} sm={12}>
                                <ControlLabel className="color-white">Gas Limit  <span className="required-mask">(*)</span></ControlLabel>
                                <NumberInputFormat
                                    value={gasLimit}
                                    placeholder="Gas limit"
                                    onChange={(event) => {
                                        setGasLimit(event.value);
                                        validateGasLimit(event.value)
                                    }} />
                                <ErrMessage message={gasLimitErr} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} sm={12}>
                                <ControlLabel className="color-white">Gas Price <span className="required-mask">(*)</span></ControlLabel>
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
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <Button size="big" style={{ margin: 0 }} onClick={submitSend} >Send KAI<Icon icon="space-shuttle" style={{ marginLeft: '10px' }} /></Button>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </FormGroup>
                </Form>
            </Panel>
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmModal} onHide={() => { setShowConfirmModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm-letter">Be carefully verify your transaction before sending the transaction</div>
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
                                        {numberFormat(amount)} KAI
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                    </List>
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={sendBntLoading} onClick={confirmSend}>
                        Confirm
                    </Button>
                    <Button className="kai-button-gray" onClick={() => { setShowConfirmModal(false) }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default SendTransaction;