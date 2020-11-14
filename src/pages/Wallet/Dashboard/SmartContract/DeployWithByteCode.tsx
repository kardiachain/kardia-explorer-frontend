import React, { useState } from 'react';
import { Alert, Col, ControlLabel, Divider, FlexboxGrid, Form, FormControl, FormGroup, Icon, InputGroup, Modal, Panel, SelectPicker } from 'rsuite';
import Button from '../../../../common/components/Button';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { onlyInteger } from '../../../../common/utils/number';
import { copyToClipboard } from '../../../../common/utils/string';
import { jsonValid } from '../../../../common/utils/validate';
import { deploySmartContract } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';
import ReactJson from 'react-json-view'
import './smartContract.css'

const onSuccess = () => {
    Alert.success('Copied to clipboard.')
}

const DeployWithByteCode = () => {

    const gasPriceOption = [
        { label: 'Normal (1 Gwei)', value: 1 },
        { label: 'Regular (2 Gwei)', value: 2 },
        { label: 'Fast (3 Gwei)', value: 3 },
    ] as any[]

    const [gasLimit, setGasLimit] = useState(1000000);
    const [byteCode, setByteCode] = useState('')
    const [abi, setAbi] = useState('')
    const [byteCodeErr, setByteCodeErr] = useState('')
    const [abiErr, setAbiErr] = useState('')
    const [gasLimitErr, setGasLimitErr] = useState('')
    const myAccount = getAccount() as Account
    const [loading, setLoading] = useState(false)
    const [gasPrice, setGasPrice] = useState(1)
    const [construc, setConstruc] = useState('')
    const [construcPlaceholder, setConstrucPlaceholder] = useState('')
    const [gasPriceErr, setGasPriceErr] = useState('')
    const [disableConstrucInput, setDisableConstrucInput] = useState(true)
    const [deployedContract, setDeployedContract] = useState('')
    const [deployDone, setDeployDone] = useState(false)
    const [txDetail, setTxDetail] = useState('')
    const [showTxDetailModal, setShowTxDetailModal] = useState(false)
    const [contractJsonFileDownload, setContractJsonFileDownload] = useState<ContractJsonFile>({ contractAddress: "", byteCode: "", abi: "{}" })
    const [deploySmcErr, setDeploySmcErr] = useState('')



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
        setGasPrice(1)
        setConstruc('')
        setConstrucPlaceholder('')
        setGasPriceErr('')
        setDisableConstrucInput(true)
        setDeployDone(false)
        setDeployedContract('')
        setTxDetail('')
        setDeploySmcErr('')
    }

    const deploy = async () => {
        try {
            if (!validateGasLimit(gasLimit) || !validateByteCode(byteCode) || !validateAbi(abi)) {
                return false;
            }
            setLoading(true)
            setDeploySmcErr('')

            const txObject = {
                account: myAccount,
                abi: abi,
                bytecode: byteCode,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                params: construc ? construc.split(",").map(item => item.trim()) : []
            } as SMCDeployObject
            const deployTx = await deploySmartContract(txObject);
            if (deployTx) {
                setDeployedContract(deployTx.contractAddress)
                setContractJsonFileDownload({
                    contractAddress: deployTx.contractAddress,
                    byteCode: byteCode,
                    abi: abi
                })
                setTxDetail(deployTx)
                setDeployDone(true)
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                setDeploySmcErr(`Deploy smart contract failed: ${errJson?.error?.message}`)
            } catch (error) {
                setDeploySmcErr('Deploy smart contract failed.')
            }
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
                const placeHoler = construc[0] && construc[0].inputs && construc[0].inputs.map((item: any) => {
                    return `${item.type} ${item.name}`
                });
                if (placeHoler && placeHoler.length > 0) {
                    setConstrucPlaceholder(placeHoler.join(', '))
                    setDisableConstrucInput(false)
                }
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

    return (
        <div className="deploy-bytecode-container">
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="logo-dmp" size={"lg"} />
                    <p style={{ marginLeft: '12px' }} className="title">Deploy Smart Contract By ByteCode</p>
                </div>
            </div>
            <Panel shaded>
                <Form fluid>
                    <FormGroup>
                        <FlexboxGrid>
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
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                <FlexboxGrid justify="space-between">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} className="form-addon-container">
                                        <ControlLabel>Byte Code:<span className="required-mask">*</span></ControlLabel>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} className="form-addon-container button-addon">
                                        <div>
                                            <Button className="ghost-button" onClick={() => { setByteCode('') }}>Clear</Button>
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                                <FormControl rows={20}
                                    name="bytecode"
                                    componentClass="textarea"
                                    placeholder="Byte Code"
                                    value={byteCode}
                                    onChange={(value) => {
                                        setByteCode(value)
                                        validateByteCode(value)
                                    }}
                                />
                                <ErrMessage message={byteCodeErr} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                <FlexboxGrid justify="space-between">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} className="form-addon-container">
                                        <ControlLabel>Abi Json:<span className="required-mask">*</span></ControlLabel>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={18} className="form-addon-container button-addon">
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
                                <FormControl rows={20}
                                    name="abi"
                                    componentClass="textarea"
                                    placeholder="ABI"
                                    value={abi}
                                    onChange={(value) => {
                                        hanldeOnchangeAbi(value)
                                    }}
                                />
                                <ErrMessage message={abiErr} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24}>
                                <ControlLabel>Constructor:</ControlLabel>
                                <FormControl
                                    disabled={disableConstrucInput}
                                    name="construc"
                                    placeholder={construcPlaceholder}
                                    value={construc}
                                    onChange={(value) => {
                                        setConstruc(value);
                                    }}
                                />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24} style={{ marginTop: '25px', paddingLeft: 0 }}>
                                <Button size="big" loading={loading} onClick={deploy} style={{ width: '230px' }}>Deploy Contract</Button>
                                <Button size="big" className="ghost-button" onClick={resetAll}>Reset</Button>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ paddingLeft: 0 }}>
                                <ErrMessage message={deploySmcErr} />
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                        {
                            deployDone ?
                                <>
                                    <Divider />
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24}>
                                            <ControlLabel>Your deployed contract:</ControlLabel>
                                            <InputGroup style={{ width: '100%' }}>
                                                <FormControl
                                                    readOnly
                                                    name="deployedContract"
                                                    value={deployedContract}
                                                    onChange={(value) => {
                                                        setDeployedContract(value);
                                                    }}
                                                />
                                                <InputGroup.Button onClick={() => {
                                                    copyToClipboard(deployedContract, onSuccess)
                                                }}>
                                                    <Icon icon="copy" />
                                                </InputGroup.Button>
                                            </InputGroup>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ paddingLeft: 0 }}>
                                            <Button className="ghost-button" onClick={() => { setShowTxDetailModal(true) }} >
                                                <Icon icon="file-text-o" style={{ marginRight: 10 }} />View Transaction Details
                                            </Button>
                                            <Button style={{ marginTop: 15 }} className="ghost-button" onClick={() => { downloadContractJsonFile(contractJsonFileDownload) }} >
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
                    <ReactJson src={{ txDetail }} />
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