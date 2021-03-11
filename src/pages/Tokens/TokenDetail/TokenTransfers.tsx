import React, { useEffect, useState } from 'react';
import { Col, FlexboxGrid, Icon, Table } from 'rsuite';
import { numberFormat } from '../../../common/utils/number';
import { useViewport } from '../../../context/ViewportContext';
import { ITokenTranferTx } from '../../../service/kai-explorer/tokens/type';
import { TABLE_CONFIG } from '../../../config';
import { getTokenTransferTx } from '../../../service/kai-explorer/tokens';
import { millisecondToHMS, renderHashToRedirect } from '../../../common/utils/string';
import { convertValueFollowDecimal } from '../../../common/utils/amount';
import TablePagination from 'rsuite/lib/Table/TablePagination';

const { Column, HeaderCell, Cell } = Table;

const TokenTransfers = ({ tokenAddr, decimals }: {
    tokenAddr: string;
    decimals: number
}) => {
    const { isMobile } = useViewport()
    const [txs, setTxs] = useState<ITokenTranferTx[]>([] as ITokenTranferTx[])
    const [totalTx, setTotalTx] = useState(0)
    const [page, setPage] = useState(TABLE_CONFIG.page)
    const [size, setSize] = useState(TABLE_CONFIG.limitDefault)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const rs = await getTokenTransferTx(tokenAddr, page, size)
            setTotalTx(rs.total)
            setTxs(rs.txs)
            setLoading(false)
        })()
    }, [size, page, tokenAddr])

    return (
        <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                <Table
                    rowHeight={60}
                    height={200}
                    data={txs}
                    autoHeight
                    hover={false}
                    wordWrap
                    loading={loading}
                >
                    <Column flexGrow={2} minWidth={200} verticalAlign="middle">
                        <HeaderCell><span style={{ marginLeft: 40 }}>Tx Hash</span></HeaderCell>
                        <Cell>
                            {(rowData: ITokenTranferTx) => {
                                return (
                                    <div>
                                        <span className={`container-icon-left`}>
                                            <Icon icon="file-text-o" className="gray-highlight" />
                                        </span>
                                        <span className="container-content-right">
                                            {
                                                renderHashToRedirect({
                                                    hash: rowData.txHash,
                                                    headCount: isMobile ? 5 : 20,
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
                    <Column flexGrow={2} minWidth={180} verticalAlign="middle">
                        <HeaderCell>From</HeaderCell>
                        <Cell>
                            {(rowData: ITokenTranferTx) => {
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
                    <Column flexGrow={2} minWidth={180} verticalAlign="middle">
                        <HeaderCell>To</HeaderCell>
                        <Cell>
                            {(rowData: ITokenTranferTx) => {
                                return (
                                    <div>
                                        {renderHashToRedirect({
                                            hash: rowData.to,
                                            headCount: isMobile ? 5 : 12,
                                            tailCount: 4,
                                            showTooltip: true,
                                            redirectTo: `/address/${rowData.to}`
                                        })}
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={1} minWidth={150} verticalAlign="middle">
                        <HeaderCell>Value (KAI)</HeaderCell>
                        <Cell>
                            {(rowData: any) => {
                                return (
                                    <div>
                                        {numberFormat(convertValueFollowDecimal(rowData.value, decimals))}
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
                    total={totalTx}
                    onChangePage={setPage}
                    onChangeLength={setSize}
                />
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default TokenTransfers
