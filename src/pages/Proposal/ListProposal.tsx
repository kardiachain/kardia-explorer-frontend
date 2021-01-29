import React, { useState } from 'react'
import { Col, FlexboxGrid, Panel, Table } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import { useEffect } from 'react';
import { getProposals } from '../../service/kai-explorer';
import { TABLE_CONFIG } from '../../config';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { dateToUTCString } from '../../common/utils/string';
import { RenderStatus } from '.';
import { Link } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;

const ListProposal = () => {

    const { isMobile } = useViewport();
    const [proposals, setProposals] = useState([] as Proposal[])
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault)
    const [totalProposal, setTotalProposal] = useState(0)

    useEffect(() => {
        (async () => {
            const rs = await getProposals(page, size)
            setProposals(rs.proposal)
            setTotalProposal(rs.total)
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
                                rowHeight={() => 80}
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
                                <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                    <HeaderCell>Start time</HeaderCell>
                                    <Cell>
                                        {(rowData: Proposal) => {
                                            return (
                                                <div>
                                                    {dateToUTCString(rowData?.startTime) || ''}
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                    <HeaderCell>End time</HeaderCell>
                                    <Cell>
                                        {(rowData: Proposal) => {
                                            return (
                                                <div>
                                                    {dateToUTCString(rowData?.endTime) || ''}
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column flexGrow={1} minWidth={70} verticalAlign="middle">
                                    <HeaderCell>Vote Yes</HeaderCell>
                                    <Cell>
                                        {(rowData: Proposal) => {
                                            return (
                                                <div>
                                                    {rowData.voteYes}
                                                </div>
                                            );
                                        }}
                                    </Cell>
                                </Column>
                                <Column flexGrow={1} minWidth={70} verticalAlign="middle">
                                    <HeaderCell>Vote No</HeaderCell>
                                    <Cell>
                                        {(rowData: Proposal) => {
                                            return (
                                                <div>
                                                    {rowData.voteNo}
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