import React, { useState, useEffect } from 'react'
import { FlexboxGrid, Col, Panel, Table, Icon, Whisper, Tooltip, Tag } from 'rsuite';
import { useViewport } from '../../../../context/ViewportContext';
import { renderHashToRedirect, millisecondToHMS } from '../../../../common/utils/string';
import { weiToKAI } from '../../../../common/utils/amount';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { TABLE_CONFIG } from '../../../../config';
import { Link, useHistory } from 'react-router-dom';
import { getTxsByAddress } from '../../../../service/kai-explorer/transaction';
import { getAccount } from '../../../../service/wallet';
import { numberFormat } from '../../../../common/utils/number';
import { StakingIcon } from '../../../../common/components/IconCustom';
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
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                    <div className="block-title" style={{ padding: '0px 5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon className="gray-highlight" icon="exchange" size={"lg"} />
                            <p style={{ marginLeft: '12px' }} className="title color-white">Transaction history</p>
                        </div>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                    <div className="transaction-summary" style={{marginBottom: 5}}>
                        <Tag className="gray-tab-custom">A total of {numberFormat(totalTxs)} transactions found</Tag>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded className="panel-bg-gray">
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
                                    <Column flexGrow={3} minWidth={isMobile ? 100 : 0}>
                                        <HeaderCell>Tx Hash</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon className="gray-highlight" icon="exchange" style={{ marginRight: '5px' }} />}
                                                        {renderHashToRedirect({
                                                            hash: rowData.txHash,
                                                            headCount: isMobile ? 5 : 12,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { history.push(`/tx/${rowData.txHash}`) }
                                                        })}
                                                        {
                                                            !rowData.status ? (
                                                                <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">Transaction error</Tooltip>}>
                                                                    <Icon style={{ marginRight: '5px' }} className="tx-error-icon" icon="warning" />
                                                                </Whisper>
                                                            ) : <></>
                                                        }
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
                                                        {isMobile ? <></> : <Icon className="gray-highlight" icon="cubes" style={{ marginRight: '5px' }} />}
                                                        <Link className="color-white" to={`/block/${rowData.blockNumber}`}>{numberFormat(rowData.blockNumber)}</Link>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} align="center" minWidth={isMobile ? 90 : 0}>
                                        <HeaderCell>Age</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon className="orange-highlight" icon="clock-o" style={{ marginRight: '5px' }} />}
                                                        {millisecondToHMS(rowData.age || 0)}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0}>
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
                                    <Column flexGrow={1}>
                                        <HeaderCell></HeaderCell>
                                        <Cell style={{ display: 'flex', justifyContent: 'center' }}>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {
                                                            myAccount.publickey === rowData.from ? <Tag color="yellow" className="tab-in-out">OUT</Tag> : <Tag color="green" className="tab-in-out">IN</Tag>
                                                        }
                                                    </div>
                                                )
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0}>
                                        <HeaderCell>To</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {
                                                            !rowData.toSmcAddr ? (
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
                                                                        {
                                                                            rowData.isInValidatorsList ? (
                                                                                <StakingIcon
                                                                                    color={rowData?.role?.classname}
                                                                                    character={rowData?.role?.character}
                                                                                    size='small' style={{ marginLeft: 5 }} />
                                                                            ) : <></>
                                                                        }
                                                                    </>

                                                                )
                                                        }
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0}>
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
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0}>
                                        <HeaderCell>Tx Fee</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {numberFormat(weiToKAI(rowData.txFee))} KAI
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