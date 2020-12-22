import React, { useEffect, useState } from "react";
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, Modal, Radio, RadioGroup, SelectPicker } from "rsuite";
import Button from "../../../../common/components/Button";
import NumberInputFormat from "../../../../common/components/FormInput";
import ErrMessage from "../../../../common/components/InputErrMessage/InputErrMessage";
import { NotificationError, NotificationSuccess } from "../../../../common/components/Notification";
import { gasLimitDefault, gasPriceOption } from "../../../../common/constant";
import { ErrorMessage, NotifiMessage } from "../../../../common/constant/Message";
import { onlyInteger } from "../../../../common/utils/number";
import { dateToUTCString } from "../../../../common/utils/string";
import { updateValidatorCommission, updateValidatorName } from "../../../../service/smc/staking";
// import { updateValidator } from "../../../../service/smc/staking";
import { getAccount, getStoredBalance } from "../../../../service/wallet";
import './validators.css'

const UpdateValidator = ({validator = {} as Validator}:{validator: Validator}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [commissionRate, setCommissionRate] = useState('')
    const [valName, setValName] = useState('')
    const [commissionRateErr, setCommissionRateErr] = useState('')
    const [valNameErr, setValNameErr] = useState('')
    const myAccount = getAccount() as Account;

    const [gasPrice, setGasPrice] = useState(1)
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [gasLimit, setGasLimit] = useState(gasLimitDefault)
    const [gasLimitErr, setGasLimitErr] = useState('')
    const [canUpdate, setCanUpdate] = useState(false);
    const [showEditModel, setShowEditModel] = useState(false);
    const [updateOption, setUpdateOption] = useState('name');

    useEffect(() => {
        const updateTime = (new Date(validator.updateTime)).getTime()
        const nowTime = (new Date()).getTime();
        if (nowTime > updateTime + 86400000) {
            setCanUpdate(true);
        }
        
    }, [validator]);


    const validateValName = (value: any) => {
        if (!value) {
            setValNameErr(ErrorMessage.Require);
            return false;
        }

        const balance = getStoredBalance();
        if (balance === 0 || balance < 10000) {
            setValNameErr(ErrorMessage.BalanceNotEnough)
            return false
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
        if (!validateGasLimit(gasLimit) || !validateGasPrice(gasPrice)) {
            return
        }
        try {
            setIsLoading(true);
            const valSmcAddr = validator?.smcAddress || '';
            if (!valSmcAddr) {
                return
            }

            if (updateOption === "name") {
                if (!validateValName(valName)) return;
                let result = await updateValidatorName(valSmcAddr,valName, myAccount, 10000, gasLimit, gasPrice);
                if (result && result.status === 1) {
                    NotificationSuccess({
                        description: NotifiMessage.TransactionSuccess,
                        callback: () => { window.open(`/tx/${result.transactionHash}`) },
                        seeTxdetail: true
                    });
                } else {
                    NotificationError({
                        description: NotifiMessage.TransactionError,
                        callback: () => { window.open(`/tx/${result.transactionHash}`) },
                        seeTxdetail: true
                    });
                }
            } else {
                if (!validateCommissionRate(commissionRate)) return;
                let result = await updateValidatorCommission(valSmcAddr, Number(commissionRate), myAccount, gasLimit, gasPrice);
                if (result && result.status === 1) {
                    NotificationSuccess({
                        description: NotifiMessage.TransactionSuccess,
                        callback: () => { window.open(`/tx/${result.transactionHash}`) },
                        seeTxdetail: true
                    });
                } else {
                    NotificationError({
                        description: NotifiMessage.TransactionError,
                        callback: () => { window.open(`/tx/${result.transactionHash}`) },
                        seeTxdetail: true
                    });
                }
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
        setValName('');
        setValNameErr('');
        setCommissionRate('');
        setCommissionRateErr('');
    }

    const cancelEdit = () => {
        setShowEditModel(false);
        resetForm();
    }

    return (
        <>
            <Button className="kai-button-gray" onClick={() => { setShowEditModel(true) }}>
                <Icon icon="edit" /> Edit
            </Button>
            {/* Modal edit validator infomation */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showEditModel} onHide={cancelEdit}>
                <Modal.Header>
                    <Modal.Title>Edit Validator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid>
                        <FormGroup>
                            <FlexboxGrid>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                                    <RadioGroup
                                        name="updateOption"
                                        value={updateOption}
                                        onChange={(value) => {
                                            setUpdateOption(value);
                                        }}>
                                        <Radio value="name">Validator Name</Radio>
                                        <Radio value="commission">Commission Rate</Radio>
                                    </RadioGroup>
                                </FlexboxGrid.Item>
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
                                {
                                    (() => {
                                        switch(updateOption) {
                                            case "name": 
                                                return (
                                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                                                        <ControlLabel>New Validator Name <span className="required-mask">(*)</span></ControlLabel>
                                                        <div className="warning-note">You must pay 10000 KAI fees to change the validator name.</div>
                                                        <FormControl placeholder="Validator Name"
                                                            name="valName"
                                                            value={valName}
                                                            onChange={(value) => {
                                                                setValName(value)
                                                                validateValName(value)
                                                            }} />
                                                        <ErrMessage message={valNameErr} />
                                                    </FlexboxGrid.Item>
                                                );
                                            case "commission":
                                                return (
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
                                                );
                                        }
                                    })()
                                }
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

export default UpdateValidator;