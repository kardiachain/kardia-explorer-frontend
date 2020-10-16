import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, ButtonToolbar, Col, FlexboxGrid, Icon, Panel, Table } from 'rsuite';
import { renderHashString } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { getValidators } from '../../../../service/smc';
import '../dashboard.css'
import ValidatorCreate from './ValidatorCreate';

const { Column, HeaderCell, Cell } = Table;

const Validators = () => {

    let history = useHistory();
    const [validators, setValidators] = useState([] as Validator[])
    const { isMobile } = useViewport()
    const [wantRegister, setWantRegister] = useState(false)

    useEffect(() => {
        getValidators().then(rs => {
            setValidators(rs)
        });
    }, []);

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
                                        <ValidatorCreate />
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
                    onRowClick={validator => {
                        console.log(validator);
                        history.push(`/dashboard/validator?id=${validator.address}`)
                    }}
                >
                    <Column width={isMobile ? 120 : 500}>
                        <HeaderCell>Validator</HeaderCell>
                        <Cell>
                            {(rowData: Validator) => {
                                return (
                                    <div> {renderHashString(rowData.address, isMobile ? 10 : 50)} </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column width={isMobile ? 120 : 300}>
                        <HeaderCell>Voting power</HeaderCell>
                        <Cell>
                            {(rowData: Validator) => {
                                return (
                                    <div> {rowData.votingPower} </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column width={isMobile ? 120 : 300}>
                        <HeaderCell>Status</HeaderCell>
                        <Cell>
                            {(rowData: Validator) => {
                                return (
                                    <div> Active </div>
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