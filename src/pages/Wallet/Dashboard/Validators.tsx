import React, { useEffect, useState } from 'react'
import { Button, ButtonToolbar, Col, FlexboxGrid, Form, FormControl, FormGroup, Icon, Panel, Table } from 'rsuite';
import { renderHashString } from '../../../common/utils/string';
import { useViewport } from '../../../context/ViewportContext';
import { getValidators } from '../../../service/smc';
import './dashboard.css'

const { Column, HeaderCell, Cell } = Table;

const Validators = () => {

    const [validators, setValidators] = useState([] as Validator[])
    const { isMobile } = useViewport()
    const [wantRegister, setWantRegister] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getValidators().then(rs => {
            setValidators(rs)
        });
    }, []);

    const registerValidator = () => {

    }

    return (
        <FlexboxGrid>
            <div className="register-container">
                <ButtonToolbar>
                    <Button className="register-button" onClick={() => setWantRegister(!wantRegister)}>
                        <Icon icon="plus-circle"/> Register to become validator
                    </Button>
                </ButtonToolbar>
                {
                    !!wantRegister ? (
                        <div className="register-form">
                            <Panel bordered>
                                <FlexboxGrid>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                                        <Form fluid>
                                            <FormGroup>
                                                <FormControl  placeholder="Commission Rate*" name="commssionRate" type="number" />
                                                <FormControl  placeholder="Max Rate*" name="maxRate" type="number" />
                                                <FormControl  placeholder="Max Change Rate*" name="maxChangeRate" type="number" />
                                                <FormControl  placeholder="Min Seft Delegation*" name="minSeftDelegation" type="number" />
                                            </FormGroup>
                                            <FormGroup>
                                                <ButtonToolbar>
                                                    <Button appearance="primary" loading={isLoading} onClick={registerValidator}>Register</Button>
                                                </ButtonToolbar>
                                            </FormGroup>
                                        </Form>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                                    <Panel header="Policy" bordered>
                                        
                                    </Panel>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </Panel>
                        </div>
                    ) : <></>
                }

            </div>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                <h4>Validator list</h4>
                <Table
                    bordered
                    autoHeight
                    rowHeight={70}
                    data={validators}
                    onRowClick={data => {
                        console.log(data);
                    }}
                >
                    <Column width={isMobile ? 120 : 500}>
                        <HeaderCell>Validator</HeaderCell>
                        <Cell>
                            {(rowData: Validator) => {
                                return (
                                    <div>
                                        <div> {renderHashString(rowData.address, isMobile ? 10 : 50)} </div>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column width={isMobile ? 120 : 300}>
                        <HeaderCell>Voting power</HeaderCell>
                        <Cell>
                            {(rowData: Validator) => {
                                return (
                                    <div>
                                        <div> {rowData.votingPower} </div>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column width={isMobile ? 120 : 300}>
                        <HeaderCell>Status</HeaderCell>
                        <Cell>
                            {(rowData: Validator) => {
                                return (
                                    <div>
                                        <div> Active </div>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                </Table>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default Validators;