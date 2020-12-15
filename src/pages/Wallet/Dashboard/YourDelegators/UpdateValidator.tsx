import React, { useState } from "react";
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal, SelectPicker } from "rsuite";
import Button from "../../../../common/components/Button";
import ErrMessage from "../../../../common/components/InputErrMessage/InputErrMessage";
import { gasLimitDefault, gasPriceOption } from "../../../../common/constant";
import { ErrorMessage } from "../../../../common/constant/Message";
import { numberFormat, onlyInteger, onlyNumber } from "../../../../common/utils/number";
import { renderHashToRedirect } from "../../../../common/utils/string";
import { updateValidator } from "../../../../service/smc/staking";
import { getAccount } from "../../../../service/wallet";

const UpdateValidator = () => {


    const [isLoading, setIsLoading] = useState(false);
    const [commissionRate, setCommissionRate] = useState('')
    const [minSelfDelegation, setMinSelfDelegation] = useState('')
    const [valName, setValName] = useState('')
    const [commissionRateErr, setCommissionRateErr] = useState('')
    const [minSelfDelegationErr, setMinSelfDelegationErr] = useState('')
    const [valNameErr, setValNameErr] = useState('')
    const myAccount = getAccount() as Account;
    const [validator, setValidator] = useState<Validator>();

    const [gasPrice, setGasPrice] = useState(1)
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [gasLimit, setGasLimit] = useState(gasLimitDefault)
    const [gasLimitErr, setGasLimitErr] = useState('')

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [hashTransaction, setHashTransaction] = useState('')
    const [updateValErrMsg, setUpdateValErrMsg] = useState('')


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

    const submitUpdateValidator = () => {
        if (!validateGasLimit(gasLimit) || !validateGasPrice(gasPrice) || !validateCommissionRate(commissionRate) || !validateMinSelfDelegation(minSelfDelegation)) {
            return
        }
        setShowConfirmModal(true)
    }

    const update = async () => {
        setHashTransaction('')
        try {
            setIsLoading(true);

            const params: UpdateValParams = {
                valSmcAddr: validator?.smcAddress || '',
                newValName: valName,
                newCommissionRate: Number(commissionRate),
                newMinSelfDelegation: Number(minSelfDelegation)
            }

            let result = await updateValidator(params, myAccount, gasLimit, gasPrice);
            if (result && result.status === 1) {
                Alert.success('Update validator success.');
                setHashTransaction(result.transactionHash);
                // reFetchData();
            } else {
                setUpdateValErrMsg('Update validator failed.');
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                setUpdateValErrMsg(`Update validator failed: ${errJson?.error?.message}`);
            } catch (error) {
                setUpdateValErrMsg('Update validator failed.');
            }
        }
        resetForm();
        setIsLoading(false);
        setShowConfirmModal(false);
    }

    const resetForm = () => {
        setCommissionRate('');
        setMinSelfDelegation('');
    }

    return (
        <>
        <Form fluid>
            <FormGroup>
                <FlexboxGrid>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
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
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </FormGroup>
            <FormGroup>
                <Button size="big" onClick={submitUpdateValidator}>Update</Button>
            </FormGroup>
            <ErrMessage message={updateValErrMsg} />
            {
                hashTransaction ? <div style={{ marginTop: '20px', wordBreak: 'break-all' }}> Transaction update validator: {renderHashToRedirect({ hash: hashTransaction, headCount: 100, tailCount: 4, showTooltip: false, callback: () => { window.open(`/tx/${hashTransaction}`) } })}</div> : <></>
            }
        </Form>
        {/* Modal confirm when update validator */}
        <Modal backdrop="static" size="sm" enforceFocus={true} show={showConfirmModal} onHide={() => { setShowConfirmModal(false) }}>
            <Modal.Header>
                <Modal.Title>Confirm update validator</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ fontWeight: 'bold', color: '#36638A', marginBottom: '15px' }}>Are you sure you want to update validator with: </div>
                <div>Your Address: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {myAccount.publickey} </span></div>
                <div>New Commission Rate: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {numberFormat(commissionRate)} %</span></div>
                <div>New Minimum Delegate Amount: <span style={{ fontWeight: 'bold', color: '#36638A' }}> {numberFormat(minSelfDelegation)} KAI</span></div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => { setShowConfirmModal(false) }} className="kai-button-gray">
                    Cancel
                </Button>
                <Button loading={isLoading} onClick={update}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default UpdateValidator;