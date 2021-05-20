import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Panel, Nav } from 'rsuite';
import DeployWithSourceCode from './DeployWithSourceCode';
import CompilerOutput from './CompilerOutput';

const VerifyContract = () => {
    const [activeKey, setActiveKey] = useState('contractSourceCode')

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <div className="title header-title">
                    Verify & Publish Contract Source Code
                </div>
            </div>
            <Panel shaded className="panel-bg-gray">
                <div className="custom-nav">
                    <Nav
                        appearance="subtle"
                        activeKey={activeKey}
                        onSelect={setActiveKey}
                        style={{ marginBottom: 20 }}>
                        <Nav.Item eventKey="contractSourceCode">
                            {`Contract Source Code`}
                        </Nav.Item>
                        <Nav.Item eventKey="compilerOutput">
                            {`Compiler Output`}
                        </Nav.Item>
                    </Nav>
                </div>
                {
                    (() => {
                        switch (activeKey) {
                            case 'contractSourceCode':
                                return (
                                    <DeployWithSourceCode/>
                                );
                            case 'compilerOutput':
                                return (
                                    <CompilerOutput/>
                                )
                        }
                    })()
                }
            </Panel>


        </div>
    )
}


export default VerifyContract;