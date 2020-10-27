import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { Col, Divider, FlexboxGrid, Icon, Panel, Table } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { weiToKAI } from '../../common/utils/amount';
import { millisecondToHMS, renderHashToRedirect } from '../../common/utils/string';
import { TABLE_CONFIG } from '../../config';
import { useViewport } from '../../context/ViewportContext';
import { getTransactions, getTxsByBlockHeight } from '../../service/kai-explorer';
import './txList.css'
const { Column, HeaderCell, Cell } = Table;

const TxList = () => {
    
    const query = new URLSearchParams(useLocation().search);
    const block = query.get("block") || '';
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const { isMobile } = useViewport()
    const history = useHistory();
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault)
    const [totalTxs, setTotalTxs] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            if (block) {
                const rs = await getTxsByBlockHeight(block, page, size);
                setLoading(false)
                setTransactionList(rs.transactions)
                setTotalTxs(rs.totalTxs)
            } else {
                const rs = await getTransactions(page, size);
                setLoading(false)
                setTransactionList(rs.transactions)
                setTotalTxs(rs.totalTxs)
            }
        })()
    }, [page, size, block])

    return (
        <div className="txs-container">
            <h3>Transactions</h3>
            <div>{block ? `Block number: #${block}` : ''}</div>
            <Divider />
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded>
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <Table
                                    virtualized
                                    rowHeight={60}
                                    height={650}
                                    data={transactionList}
                                    autoHeight
                                    hover={false}
                                    loading={loading}
                                >
                                    <Column width={isMobile ? 120 : 400}>
                                        <HeaderCell>Tx Hash</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div> <Icon icon="money" style={{ marginRight: '10px' }} />
                                                        {renderHashToRedirect({
                                                            hash: rowData.txHash,
                                                            headCount: isMobile ? 10 : 45,
                                                            tailCount: 4,
                                                            callback: () => { history.push(`/tx/${rowData.txHash}`)}
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column width={100} align="center">
                                        <HeaderCell>Block Height</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {renderHashToRedirect({
                                                            hash: rowData.blockNumber,
                                                            headCount: 20,
                                                            tailCount: 4,
                                                            callback: () => { history.push(`/block/${rowData.blockNumber}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column width={200} align="center">
                                        <HeaderCell>Age</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>{millisecondToHMS(rowData.age || 0)}</div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column width={isMobile ? 120 : 400}>
                                        <HeaderCell>From</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {renderHashToRedirect({
                                                            hash: rowData.from,
                                                            headCount: isMobile ? 10 : 45,
                                                            tailCount: 4
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column width={isMobile ? 120 : 400}>
                                        <HeaderCell>To</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {renderHashToRedirect({
                                                            hash: rowData.to,
                                                            headCount: isMobile ? 10 : 45,
                                                            tailCount: 4
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column width={200} align="center">
                                        <HeaderCell>Value</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {weiToKAI(rowData.value)} KAI
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
                                    total={totalTxs}
                                    onChangePage={setPage}
                                    onChangeLength={setSize}
                                />
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default TxList