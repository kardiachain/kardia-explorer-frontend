import React, { useState } from 'react'
import { Alert, Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, Panel } from 'rsuite';
import Button from '../../../../common/components/Button';
import ErrMessage from '../../../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../../../common/constant/Message';
import { copyToClipboard } from '../../../../common/utils/string';
import { addressValid, jsonValid } from '../../../../common/utils/validate';

const InteracteWithSmc = () => {

    const [smcAddr, setSmcAddr] = useState('')
    const [smcAddrErr, setSmcAddrErr] = useState('')
    const [abi, setAbi] = useState('')
    const [abiErr, setAbiErr] = useState('')

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

    const interact = async () => {
        if(!validateToAddress(smcAddr) || !validateAbi(abi)) {
            return
        }

        // TODO interact with smart contract
        try {
            
        } catch (error) {
            
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
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={16} style={{marginBottom: 20}}>
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
                                                    const onSuccess = () => {
                                                        Alert.success('Copied to clipboard.')
                                                    }
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
                                <Button size="big" style={{ width: '250px' }} onClick={interact}>INTERACT CONTRACT</Button>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </FormGroup>
                </Form>
            </Panel>
        </div>
    )
}

export default InteracteWithSmc;