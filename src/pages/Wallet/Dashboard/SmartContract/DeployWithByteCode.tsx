import React, { useState } from 'react';
import { Col, ControlLabel, Divider, FlexboxGrid, Form, FormControl, FormGroup, Icon, InputGroup, Modal, Panel, SelectPicker } from 'rsuite';
import { deploySmartContract, isExtensionWallet, deploySMCByEW } from '../../../../service';
import ReactJson from 'react-json-view'
import './smartContract.css'
import {
    Button,
    ErrMessage,
    NumberInputFormat,
    ErrorMessage,
    gasLimitDefault,
    copyToClipboard,
    jsonValid,
    gasPriceOption,
    onSuccess,
    ShowNotifyErr,
    ShowNotify
} from '../../../../common';
import { useRecoilValue } from 'recoil';
import walletState from '../../../../atom/wallet.atom';
import { GasMode } from '../../../../enum';

const DeployWithByteCode = () => {

    const [gasLimit, setGasLimit] = useState(gasLimitDefault);
    const [byteCode, setByteCode] = useState('')
    const [abi, setAbi] = useState('')
    const [byteCodeErr, setByteCodeErr] = useState('')
    const [abiErr, setAbiErr] = useState('')
    const [gasLimitErr, setGasLimitErr] = useState('')
    const [loading, setLoading] = useState(false)
    const [gasPrice, setGasPrice] = useState<GasMode>(GasMode.NORMAL)
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [deployedContract, setDeployedContract] = useState('')
    const [deployDone, setDeployDone] = useState(false)
    const [txDetail, setTxDetail] = useState('')
    const [showTxDetailModal, setShowTxDetailModal] = useState(false)
    const [contractJsonFileDownload, setContractJsonFileDownload] = useState<ContractJsonFile>({ contractAddress: "", byteCode: "", abi: "{}" })
    const [construcFields, setConstrucFields] = useState([] as any[]);
    const walletLocalState = useRecoilValue(walletState)


    const validateByteCode = (byteCode: string) => {
        if (!byteCode) {
            setByteCodeErr(ErrorMessage.Require)
            return false;
        }
        setByteCodeErr('')
        return true;
    }

    const validateAbi = (abiString: string): boolean => {
        if (!abiString) {
            setAbiErr(ErrorMessage.Require);
            return false;
        }
        if (!jsonValid(abiString)) {
            setAbiErr(ErrorMessage.AbiInvalid);
            return false;
        }
        setAbiErr('')
        return true;
    }

    const validateGasLimit = (gas: any): boolean => {
        if (!Number(gas)) {
            setGasLimitErr(ErrorMessage.Require);
            return false;
        }
        setGasLimitErr('')
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

    const resetAll = () => {
        setByteCode('')
        setAbi('')
        setByteCodeErr('')
        setAbiErr('')
        setGasLimitErr('')
        setGasPrice(GasMode.NORMAL)
        setGasPriceErr('')
        setDeployDone(false)
        setDeployedContract('')
        setTxDetail('')
        setConstrucFields([])
    }

    const deploy = async () => {
        try {
            setDeployDone(false)
            if (!validateGasLimit(gasLimit) || !validateByteCode(byteCode) || !validateAbi(abi)) {
                return false;
            }

            if (isExtensionWallet()) {
                try {
                    const params = construcFields && construcFields.length > 0 ? construcFields.map(item => JSON.parse(item.value)) : []
                    setLoading(true);
                    const response = await deploySMCByEW({
                        abi: abi,
                        bytecode: byteCode,
                        params: params,
                        gasLimit: gasLimit,
                        gasPrice: gasPrice
                    })

                    setLoading(false);
                    setDeployedContract(response.contractAddress)
                    setContractJsonFileDownload({
                        contractAddress: response.contractAddress,
                        byteCode: byteCode,
                        abi: abi
                    })
                    setTxDetail(response)
                    setDeployDone(true)

                } catch (error) {
                    ShowNotifyErr(error)
                }
                return;
            }

            setLoading(true);
            const txObject = {
                account: walletLocalState.account,
                abi: abi,
                bytecode: byteCode,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                params: construcFields && construcFields.length > 0 ? construcFields.map(item => JSON.parse(item.value)) : []
            } as SMCDeployObject

            const result = await deploySmartContract(txObject);
            ShowNotify(result)
            setDeployedContract(result.contractAddress)
            setContractJsonFileDownload({
                contractAddress: result.contractAddress,
                byteCode: byteCode,
                abi: abi
            })
            setTxDetail(result)
            setDeployDone(true)
        } catch (error) {
            ShowNotifyErr(error)
        }
        setLoading(false)
    }

    const formatAbiJson = () => {
        try {
            const abiFormated = JSON.stringify(JSON.parse(abi), undefined, 4);
            setAbi(abiFormated)
        } catch (error) {
            return
        }
    }

    const hanldeOnchangeAbi = (value: any) => {
        setAbi(value);
        if (validateAbi(value)) {
            const abiJson = JSON.parse(value)
            if (abiJson && abiJson.length > 0) {
                const construc = abiJson.filter((value: any) => value.type === 'constructor')
                setConstrucFields(construc[0] && construc[0].inputs && construc[0].inputs.map((item: any) => {
                    return {
                        name: item.name,
                        type: item.type,
                        value: ''
                    }
                }));
            }
        }
    }

    const downloadContractJsonFile = (object: ContractJsonFile) => {
        const _json = JSON.stringify(object);
        const blob = new Blob([_json], { type: 'text/plain' });
        const e = document.createEvent('MouseEvents'), a = document.createElement('a');
        a.download = `contract.json`;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initEvent('click', true, false);
        a.dispatchEvent(e);
    }

    const handelContrucFieldOnchange = (value: any, idx: any) => {
        const values = [...construcFields];
        values[idx].value = value;
        setConstrucFields(values)
    }

    return (
        <div className="deploy-bytecode-container">
            <div style={{ marginBottom: 16 }}>
                <div className="title header-title">
                    Deploy Smart Contract By ByteCode
                </div>
            </div>
            <Panel shaded className="panel-bg-gray">
                <Form fluid>
                    <FormGroup>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} sm={12}>
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
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} sm={12}>
                                <ControlLabel className="color-white">Gas Price (required)</ControlLabel>
                                <SelectPicker
                                    className="dropdown-custom w100"
                                    data={gasPriceOption}
                                    searchable={false}
                                    value={gasPrice}
                                    onChange={(value) => {
                                        setGasPrice(value)
                                        validateGasPrice(value)
                                    }}
                                    style={{ width: 250 }}
                                />
                                <ErrMessage message={gasPriceErr} />
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                <FlexboxGrid justify="space-between" align="middle" className="mb10">
                                    <ControlLabel className="color-white">Byte Code (required)</ControlLabel>
                                    <Button className="kai-button-gray pd0" onClick={() => { setByteCode('') }}>Clear</Button>
                                </FlexboxGrid>
                                <FormControl rows={20}
                                    style={{ minWidth: 100 }}
                                    name="bytecode"
                                    componentClass="textarea"
                                    placeholder="Byte Code"
                                    className="input"
                                    value={byteCode}
                                    onChange={(value) => {
                                        setByteCode(value)
                                        validateByteCode(value)
                                    }}
                                />
                                <ErrMessage message={byteCodeErr} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                <FlexboxGrid justify="space-between" align="middle">
                                    <ControlLabel className="color-white">ABI JSON (required)</ControlLabel>
                                    <div className="mb10">
                                        <Button className="kai-button-gray pd0"
                                            onClick={() => {
                                                setAbi('')
                                                setAbiErr('')
                                            }}>Clear</Button>
                                        <Button className="kai-button-gray pd0"
                                            onClick={() => {
                                                copyToClipboard(abi, onSuccess)
                                            }}>Copy</Button>
                                        <Button className="kai-button-gray pd0" onClick={formatAbiJson}>Format</Button>
                                    </div>
                                </FlexboxGrid>
                                <FormControl rows={20}
                                    style={{ minWidth: 100 }}
                                    name="abi"
                                    componentClass="textarea"
                                    className="input"
                                    placeholder="ABI"
                                    value={abi}
                                    onChange={(value) => {
                                        hanldeOnchangeAbi(value)
                                    }}
                                />
                                <ErrMessage message={abiErr} />
                            </FlexboxGrid.Item>
                            {
                                construcFields && construcFields.length > 0 ? (
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} sm={24}>
                                        <ControlLabel className="color-white">Constructor:</ControlLabel>
                                        {
                                            construcFields.map((field: any, idx: any) => {
                                                return (
                                                    <FormControl
                                                        key={idx}
                                                        style={{
                                                            marginBottom: 10,
                                                        }}
                                                        type="text"
                                                        name={field.name}
                                                        placeholder={`${field.type} ${field.name}`}
                                                        value={field.value}
                                                        onChange={(value) => {
                                                            handelContrucFieldOnchange(value, idx)
                                                        }} />
                                                )
                                            })
                                        }
                                    </FlexboxGrid.Item>
                                ) : <></>
                            }
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginTop: 20, paddingLeft: 0 }}>
                                <Button size="big" loading={loading} onClick={deploy}>Deploy Contract</Button>
                                <Button size="big" className="kai-button-gray" onClick={resetAll}>Reset</Button>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                        {
                            deployDone ?
                                <>
                                    <Divider />
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24}>
                                            <ControlLabel className="color-white">Your deployed contract:</ControlLabel>
                                            <InputGroup style={{ width: '100%' }}>
                                                <FormControl
                                                    readOnly
                                                    className="input"
                                                    name="deployedContract"
                                                    value={deployedContract}
                                                    onChange={(value) => {
                                                        setDeployedContract(value);
                                                    }}
                                                />
                                                <InputGroup.Button onClick={() => {
                                                    copyToClipboard(deployedContract, onSuccess)
                                                }}>
                                                    <Icon icon="copy" style={{ color: 'black' }} />
                                                </InputGroup.Button>
                                            </InputGroup>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ paddingLeft: 0 }}>
                                            <Button className="kai-button-gray" onClick={() => { setShowTxDetailModal(true) }} >
                                                <Icon icon="file-text-o" style={{ marginRight: 10 }} />View Transaction Details
                                            </Button>
                                            <Button style={{ marginTop: 15 }} className="kai-button-gray" onClick={() => { downloadContractJsonFile(contractJsonFileDownload) }} >
                                                <Icon icon="cloud-download" style={{ marginRight: 10 }} />Save Contract To Json File
                                            </Button>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </>
                                : <></>
                        }

                    </FormGroup>
                </Form>
            </Panel>
            {/* Modal show transaction details  */}
            <Modal size="lg" show={showTxDetailModal} onHide={() => { setShowTxDetailModal(false) }}>
                <Modal.Header>
                    <Modal.Title>Transaction Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReactJson src={{ txDetail }} theme="ocean" />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setShowTxDetailModal(false) }} className="ghost-button">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DeployWithByteCode;