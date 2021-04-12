import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { millisecondToHMS, renderHashToRedirect, weiToKAI, numberFormat } from '../../../common';
import { TABLE_CONFIG } from '../../../config';
import { useViewport } from '../../../context/ViewportContext';

const { Column, HeaderCell, Cell } = Table;
const BlockByProposerList = ({
    blockRewards,
    totalBlockRewards,
    page,
    limit,
    loading,
    setPage,
    setLimit
}: {
    blockRewards: KAIBlock[];
    totalBlockRewards: number;
    page: number;
    limit: number;
    loading: boolean;
    setPage: (newPage: number) => void;
    setLimit: (newLimit: number) => void;
}) => {
    const { isMobile } = useViewport();

    return (
        <>
            <Table
                hover={false}
                wordWrap
                autoHeight
                rowHeight={() => 60}
                data={blockRewards}
                loading={loading}
            >
                <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                    <HeaderCell><span style={{marginLeft: 40}}>Block</span></HeaderCell>
                    <Cell>
                        {(rowData: KAIBlock) => {
                            return (
                                <div>
                                    <span className="container-icon-left" style={{lineHeight: '28px'}}>
                                        <Icon icon="cubes" className="gray-highlight"/>
                                    </span>
                                    <span className="container-content-right text-link">
                                        <Link className="color-white text-bold" to={`/block/${rowData.blockHeight}`} >{numberFormat(rowData.blockHeight)}</Link>
                                        <div className="sub-text">{millisecondToHMS(rowData.age || 0)}</div>
                                    </span>
                                </div>
                                
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={4} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                    <HeaderCell>Block Hash</HeaderCell>
                    <Cell>
                        {(rowData: KAIBlock) => {
                            return (
                                <div>
                                    {renderHashToRedirect({
                                        hash: rowData.blockHash,
                                        headCount: isMobile ? 10 : 20,
                                        tailCount: 4,
                                        showTooltip: true,
                                        redirectTo: `/block/${rowData.blockHash}`
                                    })}
                                </div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={1} verticalAlign="middle">
                    <HeaderCell>Txs</HeaderCell>
                    <Cell>
                        {(rowData: KAIBlock) => {
                            return (
                                <div>
                                    {
                                        !rowData.transactions ? '0' :
                                            <Link className="color-white" to={`/txs?block=${rowData.blockHeight}`} >{numberFormat(rowData.transactions)}</Link>
                                    }
                                </div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                    <HeaderCell>Rewards (KAI)</HeaderCell>
                    <Cell>
                        {(rowData: KAIBlock) => {
                            return (
                                <div>
                                    {numberFormat(weiToKAI(rowData.rewards), 8)}
                                </div>
                            );
                        }}
                    </Cell>
                </Column>
            </Table>
            <TablePagination
                lengthMenu={TABLE_CONFIG.pagination.lengthMenu}
                activePage={page}
                displayLength={limit}
                total={totalBlockRewards}
                onChangePage={setPage}
                onChangeLength={setLimit}
            />
        </>
    );
}

export default BlockByProposerList;