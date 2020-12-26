import React, { useEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Panel, Table, Tag, Tooltip, Whisper } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { weiToKAI } from '../../common/utils/amount';
import { millisecondToHMS, renderHashToRedirect } from '../../common/utils/string';
import { TABLE_CONFIG } from '../../config';
import { TIME_INTERVAL_MILISECONDS } from '../../config/api';
import { useViewport } from '../../context/ViewportContext';
import { getTransactions, getTxsByBlockHeight } from '../../service/kai-explorer';
import './txList.css'
import SearchSection from '../../common/components/Header/SearchSection';
import { numberFormat } from '../../common/utils/number';
import { StakingIcon } from '../../common/components/IconCustom';

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
            await fetchTxs(page, size, block)
            setLoading(false)
        })()
    }, [page, size, block])

    useEffect(() => {
        if (!block) {
            const loop = setInterval(async () => {
                const rs = await getTransactions(page, size);
                setTransactionList(rs.transactions)
                setTotalTxs(rs.totalTxs)
            }, TIME_INTERVAL_MILISECONDS)

            return () => clearInterval(loop)
        }
    }, [page, size, block])

    const fetchTxs = async (page: number, size: number, block: string) => {
        if (block) {
            const rs = await getTxsByBlockHeight(block, page, size);
            setTransactionList(rs.transactions)
            setTotalTxs(rs.totalTxs)
        } else {
            const rs = await getTransactions(page, size);
            setTransactionList(rs.transactions)
            setTotalTxs(rs.totalTxs)
        }
    }

    return (
        <div className="container txs-container">
            <SearchSection />
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                    <div className="block-title" style={{ padding: '0px 5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon className="gray-highlight" icon="exchange" size={"2x"} />
                            <p style={{ marginLeft: 12, marginRight: 12 }} className="title color-white">Transactions</p>
                            <span>{block ? `(For Block: #${block})` : ''}</span>
                        </div>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={12}>
                    <div className="transaction-summary">
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
                                    height={400}
                                    data={transactionList}
                                    autoHeight
                                    hover={false}
                                    loading={loading}
                                    wordWrap
                                >
                                    <Column flexGrow={3} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                                        <HeaderCell>Tx Hash</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon className="gray-highlight" icon="exchange" style={{ marginRight: '5px' }} />}
                                                        {renderHashToRedirect({
                                                            hash: rowData.txHash,
                                                            headCount: isMobile ? 5 : 10,
                                                            tailCount: 4,
                                                            showTooltip: false,
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
                                    <Column flexGrow={2} minWidth={isMobile ? 70 : 0} verticalAlign="middle">
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
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
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
                                    <Column flexGrow={3} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                                        <HeaderCell>From</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {renderHashToRedirect({
                                                            hash: rowData.from,
                                                            headCount: isMobile ? 5 : 10,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { history.push(`/address/${rowData.from}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={3} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
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
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
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
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
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

export default TxList