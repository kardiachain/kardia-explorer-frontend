import React, { useState } from 'react';
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, InputGroup, Panel, SelectPicker } from 'rsuite';
import Button from '../../../../common/components/Button';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { onlyInteger } from '../../../../common/utils/number';
import { copyToClipboard } from '../../../../common/utils/string';
import { jsonValid } from '../../../../common/utils/validate';
import { deploySmartContract } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';
import './smartContract.css'

const DeployWithByteCode = () => {

    const gasPriceOption = [
        { label: 'Nomal (1 Gwei)', value: 1 },
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
        if(!Number(gasPrice)) {
            setGasPriceErr(ErrorMessage.Require)
            return false
        }
        setGasPriceErr('')
        return true
    }

    const deploy = async () => {
        try {
            if (!validateGasLimit(gasLimit) || !validateByteCode(byteCode) || !validateAbi(abi)) {
                return false;
            }
            setLoading(true)
            const txObject = {
                account: myAccount,
                abi: abi,
                bytecode: byteCode,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                // params: construc.split(",").map(item => item.trim())
                params: [],
            } as SMCDeployObject
            const deploy = await deploySmartContract(txObject);
            setLoading(false)
            console.log("Deploy", deploy);
        } catch (error) {
            console.log(error);
        }
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
                setConstrucPlaceholder(placeHoler && placeHoler.length > 0 && placeHoler.join(', '))
            }
        }
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
                                                const onSuccess = () => {
                                                    Alert.success('Copied to clipboard.')
                                                }
                                                copyToClipboard(abi, onSuccess)
                                            }}>Copy</Button>
                                            <Button className="ghost-button" onClick={formatAbiJson}>Format</Button>
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                                <InputGroup inside style={{ width: '100%' }}>
                                    <FormControl rows={20}
                                        name="abi"
                                        componentClass="textarea"
                                        placeholder="ABI"
                                        value={abi}
                                        onChange={(value) => {
                                            hanldeOnchangeAbi(value)
                                        }}
                                    />
                                </InputGroup>
                                <ErrMessage message={abiErr} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={12}>
                                <ControlLabel>Constructor:</ControlLabel>
                                <FormControl
                                    name="construc"
                                    placeholder={construcPlaceholder}
                                    value={construc}
                                    onChange={(value) => {
                                        setConstruc(value);
                                    }}
                                />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24} style={{ marginTop: '25px', paddingLeft: 0 }}>
                                <Button size="big" loading={loading} onClick={deploy} style={{ width: '230px' }}>DEPLOY CONTRACT</Button>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </FormGroup>
                </Form>
            </Panel>
        </div>
    )
}

export default DeployWithByteCode;