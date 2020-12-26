import React, { useEffect, useState } from "react";
import { Col, ControlLabel, FlexboxGrid, Form, FormGroup, Modal, SelectPicker } from "rsuite";
import Button from "../../../../common/components/Button";
import NumberInputFormat from "../../../../common/components/FormInput";
import ErrMessage from "../../../../common/components/InputErrMessage/InputErrMessage";
import { NotificationError, NotificationSuccess } from "../../../../common/components/Notification";
import { gasLimitDefault, gasPriceOption } from "../../../../common/constant";
import { ErrorMessage, NotifiMessage } from "../../../../common/constant/Message";
import { dateToUTCString } from "../../../../common/utils/string";
import { updateValidatorCommission } from "../../../../service/smc/staking";
import { getAccount } from "../../../../service/wallet";
import './validators.css'

const UpdateCommissionRate = ({ validator = {} as Validator, showModel, setShowModel, reFetchData }: {
    validator: Validator;
    showModel: boolean;
    setShowModel: (isShow: boolean) => void;
    reFetchData: () => void;
}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [commissionRate, setCommissionRate] = useState('');
    const [commissionRateErr, setCommissionRateErr] = useState('');
    const myAccount = getAccount() as Account;

    const [gasPrice, setGasPrice] = useState(1);
    const [gasPriceErr, setGasPriceErr] = useState('');
    const [gasLimit, setGasLimit] = useState(gasLimitDefault);
    const [gasLimitErr, setGasLimitErr] = useState('');
    const [canUpdate, setCanUpdate] = useState(false);

    useEffect(() => {
        const updateTime = (new Date(validator.updateTime)).getTime()
        const nowTime = (new Date()).getTime();
        const lockTime = Number(process.env.REACT_APP_TIME_UPDATE_COMMISSION_LOCK_TIME || 0)
        if (nowTime > updateTime + lockTime) {
            setCanUpdate(true);
        }
    }, [validator]);


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

        const commissionChange = Math.abs(Number(value) - Number(validator.commissionRate));

        if (commissionChange > Number(validator.maxChangeRate)) {
            setCommissionRateErr(ErrorMessage.CommissionMoreThanMaximunRateRangeChange);
            return;
        }

        setCommissionRateErr('')
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


    const update = async () => {
        if (!canUpdate) return;
        if (!validateGasLimit(gasLimit) || !validateGasPrice(gasPrice) || !validateCommissionRate(commissionRate)) {
            return
        }
        try {
            setIsLoading(true);
            const valSmcAddr = validator?.smcAddress || '';
            if (!valSmcAddr) {
                return
            }
            let result = await updateValidatorCommission(valSmcAddr, Number(commissionRate), myAccount, gasLimit, gasPrice);
            if (result && result.status === 1) {
                NotificationSuccess({
                    description: NotifiMessage.TransactionSuccess,
                    callback: () => { window.open(`/tx/${result.transactionHash}`) },
                    seeTxdetail: true
                });
                reFetchData();
            } else {
                NotificationError({
                    description: NotifiMessage.TransactionError,
                    callback: () => { window.open(`/tx/${result.transactionHash}`) },
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
        setIsLoading(false);
        cancelEdit();
    }

    const resetForm = () => {
        setCommissionRate('');
        setCommissionRateErr('');
    }

    const cancelEdit = () => {
        setShowModel(false);
        resetForm();
    }

    return (
        <>
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showModel} onHide={cancelEdit}>
                <Modal.Header>
                    <Modal.Title>Update Validator Commmission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid>
                        <FormGroup>
                            <FlexboxGrid>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} style={{ marginBottom: 15 }}>
                                    <ControlLabel>Gas Limit <span className="required-mask">(*)</span></ControlLabel>
                                    <NumberInputFormat
                                        value={gasLimit}
                                        placeholder="Gas Limit"
                                        onChange={(event) => {
                                            setGasLimit(event.value);
                                            validateGasLimit(event.value)
                                        }} />
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
                                    <ControlLabel>New Commission Rate (%)  <span className="required-mask">(*)</span></ControlLabel>
                                    <div className="latest-update-validator">
                                        <span>Latest update: {dateToUTCString(validator?.updateTime || '')}</span>
                                    </div>
                                    {
                                        !canUpdate ? <div className="warning-note">* The next update only can perform after 24 hours since the last update.</div> : <></>
                                    }
                                    <NumberInputFormat
                                        value={commissionRate}
                                        placeholder="Commission Rate"
                                        onChange={(event) => {
                                            setCommissionRate(event.value);
                                            validateCommissionRate(event.value)
                                        }} />
                                    <ErrMessage message={commissionRateErr} />
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={isLoading} disable={!canUpdate} onClick={update}>
                        Update
                    </Button>
                    <Button className="kai-button-gray" onClick={cancelEdit}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UpdateCommissionRate;