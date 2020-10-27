import React, { useState, useEffect } from 'react'
import './sendTxs.css'
import { Panel, Form, FormGroup, FormControl, FlexboxGrid, Col, Button, Icon, Alert } from 'rsuite'
import { ErrorMessage } from '../../../../common/constant/Message'
import { onlyNumber } from '../../../../common/utils/number'
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage'
import { addressValid } from '../../../../common/utils/validate'
import { getAccount, generateTx } from '../../../../service/wallet'
import { getBalance } from '../../../../service/kai-explorer'
import { weiToKAI } from '../../../../common/utils/amount'
import { renderHashToRedirect } from '../../../../common/utils/string'
import { useHistory } from 'react-router-dom'

const SendTransaction = () => {
    const [amount, setAmount] = useState(0)
    const [toAddress, setToAddress] = useState('')
    const [gasLimit, setGasLimit] = useState(21000)
    const [amountErr, setAmountErr] = useState('')
    const [toAddressErr, setToAddressErr] = useState('')
    const [gasLimitErr, serGasLimitErr] = useState('')
    const [balance, setBalance] = useState(0)
    const myAccount = getAccount() as Account
    const [sendBntLoading, setSendBntLoading] = useState(false)
    const [txHash, setTxHash] = useState(false)
    const history = useHistory()
    useEffect(() => {
        (async() => {
            const balance = await getBalance(myAccount.publickey)
            setBalance(Number(weiToKAI(balance)))
        })()
    }, [myAccount.publickey])

    const validateAmount = (amount: number): boolean => {
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

    const sendKAI = async () => {
        if(!validateAmount(amount) || !validateToAddress(toAddress) || !validateGasLimit(gasLimit)) {
            return
        }
        
        setSendBntLoading(true)
        const txHash = await generateTx(myAccount, toAddress, amount, gasLimit)
        setTxHash(txHash);
        setSendBntLoading(false)
        Alert.success('Create transaction success.') 
    }

    return (
        <div className="send-txs-container">
            <Panel header={<h3>Send Transaction</h3>} shaded>
                <Form fluid>
                    <FormGroup>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                                <div className="label">Amount*:</div>
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
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                                <div className="label">To Address*:</div>
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
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6}>
                                <div className="label">Gas Limit*:</div>
                                <FormControl
                                    placeholder="Gas limit"
                                    name="gasLimit"
                                    value={gasLimit}
                                    onChange={(value) => {
                                        if (onlyNumber(value)) {
                                            setGasLimit(value)
                                            validateGasLimit(value)
                                        }
                                    }}
                                />
                                <ErrMessage message={gasLimitErr} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <Button loading={sendBntLoading} color="violet" onClick={sendKAI}>Send KAI <Icon icon="space-shuttle"/></Button>
                            </FlexboxGrid.Item>
                            {
                                txHash ? <div style={{marginTop: '20px'}}> Txs hash: {renderHashToRedirect({hash: txHash, headCount: 100, tailCount: 4, callback: () => { history.push(`/tx/${txHash}`) }})}</div> : <></>
                            }
                        </FlexboxGrid>
                    </FormGroup>
                </Form>
            </Panel>
        </div>
    )
}

export default SendTransaction;