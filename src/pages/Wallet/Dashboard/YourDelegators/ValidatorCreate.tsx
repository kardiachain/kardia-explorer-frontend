import React, { useState } from 'react'
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, Modal, SelectPicker } from 'rsuite';
import Button from '../../../../common/components/Button';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { gasPriceOption } from '../../../../common/constant';
import { ErrorMessage } from '../../../../common/constant/Message';
import { numberFormat, onlyInteger, onlyNumber } from '../../../../common/utils/number';
import { renderHashToRedirect } from '../../../../common/utils/string';
import { createValidator } from '../../../../service/smc/staking';
import { getAccount } from '../../../../service/wallet';
import './validators.css'
import Helper from '../../../../common/components/Helper';
import { HelperMessage } from '../../../../common/constant/HelperMessage';

const ValidatorCreate = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [commissionRate, setCommissionRate] = useState('')
    const [maxRate, setMaxRate] = useState('')
    const [maxChangeRate, setMaxChangeRate] = useState('')
    const [minSelfDelegation, setMinSelfDelegation] = useState('')
    const [valName, setValName] = useState('')

    const [commissionRateErr, setCommissionRateErr] = useState('')
    const [maxRateErr, setMaxRateErr] = useState('')
    const [maxChangeRateErr, setMaxChangeRateErr] = useState('')
    const [minSelfDelegationErr, setMinSelfDelegationErr] = useState('')
    const [valNameErr, setValNameErr] = useState('')

    const [hashTransaction, setHashTransaction] = useState('')
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [createValErrMsg, setCreateValErrMsg] = useState('')

    const [gasPrice, setGasPrice] = useState(1)
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [gasLimit, setGasLimit] = useState(5000000)
    const [gasLimitErr, setGasLimitErr] = useState('')

    const validateValName = (value: string) => {
        if (!value) {
            setValNameErr(ErrorMessage.Require);
            return false;
        }
        setValNameErr('');
        return true;
    }

    const validateCommissionRate = (value: any) => {
        if (!value) {
            setCommissionRateErr(ErrorMessage.Require)
            return false
        }
        if (Number(value) === 0) {
            setCommissionRateErr(ErrorMessage.ValueInvalid)
            return false
        }

        // The commission value cannot be more than 100%
        if (Number(value) > 100) {
            setCommissionRateErr(ErrorMessage.CommissionRateMoreThanHundred)
            return false
        }

        //commission rate cannot be more than the max rate
        if (Number(value) > Number(maxRate)) {
            setCommissionRateErr(ErrorMessage.CommissionRateMoreThanMaxRate)
            return false
        }
        setCommissionRateErr('')
        return true
    }

    const validateMaxRate = (value: any) => {
        if (!value) {
            setMaxRateErr(ErrorMessage.Require)
            return false
        }
        if (Number(value) === 0) {
            setMaxRateErr(ErrorMessage.ValueInvalid)
            return false
        }

        // The commission max rate value cannot be more than 100%
        if (Number(value) > 100) {
            setMaxRateErr(ErrorMessage.MaxRateMoreThanHundred)
            return false
        }

        //commission rate cannot be more than the max rate
        if (Number(value) < Number(commissionRate)) {
            setCommissionRateErr(ErrorMessage.CommissionRateMoreThanMaxRate)
            return false
        } else {
            setCommissionRateErr('')
        }

        //commission max change rate can not be more than the max rate
        if (Number(value) < Number(maxChangeRate)) {
            setMaxChangeRateErr(ErrorMessage.MaxChangeRateMoreThanMaxRate)
            return false
        } else {
            setMaxChangeRateErr('')
        }

        setMaxRateErr('')
        return true
    }

    const validateMaxChangeRate = (value: any) => {
        if (!value) {
            setMaxChangeRateErr(ErrorMessage.Require)
            return false
        }
        if (Number(value) === 0) {
            setMaxChangeRateErr(ErrorMessage.ValueInvalid)
            return false
        }

        // The commission max change rate value cannot be more than 100%
        if (Number(value) > 100) {
            setMaxChangeRateErr(ErrorMessage.MaxChangeRateMoreThanHundred)
            return false
        }

        //commission max change rate can not be more than the max rate
        if (Number(value) > Number(maxRate)) {
            setMaxChangeRateErr(ErrorMessage.MaxChangeRateMoreThanMaxRate)
            return false
        }

        setMaxChangeRateErr('')
        return true
    }

    const validateMinSelfDelegation = (value: any) => {
        if (!value) {
            setMinSelfDelegationErr(ErrorMessage.Require)
            return false
        }
        if (Number(value) === 0) {
            setMinSelfDelegationErr(ErrorMessage.ValueInvalid)
            return false
        }

        setMinSelfDelegationErr('');
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

    const validateGasLimit = (gas: any): boolean => {
        if (!Number(gas)) {
            setGasLimitErr(ErrorMessage.Require);
            return false;
        }
        setGasLimitErr('')
        return true
    }

    const resetForm = () => {
        setCommissionRate('')
        setMaxRate('')
        setMaxChangeRate('')
        setMinSelfDelegation('')
        setValName('')
    }

    const submitValidator = () => {
        if (!validateGasPrice(gasPrice) ||
            !validateValName(valName) ||
            !validateGasLimit(gasLimit) ||
            !validateCommissionRate(commissionRate) ||
            !validateMaxRate(maxRate) ||
            !validateMaxChangeRate(maxChangeRate) ||
            !validateMinSelfDelegation(minSelfDelegation)) {
            return
        }
        setShowConfirmModal(true)
    }

    const registerValidator = async () => {
        setHashTransaction('');
        setCreateValErrMsg('');
        try {
            setIsLoading(true)
            const account = await getAccount() as Account;
            const params = {
                valName: valName,
                commissionRate: Number(commissionRate),
                maxRate: Number(maxRate),
                maxChangeRate: Number(maxChangeRate),
                minSeftDelegation: Number(minSelfDelegation)
            } as CreateValParams;

            let validator = await createValidator(params, account, gasLimit, gasPrice);
            if (validator && validator.status === 1) {
                Alert.success('Create validator success.')
            } else {
                const errMsg = validator.gasUsed === Number(gasLimit) ? 'Create transaction fail with error: Out of gas.' : 'Create validator failed.'
                setCreateValErrMsg(errMsg)
            }
            setHashTransaction(validator.transactionHash)
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                setCreateValErrMsg(`Create validator failed: ${errJson?.error?.message}`)
            } catch (error) {
                setCreateValErrMsg('Create validator failed.');
            }
        }
        resetForm();
        setIsLoading(false)
        setShowConfirmModal(false)
    }

    return (
        <>
            <Form fluid>
                <FlexboxGrid>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} style={{ marginBottom: 15 }}>
                        <ControlLabel>Gas Limit <span className="required-mask">(*)</span></ControlLabel>
                        <FormControl name="gaslimit"
                            placeholder="Gas Limit"
                            value={gasLimit}
                            onChange={(value) => {
                                if (onlyInteger(value)) {
                                    setGasLimit(value);
                                    validateGasLimit(value)
                                }
                            }}
                            style={{ width: '100%' }}
                        />
                        <ErrMessage message={gasLimitErr} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} style={{ marginBottom: 15 }}>
                        <ControlLabel>Gas Price <span className="required-mask">(*)</span></ControlLabel>
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

                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                        <ControlLabel>
                            Name <span className="required-mask">(*)</span>
                        </ControlLabel>
                        <FormControl placeholder="Name"
                            name="valName"
                            value={valName}
                            onChange={(value) => {
                                setValName(value)
                                validateValName(value);
                            }} />
                        <ErrMessage message={valNameErr} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                        <ControlLabel>
                            <Helper style={{ marginRight: 5 }} info={HelperMessage.CommissionRate} />
                            Commission Rate (%)  <span className="required-mask">(*)</span>
                        </ControlLabel>
                        <FormControl placeholder="Commission Rate"
                            name="commissionRate"
                            value={commissionRate}
                            onChange={(value) => {
                                if (onlyNumber(value)) {
                                    setCommissionRate(value)
                                    validateCommissionRate(value)
                                }
                            }} />
                        <ErrMessage message={commissionRateErr} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                        <ControlLabel>
                            <Helper style={{ marginRight: 5 }} info={HelperMessage.MaxRate} />
                            Max Rate (%)  <span className="required-mask">(*)</span>
                        </ControlLabel>
                        <FormControl placeholder="Max Rate"
                            name="maxRate"
                            value={maxRate}
                            onChange={(value) => {
                                if (onlyNumber(value)) {
                                    setMaxRate(value)
                                    validateMaxRate(value)
                                }
                            }} />
                        <ErrMessage message={maxRateErr} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                        <ControlLabel>
                            <Helper style={{ marginRight: 5 }} info={HelperMessage.MaxChangeRate} />
                            Max Change Rate (%)  <span className="required-mask">(*)</span>
                        </ControlLabel>
                        <FormControl placeholder="Max Change Rate"
                            name="maxChangeRate"
                            value={maxChangeRate}
                            onChange={(value) => {
                                if (onlyNumber(value)) {
                                    setMaxChangeRate(value)
                                    validateMaxChangeRate(value)
                                }
                            }} />
                        <ErrMessage message={maxChangeRateErr} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                        <ControlLabel>
                            <Helper style={{ marginRight: 5 }} info={HelperMessage.MinSelfDelegation} />
                            Minimum Delegate Amount (KAI)  <span className="required-mask">(*)</span>
                        </ControlLabel>
                        <FormControl placeholder="Minimum Expected Delegate Amount"
                            name="minSelfDelegation"
                            value={minSelfDelegation}
                            onChange={(value) => {
                                if (onlyNumber(value)) {
                                    setMinSelfDelegation(value)
                                    validateMinSelfDelegation(value)
                                }
                            }} />
                        <ErrMessage message={minSelfDelegationErr} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                        <Button size="big" onClick={submitValidator}>Register</Button>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </Form>
            <ErrMessage message={createValErrMsg} />
            {
                hashTransaction ? <div style={{ marginTop: '20px', wordBreak: 'break-all' }}>Txs create validator: {renderHashToRedirect({ hash: hashTransaction, headCount: 100, tailCount: 4, showTooltip: false, callback: () => { window.open(`/tx/${hashTransaction}`) } })}</div> : <></>
            }

            {/* Modal confirm when create validator */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmModal} onHide={() => { setShowConfirmModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirm create validator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>Are you sure you want to create validator with: </div>
                    <div>Validator Name: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {valName}</span></div>
                    <div>Commission Rate: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {numberFormat(commissionRate)} %</span></div>
                    <div>Max Rate: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {numberFormat(maxRate)} %</span></div>
                    <div>Max Rate Change: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {numberFormat(maxChangeRate)} %</span></div>
                    <div>Minimum Delegate Amount: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {numberFormat(minSelfDelegation)} KAI</span></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={isLoading} onClick={registerValidator}>
                        Confirm
                    </Button>
                    <Button className="kai-button-gray" onClick={() => { setShowConfirmModal(false) }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ValidatorCreate;