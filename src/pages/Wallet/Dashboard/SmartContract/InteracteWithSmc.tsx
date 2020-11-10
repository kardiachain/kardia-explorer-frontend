import React, { useState } from 'react'
import { Col, ControlLabel, FlexboxGrid, Form, FormControl, FormGroup, Icon, Panel, Uploader } from 'rsuite';
import SmartContract from '.';
import Button from '../../../../common/components/Button';

const InteracteWithSmc = () => {
    
    const [smcAddr, setSmcAddr] = useState('')
    const [abi, setAbi] = useState('')

    return (
        <div>
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="related-map" size={"lg"} />
                    <p style={{ marginLeft: '12px' }} className="title">Deploy Smart Contract By Source Code</p>
                </div>
            </div>
            <Panel shaded>
                <Form fluid>
                    <FormGroup>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={16}>
                                <ControlLabel>Contract Address:<span className="required-mask">*</span></ControlLabel>
                                <FormControl name="smcAddr"
                                    placeholder="Input Contract Address"
                                    value={smcAddr}
                                    onChange={setSmcAddr}
                                /> 
                            </FlexboxGrid.Item>
                            {/* <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={16}>
                                <ControlLabel>{'Your <contract.json> file:'}<span className="required-mask">*</span></ControlLabel>
                                <Uploader action="//jsonplaceholder.typicode.com/posts/" draggable>
                                    <FormControl name="smcAddr"
                                        style={{padding: '11px 12px'}}
                                        placeholder="Upload Your <contract.json> file:"
                                    />
                                </Uploader>
                            </FlexboxGrid.Item> */}
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <ControlLabel>Abi Json:<span className="required-mask">*</span></ControlLabel>
                                <FormControl rows={10}
                                    name="abi"
                                    componentClass="textarea"
                                    placeholder="ABI"
                                    value={abi}
                                    onChange={setAbi}
                                />
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8} sm={24} style={{marginTop: '25px', paddingLeft: 0}}>
                                <Button size="big" style={{width: '250px'}}>INTERACT CONTRACT</Button>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </FormGroup>
                </Form>
            </Panel>
        </div>
    )
}

export default InteracteWithSmc;