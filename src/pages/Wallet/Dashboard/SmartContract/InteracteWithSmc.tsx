import React, { useState } from 'react'
import ReactJson from 'react-json-view';
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, Panel, SelectPicker, Steps, Uploader } from 'rsuite';
import { FileType } from 'rsuite/lib/Uploader';
import Button from '../../../../common/components/Button';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { onlyInteger } from '../../../../common/utils/number';
import { copyToClipboard } from '../../../../common/utils/string';
import { addressValid, jsonValid } from '../../../../common/utils/validate';
import { invokeFunctionFromContractAbi } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';
import './smartContract.css'


const onSuccess = () => {
    Alert.success('Copied to clipboard.')
}

const InteracteWithSmc = () => {

    const gasPriceOption = [
        { label: 'Normal (1 Gwei)', value: 1 },
        { label: 'Regular (2 Gwei)', value: 2 },
        { label: 'Fast (3 Gwei)', value: 3 },
    ] as any[]

    const [smcAddr, setSmcAddr] = useState('')
    const [smcAddrErr, setSmcAddrErr] = useState('')
    const [abi, setAbi] = useState('')
    const [abiErr, setAbiErr] = useState('')
    const [smcFuncList, setSmcFuncList] = useState([] as any[])
    const [paramsPlaceholder, setparamsPlaceholder] = useState('');
    const [paramsInput, setParamsInput] = useState('')
    const [smcFuncActive, setSmcFuncActive] = useState({} as any)
    const myAccount = getAccount() as Account
    const [currentStep, setCurrentStep] = useState(0)
    const [loadingExecute, setLoadingExecute] = useState(false)
    const [gasLimit, setGasLimit] = useState(1000000)
    const [gasLimitErr, setGasLimitErr] = useState('')
    const [gasPrice, setGasPrice] = useState(1)
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [interactErr, setInteractErr] = useState('')
    const [txResult, setTxResult] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [fileList, setListFile] = useState([] as FileType[]);
    const [fileUploadErr, setFileUploadErr] = useState('');

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
        const smcFuncList = abiJson.length > 0 ? abiJson.map((item: any) => {
            if (item.type === "function") {
                return {
                    label: item.name,
                    value: item
                }
            }
        }).filter((item: any) => item) : [];
        setSmcFuncList(smcFuncList);
        setCurrentStep(1)
    }

    const executeFunction = async () => {
        setLoadingExecute(true)
        setShowResult(false)
        try {
            const txObject = {
                contractAddress: smcAddr,
                account: myAccount,
                abi: abi,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                params: paramsInput ? paramsInput.split(",").map(item => item.trim()) : [],
                isPure: smcFuncActive.stateMutability === 'view' || smcFuncActive.stateMutability === 'pure' ? true : false,
                functionName: smcFuncActive.name,
                amount: 0
            } as SMCInvokeObject
            const invokeTx = await invokeFunctionFromContractAbi(txObject);
            setTxResult(invokeTx);
            setShowResult(true)
            console.log("InvokeTx", invokeTx)
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
        try {
            setParamsInput('')
            setparamsPlaceholder('')
            if (value.stateMutability !== 'pure' && value.stateMutability !== 'view') {
                const placeHoler = value.inputs && value.inputs.length > 0 && value.inputs.map((item: any) => {
                    return `${item.type} ${item.name}`
                });
                if (placeHoler && placeHoler.length > 0) {
                    setparamsPlaceholder(placeHoler.join(', '))
                }
            }
            console.log("Value: ", value);

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
                if(!validateToAddress(contractAddress) || !validateAbi(abi)) {
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
                                            <ControlLabel>Gas Limit:<span className="required-mask">*</span></ControlLabel>
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
                                            <ControlLabel>Gas Price:<span className="required-mask">*</span></ControlLabel>
                                            <SelectPicker
                                                className="dropdown-custom"
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
                                            <ControlLabel>Contract Address:<span className="required-mask">*</span></ControlLabel>
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
                                            <ControlLabel>{'Or Upload Your <contract.json> file:'}<span className="required-mask">*</span></ControlLabel>
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
                                            <FlexboxGrid justify="space-between">
                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} className="form-addon-container">
                                                    <ControlLabel>Abi Json:<span className="required-mask">*</span></ControlLabel>
                                                </FlexboxGrid.Item>
                                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} className="form-addon-container button-addon">
                                                    <div>
                                                        <Button className="ghost-button"
                                                            onClick={() => {
                                                                setAbi('')
                                                                setAbiErr('')
                                                            }}>Clear</Button>
                                                        <Button className="ghost-button"
                                                            onClick={() => {
                                                                copyToClipboard(abi, onSuccess)
                                                            }}>Copy</Button>
                                                        <Button className="ghost-button" onClick={formatAbiJson}>Format</Button>
                                                    </div>
                                                </FlexboxGrid.Item>
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
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24} style={{ marginTop: '25px', paddingLeft: 0 }}>
                                            <Button size="big" style={{ width: '250px' }} onClick={compilerABIStep}>Go To Contract</Button>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </>
                            ) : (
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24}>
                                            <ControlLabel>Interact With Contract</ControlLabel>
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
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24}>
                                            <ControlLabel>Params: </ControlLabel>
                                            <FormControl rows={10}
                                                disabled={paramsPlaceholder === ''}
                                                name="params"
                                                placeholder={paramsPlaceholder}
                                                value={paramsInput}
                                                onChange={(value) => {
                                                    setParamsInput(value)
                                                }}
                                            />
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginTop: '25px' }}>
                                            <Button size="big" style={{ width: '250px' }} loading={loadingExecute} onClick={executeFunction}>Execute</Button>
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{}}>
                                            <ErrMessage message={interactErr} />
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginTop: '25px' }}>
                                            {
                                                showResult ? <>
                                                    <ControlLabel >Result: </ControlLabel>
                                                    <ReactJson src={{ txResult }} />
                                                </> : <></>
                                            }
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                )
                        }

                    </FormGroup>
                </Form>
            </Panel>
        </div>
    )
}

export default InteracteWithSmc;