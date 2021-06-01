import React, { useState } from 'react'
import { useRecoilValue } from 'recoil';
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, List, Modal, SelectPicker } from 'rsuite';
import walletState from '../../../../atom/wallet.atom';
import {
    addressValid,
    Button,
    numberFormat,
    NumberInputFormat,
    ErrMessage,
    renderHashString,
    gasLimitSendTxKRC20,
    convertValueFollowDecimal,
    ErrorMessage,
    InforMessage,
    gasPriceOption,
    ShowNotifyErr,
    ShowNotify
} from '../../../../common';
import { sendKRC20ByExtension, getAccount, isExtensionWallet, transferKrc20Token } from '../../../../service';
import { GasMode } from '../../../../enum';

const SendKrc20Token = ({ tokens, fetchKrc20Token }: {
    tokens: any[];
    fetchKrc20Token: () => void;
}) => {

    const [amount, setAmount] = useState('')
    const [toAddress, setToAddress] = useState('')
    const [gasLimit, setGasLimit] = useState(gasLimitSendTxKRC20)
    const [amountErr, setAmountErr] = useState('')
    const [toAddressErr, setToAddressErr] = useState('')
    const [gasLimitErr, serGasLimitErr] = useState('')
    const myAccount: Account = getAccount();
    const [sendBntLoading, setSendBntLoading] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const [gasPrice, setGasPrice] = useState<GasMode>(GasMode.NORMAL)
    const [gasPriceErr, setGasPriceErr] = useState('')

    const walletLocalState = useRecoilValue(walletState)

    const [krc20Token, setKrc20Token] = useState(null as any)
    const [addressKRC20Err, setAddressKRC20Err] = useState('')

    const validateKRC20 = (krc20: any): boolean => {
        if (!krc20) {
            setAddressKRC20Err(ErrorMessage.Require)
            return false
        }
        setAddressKRC20Err('')
        return true
    }

    const validateAmount = (amount: any): boolean => {

        if (!amount) {
            setAmountErr(ErrorMessage.Require)
            return false
        }

        if (Number(amount) <= 0) {
            setAmountErr(ErrorMessage.AmountNotZero)
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



    const submitSend = async () => {
        if (!validateKRC20(krc20Token) || !validateToAddress(toAddress) || !validateAmount(amount) || !validateGasLimit(gasLimit) || !validateGasPrice(gasPrice)) {
            return
        }
        if (isExtensionWallet()) {
            setSendBntLoading(true)
            // Case: Send transaction interact with Kai Extension Wallet
            try {
                await sendKRC20ByExtension(toAddress, Number(amount), gasPrice, gasLimit, krc20Token.contractAddress, krc20Token.tokenDecimals);
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
        setGasLimit(gasLimitSendTxKRC20);
        setGasPrice(GasMode.NORMAL);
        setToAddressErr('');
        setAmountErr('');
        setAddressKRC20Err('');
        setKrc20Token(null)
    }

    const confirmSend = async () => {
        if (!validateToAddress(toAddress) || !validateAmount(amount) || !validateGasLimit(gasLimit) || !validateGasPrice(gasPrice)) {
            return
        }
        transferKRC20();
    }

    const transferKRC20 = async () => {
        setConfirmLoading(true)
        try {
            const token = {
                address: krc20Token.contractAddress,
                decimals: krc20Token.tokenDecimals
            } as Krc20Token
            const response = await transferKrc20Token({
                fromAccount: walletLocalState.account,
                token,
                toAddress,
                amount: Number(amount),
                gasLimit: Number(gasLimit),
                gasPrice: gasPrice
            })
            ShowNotify(response)
        } catch (error) {
            ShowNotifyErr(error)
        }
        fetchKrc20Token()
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
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24}>
                                    <ControlLabel className="color-white">Select token KRC20 (required)</ControlLabel>
                                    <SelectPicker
                                        placeholder="Your KRC20 token"
                                        className="dropdown-custom"
                                        virtualized={false}
                                        style={{
                                            width: '100%'
                                        }}
                                        data={tokens}
                                        value={krc20Token}
                                        onChange={(value) => {
                                            validateKRC20(value)
                                            setKrc20Token(value)
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
                                    <ErrMessage message={addressKRC20Err} />
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
                                    <ControlLabel className="color-white">Amount (required)</ControlLabel>
                                    <NumberInputFormat
                                        decimalScale={krc20Token && krc20Token.tokenDecimals}
                                        value={amount}
                                        placeholder="Ex. 1000"
                                        className="input"
                                        onChange={(event) => {
                                            setAmount(event.value)
                                            validateAmount(event.value)
                                        }} />
                                    <ErrMessage message={amountErr} />
                                    {krc20Token ? <p style={{ marginTop: '8px' }} className="property-content">Available: {numberFormat(convertValueFollowDecimal(krc20Token.balance, krc20Token.tokenDecimals))} {krc20Token.tokenSymbol}</p> : <></>}
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                    <ControlLabel className="color-white">Gas Limit (required)</ControlLabel>
                                    <NumberInputFormat
                                        value={gasLimit}
                                        decimalScale={0}
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
                                    <Button size="big" style={{ margin: 0 }} onClick={submitSend} loading={sendBntLoading} >Send Token<Icon icon="space-shuttle" style={{ marginLeft: '10px' }} /></Button>
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
                                        {numberFormat(amount)} {krc20Token && krc20Token.tokenSymbol ? krc20Token.tokenSymbol : ''}
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

export default SendKrc20Token