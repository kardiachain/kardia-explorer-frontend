import React, { useState } from 'react';
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, InputGroup, Panel, SelectPicker, Tooltip, Whisper } from 'rsuite';
import Button from '../../../../common/components/Button';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { jsonValid } from '../../../../common/utils/validate';
import { deploySmartContract } from '../../../../service/smc';
import { getAccount } from '../../../../service/wallet';
import './smartContract.css'

const tooltip = (
    <Tooltip>
        Format Abi Json
    </Tooltip>
);

const DeployWithByteCode = () => {

    const gasPriceOption = [
        {label: 'Nomal (1 Gwei)', value: 1},
        {label: 'Regular (2 Gwei)', value: 2},
        {label: 'Fast (3 Gwei)', value: 3},
    ] as any[]

    const [gasLimit, setGasLimit] = useState(21000);
    const [byteCode, setByteCode] = useState('')
    const [abi, setAbi] = useState('')
    const [byteCodeErr, setByteCodeErr] = useState('')
    const [abiErr, setAbiErr] = useState('')
    const [gasLimitErr, setGasLimitErr] = useState('')
    const myAccount = getAccount() as Account
    const [loading, setLoading] = useState(false)
    const [gasPrice, setGasPrice] = useState(1)
    const [constructor, setConstructor] = useState([] as any[])
    const [constructorPlaceholder, setConstructorPlaceholder] = useState('')

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

    const deploy = async () => {
        if (!validateByteCode(byteCode) || !validateAbi(abi)) {
            return false;
        }
        setLoading(true)
        const txObject = {
            account: myAccount,
            abi: abi,
            bytecode: byteCode,
            gasLimit: gasLimit,
            gasPrice: gasPrice,
            params: constructor
        } as SMCDeployObject
        const deploy = await deploySmartContract(txObject);
        setLoading(false)
        console.log(deploy);
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
        validateAbi(value)
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
                                        setGasLimit(value);
                                        validateGasLimit(value)
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
                                    onChange={setGasPrice}
                                    style={{ width: 250 }}
                                />
                                <ErrMessage message={gasLimitErr} />
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12} sm={24}>
                                <ControlLabel>Byte Code:<span className="required-mask">*</span></ControlLabel>
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
                                <ControlLabel>Abi Json:<span className="required-mask">*</span></ControlLabel>
                                <InputGroup inside style={{ width: '100%' }}>
                                    <FormControl rows={20}
                                        name="abi"
                                        componentClass="textarea"
                                        placeholder="ABI"
                                        value={abi}
                                        onChange={(value) => {
                                            setAbi(value);
                                            validateAbi(value)
                                        }}
                                    />
                                    <InputGroup.Addon style={{ left: 0, bottom: 0, top: 'unset' }}>
                                        <Whisper placement="top" trigger="hover" speaker={tooltip}>
                                            <Icon onClick={formatAbiJson} style={{ cursor: 'pointer' }} className="highlight" icon="align-justify" />
                                        </Whisper>
                                    </InputGroup.Addon>
                                </InputGroup>
                                <ErrMessage message={abiErr} />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={6} sm={12}>
                                <ControlLabel>Constructor:</ControlLabel>
                                <FormControl  
                                    name="constructor"
                                    placeholder={constructorPlaceholder}
                                    value={constructor}
                                    onChange={(value) => {
                                        hanldeOnchangeAbi(value);
                                    }}
                                />
                                {/* <ErrMessage message={gasLimitErr} /> */}
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