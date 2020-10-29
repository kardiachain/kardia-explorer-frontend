import React, { useEffect, useState } from 'react'
import { Alert, Button, ButtonToolbar, ControlLabel, Form, FormControl, FormGroup, Modal } from 'rsuite';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { onlyNumber } from '../../../../common/utils/number';
import { renderHashToRedirect } from '../../../../common/utils/string';
import { createValidator } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';
import './validators.css'

const ValidatorCreate = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [commissionRate, setCommissionRate] = useState('')
    const [maxRate, setMaxRate] = useState('')
    const [maxChangeRate, setMaxChangeRate] = useState('')
    const [minSelfDelegation, setMinSelfDelegation] = useState('')
    const [amountDel, setAmountDel] = useState('')

    const [commissionRateErr, setCommissionRateErr] = useState('')
    const [maxRateErr, setMaxRateErr] = useState('')
    const [maxChangeRateErr, setMaxChangeRateErr] = useState('')
    const [maxMinSelfDelegationErr, setMaxMinSelfDelegationErr] = useState('')
    const [amountDelErr, setAmountDelErr] = useState('')

    const [hashTransaction, setHashTransaction] = useState('')
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    useEffect(() => {
        if (commissionRate) setCommissionRateErr('');
    }, [commissionRate])

    useEffect(() => {
        if (maxRate) setMaxRateErr('');
    }, [maxRate])

    useEffect(() => {
        if (maxChangeRate) setMaxChangeRateErr('');
    }, [maxChangeRate])

    useEffect(() => {
        if (minSelfDelegation) setMaxMinSelfDelegationErr('');
    }, [minSelfDelegation])

    useEffect(() => {
        if (amountDel) setAmountDelErr('');
    }, [amountDel])

    const validateCommissionRate = () => {
        if (!commissionRate) {
            setCommissionRateErr(ErrorMessage.Require)
            return false
        }
        if (Number(commissionRate) === 0) {
            setCommissionRateErr(ErrorMessage.ValueInvalid)
            return false
        }
        if (Number(commissionRate) > 100) {
            setCommissionRateErr(ErrorMessage.MaxRateMoreThanHundred)
            return false
        }
        setCommissionRateErr('')
        return true
    }

    const resetForm = () => {
        setCommissionRate('')
        setMaxRate('')
        setMaxChangeRate('')
        setMinSelfDelegation('')
        setAmountDel('')
    }

    const validateMaxRate = () => {
        if (!maxRate) {
            setMaxRateErr(ErrorMessage.Require)
            return false
        }
        if (Number(maxRate) === 0) {
            setMaxRateErr(ErrorMessage.ValueInvalid)
            return false
        }
        setMaxRateErr('')
        return true
    }

    const validateMaxChangeRate = () => {
        if (!maxChangeRate) {
            setMaxChangeRateErr(ErrorMessage.Require)
            return false
        }
        if (Number(maxChangeRate) === 0) {
            setMaxChangeRateErr(ErrorMessage.ValueInvalid)
            return false
        }
        setMaxChangeRateErr('')
        return true
    }

    const validateMinSelfDelegation = () => {
        if (!minSelfDelegation) {
            setMaxMinSelfDelegationErr(ErrorMessage.Require)
            return false
        }
        if (Number(minSelfDelegation) === 0) {
            setMaxMinSelfDelegationErr(ErrorMessage.ValueInvalid)
            return false
        }
        setMaxMinSelfDelegationErr('')
        return true
    }

    const validateAmountDel = () => {
        if (!amountDel) {
            setAmountDelErr(ErrorMessage.Require)
            return false
        }
        if (Number(amountDel) === 0) {
            setAmountDelErr(ErrorMessage.ValueInvalid)
            return false
        }

        if (Number(amountDel) < Number(minSelfDelegation)) {
            setAmountDelErr(ErrorMessage.DelBelowMinimum)
            return false
        }
        setAmountDelErr('')
        return true
    }

    const submitValidator = () => {
        if (!validateCommissionRate() || !validateMaxRate() || !validateMaxChangeRate() || !validateMinSelfDelegation() || !validateAmountDel()) {
            return
        }
        setShowConfirmModal(true)
    }

    const registerValidator = async () => {
        setIsLoading(true)
        let account = await getAccount() as Account;
        let validator = await createValidator(Number(commissionRate), Number(maxRate), Number(maxChangeRate), Number(minSelfDelegation), account, Number(amountDel));
        if (validator && validator.status === 1) {
            Alert.success('Create validator success.')
            setHashTransaction(validator.transactionHash)
        } else {
            Alert.error('Create validator failed')
        }
        resetForm();
        setIsLoading(false)
        setShowConfirmModal(false)
    }

    return (
        <>
            <Form fluid>
                <FormGroup>
                    <ControlLabel>Commission Rate <span className="required-mask">*</span></ControlLabel>
                    <FormControl placeholder="Commission Rate"
                        name="commissionRate"
                        value={commissionRate}
                        onChange={(value) => {
                            if (!value) {
                                setCommissionRateErr(ErrorMessage.Require)
                            }
                            if (onlyNumber(value)) {
                                setCommissionRate(value)
                            }
                        }} />
                    <ErrMessage message={commissionRateErr} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Max Rate <span className="required-mask">*</span></ControlLabel>
                    <FormControl placeholder="Max Rate"
                        name="maxRate"
                        value={maxRate}
                        onChange={(value) => {
                            if (!value) {
                                setMaxRateErr(ErrorMessage.Require)
                            }
                            if (onlyNumber(value)) {
                                setMaxRate(value)
                            }
                        }} />
                    <ErrMessage message={maxRateErr} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Max Change Rate <span className="required-mask">*</span></ControlLabel>
                    <FormControl placeholder="Max Change Rate"
                        name="maxChangeRate"
                        value={maxChangeRate}
                        onChange={(value) => {
                            if (!value) {
                                setMaxChangeRateErr(ErrorMessage.Require)
                            }
                            if (onlyNumber(value)) {
                                setMaxChangeRate(value)
                            }
                        }} />
                    <ErrMessage message={maxChangeRateErr} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Min Self Delegation <span className="required-mask">*</span></ControlLabel>
                    <FormControl placeholder="Min Self Delegation"
                        name="minSelfDelegation"
                        value={minSelfDelegation}
                        onChange={(value) => {
                            if (!value) {
                                setMaxMinSelfDelegationErr(ErrorMessage.Require)
                            }
                            if (onlyNumber(value)) {
                                setMinSelfDelegation(value)
                            }
                        }} />
                    <ErrMessage message={maxMinSelfDelegationErr} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Amount Self Delegation <span className="required-mask">*</span></ControlLabel>
                    <FormControl placeholder="Amount Self Delegation"
                        name="amountDel"
                        value={amountDel}
                        onChange={(value) => {
                            if (!value) {
                                setAmountDelErr(ErrorMessage.Require)
                            }
                            if (onlyNumber(value)) {
                                setAmountDel(value)
                            }
                        }} />
                    <ErrMessage message={amountDelErr} />
                </FormGroup>
                <FormGroup>
                    <ButtonToolbar>
                        <Button appearance="primary" onClick={submitValidator}>Register</Button>
                    </ButtonToolbar>
                </FormGroup>
            </Form>
            {
                hashTransaction ? <div style={{ marginTop: '20px', wordBreak: 'break-all' }}>Txs create validator: {renderHashToRedirect({ hash: hashTransaction, headCount: 100, tailCount: 4, callback: () => { window.open(`/tx/${hashTransaction}`) } })}</div> : <></>
            }

            {/* Modal confirm when create validator */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmModal} onHide={() => { setShowConfirmModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirm create validator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>Are you sure you want to create validator with: </div>
                    <div>Commission Rate: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {commissionRate} %</span></div>
                    <div>Max Rate: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {maxRate} KAI</span></div>
                    <div>Max Rate Change: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {maxChangeRate} KAI</span></div>
                    <div>Min Self Delegation: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {minSelfDelegation} KAI</span></div>
                    <div>Amount Self Delegation: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {amountDel} KAI</span></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setShowConfirmModal(false) }} appearance="subtle">
                        Cancel
                    </Button>
                    <Button loading={isLoading} onClick={registerValidator} appearance="primary">
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ValidatorCreate;