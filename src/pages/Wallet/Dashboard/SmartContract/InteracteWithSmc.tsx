import React, { useState } from 'react'
import ReactJson from 'react-json-view';
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, Modal, Panel, SelectPicker, Steps, Uploader } from 'rsuite';
import { FileType } from 'rsuite/lib/Uploader';
import Button from '../../../../common/components/Button';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { gasLimitDefault, gasPriceOption } from '../../../../common/constant';
import { ErrorMessage } from '../../../../common/constant/Message';
import { onlyInteger } from '../../../../common/utils/number';
import { copyToClipboard, renderHashToRedirect } from '../../../../common/utils/string';
import { addressValid, jsonValid } from '../../../../common/utils/validate';
import { invokeFunctionFromContractAbi } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';
import './smartContract.css'

const onSuccess = () => {
    Alert.success('Copied to clipboard.');
}

const InteracteWithSmc = () => {

    const [smcAddr, setSmcAddr] = useState('')
    const [smcAddrErr, setSmcAddrErr] = useState('')
    const [abi, setAbi] = useState('')
    const [abiErr, setAbiErr] = useState('')
    const [smcFuncList, setSmcFuncList] = useState([] as any[])
    const [smcFuncActive, setSmcFuncActive] = useState({} as any)
    const myAccount = getAccount() as Account
    const [currentStep, setCurrentStep] = useState(0)
    const [loadingExecute, setLoadingExecute] = useState(false)
    const [gasLimit, setGasLimit] = useState(gasLimitDefault)
    const [gasLimitErr, setGasLimitErr] = useState('')
    const [gasPrice, setGasPrice] = useState(1)
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [interactErr, setInteractErr] = useState('')
    const [txResult, setTxResult] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [fileList, setListFile] = useState([] as FileType[]);
    const [fileUploadErr, setFileUploadErr] = useState('');
    const [interactType, setInteractType] = useState('') // interact with smc had 2 type: call or send
    const [txHash, setTxHash] = useState('')
    const [showTxDetailModal, setShowTxDetailModal] = useState(false)
    const [payableAmount, setPayableAmount] = useState(0)
    const [payableFunction, setPayableFunction] = useState(false)

    const [paramsFields, setParamsFields] = useState([] as any[]);

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

    const validateToAddress = (addr: string): boolean => {
        if (!addr) {
            setSmcAddrErr(ErrorMessage.Require)
            return false
        }
        if (!addressValid(addr)) {
            setSmcAddrErr(ErrorMessage.AddressInvalid)
            return false
        }
        setSmcAddrErr('')
        return true
    }

    const formatAbiJson = () => {
        try {
            const abiFormated = JSON.stringify(JSON.parse(abi), undefined, 4);
            setAbi(abiFormated)
        } catch (error) {
            return
        }
    }

    const compilerABIStep = () => {
        if (!validateToAddress(smcAddr) || !validateAbi(abi)) {
            return
        }
        // TODO interact with smart contract
        const abiJson = JSON.parse(abi)
        const smcFuncList = abiJson.length > 0 ? abiJson.filter((item: any) => item.type === "function").map((item: any) => {
                return {
                    label: item.name,
                    value: item
                }
        }) : [];
        setSmcFuncList(smcFuncList);
        setCurrentStep(1)
    }

    const executeFunction = async () => {
        setLoadingExecute(true)
        setShowResult(false)
        setInteractErr('')
        try {
            const txObject = {
                contractAddress: smcAddr,
                account: myAccount,
                abi: abi,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                params: paramsFields && paramsFields.length > 0 ? paramsFields.map(item => JSON.parse(item.value)) : [],
                isPure: smcFuncActive ? (smcFuncActive.stateMutability === 'view' || smcFuncActive.stateMutability === 'pure' ? true : false) : [],
                functionName: smcFuncActive ? smcFuncActive.name : '',
                amount: payableAmount
            } as SMCInvokeObject

            setInteractType(txObject.isPure ? "call" : "send")
            const invokeTx = await invokeFunctionFromContractAbi(txObject);
            if (txObject.isPure) {
                setTxResult(invokeTx);
                setShowResult(true)
            } else {
                if (invokeTx?.status === 1) {
                    Alert.success("Interact with smart contract success.")
                } else {
                    const errMsg = invokeTx && invokeTx.gasUsed === Number(gasLimit) ? 'Invoke to smart contract fail with error: Out of gas' : 'Invoke to smart contract failed.'
                    setInteractErr(errMsg)
                }
                setTxResult(invokeTx);
                setShowResult(true)
                setTxHash(invokeTx.transactionHash)
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                setInteractErr(`Invoke to smart contract failed: ${errJson?.error?.message}`)
            } catch (error) {
                setInteractErr('Invoke to smart contract failed.')
            }
        }
        setLoadingExecute(false)
    }

    const selectFunction = (value: any) => {
        setInteractErr('')
        setShowResult(false)
        setPayableFunction(false)
        try {
            setParamsFields([])
            if (value.inputs && value.inputs.length > 0) {
                setParamsFields(
                    value.inputs.map((item: any) => {
                        return {
                            name: item.name,
                            type: item.type,
                            value: ''
                        }
                    })
                )
            }
            if(value.stateMutability === 'payable') {
                setPayableFunction(true)
            }
            setSmcFuncActive(value)
        } catch (error) {
            console.log(error);
        }
    }

    const uploadFileFailed = (response: Object, file: FileType) => {
        setListFile([]);
        Alert.error('Uploaded failed.');
    }

    const handleRemoveFile = (file: FileType) => {
        setListFile([]);
        setAbi('')
        setSmcAddr('')
    }

    const handleUpload = (fileList: any) => {
        setFileUploadErr('')
        if (fileList.length > 0) {
            setListFile([fileList[fileList.length - 1]]);
            const reader = new FileReader();
            reader.readAsText(fileList[fileList.length - 1].blobFile)
            reader.onload = () => {
                const { contractAddress, abi } = JSON.parse(reader.result as any)
                if (!validateToAddress(contractAddress) || !validateAbi(abi)) {
                    setFileUploadErr(ErrorMessage.FileUploadInvalid)
                    setAbi('')
                    setSmcAddr('')
                    setListFile([]);
                    return
                }
                setListFile([fileList[fileList.length - 1]]);
                setAbi(abi)
                setSmcAddr(contractAddress)
                Alert.success('Uploaded successfully.');
            }
        }
    }

    const resetAll = () => {
        setSmcAddr('')
        setSmcAddrErr('')
        setAbi('')
        setAbiErr('')
        setSmcFuncList([] as any)
        setSmcFuncActive({} as any)
        setCurrentStep(0)
        setGasLimit(gasLimitDefault);
        setGasLimitErr('')
        setGasPrice(1)
        setGasPriceErr('')
        setInteractErr('')
        setTxResult('')
        setShowResult(false)
        setListFile([] as FileType[])
        setFileUploadErr('')
        setInteractType('')
        setTxHash('')
    }

    const handelInputFieldOnchange = (value: any, idx: any) => {
        const values = [...paramsFields];
        values[idx].value = value;
        setParamsFields(values)
    }

    return (
        <div className="interact-smc-container">
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="related-map" size={"lg"} />
                    <p style={{ marginLeft: '12px' }} className="title">Interact With Smart Contract</p>
                </div>
            </div>
            <Panel shaded>
                <Form fluid>
                    <FormGroup>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginBottom: 20 }}>
                                <Steps current={currentStep}>
                                    <Steps.Item title="Select Your Contract" />
                                    <Steps.Item title="Invoke Contract" />
                                </Steps>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                        {
                            currentStep === 0 ? (
                                <>
                                    <FlexboxGrid style={{ marginBottom: 20 }}>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} sm={12}>
                                            <ControlLabel className="label">Gas Limit <span className="required-mask">(*)</span></ControlLabel>
                                            <FormControl name="gaslimit"
                                                placeholder="Gas Limit"
                                                value={gasLimit}
                                                onChange={(value) => {
                                                    if (onlyInteger(value)) {
                                                        setGasLimit(value);
                                                        validateGasLimit(value)
                                                    }
                                                }}
                                                width={50}
                                            />
                                            <ErrMessage message={gasLimitErr} />
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} sm={12}>
                                            <ControlLabel className="label">Gas Price <span className="required-mask">(*)</span></ControlLabel>
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
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24} style={{ marginBottom: 20 }}>
                                            <ControlLabel className="label">Contract Address <span className="required-mask">(*)</span></ControlLabel>
                                            <FormControl name="smcAddr"
                                                placeholder="Input Contract Address"
                                                value={smcAddr}
                                                onChange={(value) => {
                                                    setSmcAddr(value)
                                                    validateToAddress(value)
                                                }}
                                            />
                                            <ErrMessage message={smcAddrErr} />
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24}>
                                            <ControlLabel className="label">{'Or Upload Your <contract.json> file'} <span className="required-mask">(*)</span></ControlLabel>
                                            <Uploader
                                                action="//jsonplaceholder.typicode.com/posts/"
                                                draggable
                                                fileList={fileList}
                                                onChange={handleUpload}
                                                onError={uploadFileFailed}
                                                onRemove={handleRemoveFile}>
                                                <FormControl name="smcAddr"
                                                    style={{ padding: '11px 12px' }}
                                                    placeholder="Upload Your <contract.json> file:"
                                                />
                                            </Uploader>
                                            <ErrMessage message={fileUploadErr} />
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                            <FlexboxGrid justify="space-between" align="middle" className="mb10">
                                                    <ControlLabel className="label">ABI JSON <span className="required-mask">(*)</span></ControlLabel>
                                                    <div>
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
                                            <FormControl rows={10}
                                                name="abi"
                                                componentClass="textarea"
                                                placeholder="ABI"
                                                value={abi}
                                                onChange={(value) => {
                                                    setAbi(value)
                                                    validateAbi(value)
                                                }}
                                            />
                                            <ErrMessage message={abiErr} />
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginTop: '25px', paddingLeft: 0 }}>
                                            <Button size="big" onClick={compilerABIStep}>Go To Contract</Button>
                                            <Button size="big" className="kai-button-gray" onClick={resetAll}>Reset</Button>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </>
                            ) : (
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                            <Button className="kai-button-gray"
                                                style={{ marginBottom: '25px' }}
                                                onClick={() => {
                                                    setCurrentStep(0)
                                                    resetAll()
                                                }}
                                            >
                                                <Icon icon="angle-double-left" /><Icon icon="angle-double-left" /> Back
                                            </Button>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24}>
                                            <ControlLabel className="label">Interact With Contract</ControlLabel>
                                            <SelectPicker
                                                placeholder="Select a function"
                                                data={smcFuncList}
                                                searchable={false}
                                                className="dropdown-custom"
                                                style={{ width: "100%" }}
                                                onChange={(value) => {
                                                    selectFunction(value)
                                                }}
                                            />
                                        </FlexboxGrid.Item>
                                        {
                                            paramsFields && paramsFields.length > 0 ? (
                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24}>
                                                    <ControlLabel className="label">Params: </ControlLabel>
                                                    {
                                                        paramsFields.map((field: any, idx: any) => {
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
                                                                        handelInputFieldOnchange(value, idx)
                                                                    }} />
                                                            )
                                                        })
                                                    }
                                                </FlexboxGrid.Item>
                                            ) : <></>
                                        }
                                        {
                                            payableFunction ? 
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24}>
                                                <ControlLabel className="label">Payable Amount: </ControlLabel>
                                                <FormControl
                                                    name="payableAmount"
                                                    placeholder="Payable Amount"
                                                    value={payableAmount}
                                                    onChange={(value) => {
                                                        if (onlyInteger(value)) {
                                                            setPayableAmount(value)
                                                        }
                                                    }
                                                } />
                                            </FlexboxGrid.Item> : <></>
                                        }

                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginTop: '25px' }}>
                                            <Button size="big" style={{ width: '250px' }} loading={loadingExecute} onClick={executeFunction}>Execute</Button>
                                            <ErrMessage message={interactErr} />
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginTop: '25px' }}>
                                            {
                                                showResult ? <>
                                                    {
                                                        interactType === "call" ?
                                                            <ControlLabel className="label"><ReactJson name={false} src={{ txResult }} /></ControlLabel> :
                                                            (
                                                                interactType === "send" ? (
                                                                    <>
                                                                        {
                                                                            txHash ? <div style={{ marginBottom: '20px', wordBreak: 'break-all' }}>
                                                                                Txs hash: {renderHashToRedirect({ hash: txHash, headCount: 100, tailCount: 4, showTooltip: false, callback: () => { window.open(`/tx/${txHash}`) } })}
                                                                            </div> : <></>
                                                                        }
                                                                        <Button className="kai-button-gray" onClick={() => { setShowTxDetailModal(true) }}>
                                                                            <Icon icon="file-text-o" style={{ marginRight: 10 }} />View Transaction Details
                                                                        </Button>
                                                                    </>
                                                                ) : <></>
                                                            )
                                                    }
                                                </> : <></>
                                            }
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                )
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
                    <ReactJson name={false} src={{ txResult }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setShowTxDetailModal(false) }} className="kai-button-gray">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default InteracteWithSmc;