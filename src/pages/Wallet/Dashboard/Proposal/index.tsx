import React, { useState } from 'react'
import { useRecoilValue } from 'recoil';
import { CheckPicker, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Panel, SelectPicker } from 'rsuite';
import walletState from '../../../../atom/wallet.atom';
import Button from '../../../../common/components/Button';
import NumberInputFormat from '../../../../common/components/FormInput';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { NotificationError, NotificationSuccess } from '../../../../common/components/Notification';
import { gasLimitDefault, gasPriceOption } from '../../../../common/constant';
import { ErrorMessage, NotifiMessage } from '../../../../common/constant/Message';
import { createNewProposal } from '../../../../service/smc/proposal';
import { proposalItems } from './type';

interface FieldsModal {
    value: string;
    name: string;
    label: string;
    keyId: any;
    placeholder: string;
    errorMsg: string;
}

const CreateProposal = () => {

    const [items, setItems] = useState([] as FieldsModal[]);
    const [loading, setLoading] = useState(false);
    const [gasPrice, setGasPrice] = useState(1)
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [gasLimit, setGasLimit] = useState(gasLimitDefault)
    const [gasLimitErr, setGasLimitErr] = useState('')


    const walletLocalState = useRecoilValue(walletState)

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

    const selectItems = (value: any) => {
        const _items = value && value.length > 0 ? value.map((item: any) => {
            return {
                name: item.name,
                label: item.label,
                placeholder: item.placeholder,
                keyId: item.keyId
            }
        }) : []
        setItems(_items)
    }


    const handelInputFieldOnchange = (value: string, idx: number) => {
        const _items = [...items];
        _items[idx].value = value;
        setItems(_items)
    }

    const validateItem = (value: string, idx: number) => {
        const _items = [...items];
        if (!value) {
            _items[idx].errorMsg = ErrorMessage.Require;
            setItems(_items);
            return false;
        }
        _items[idx].errorMsg = '';
        setItems(_items);
        return true
    }

    const submit = async () => {
        const invalid = (items.filter((item: FieldsModal, idx: number) => !validateItem(item.value, idx))).length > 0
        if (invalid) {
            return
        }

        setLoading(true)
        try {
            const paramsKey = items.map((item) => {
                return item.keyId
            });
            const paramsValue = items.map((item) => {
                return item.value;
            })

            const rs = await createNewProposal(walletLocalState.account, paramsKey, paramsValue, gasLimit, gasPrice);
            
            if (rs && rs.status === 1) {
                NotificationSuccess({
                    description: NotifiMessage.TransactionSuccess,
                    callback: () => { window.open(`/tx/${rs.transactionHash}`) },
                    seeTxdetail: true
                });
            } else {
                NotificationError({
                    description: NotifiMessage.TransactionError,
                    callback: () => { window.open(`/tx/${rs.transactionHash}`) },
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
        setLoading(false)
    }

    return (
        <FlexboxGrid>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24}>
                <div className="val-info-container">
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Create Proposal
                        </div>
                    </div>
                </div>
                <Panel shaded className="panel-bg-gray">
                    <FlexboxGrid>
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                            <Form fluid>
                                <FormGroup>
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} xs={24} style={{ marginBottom: 15 }}>
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
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} xs={24} style={{ marginBottom: 15 }}>
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
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={16} sm={24} style={{ marginBottom: 20 }}>
                                            <ControlLabel className="color-white">Select items you want to proposal</ControlLabel>
                                            <CheckPicker
                                                placeholder="Choose proposal items"
                                                className="dropdown-custom"
                                                data={proposalItems}
                                                searchable={true}
                                                onChange={(value) => {
                                                    selectItems(value)
                                                }}
                                                style={{ width: '100%' }}
                                            />
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                    {
                                        items && items.length > 0 ? (
                                            <>
                                                {
                                                    items.map((field: FieldsModal, idx: number) => {
                                                        return (
                                                            <FlexboxGrid justify="space-between">
                                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24} style={{marginBottom: 10}}>
                                                                    <ControlLabel className="color-white">{field.label}</ControlLabel>
                                                                    <FormControl
                                                                        key={idx}
                                                                        type="text"
                                                                        className="input"
                                                                        name={field.name}
                                                                        placeholder={field.placeholder}
                                                                        value={field.value}
                                                                        onChange={(value) => {
                                                                            handelInputFieldOnchange(value, idx)
                                                                            validateItem(value, idx)
                                                                        }} />
                                                                    <ErrMessage message={field.errorMsg} />
                                                                </FlexboxGrid.Item>
                                                            </FlexboxGrid>
                                                        )
                                                    })
                                                }
                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginTop: '25px' }}>
                                                    <Button loading={loading} size="big" style={{ width: '250px' }} onClick={submit}>Submit</Button>
                                                </FlexboxGrid.Item>
                                            </>
                                        ) : <></>
                                    }
                                </FormGroup>
                            </Form>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Panel>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default CreateProposal;