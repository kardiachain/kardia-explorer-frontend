import React, { useState } from 'react';
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal, SelectPicker } from 'rsuite';
import {
    ErrorMessage,
    Button,
    NumberInputFormat,
    ErrMessage,
    gasLimitDefault,
    gasPriceOption,
    ShowNotifyErr,
    ShowNotify
} from '../../../../common';
import { useRecoilValue } from 'recoil';
import walletState from '../../../../atom/wallet.atom';
import { updateValidatorNameByEW, getStoredBalance, isExtensionWallet, updateValidatorName } from '../../../../service';
import { GasMode } from '../../../../enum';

const UpdateValidatorName = ({ validator = {} as Validator, showModel, setShowModel, reFetchData }: {
    validator: Validator;
    showModel: boolean;
    setShowModel: (isShow: boolean) => void;
    reFetchData: () => void;
}) => {

    const [gasPrice, setGasPrice] = useState<GasMode>(GasMode.NORMAL);
    const [gasPriceErr, setGasPriceErr] = useState('');
    const [gasLimit, setGasLimit] = useState(gasLimitDefault);
    const [gasLimitErr, setGasLimitErr] = useState('');
    const [valName, setValName] = useState('');
    const [valNameErr, setValNameErr] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const updateFee = Number(process.env.REACT_APP_UPDATE_VALIDATOR_NAME_FEE);
    const walletLocalState = useRecoilValue(walletState);

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

        const valSmcAddr = validator?.smcAddress || '';
        if (!valSmcAddr) {
            return
        }
        // Case: update validator's name interact with Kai Extension Wallet
        if (isExtensionWallet()) {
            await updateValidatorNameByEW(valSmcAddr, valName, updateFee, gasLimit, gasPrice)
            reFetchData();
            setShowModel(false);
            resetForm();
            return
        }

        try {
            setIsLoading(true);
            if (!validateValName(valName)) return;
            let result = await updateValidatorName(valSmcAddr, valName, walletLocalState.account, updateFee, gasLimit, gasPrice);
            ShowNotify(result)
        } catch (error) {
            ShowNotifyErr(error)
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
                                    <ControlLabel className="color-white">New Validator Name (required)</ControlLabel>
                                    <div className="warning-note">You must pay 10,000 KAI to change the validator's name.</div>
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
                    <Button className="kai-button-gray"
                        onClick={() => {
                            setShowModel(false);
                            resetForm();
                        }}>
                        Cancel
                    </Button>
                    <Button loading={isLoading} onClick={update}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default UpdateValidatorName;