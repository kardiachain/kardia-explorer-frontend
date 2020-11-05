import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { Col, Divider, FlexboxGrid, Icon, List, Panel, Table } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { weiToKAI } from '../../common/utils/amount';
import { millisecondToHMS, renderHashString, renderHashToRedirect, renderHashStringAndTooltip } from '../../common/utils/string';
import { TABLE_CONFIG } from '../../config';
import { useViewport } from '../../context/ViewportContext';
import { getBalance } from '../../service/kai-explorer';
import { getTxsByAddress } from '../../service/kai-explorer/transaction';
import './addressDetail.css'


const { Column, HeaderCell, Cell } = Table;

const AddressDetail = () => {
    const { isMobile } = useViewport()
    const history = useHistory();
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault)
    const [totalTxs, setTotalTxs] = useState(0)
    const [loading, setLoading] = useState(false)
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const { address }: any = useParams()
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const rs = await getTxsByAddress(address, page, size);
            const balance = await getBalance(address)
            setLoading(false)
            setTransactionList(rs.transactions)
            setTotalTxs(rs.totalTxs)
            setBalance(balance)
        })()
    }, [page, size, address])
    return (
        <div className="container address-detail-container">
            <h3>Address Detail</h3>
            <Divider />
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={14} sm={24} style={{ marginBottom: '25px' }}>
                    <Panel header="Overview" shaded>
                        <List bordered={false}>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={6}>
                                        <div className="title">Address: </div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={18}>
                                        <div className="content">
                                            {renderHashString(address, 45)}
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={6}>
                                        <div className="title">Balance: </div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} sm={18}>
                                        <div className="content">{weiToKAI(balance)} KAI</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                        </List>
                    </Panel>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel header="Transaction History" shaded>
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
                                    <Column flexGrow={2} verticalAlign="middle">
                                        <HeaderCell>Tx Hash</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon icon="exchange" style={{ marginRight: '5px' }}/>}
                                                        {renderHashToRedirect({
                                                            hash: rowData.txHash,
                                                            headCount: isMobile ? 10 : 25,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { history.push(`/tx/${rowData.txHash}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={1} align="center" verticalAlign="middle">
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
                                    <Column flexGrow={1} align="center" verticalAlign="middle">
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
                                    <Column flexGrow={2} verticalAlign="middle">
                                        <HeaderCell>From</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {
                                                            address === rowData.from ? renderHashStringAndTooltip(rowData.from, isMobile ? 10 : 25, 4, true) : renderHashToRedirect({
                                                                hash: rowData.from,
                                                                headCount: isMobile ? 10 : 25,
                                                                tailCount: 4,
                                                                showTooltip: true,
                                                                callback: () => { history.push(`/address/${rowData.from}`) }
                                                            })
                                                        }
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} verticalAlign="middle">
                                        <HeaderCell>To</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon icon="arrow-circle-right" style={{ marginRight: '5px' }}/>}
                                                        {
                                                            address === rowData.to ? renderHashStringAndTooltip(rowData.to, isMobile ? 10 : 25, 4, true) : renderHashToRedirect({
                                                                hash: rowData.to,
                                                                headCount: isMobile ? 10 : 25,
                                                                tailCount: 4,
                                                                showTooltip: true,
                                                                callback: () => { history.push(`/address/${rowData.to}`) }
                                                            })
                                                        }
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={1} align="center" verticalAlign="middle">
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

export default AddressDetail;