import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { Col, Divider, FlexboxGrid, Icon, Panel, Table } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { kaiValueString } from '../../common/utils/amount';
import { millisecondToHMS, renderHashToRedirect } from '../../common/utils/string';
import { TABLE_CONFIG } from '../../config';
import { useViewport } from '../../context/ViewportContext';
import { getTransactions, getTxsByBlockHeight } from '../../service/kai-explorer';
import { getTxsByAddress } from '../../service/kai-explorer/transaction';
import './txList.css'
const { Column, HeaderCell, Cell } = Table;

const TxList = () => {
    
    const query = new URLSearchParams(useLocation().search);
    const block = query.get("block") || '';
    const address = query.get("addresses") || '';
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const { isMobile } = useViewport()
    const history = useHistory();
    const [activePage, setActivePage] = useState(1)

    useEffect(() => {
        loadTransaction(TABLE_CONFIG.skipDefault, TABLE_CONFIG.limitDefault)
    }, [block,address])

    const handleChangePage = async (dataKey: number) => {
        loadTransaction(dataKey, TABLE_CONFIG.limitDefault)
        setActivePage(dataKey)
    }

    const handleChangeLength = async (size: number) => {
        loadTransaction(TABLE_CONFIG.skipDefault, size)
        setActivePage(TABLE_CONFIG.skipDefault)
    }

    const loadTransaction = async (page: number, size: number) => {
        if (block) {
            const transactions = await getTxsByBlockHeight(block, page, size);
            setTransactionList(transactions)
        } else if(address) {
            const transactions = await getTxsByAddress(address, page, size);
            setTransactionList(transactions)
        } else {
            const transactions = await getTransactions(page, size);
            setTransactionList(transactions)
        }
    }

    return (
        <div className="txs-container">
            <h3>Transactions</h3>
            <div>{block ? `Block number: #${block}` : address ? `Address: #${address}` : ''}</div>
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
                                    hover={false}
                                >
                                    <Column width={isMobile ? 120 : 400}>
                                        <HeaderCell>Tx Hash</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div> <Icon icon="money" style={{ marginRight: '10px' }} />
                                                        {renderHashToRedirect(rowData.txHash, isMobile ? 10 : 45, () => { history.push(`/tx?hash=${rowData.txHash}`)})}
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
                                                        {renderHashToRedirect(rowData.blockNumber, 20, () => { history.push(`/block?block=${rowData.blockNumber}`) })}
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
                                                        {renderHashToRedirect(rowData.from, isMobile ? 10 : 45, () => { history.replace(`/txs?addresses=${rowData.from}`) })}
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
                                                        {renderHashToRedirect(rowData.to, isMobile ? 10 : 45, () => {  history.replace(`/txs?addresses=${rowData.to}`) })}
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
                                                        {kaiValueString(rowData.value)}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                </Table>
                                <TablePagination
                                    engthMenu={TABLE_CONFIG.pagination.lengthMenu}
                                    activePage={activePage}
                                    displayLength={10}
                                    total={150}
                                    onChangePage={handleChangePage}
                                    onChangeLength={handleChangeLength}
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