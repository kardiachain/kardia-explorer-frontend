import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { CheckPicker, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Modal, Panel, SelectPicker } from 'rsuite';
import walletState from '../../../../atom/wallet.atom';
import {
    cellValue,
    Button,
    NumberInputFormat,
    gasLimitDefault,
    gasPriceOption,
    ErrorMessage,
    InforMessage,
    ErrMessage,
    ShowNotifyErr,
    ShowNotify
} from '../../../../common';
import { proposalItems } from './type';
import './style.css'
import {
    getStoredBalance,
    isExtensionWallet,
    getCurrentNetworkParams,
    createNewProposal,
    createProposalByEW
} from '../../../../service';
import { GasMode } from '../../../../enum';

interface FieldsModal {
    value: string;
    name: string;
    label: string;
    keyId: any;
    placeholder: string;
    errorMsg: string;
    type: string;
}

const CreateProposal = () => {

    const [items, setItems] = useState([] as FieldsModal[]);
    const [loading, setLoading] = useState(false);
    const [gasPrice, setGasPrice] = useState<GasMode>(GasMode.NORMAL);
    const [gasPriceErr, setGasPriceErr] = useState('');
    const [gasLimit, setGasLimit] = useState(gasLimitDefault);
    const [gasLimitErr, setGasLimitErr] = useState('');
    const [currentNetworkParams, setCurrentNetworkParams] = useState<NetworkParams>({} as NetworkParams);
    const [readyStarting, setReadyStarting] = useState(false)
    const [showModelConfirm, setShowModelConfirm] = useState(false)

    const walletLocalState = useRecoilValue(walletState)

    useEffect(() => {
        (async () => {
            const _proposal = await getCurrentNetworkParams()
            setCurrentNetworkParams(_proposal)
            const balance = getStoredBalance();
            if (balance >= 500000) {
                setReadyStarting(true)
            }
        })()
    }, [])

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
                keyId: item.keyId,
                type: item.type ? item.type : '',
                value: (currentNetworkParams as any)[item.name]
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
        setShowModelConfirm(true)
    }

    const confirm = async () => {
        setLoading(true)
        try {
            const paramsKey = items.map((item) => {
                return item.keyId
            });
            const paramsValue = items.map((item) => {
                if (item.type === 'decimal') {
                    return cellValue(item.value);
                } else if (item.type === 'percent') {
                    return cellValue(Number(item.value) / 100);
                }
                return item.value
            })

            if (isExtensionWallet()) {
                await createProposalByEW(paramsKey, paramsValue)
            } else {
                const response = await createNewProposal(walletLocalState.account, paramsKey, paramsValue, gasLimit, gasPrice);
                ShowNotify(response)
            }
        } catch (error) {
            ShowNotifyErr(error)
        }
        setLoading(false)
        setShowModelConfirm(false)
        resetForm()
    }

    const resetForm = () => {
        // setItems([] as FieldsModal[])
        setLoading(false)
        setGasPrice(GasMode.NORMAL)
        setGasPriceErr('')
        setGasLimit(gasLimitDefault)
        setGasLimitErr('')
    }

    return (
        <>
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
                                        <div className="proposal-note">You must lock 500,000 KAI to create a proposal. The network will refund your tokens if the proposal is approved by 2/3+ voting power, otherwise it will be slashed and locked into the Kardia Treasury.</div>
                                        <FlexboxGrid>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} xs={24} style={{ marginBottom: 15 }}>
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
                                                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24} style={{ marginBottom: 10 }}>
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
                                                        {
                                                            !readyStarting ? <div className="warning-note" style={{ marginBottom: 5, fontSize: 14 }}>
                                                                {InforMessage.CreateProposalCondition}</div> : <></>
                                                        }
                                                        <Button
                                                            loading={loading}
                                                            size="big" style={{ width: '250px' }}
                                                            onClick={submit}
                                                            disable={!readyStarting}
                                                        >Submit</Button>
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

            {/* Modal confirm when create proposal */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showModelConfirm} onHide={() => { setShowModelConfirm(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirm create proposal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm-letter" style={{ textAlign: 'center' }}>
                        Are you sure you want to create proposal
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="kai-button-gray" onClick={() => { setShowModelConfirm(false) }}>
                        Cancel
            </Button>
                    <Button loading={loading} onClick={confirm}>
                        Confirm
            </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CreateProposal;