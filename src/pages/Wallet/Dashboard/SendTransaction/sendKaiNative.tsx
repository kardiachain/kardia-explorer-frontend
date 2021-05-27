import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, List, Modal, SelectPicker } from 'rsuite'
import walletState from '../../../../atom/wallet.atom'
import {
    addressValid,
    Button,
    NumberInputFormat,
    ErrMessage,
    gasLimitSendTx,
    gasPriceOption,
    ErrorMessage,
    InforMessage,
    weiToKAI,
    numberFormat,
    renderHashString,
    ShowNotify,
    ShowNotifyErr
} from '../../../../common'
import { GasMode } from '../../../../enum'
import { generateTxForEW, generateTx, getAccount, getStoredBalance, isExtensionWallet } from '../../../../service'

const SendKaiNative = () => {

    const [amount, setAmount] = useState('')
    const [toAddress, setToAddress] = useState('')
    const [gasLimit, setGasLimit] = useState(gasLimitSendTx)
    const [amountErr, setAmountErr] = useState('')
    const [toAddressErr, setToAddressErr] = useState('')
    const [gasLimitErr, serGasLimitErr] = useState('')
    const myAccount: Account = getAccount();

    const [gasPrice, setGasPrice] = useState<GasMode>(GasMode.NORMAL)
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [sendBntLoading, setSendBntLoading] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const walletLocalState = useRecoilValue(walletState)

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

    const submitSend = async () => {
        if (!validateToAddress(toAddress) || !validateAmount(amount) || !validateGasLimit(gasLimit) || !validateGasPrice(gasPrice)) {
            return
        }
        if (isExtensionWallet()) {
            // Case: Send transaction interact with Kai Extension Wallet
            setSendBntLoading(true)
            try {
                await generateTxForEW(toAddress, Number(amount), gasPrice, gasLimit);
            } catch (error) {
                ShowNotifyErr(error)
            }
            setSendBntLoading(false)
            resetFrom()
        } else {
            setShowConfirmModal(true)
        }
    }

    const resetFrom = () => {
        setAmount('');
        setToAddress('');
        setGasLimit(gasLimitSendTx);
        setGasPrice(GasMode.NORMAL);
        setToAddressErr('');
        setAmountErr('');
    }

    const confirmSend = async () => {
        if (!validateToAddress(toAddress) || !validateAmount(amount) || !validateGasLimit(gasLimit) || !validateGasPrice(gasPrice)) {
            return
        }
        setConfirmLoading(true)
        try {
            const response = await generateTx(walletLocalState.account, toAddress,  amount, gasLimit, gasPrice)
            ShowNotify(response)
        } catch (error) {
            ShowNotifyErr(error)
        }

        setShowConfirmModal(false)
        resetFrom()
        setConfirmLoading(false)
    }

    return (
        <>
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
                                        decimalScale={18}
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
                                        decimalScale={0}
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
                                    <Button size="big" loading={sendBntLoading} style={{ margin: 0 }} onClick={submitSend} >Send KAI<Icon icon="space-shuttle" style={{ marginLeft: '10px' }} /></Button>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </FormGroup>
            </Form>
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
                                        {numberFormat(amount)} KAI
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
                    <Button loading={confirmLoading} onClick={confirmSend}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}

export default SendKaiNative