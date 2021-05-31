import React, { useEffect, useState } from "react";
import { Col, ControlLabel, FlexboxGrid, Form, FormGroup, Modal, SelectPicker } from "rsuite";
import { dateToUTCString, Button, NumberInputFormat, ErrMessage, gasLimitDefault, gasPriceOption, ErrorMessage, ShowNotifyErr, ShowNotify } from "../../../../common";
import './validators.css'
import { useRecoilValue } from 'recoil';
import walletState from "../../../../atom/wallet.atom";
import { updateValidatorCommissionByEW, updateValidatorCommission, isExtensionWallet } from "../../../../service";
import { GasMode } from "../../../../enum";

const UpdateCommissionRate = ({ validator = {} as Validator, showModel, setShowModel, reFetchData }: {
    validator: Validator;
    showModel: boolean;
    setShowModel: (isShow: boolean) => void;
    reFetchData: () => void;
}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [commissionRate, setCommissionRate] = useState('');
    const [commissionRateErr, setCommissionRateErr] = useState('');

    const [gasPrice, setGasPrice] = useState<GasMode>(GasMode.NORMAL);
    const [gasPriceErr, setGasPriceErr] = useState('');
    const [gasLimit, setGasLimit] = useState(gasLimitDefault);
    const [gasLimitErr, setGasLimitErr] = useState('');
    const [canUpdate, setCanUpdate] = useState(false);

    const walletLocalState = useRecoilValue(walletState);

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
        const valSmcAddr = validator?.smcAddress || '';
        if (!valSmcAddr) {
            return
        }

        // Case: update validator's commission interact with Kai Extension Wallet
        if (isExtensionWallet()) {
            await updateValidatorCommissionByEW(valSmcAddr, Number(commissionRate), gasLimit, gasPrice)
            reFetchData();
            cancelEdit()
            return;
        }

        try {
            setIsLoading(true);
            let result = await updateValidatorCommission(valSmcAddr, Number(commissionRate), walletLocalState.account, gasLimit, gasPrice);
            ShowNotify(result)
        } catch (error) {
            ShowNotifyErr(error)
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
                    <Form fluid className="panel-bg-gray">
                        <FormGroup>
                            <FlexboxGrid>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} style={{ marginBottom: 15 }}>
                                    <ControlLabel className="color-white">Gas Limit (required)</ControlLabel>
                                    <NumberInputFormat
                                        decimalScale={0}
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
                                    <ControlLabel className="color-white">New Commission Rate (%)  (required)</ControlLabel>
                                    <div className="latest-update-validator">
                                        <span className="color-white">Latest update: {dateToUTCString(validator?.updateTime || '')}</span>
                                    </div>
                                    {
                                        !canUpdate ? <div className="warning-note">* Validator's commission rate can only be updated once every 24 hours.</div> : <></>
                                    }
                                    <NumberInputFormat
                                        value={commissionRate}
                                        placeholder="Commission Rate"
                                        className="input"
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
                    <Button className="kai-button-gray" onClick={cancelEdit}>
                        Cancel
                    </Button>
                    <Button loading={isLoading} disable={!canUpdate} onClick={update}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UpdateCommissionRate;