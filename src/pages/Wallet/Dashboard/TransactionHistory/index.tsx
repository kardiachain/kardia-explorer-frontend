import React, { useState, useEffect } from 'react'
import { FlexboxGrid, Col, Panel, Table, Icon } from 'rsuite';
import { useViewport } from '../../../../context/ViewportContext';
import { renderHashToRedirect, millisecondToHMS } from '../../../../common/utils/string';
import { weiToKAI } from '../../../../common/utils/amount';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { TABLE_CONFIG } from '../../../../config';
import { useHistory } from 'react-router-dom';
import { getTxsByAddress } from '../../../../service/kai-explorer/transaction';
import { getAccount } from '../../../../service/wallet';
const { Column, HeaderCell, Cell } = Table;

const TransactionHistory = () => {
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const { isMobile } = useViewport()
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault)
    const [totalTxs, setTotalTxs] = useState(0)
    const history = useHistory();
    const myAccount = getAccount() as Account

    useEffect(() => {
        (async () => {
            setLoading(true)
            const rs = await getTxsByAddress(myAccount.publickey, page, size);
            setLoading(false)
            setTransactionList(rs.transactions)
            setTotalTxs(rs.totalTxs)
        })()
    }, [myAccount.publickey, page, size])

    return (
        <div>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel header={<h4>Transaction history</h4>} shaded>
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <Table
                                    rowHeight={60}
                                    height={200}
                                    data={transactionList}
                                    autoHeight
                                    hover={false}
                                    loading={loading}
                                    wordWrap
                                >
                                    <Column flexGrow={2}>
                                        <HeaderCell>Tx Hash</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon icon="exchange" style={{ marginRight: '5px' }}/>}
                                                        {renderHashToRedirect({
                                                            hash: rowData.txHash,
                                                            headCount: isMobile ? 10 : 20,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { history.push(`/tx/${rowData.txHash}`)}
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={1} align="center">
                                        <HeaderCell>Block Height</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon icon="cubes" style={{ marginRight: '5px' }}/>}
                                                        {renderHashToRedirect({
                                                            hash: rowData.blockNumber,
                                                            headCount: 20,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { history.push(`/block/${rowData.blockNumber}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={1} align="center">
                                        <HeaderCell>Age</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon icon="clock-o" style={{ marginRight: '5px' }}/>}
                                                        {millisecondToHMS(rowData.age || 0)}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2}>
                                        <HeaderCell>From</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {renderHashToRedirect({
                                                            hash: rowData.from,
                                                            headCount: isMobile ? 10 : 20,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { history.push(`/address/${rowData.from}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2}>
                                        <HeaderCell>To</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon icon="arrow-circle-right" style={{ marginRight: '5px' }}/>}
                                                        {renderHashToRedirect({
                                                            hash: rowData.to,
                                                            headCount: isMobile ? 10 : 20,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { history.push(`/address/${rowData.to}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={1} align="center">
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

export default TransactionHistory;