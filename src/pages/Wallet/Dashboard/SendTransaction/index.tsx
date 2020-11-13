import React, { useState, useEffect } from 'react'
import './sendTxs.css'
import { Panel, Form, FormGroup, FormControl, FlexboxGrid, Col, Icon, Alert, ControlLabel, Modal } from 'rsuite'
import { ErrorMessage } from '../../../../common/constant/Message'
import { onlyInteger, onlyNumber } from '../../../../common/utils/number'
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage'
import { addressValid } from '../../../../common/utils/validate'
import { getAccount, generateTx } from '../../../../service/wallet'
import { getBalance } from '../../../../service/kai-explorer'
import { weiToKAI } from '../../../../common/utils/amount'
import { renderHashToRedirect } from '../../../../common/utils/string'
import Button from '../../../../common/components/Button'

const SendTransaction = () => {
    const [amount, setAmount] = useState('')
    const [toAddress, setToAddress] = useState('')
    const [gasLimit, setGasLimit] = useState(21000)
    const [amountErr, setAmountErr] = useState('')
    const [toAddressErr, setToAddressErr] = useState('')
    const [gasLimitErr, serGasLimitErr] = useState('')
    const [balance, setBalance] = useState(0)
    const myAccount = getAccount() as Account
    const [sendBntLoading, setSendBntLoading] = useState(false)
    const [txHash, setTxHash] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [sendTxErrMs, setSendTxErrMsg] = useState('')
    useEffect(() => {
        (async () => {
            const balance = await getBalance(myAccount.publickey)
            setBalance(Number(weiToKAI(balance)))
        })()
    }, [myAccount.publickey])

    const validateAmount = (amount: any): boolean => {
        if (Number(amount) === 0) {
            setAmountErr(ErrorMessage.AmountNotZero)
            return false
        }
        if (Number(balance) === 0 || Number(balance) < amount) {
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
        if(addr.toLocaleLowerCase() === myAccount.publickey.toLocaleLowerCase()) {
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

    const resetFrom = () => {
        setAmount('');
        setToAddress('');
        setGasLimit(21000)
    }

    const submitSend = () => {
        if (!validateAmount(amount) || !validateToAddress(toAddress) || !validateGasLimit(gasLimit)) {
            return
        }
        setShowConfirmModal(true)
    }

    const confirmSend = async () => {
        setSendBntLoading(true)
        try {
            const txHash = await generateTx(myAccount, toAddress, Number(amount), gasLimit)
            if (txHash) {
                setTxHash(txHash);
                Alert.success('Send transaction success.')
            } else {
                setSendTxErrMsg('Send transaction failed.')
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                setSendTxErrMsg(`Send transaction failed: ${errJson?.error?.message}`)
            } catch (error) {
                setSendTxErrMsg('Send transaction failed.')
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
                    <Icon className="highlight" icon="exchange" size={"lg"} />
                    <p style={{ marginLeft: '12px' }} className="title">Transactions</p>
                </div>
            </div>
            <Panel shaded>
                <Form fluid>
                    <FormGroup>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8}>
                                <ControlLabel>Amount <span className="required-mask">*</span></ControlLabel>
                                <FormControl
                                    placeholder="Amount"
                                    name="amount"
                                    value={amount}
                                    onChange={(value) => {
                                        if (onlyNumber(value)) {
                                            setAmount(value)
                                            validateAmount(value)
                                        }
                                    }}
                                />
                                <ErrMessage message={amountErr} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8}>
                                <ControlLabel>To Address <span className="required-mask">*</span></ControlLabel>
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
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8}>
                                <ControlLabel>Gas Limit <span className="required-mask">*</span></ControlLabel>
                                <FormControl
                                    placeholder="Gas limit"
                                    name="gasLimit"
                                    value={gasLimit}
                                    onChange={(value) => {
                                        if (onlyInteger(value)) {
                                            setGasLimit(value)
                                            validateGasLimit(value)
                                        }
                                    }}
                                />
                                <ErrMessage message={gasLimitErr} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <Button size="big" onClick={submitSend} >Send KAI<Icon icon="space-shuttle" style={{marginLeft: '10px'}} /></Button>
                            </FlexboxGrid.Item>
                            <ErrMessage message={sendTxErrMs} />
                            {
                                txHash ? <div style={{ marginTop: '20px', wordBreak: 'break-all' }}> Txs hash: {renderHashToRedirect({ hash: txHash, headCount: 100, tailCount: 4,showTooltip: false, callback: () => {window.open(`/tx/${txHash}`) } })}</div> : <></>
                            }
                        </FlexboxGrid>
                    </FormGroup>
                </Form>
            </Panel>
            <Modal backdrop="static" size="xs" enforceFocus={true} show={showConfirmModal} onHide={() => {setShowConfirmModal(false)}}>
                <Modal.Header>
                    <Modal.Title>Confirm send transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{textAlign:'center'}}>Are you sure you want to transfer <span style={{fontWeight: 'bold', color: '#36638A'}}>{amount} KAI</span></div>
                    <div style={{textAlign:'center'}}>TO</div>
                    <div style={{textAlign:'center', fontWeight: 'bold', color: '#36638A'}}>{toAddress}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={sendBntLoading} onClick={confirmSend}>
                        Confirm
                    </Button>
                    <Button className="primary-button" onClick={() => {setShowConfirmModal(false)}}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default SendTransaction;