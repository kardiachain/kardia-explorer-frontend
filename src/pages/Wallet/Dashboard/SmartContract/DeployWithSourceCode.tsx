import React, { useState } from 'react';
import { Col, FlexboxGrid, Form, FormGroup, Icon, Panel, Steps } from 'rsuite';
import AceEditor from "react-ace";
import "ace-mode-solidity/build/remix-ide/mode-solidity";
import "ace-builds/src-noconflict/theme-xcode";

const DeployWithSourceCode = () => {

    const [smcCode, setSmcCode] = useState('')
    const [currentStep, setCurrentStep] = useState(1)
    return (
        <div>
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="code" size={"lg"} />
                    <p style={{ marginLeft: '12px' }} className="title">Deploy Smart Contract By Byte Code</p>
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
                                    <Steps.Item title="Deploy"/>
                                    <Steps.Item title="Run" />
                                </Steps>
                            </Panel>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </FormGroup>
            </Form>
        </div>
    )
}

export default DeployWithSourceCode;