import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Col, Divider, FlexboxGrid, Icon, Panel, Table } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { millisecondToHMS, renderHashString, renderHashToRedirect } from '../../common/utils/string';
import { TABLE_CONFIG} from '../../config';
import { useViewport } from '../../context/ViewportContext';
import { getTransactions } from '../../service/kai-explorer';
import './txList.css'
const { Column, HeaderCell, Cell } = Table;

const TxList = () => {
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const { isMobile } = useViewport()
    let history = useHistory();
    const [activePage, setActivePage] = useState(1)

    useEffect(() => {
        (async () => {
            const transactions = await getTransactions(TABLE_CONFIG.skipDefault, TABLE_CONFIG.limitDefault);
            setTransactionList(transactions)
        })()
    }, [])

    const handleChangePage = async (dataKey: number) => {
        const transactions = await getTransactions(dataKey, TABLE_CONFIG.limitDefault);
        setTransactionList(transactions)
    }

    const handleChangeLength = async (size: number) => {
        const transactions = await getTransactions(TABLE_CONFIG.skipDefault, size);
        setTransactionList(transactions)
    }

    return (
        <React.Fragment>
            <div className="txs-container">
                <h3>Transactions</h3>
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
                                                        <div> <Icon icon="money" style={{marginRight: '10px'}}/> 
                                                            {renderHashToRedirect(rowData.txHash, isMobile ? 10 : 45, () => { history.push(`/tx?hash=${rowData.txHash}`) })}
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
                                                            {renderHashToRedirect(rowData.from, isMobile ? 10 : 45, () => {/*TODO: //*/})}
                                                        </div>
                                                    );
                                                }}
                                            </Cell>
                                        </Column>
                                        <Column width={isMobile ? 120 : 300}>
                                            <HeaderCell>To</HeaderCell>
                                            <Cell>
                                                {(rowData: KAITransaction) => {
                                                    return (
                                                        <div>
                                                            {renderHashToRedirect(rowData.to, isMobile ? 10 : 45, () => {/*TODO: //*/})}
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
                                                            {rowData.value} KAI
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
        </React.Fragment>
    )
}

export default TxList