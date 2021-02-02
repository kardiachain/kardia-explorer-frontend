import React, { useState } from 'react'
import { Col, FlexboxGrid, Panel, Table, Icon, Progress } from 'rsuite';
import { useEffect } from 'react';
import { getCurrentNetworkParams, getProposals } from '../../service/kai-explorer';
import { TABLE_CONFIG } from '../../config';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { RenderStatus } from '.';
import { Link, useHistory } from 'react-router-dom';
import Button from '../../common/components/Button';
import { isLoggedIn } from '../../service/wallet';

const { Column, HeaderCell, Cell } = Table;
const { Line } = Progress;

const ListProposal = () => {

    const [proposals, setProposals] = useState([] as Proposal[])
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault)
    const [totalProposal, setTotalProposal] = useState(0)
    const history = useHistory()

    useEffect(() => {
        (async () => {
            const rs = await Promise.all([
                getProposals(page, size),
                getCurrentNetworkParams()
            ])
            setProposals(rs[0].proposal)
            setTotalProposal(rs[0].total)
        })()
    }, [page, size])

    return (
        <FlexboxGrid>
            <FlexboxGrid.Item componentClass={Col} xs={24} sm={24} md={24}>
                <Panel shaded className="panel-bg-gray">
                    <FlexboxGrid justify="space-between">
                        <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                            <Table
                                autoHeight
                                data={proposals}
                                hover={false}
                                wordWrap
                            >
                                <Column width={110} verticalAlign="middle">
                                    <HeaderCell>Proposal ID</HeaderCell>
                                    <Cell>
                                        {(rowData: Proposal) => {
                                            return (
                                                <div className="text-link">
                                                    <Link className="text-bold" to={`/proposal/${rowData.id}`} >#{rowData.id}</Link>
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column flexGrow={2} minWidth={500} verticalAlign="middle">
                                    <HeaderCell>Proposal</HeaderCell>
                                    <Cell>
                                        {(rowData: Proposal) => {
                                            return (
                                                <>

                                                    {
                                                        rowData.params ?
                                                        rowData.params.map((item: ProposalParams, index: number) => {
                                                                return (
                                                                    <div key={index} style={{
                                                                        marginBottom: 10
                                                                    }}>

                                                                        <span style={{
                                                                            marginRight: 10,
                                                                            display: 'inline-block',
                                                                            width: 200
                                                                        }}>{item.labelName}</span>
                                                                        <span style={{
                                                                            marginRight: 10,
                                                                            minWidth: 100,
                                                                            textAlign: 'center'
                                                                        }}>
                                                                            { item.fromValue }
                                                                        </span>
                                                                        <Icon className="cyan-highlight" style={{
                                                                            marginRight: 10
                                                                        }} icon="long-arrow-right" />
                                                                        <span
                                                                            style={{
                                                                                minWidth: 100,
                                                                                textAlign: 'center',
                                                                                display: 'inline-block',
                                                                                fontWeight: 600,
                                                                                color: 'aqua'
                                                                            }}
                                                                        >
                                                                            { item.toValue }
                                                                        </span>
                                                                    </div>
                                                                )
                                                            }) : <></>
                                                    }
                                                </>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column flexGrow={1} minWidth={200} verticalAlign="middle">
                                    <HeaderCell>Vote Power</HeaderCell>
                                    <Cell>
                                        {(rowData: Proposal) => {
                                            return (
                                                <div>
                                                    <Line percent={Number(parseFloat(String(rowData.voteYes)).toFixed(0))} status='active' strokeWidth={5} strokeColor={'#ffc107'} />
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column minWidth={110} verticalAlign="middle">
                                    <HeaderCell>Status</HeaderCell>
                                    <Cell>
                                        {(rowData: Proposal) => {
                                            return (
                                                <div>
                                                    <RenderStatus status={rowData?.status || 0} />
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column width={120} verticalAlign="middle">
                                    <HeaderCell></HeaderCell>
                                    <Cell>
                                        {(rowData: Proposal) => {

                                            return (
                                                <>
                                                    {
                                                        rowData?.status === 0 ?
                                                            (
                                                                <Button className="kai-button-gray"
                                                                    onClick={() => {
                                                                        isLoggedIn() ? history.push(`/wallet/proposal-vote/${rowData.id}`) : history.push('/wallet')
                                                                    }}>Vote</Button>
                                                            ) : <></>

                                                    }
                                                </>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                            </Table>
                            <TablePagination
                                lengthMenu={TABLE_CONFIG.pagination.lengthMenu}
                                activePage={page}
                                displayLength={size}
                                total={totalProposal}
                                onChangePage={setPage}
                                onChangeLength={setSize}
                            />
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Panel>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )

}

export default ListProposal;