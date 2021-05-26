import React, { useState } from 'react';
import { Col, FlexboxGrid, Form, FormControl, FormGroup, SelectPicker } from 'rsuite';
import AceEditor from "react-ace";
import "ace-mode-solidity/build/remix-ide/mode-solidity";
import "ace-builds/src-noconflict/theme-monokai";
import { Button, CompilerVersion, ErrMessage, ErrorMessage, TrueOrFalse } from '../../../../common';
import { compileSourceCode } from '../../../../service';
import './style.css'

const DeployWithSourceCode = () => {

    const [smcCode, setSmcCode] = useState('')
    const [sourceCodeError, setSourceCodeError] = useState('')
    const [byteCode, setByteCode] = useState('');

    const [contractAddress, setContractAddress] = useState('');
    const [contractAddressError, setContractAddressError] = useState('')

    const [optimize, setOptimize] = useState<Boolean>();
    const [optimizeError, setOptimizeError] = useState('')

    const [compilerVersion, setCompilerVersion] = useState('');
    const [compilerVersionError, setCompilerVersionError] = useState('')

    const [constructorArgument, setConstructorArgument] = useState('');


    const validateOptimize = (value: Boolean) => {

    //     if (!value) {
    //         setOptimizeError(ErrorMessage.Require);
    //         return false;
    //     }

    //     setOptimizeError("");
    //     return true
    }

    const validateCompilerVersion = (value: String) => {

        // if (!value) {
        //     setCompilerVersionError(ErrorMessage.Require);
        //     return false;
        // }

        // setCompilerVersionError("");
        // return true
    }

    const validateContractAddress = (value: any) => {

        // if (!value) {
        //     setContractAddressError(ErrorMessage.Require);
        //     return false;
        // }

        // setContractAddressError("");
        // return true
    }

    const validateSourceCode = (value: any) => {

        // if (!value) {
        //     setSourceCodeError(ErrorMessage.Require);
        //     return false;
        // }

        // setSourceCodeError("");
        // return true
    }


    const getByteCode = async () => {
        // if (!validateContractAddress(optimize as Boolean) ||
        //     !validateCompilerVersion(compilerVersion) ||
        //     !validateSourceCode(smcCode) ||
        //     !validateOptimize(contractAddress as any)) {
        //     return;
        // }

        const param = {
            sourceCode: JSON.stringify(smcCode),
            compilerVersion: JSON.stringify(compilerVersion),
            isOptimize: JSON.stringify(optimize)
        }
        const response = await compileSourceCode(param);
        // for (var contractName in response.contracts['hello.sol']) {
        //     const byteCode = response.contracts['hello.sol'][contractName].evm.bytecode.object
        //     setByteCode(byteCode);
        // }
    }

    const resetAll = () => {
        setOptimizeError("");
        setSourceCodeError("");
        setCompilerVersionError("");
        setContractAddressError("");
    }

    const verify = () => {
        const byteCode = getByteCode();
        // compare input data

        // success => switch to Compiler Output tabs
    }

    return (
        <div>
            <Form>
                <div className="row wrapper" style={{ display: 'inline-flex', gap: '12px', marginBottom: '16px', width: '100%' }}>
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
                                validateContractAddress(value)
                            }}
                            style={{ width: '100%' }}
                        />
                        <ErrMessage message={contractAddressError} />
                    </div>

                    <div className="flex-1" style={{ flex: 1 }}>
                        <p className="rs-control-label color-white">
                            Compiler
                    </p>
                        <SelectPicker
                            className="dropdown-custom"
                            data={CompilerVersion}
                            searchable={false}
                            value={compilerVersion}
                            onChange={(value) => {
                                setCompilerVersion(value)
                                validateCompilerVersion(value)
                            }}
                            style={{ width: '100%' }}
                        />
                        <ErrMessage message={compilerVersionError} />
                    </div>

                    <div>
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
                                validateOptimize(value)
                            }}
                            style={{ width: '100%' }}
                        />
                        <ErrMessage message={optimizeError} />
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
                                onChange={(value) => {
                                    setSmcCode(value)
                                    validateSourceCode(value)
                                }}
                            />
                            <ErrMessage message={sourceCodeError} />

                            <p className="rs-control-label color-white" style={{ marginTop: '16px' }}>Constructor Arguments</p>
                            <FormControl rows={20}
                                style={{ minWidth: 100, height: 200 }}
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
                            <Button size="big" className="kai-button get-started" onClick={getByteCode}>Verify</Button>
                            <Button size="big" className="kai-button-gray" onClick={resetAll}>Reset</Button>
                        </FlexboxGrid.Item>

                    </FlexboxGrid>
                </FormGroup>
            </Form>
        </div>
    )
}

export default DeployWithSourceCode;