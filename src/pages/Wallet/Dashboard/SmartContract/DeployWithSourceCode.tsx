import React, { useState } from 'react';
import { Col, FlexboxGrid, Form, FormGroup, Icon, Panel, Steps } from 'rsuite';
import AceEditor from "react-ace";
import "ace-mode-solidity/build/remix-ide/mode-solidity";
import "ace-builds/src-noconflict/theme-xcode";
import { Button } from '../../../../common';
import worker from './worker.js';
const DeployWithSourceCode = () => {

    const [smcCode, setSmcCode] = useState('')
    const [currentStep, setCurrentStep] = useState(1)

    var workerInstance = new Worker(worker as any);

    const compileSourceCode = () => {
        console.log(workerInstance);
        workerInstance.postMessage('hello from main')
        // workerInstance.postMessage(JSON.stringify({
        //     language: "Solidity",
        //     sources: { "": { content: smcCode } },
        //     settings: { optimizer: { enabled: true }, outputSelection: { "*": { "*": ['evm.bytecode.object', 'evm.gasEstimates', 'evm.assembly'] } } }
        // }));

        // workerInstance.addEventListener('message', (message) => {
        //     console.log('message', message);
        // });


        // var output = JSON.parse(solc.compile(JSON.stringify(input)))
        // for (var contractName in output.contracts['hello.sol']) {
        //     console.log(contractName + ': ' + output.contracts['hello.sol'][contractName].evm.bytecode.object)
        // }
    }

    workerInstance.addEventListener('message', (message) => {
        console.log('message from worker', message);
    });

    workerInstance.postMessage(JSON.stringify({
        language: "Solidity",
        sources: { "": { content: smcCode } },
        settings: { optimizer: { enabled: true }, outputSelection: { "*": { "*": ['evm.bytecode.object', 'evm.gasEstimates', 'evm.assembly'] } } }
    }));

    return (
        <div>
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="code" size={"lg"} />
                    <p style={{ marginLeft: '12px' }} className="title">Deploy Smart Contract By Source Code</p>
                </div>
            </div>
            <Form fluid>
                <FormGroup>
                    <FlexboxGrid>
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={14} sm={24}>
                            <Panel shaded>
                                <AceEditor
                                    placeholder=""
                                    mode="solidity"
                                    theme="xcode"
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

                            </Panel>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={10} sm={24}>
                            <Panel shaded>
                                <Steps current={currentStep} vertical>
                                    <Steps.Item title="Complie" description={<div>Compile smartcontract</div>}>
                                    </Steps.Item>
                                    <Steps.Item title="Deploy" />
                                    <Steps.Item title="Run" />
                                </Steps>
                            </Panel>

                            <Button className="kai-button get-started" onClick={compileSourceCode}>Compile</Button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </FormGroup>
            </Form>
        </div>
    )
}

export default DeployWithSourceCode;