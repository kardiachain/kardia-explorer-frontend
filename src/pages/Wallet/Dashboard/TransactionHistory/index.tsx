import React, { useState, useEffect } from 'react'
import { FlexboxGrid, Col, Panel, Table, Icon, Whisper, Tooltip, Tag } from 'rsuite';
import { useViewport } from '../../../../context/ViewportContext';
import { renderHashToRedirect, millisecondToHMS } from '../../../../common/utils/string';
import { weiToKAI } from '../../../../common/utils/amount';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { TABLE_CONFIG } from '../../../../config';
import { Link } from 'react-router-dom';
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
                    <div style={{ marginBottom: 16 }}>
                        <div className="title header-title">
                            Transactions history
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
                                    height={200}
                                    data={transactionList}
                                    autoHeight
                                    hover={false}
                                    loading={loading}
                                    wordWrap
                                >
                                    <Column flexGrow={2} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                                        <HeaderCell>Tx Hash</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        <span className="container-icon-left">
                                                            <Icon icon={!rowData.isSmcInteraction ? "exchange" : "file-text-o"} className="gray-highlight" />
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
                                    <Column flexGrow={1} verticalAlign="middle">
                                        <HeaderCell>Block</HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        <Link className="color-white" to={`/block/${rowData.blockNumber}`}>{numberFormat(rowData.blockNumber)}</Link>
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
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
                                                            redirectTo: `/address/${rowData.from}`
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={1} verticalAlign="middle">
                                        <HeaderCell></HeaderCell>
                                        <Cell>
                                            {(rowData: KAITransaction) => {
                                                return (
                                                    <div>
                                                        {
                                                            myAccount.publickey === rowData.from ? <Tag color="yellow" className="tab-in-out tab-out">OUT</Tag> : <Tag color="green" className="tab-in-out tab-in">IN</Tag>
                                                        }
                                                    </div>
                                                )
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
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
                                                                        <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{rowData.to}</Tooltip>}>
                                                                            <Link className="color-white" to={`/address/${rowData.to}`}>{rowData.toName}</Link>
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

export default TransactionHistory;