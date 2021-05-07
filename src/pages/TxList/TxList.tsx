import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Panel, Table, Tooltip, Whisper } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { TABLE_CONFIG, TIME_INTERVAL_MILISECONDS } from '../../config';
import { useViewport } from '../../context/ViewportContext';
import { getTransactions, getTxsByBlockHeight } from '../../service';
import './txList.css'
import { StakingIcon, SearchSection, numberFormat, weiToKAI, millisecondToHMS, renderHashToRedirect, renderStringAndTooltip } from '../../common';

const { Column, HeaderCell, Cell } = Table;

const TxList = () => {

    const query = new URLSearchParams(useLocation().search);
    const block = query.get("block") || '';
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const { isMobile } = useViewport()
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
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Transactions
                        </div>
                        <div className="sub-title">
                            {numberFormat(totalTxs)} transactions found
                        </div>
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
                                    <Column flexGrow={3} minWidth={isMobile ? 150 : 250} verticalAlign="middle">
                                        <HeaderCell><span style={{ marginLeft: 40 }}>Tx Hash</span></HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        <span className={`container-icon-left ${rowData.status === 0 ? 'icon-tx-error' : ''}`}>
                                                            <Icon icon={ !rowData.isSmcInteraction ? "exchange" : "file-text-o"} className="gray-highlight" />
                                                        </span>
                                                        <span className="container-content-right">
                                                            {
                                                                renderHashToRedirect({
                                                                    hash: rowData.txHash,
                                                                    headCount: isMobile ? 5 : 10,
                                                                    tailCount: 4,
                                                                    showTooltip: false,
                                                                    redirectTo: `/tx/${rowData.txHash}`
                                                                })
                                                            }
                                                            <div className="sub-text">{millisecondToHMS(rowData.age || 0)}</div>
                                                        </span>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 70 : 100} verticalAlign="middle">
                                        <HeaderCell>Block</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        <Link className="text-link" to={`/block/${rowData.blockNumber}`}>{numberFormat(rowData.blockNumber)}</Link>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={3} minWidth={isMobile ? 150 : 200} verticalAlign="middle">
                                        <HeaderCell>From</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {
                                                            !rowData.fromName ? (
                                                                <>
                                                                { renderHashToRedirect({
                                                                    hash: rowData.from,
                                                                    headCount: isMobile ? 5 : 10,
                                                                    tailCount: 4,
                                                                    showTooltip: true,
                                                                    redirectTo: `/address/${rowData.from}`
                                                                })}
                                                                </>
                                                            ) : (
                                                                <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{rowData.from}</Tooltip>}>
                                                                    <Link className="text-link" style={{ fontSize: 12, fontWeight: 'bold' }} to={`/address/${rowData.from}`}>
                                                                        {
                                                                            renderStringAndTooltip({
                                                                                str: rowData.fromName,
                                                                                headCount: isMobile ? 12 : 20,
                                                                                showTooltip: false
                                                                            })
                                                                        }
                                                                    </Link>
                                                                </Whisper>
                                                            )
                                                        }
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={3} minWidth={isMobile ? 150 : 200} verticalAlign="middle">
                                        <HeaderCell>To</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {
                                                            !rowData.isSmcInteraction || !rowData.toName ? (
                                                                <>
                                                                    {renderHashToRedirect({
                                                                        hash: rowData.to,
                                                                        headCount: isMobile ? 5 : 12,
                                                                        tailCount: 4,
                                                                        showTooltip: true,
                                                                        redirectTo: `/address/${rowData.to}`
                                                                    })}
                                                                </>
                                                            ) : (
                                                                    <>
                                                                        {
                                                                            rowData.to ? (
                                                                                <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{rowData.to}</Tooltip>}>
                                                                                    <Link className="text-link" style={{ fontSize: 12, fontWeight: 'bold' }} to={`/address/${rowData.to}`}>
                                                                                        {
                                                                                            renderStringAndTooltip({
                                                                                                str: rowData.toName,
                                                                                                headCount: isMobile ? 12 : 20,
                                                                                                showTooltip: false
                                                                                            })
                                                                                        }
                                                                                    </Link>
                                                                                </Whisper>
                                                                            ) : (
                                                                                renderStringAndTooltip({
                                                                                    str: rowData.toName,
                                                                                    headCount: isMobile ? 12 : 20,
                                                                                    showTooltip: false
                                                                                })
                                                                            )
                                                                        }
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
                                        <HeaderCell>Value (KAI)</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {numberFormat(weiToKAI(rowData.value))}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                                        <HeaderCell>Tx Fee (KAI)</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {numberFormat(weiToKAI(rowData.txFee))}
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