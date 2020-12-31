import React, { useState } from 'react'
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, List, Modal, SelectPicker } from 'rsuite';
import Button from '../../../../common/components/Button';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { gasPriceOption, MIN_DELEGATION_AMOUNT } from '../../../../common/constant';
import { ErrorMessage, InforMessage, NotifiMessage } from '../../../../common/constant/Message';
import { numberFormat } from '../../../../common/utils/number';
import { createValidator } from '../../../../service/smc/staking';
import { getAccount, getStoredBalance } from '../../../../service/wallet';
import './validators.css'
import Helper from '../../../../common/components/Helper';
import { HelperMessage } from '../../../../common/constant/HelperMessage';
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification';
import NumberInputFormat from '../../../../common/components/FormInput';

const ValidatorCreate = ({ reFetchData }: { reFetchData: () => void }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [commissionRate, setCommissionRate] = useState('')
    const [maxRate, setMaxRate] = useState('')
    const [maxChangeRate, setMaxChangeRate] = useState('')
    const [valName, setValName] = useState('')
    const [yourDelAmount, setYourDelAmount] = useState(`${MIN_DELEGATION_AMOUNT}`)

    const [commissionRateErr, setCommissionRateErr] = useState('')
    const [maxRateErr, setMaxRateErr] = useState('')
    const [maxChangeRateErr, setMaxChangeRateErr] = useState('')
    const [valNameErr, setValNameErr] = useState('')
    const [yourDelAmountErr, setYourDelAmountErr] = useState('')

    const [showConfirmModal, setShowConfirmModal] = useState(false)

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

        if (Number(value) > 100) {
            setCommissionRateErr(ErrorMessage.CommissionRateMoreThanHundred)
            return false
        }

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

        if (Number(value) > 100) {
            setMaxRateErr(ErrorMessage.MaxRateMoreThanHundred)
            return false
        }

        if (Number(value) < Number(commissionRate)) {
            setCommissionRateErr(ErrorMessage.CommissionRateMoreThanMaxRate)
            return false
        } else {
            setCommissionRateErr('')
        }

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

        if (Number(value) > 100) {
            setMaxChangeRateErr(ErrorMessage.MaxChangeRateMoreThanHundred)
            return false
        }

        if (Number(value) > Number(maxRate)) {
            setMaxChangeRateErr(ErrorMessage.MaxChangeRateMoreThanMaxRate)
            return false
        }

        setMaxChangeRateErr('')
        return true
    }

    const validateYourDelegationAmount = (value: any) => {

        if (!Number(value)) {
            setYourDelAmountErr(ErrorMessage.Require);
            return
        }

        if (Number(value) < MIN_DELEGATION_AMOUNT) {
            setYourDelAmountErr(ErrorMessage.BelowMinimumDelegationAmount)
            return false
        }
        const balance = getStoredBalance();
        if (balance === 0 || balance < MIN_DELEGATION_AMOUNT) {
            setYourDelAmountErr(ErrorMessage.BalanceNotEnough)
            return false
        }

        setYourDelAmountErr('');
        return true;
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
        setCommissionRate('');
        setMaxRate('');
        setMaxChangeRate('');
        setValName('');
        setCommissionRateErr('');
        setMaxRateErr('');
        setMaxChangeRateErr('');
    }

    const submitValidator = () => {
        if (!validateGasPrice(gasPrice) ||
            !validateValName(valName) ||
            !validateGasLimit(gasLimit) ||
            !validateCommissionRate(commissionRate) ||
            !validateMaxRate(maxRate) ||
            !validateMaxChangeRate(maxChangeRate) ||
            !validateYourDelegationAmount(yourDelAmount)) {
            return
        }
        setShowConfirmModal(true)
    }

    const registerValidator = async () => {
        try {
            setIsLoading(true)
            const account = await getAccount() as Account;
            const params = {
                valName: valName,
                commissionRate: Number(commissionRate),
                maxRate: Number(maxRate),
                maxChangeRate: Number(maxChangeRate),
                yourDelegationAmount: Number(yourDelAmount)
            } as CreateValParams;

            let validator = await createValidator(params, account, gasLimit, gasPrice);
            if (validator && validator.status === 1) {
                NotificationSuccess({
                    description: NotifiMessage.TransactionSuccess,
                    callback: () => { window.open(`/tx/${validator.transactionHash}`) },
                    seeTxdetail: true
                });
                reFetchData();
            } else {
                const errMsg = validator.gasUsed === Number(gasLimit) ? `${NotifiMessage.TransactionError} Error: Out of gas.` : NotifiMessage.TransactionError;
                NotificationError({
                    description: errMsg,
                    callback: () => { window.open(`/tx/${validator.transactionHash}`) },
                    seeTxdetail: true
                });
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                NotificationError({
                    description: `${NotifiMessage.TransactionError} Error: ${errJson?.error?.message}`
                });
            } catch (error) {
                NotificationError({
                    description: NotifiMessage.TransactionError
                });
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
                        <ControlLabel className="color-white">Gas Limit (required)</ControlLabel>
                        <NumberInputFormat
                            value={gasLimit}
                            placeholder="Gas Limit"
                            className="input"
                            onChange={(event) => {
                                setGasLimit(event.value);
                                validateGasLimit(event.value)
                            }} />
                        <ErrMessage message={gasLimitErr} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} style={{ marginBottom: 15 }}>
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

                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                        <ControlLabel className="color-white">
                            Name (required)
                        </ControlLabel>
                        <FormControl placeholder="Ex. My Validator"
                            name="valName"
                            className="input"
                            value={valName}
                            onChange={(value) => {
                                setValName(value)
                                validateValName(value);
                            }} />
                        <ErrMessage message={valNameErr} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                        <ControlLabel className="color-white">
                            Commission Rate (% - required)
                            <Helper style={{ marginLeft: 5 }} info={HelperMessage.CommissionRate} />
                        </ControlLabel>
                        <NumberInputFormat
                            value={commissionRate}
                            placeholder="Ex. 10"
                            className="input"
                            onChange={(event) => {
                                setCommissionRate(event.value);
                                validateCommissionRate(event.value)
                            }} />
                        <ErrMessage message={commissionRateErr} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                        <ControlLabel className="color-white">
                            Max Rate (% - required)
                            <Helper style={{ marginLeft: 5 }} info={HelperMessage.MaxRate} />
                        </ControlLabel>
                        <NumberInputFormat
                            value={maxRate}
                            placeholder="Ex. 20"
                            className="input"
                            onChange={(event) => {
                                setMaxRate(event.value);
                                validateMaxRate(event.value)
                            }} />
                        <ErrMessage message={maxRateErr} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                        <ControlLabel className="color-white">
                            Max Change Rate (% - required)
                            <Helper style={{ marginLeft: 8 }} info={HelperMessage.MaxChangeRate} />
                        </ControlLabel>
                        <NumberInputFormat
                            value={maxChangeRate}
                            placeholder="Ex. 2"
                            className="input"
                            onChange={(event) => {
                                setMaxChangeRate(event.value);
                                validateMaxChangeRate(event.value)
                            }} />
                        <ErrMessage message={maxChangeRateErr} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                        <ControlLabel className="color-white">
                            Your Delegation Amount (required)
                            <Helper style={{ marginLeft: 5 }} info={HelperMessage.AmountSelftDelegation} />
                        </ControlLabel>
                        <NumberInputFormat
                            value={yourDelAmount}
                            placeholder="Must be at least 25,000 KAI"
                            className="input"
                            onChange={(event) => {
                                setYourDelAmount(event.value);
                                validateYourDelegationAmount(event.value)
                            }} />
                        <ErrMessage message={yourDelAmountErr} />
                    </FlexboxGrid.Item>

                </FlexboxGrid>
                <Button size="big" style={{ minWidth: 200 }} onClick={submitValidator}>Register</Button>
            </Form>

            {/* Modal confirm when create validator */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmModal} onHide={() => { setShowConfirmModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm-letter">
                        {InforMessage.CreateValidatorConfirm}
                    </div>
                    <List>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                    <div className="property-title">Validator Name</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                    <div className="property-content">
                                        {numberFormat(commissionRate)}
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                    <div className="property-title">Commission Rate</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                    <div className="property-content">
                                        {numberFormat(commissionRate)} %
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                    <div className="property-title">Max Rate</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                    <div className="property-content">
                                        {numberFormat(maxRate)} %
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                    <div className="property-title">Max Rate Change</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                    <div className="property-content">
                                        {numberFormat(maxChangeRate)} %
                                    </div>
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                        <List.Item>
                            <FlexboxGrid justify="start" align="middle">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                    <div className="property-title">Your Delegation Amount</div>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} xs={24}>
                                    <div className="property-content">
                                        {numberFormat(yourDelAmount)} KAI
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
                    <Button loading={isLoading} onClick={registerValidator}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ValidatorCreate;