import React, { useState } from 'react';
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal, SelectPicker } from 'rsuite';
import Button from '../../../../common/components/Button';
import NumberInputFormat from '../../../../common/components/FormInput';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification';
import { gasLimitDefault, gasPriceOption } from '../../../../common/constant';
import { ErrorMessage, NotifiMessage } from '../../../../common/constant/Message';
import { updateValidatorName } from '../../../../service/smc/staking';
import { getAccount, getStoredBalance } from '../../../../service/wallet';

const UpdateValidatorName = ({ validator = {} as Validator, showModel, setShowModel, reFetchData }: {
    validator: Validator;
    showModel: boolean;
    setShowModel: (isShow: boolean) => void;
    reFetchData: () => void;
}) => {

    const [gasPrice, setGasPrice] = useState(1);
    const [gasPriceErr, setGasPriceErr] = useState('');
    const [gasLimit, setGasLimit] = useState(gasLimitDefault);
    const [gasLimitErr, setGasLimitErr] = useState('');
    const [valName, setValName] = useState('');
    const [valNameErr, setValNameErr] = useState('');
    const myAccount = getAccount() as Account;
    const [isLoading, setIsLoading] = useState(false);
    const updateFee = Number(process.env.REACT_APP_UPDATE_VALIDATOR_NAME_FEE);

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

    const validateValName = (value: any) => {
        if (!value) {
            setValNameErr(ErrorMessage.Require);
            return false;
        }

        const balance = getStoredBalance();
        if (balance === 0 || balance < updateFee) {
            setValNameErr(ErrorMessage.BalanceNotEnough)
            return false
        }
        setValNameErr('');
        return true;
    }

    const update = async () => {
        if (!validateGasLimit(gasLimit) || !validateGasPrice(gasPrice) || !validateValName(valName)) {
            return
        }
        try {
            setIsLoading(true);
            const valSmcAddr = validator?.smcAddress || '';
            if (!valSmcAddr) {
                return
            }

            if (!validateValName(valName)) return;
            let result = await updateValidatorName(valSmcAddr, valName, myAccount, updateFee, gasLimit, gasPrice);
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
        setShowModel(false);
        resetForm();
    }

    const resetForm = () => {
        setValName('');
        setValNameErr('');
    }

    return (
        <>
            <Modal backdrop="static"
                size="sm"
                enforceFocus={true}
                show={showModel}
                onHide={() => {
                    setShowModel(false);
                    resetForm();
                }}>
                <Modal.Header>
                    <Modal.Title>Update Validator Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid className="panel-bg-gray">
                        <FormGroup>
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
                                    <ControlLabel className="color-white">New Validator Name (required)</ControlLabel>
                                    <div className="warning-note">You must pay 10000 KAI fees to change the validator name.</div>
                                    <FormControl placeholder="Validator Name"
                                        name="valName"
                                        value={valName}
                                        className="input"
                                        onChange={(value) => {
                                            setValName(value)
                                            validateValName(value)
                                        }} />
                                    <ErrMessage message={valNameErr} />
                                </FlexboxGrid.Item>

                            </FlexboxGrid>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button loading={isLoading} onClick={update}>
                        Update
                    </Button>
                    <Button className="kai-button-gray"
                        onClick={() => {
                            setShowModel(false);
                            resetForm();
                        }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default UpdateValidatorName;