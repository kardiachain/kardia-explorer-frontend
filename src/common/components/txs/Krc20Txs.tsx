import React from 'react'
import { Col, FlexboxGrid, Icon, Table } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { TABLE_CONFIG } from '../../../config';
import { useViewport } from '../../../context/ViewportContext';
import { convertValueFollowDecimal } from '../../utils/amount';
import { numberFormat } from '../../utils/number';
import { millisecondToHMS, renderHashToRedirect, renderStringAndTooltip } from '../../utils/string';
import { Link } from 'react-router-dom';
import { ITokenTranferTx } from '../../../service';

const { Column, HeaderCell, Cell } = Table;

export const Krc20Txs = ({ txs, loading, totalTx, page, setPage, size, setSize }: {
    txs: ITokenTranferTx[];
    totalTx: number;
    loading: boolean;
    page: number;
    setPage: (page: number) => void;
    size: number;
    setSize: (size: number) => void;
}) => {

    const { isMobile } = useViewport()

    return (

        <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                <Table
                    rowHeight={() => 60}
                    height={200}
                    data={txs}
                    autoHeight
                    hover={false}
                    wordWrap
                    loading={loading}
                >
                    <Column flexGrow={3} minWidth={200} verticalAlign="middle">
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
                    <Column flexGrow={2} minWidth={150} verticalAlign="middle">
                        <HeaderCell>Amount</HeaderCell>
                        <Cell>
                            {(rowData: any) => {
                                return (
                                    <div>
                                        {numberFormat(convertValueFollowDecimal(rowData.value, rowData.decimals))}
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={2} minWidth={180} verticalAlign="middle">
                        <HeaderCell>Token</HeaderCell>
                        <Cell>
                            {(rowData: ITokenTranferTx) => {
                                return (
                                    <div>
                                        <img
                                            style={{ marginRight: 5 }}
                                            className="token-logo-small"
                                            src={rowData.logo ? rowData.logo : ''}
                                            alt="kardiachain" />
                                        <span className="text-link">
                                            <Link to={`/token/${rowData.tokenAddress}`}>
                                                {
                                                    rowData.tokenName ? renderStringAndTooltip({
                                                        str: rowData.tokenName,
                                                        headCount: 15,
                                                        showTooltip: true
                                                    }) : ''
                                                }
                                                <span>{rowData.tokenSymbol ? `(${rowData.tokenSymbol})` : ''}</span>
                                            </Link>
                                        </span>
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
