import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Col, FlexboxGrid, Panel, Table } from 'rsuite';
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
            <div className="register-container">
                <div className="register-form">
                    <Panel bordered>
                        <FlexboxGrid>
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                                <ValidatorCreate />
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Panel>
                </div>
            </div>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                <Panel shaded>
                    <h4>Validator list</h4>
                    <Table
                        virtualized
                        autoHeight
                        rowHeight={60}
                        data={validators}
                        onRowClick={validator => {
                            // history.push(`/dashboard/validator?id=${validator.address}`)
                        }}
                    >
                        <Column width={150} align="center">
                            <HeaderCell>Name</HeaderCell>
                            <Cell>
                                {(rowData: Validator) => {
                                    return (
                                        <div>{rowData.name}</div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={isMobile ? 120 : 450} align="center">
                            <HeaderCell>Validator</HeaderCell>
                            <Cell>
                                {(rowData: Validator) => {
                                    return (
                                        <div>{truncate(rowData.address, isMobile ? 10 : 50)}</div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={150} align="center">
                            <HeaderCell>Voting power</HeaderCell>
                            <Cell>
                                {(rowData: Validator) => {
                                    return (
                                        <div>{rowData.votingPower}</div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={150} align="center">
                            <HeaderCell>Peer Count</HeaderCell>
                            <Cell>
                                {(rowData: Validator) => {
                                    return (
                                        <div>{rowData.peerCount}</div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={150} align="center">
                            <HeaderCell>RPC URL</HeaderCell>
                            <Cell>
                                {(rowData: Validator) => {
                                    return (
                                        <div>{rowData.rpcUrl}</div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={150} align="center">
                            <HeaderCell>Action</HeaderCell>
                            <Cell>
                            {(rowData: Validator) => {
                                    return (
                                        <Button appearance="primary" onClick={() => {history.push(`/dashboard/validator?id=${rowData.address}`)}}>Delegate</Button>
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