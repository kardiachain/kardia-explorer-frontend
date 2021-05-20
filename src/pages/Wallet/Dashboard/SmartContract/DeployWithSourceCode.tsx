import React, { useState } from 'react';
import { Col, FlexboxGrid, Form, FormControl, FormGroup, Icon, Panel, SelectPicker, Steps } from 'rsuite';
import AceEditor from "react-ace";
import "ace-mode-solidity/build/remix-ide/mode-solidity";
import "ace-builds/src-noconflict/theme-monokai";
import { Button, TrueOrFalse } from '../../../../common';
import { compileSourceCode } from '../../../../service';

const DeployWithSourceCode = () => {

    const [smcCode, setSmcCode] = useState('')
    const [byteCode, setByteCode] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [optimize, setOptimize] = useState('');
    const [compilerVersion, setCompilerVersion] = useState('');
    const [constructorArgument, setConstructorArgument] = useState('');



    const getByteCode = async () => {
        const param = {
            sourceCode: JSON.stringify(smcCode)
        }
        const response = await compileSourceCode(param);
        for (var contractName in response.contracts['output.sol']) {
            const byteCode = response.contracts['output.sol'][contractName].evm.bytecode.object
            setByteCode(byteCode);
        }
    }

    const verify = () => {
        // compare input data

        // success => switch to Compiler Output tabs
    }

    return (
        <div>
                <Form>
                    <div className="row" style={{ display: 'inline-flex', gap: '12px', marginBottom: '16px' }}>
                        <div className="flex-1" style={{ flex: 1 }}>
                            <p className="rs-control-label color-white">
                                Contract Address
                    </p>
                            <FormControl name="smcAddr"
                                placeholder="Ex: 0x0c2fcf8836e1652448b58080679101f819681b6d"
                                className="input"
                                value={contractAddress}
                                onChange={(value) => {
                                    setContractAddress(value)
                                }}
                            />
                        </div>

                        <div className="flex-1" style={{ flex: 1 }}>
                            <p className="rs-control-label color-white">
                                Compiler
                    </p>
                            <FormControl name="smcAddr"
                                placeholder="Select version"
                                className="input"
                                value={compilerVersion}
                                onChange={(value) => {
                                    setCompilerVersion(value)
                                }}
                            />
                        </div>

                        <div className="flex-1" style={{ flex: 1 }}>
                            <p className="rs-control-label color-white">
                                Optimization
                    </p>
                            <SelectPicker
                                className="dropdown-custom"
                                data={TrueOrFalse}
                                searchable={false}
                                value={optimize}
                                onChange={(value) => {
                                    setOptimize(value)
                                }}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                </Form>

                <Form fluid>
                    <FormGroup>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} sm={24}>
                                <p className="rs-control-label color-white">Enter the Solidity Contract Code below *</p>
                                <AceEditor
                                    placeholder=""
                                    mode="solidity"
                                    theme="monokai"
                                    width='100%'
                                    name="smcCode"
                                    fontSize={16}
                                    showPrintMargin={false}
                                    showGutter={true}
                                    highlightActiveLine={true}
                                    value={smcCode}
                                    setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                        showLineNumbers: true,
                                    }}
                                    onChange={setSmcCode}
                                />

                                <p className="rs-control-label color-white" style={{marginTop:'16px'}}>Constructor Arguments</p>
                                <FormControl rows={20}
                                    style={{ minWidth: 100 }}
                                    name="argument"
                                    componentClass="textarea"
                                    className="input"
                                    value={constructorArgument}
                                    onChange={(value) => {
                                        setConstructorArgument(value)
                                    }}
                                />

                            </FlexboxGrid.Item>

                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24} style={{ marginTop: 20, paddingLeft: 0 }}>
                                <Button size="big" className="kai-button get-started" onClick={verify}>Verify</Button>
                                <Button size="big" className="kai-button-gray">Reset</Button>
                            </FlexboxGrid.Item>

                        </FlexboxGrid>
                    </FormGroup>
                </Form>
        </div>
    )
}

export default DeployWithSourceCode;