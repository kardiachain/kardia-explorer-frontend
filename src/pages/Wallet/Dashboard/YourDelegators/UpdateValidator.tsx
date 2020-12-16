import React, { useState } from "react";
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, Modal, SelectPicker } from "rsuite";
import Button from "../../../../common/components/Button";
import ErrMessage from "../../../../common/components/InputErrMessage/InputErrMessage";
import { NotificationError, NotificationSuccess } from "../../../../common/components/Notification";
import { gasLimitDefault, gasPriceOption } from "../../../../common/constant";
import { ErrorMessage, NotifiMessage } from "../../../../common/constant/Message";
import { onlyInteger, onlyNumber } from "../../../../common/utils/number";
import { updateValidator } from "../../../../service/smc/staking";
import { getAccount } from "../../../../service/wallet";

const UpdateValidator = ({validator = {} as Validator}:{validator: Validator}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [commissionRate, setCommissionRate] = useState('')
    const [minSelfDelegation, setMinSelfDelegation] = useState('')
    const [valName, setValName] = useState('')
    const [commissionRateErr, setCommissionRateErr] = useState('')
    const [minSelfDelegationErr, setMinSelfDelegationErr] = useState('')
    const [valNameErr, setValNameErr] = useState('')
    const myAccount = getAccount() as Account;

    const [gasPrice, setGasPrice] = useState(1)
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [gasLimit, setGasLimit] = useState(gasLimitDefault)
    const [gasLimitErr, setGasLimitErr] = useState('')
    
    const [showEditModel, setShowEditModel] = useState(false);


    const validateValName = (value: any) => {
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
        setCommissionRateErr('')
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

        if (Number(value) < 10000000) {
            setMinSelfDelegationErr(ErrorMessage.MinSelfDelegationBelowMinimum)
            return false
        }

        setMinSelfDelegationErr('')
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
        if (!validateGasLimit(gasLimit) || !validateGasPrice(gasPrice) || !validateValName(valName) || !validateCommissionRate(commissionRate) || !validateMinSelfDelegation(minSelfDelegation)) {
            return
        }
        try {
            setIsLoading(true);
            const valSmcAddr = validator?.smcAddress || '';
            if (!valSmcAddr) {
                return
            }
            const params: UpdateValParams = {
                valSmcAddr: valSmcAddr,
                newValName: valName,
                newCommissionRate: Number(commissionRate),
                newMinSelfDelegation: Number(minSelfDelegation)
            }

            let result = await updateValidator(params, myAccount, gasLimit, gasPrice);
            if (result && result.status === 1) {
                NotificationSuccess({
                    description: NotifiMessage.TransactionSuccess
                });
            } else {
                NotificationError({
                    description: NotifiMessage.TransactionError
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
        setValName('');
        setValNameErr('');
        setCommissionRate('');
        setCommissionRateErr('');
        setMinSelfDelegation('');
        setMinSelfDelegationErr('');
    }

    const cancelEdit = () => {
        setShowEditModel(false);
        resetForm();
    }

    return (
        <>
            <div style={{ textAlign: 'right' }}>
                <Button className="kai-button-gray" onClick={() => { setShowEditModel(true) }}>
                    <Icon icon="edit" /> Edit
                </Button>
            </div>
            {/* Modal edit validator infomation */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showEditModel} onHide={cancelEdit}>
                <Modal.Header>
                    <Modal.Title>Edit Validator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid>
                        <FormGroup>
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
                                    <ControlLabel>New Validator Name <span className="required-mask">(*)</span></ControlLabel>
                                    <FormControl placeholder="Validator Name"
                                        name="valName"
                                        value={valName}
                                        onChange={(value) => {
                                            setValName(value)
                                            validateValName(value)
                                        }} />
                                    <ErrMessage message={valNameErr} />
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 15 }}>
                                    <ControlLabel>New Commission Rate (%)  <span className="required-mask">(*)</span></ControlLabel>
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
                                    <ControlLabel>New Minimum Delegate Amount (KAI) <span className="required-mask">(*)</span></ControlLabel>
                                    <FormControl placeholder="New Minimum Expected Delegate Amount"
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
                            </FlexboxGrid>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={isLoading} onClick={update}>
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