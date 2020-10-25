import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Panel, Table } from 'rsuite';
import { truncate } from '../../../../common/utils/string';
import { useViewport } from '../../../../context/ViewportContext';
import { getValidators } from '../../../../service/kai-explorer';
import '../dashboard.css'
import ValidatorCreate from './ValidatorCreate';

const { Column, HeaderCell, Cell } = Table;

const Validators = () => {

    let history = useHistory();
    const [validators, setValidators] = useState([] as Validator[])
    const { isMobile } = useViewport()

    useEffect(() => {
        (async () => {
            const vals = await getValidators();
            setValidators(vals)
        })()
    }, []);

    return (
        <FlexboxGrid>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                <div className="register-container">
                    <div className="register-form">
                        <Panel header={<h3>Register to become validator</h3>} shaded>
                            <FlexboxGrid>
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                                    <ValidatorCreate />
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </Panel>
                    </div>
                </div>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                <Panel header="Validators" shaded>
                    <Table
                        autoHeight
                        rowHeight={50}
                        data={validators}
                        onRowClick={validator => {
                            history.push(`/dashboard/validator?id=${validator.address}`)
                        }}
                    >
                        <Column width={150} align="center" verticalAlign="middle">
                            <HeaderCell>Name</HeaderCell>
                            <Cell>
                                {(rowData: Validator) => {
                                    return (
                                        <div>{rowData.name}</div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={isMobile ? 120 : 450} align="center" verticalAlign="middle">
                            <HeaderCell>Validator</HeaderCell>
                            <Cell>
                                {(rowData: Validator) => {
                                    return (
                                        <div>{truncate(rowData.address, isMobile ? 10 : 50)}</div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={150} align="center" verticalAlign="middle">
                            <HeaderCell>Voting power</HeaderCell>
                            <Cell>
                                {(rowData: Validator) => {
                                    return (
                                        <div>{rowData.votingPower}</div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={150} align="center" verticalAlign="middle">
                            <HeaderCell>Peer Count</HeaderCell>
                            <Cell>
                                {(rowData: Validator) => {
                                    return (
                                        <div>{rowData.peerCount}</div>
                                    );
                                }}
                            </Cell>
                        </Column>
                    </Table>
                </Panel>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default Validators;