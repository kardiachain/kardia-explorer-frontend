import React, { useState, useEffect } from 'react'
import { FlexboxGrid, Col, Panel, Table, Icon, Whisper, Tooltip } from 'rsuite';
import { useViewport } from '../../../../context/ViewportContext';
import { renderHashToRedirect, millisecondToHMS } from '../../../../common/utils/string';
import { weiToKAI } from '../../../../common/utils/amount';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { TABLE_CONFIG } from '../../../../config';
import { Link, useHistory } from 'react-router-dom';
import { getTxsByAddress } from '../../../../service/kai-explorer/transaction';
import { getAccount } from '../../../../service/wallet';
import { numberFormat } from '../../../../common/utils/number';
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
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="exchange" size={"lg"} />
                    <p style={{ marginLeft: '12px' }} className="title">Transaction history</p>
                </div>
            </div>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded>
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
                                    <Column flexGrow={3}>
                                        <HeaderCell>Tx Hash</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon className="highlight" icon="exchange" style={{ marginRight: '5px' }}/>}
                                                        {renderHashToRedirect({
                                                            hash: rowData.txHash,
                                                            headCount: isMobile ? 5 : 12,
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
                                        <HeaderCell>Block</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon className="highlight" icon="cubes" style={{ marginRight: '5px' }}/>}
                                                        <Link to={`/block/${rowData.blockNumber}`}>{rowData.blockNumber}</Link>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} align="center">
                                        <HeaderCell>Age</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon className="highlight" icon="clock-o" style={{ marginRight: '5px' }}/>}
                                                        {millisecondToHMS(rowData.age || 0)}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={3}>
                                        <HeaderCell>From</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {renderHashToRedirect({
                                                            hash: rowData.from,
                                                            headCount: isMobile ? 5 : 12,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { history.push(`/address/${rowData.from}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={3}>
                                        <HeaderCell>To</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {
                                                            !rowData.toSmcAddr? (
                                                                <>
                                                                    {isMobile ? <></> : <Icon className="highlight" icon="arrow-circle-right" style={{ marginRight: '5px' }} />}
                                                                    {renderHashToRedirect({
                                                                        hash: rowData.to,
                                                                        headCount: isMobile ? 5 : 12,
                                                                        tailCount: 4,
                                                                        showTooltip: true,
                                                                        callback: () => { history.push(`/address/${rowData.to}`) }
                                                                    })}
                                                                </>
                                                            ) : (
                                                                    <>
                                                                        {isMobile ? <></> : <Icon className="highlight" icon="file-text-o" style={{ marginRight: '5px' }} />}
                                                                        <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{rowData.toSmcAddr}</Tooltip>}>
                                                                            <Link style={{ fontSize: 12, fontWeight: 'bold' }} to={`/address/${rowData.toSmcAddr}`}>{rowData.toSmcName}</Link>
                                                                        </Whisper>
                                                                    </>

                                                                )
                                                        }
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
                                                        {numberFormat(weiToKAI(rowData.value))} KAI
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