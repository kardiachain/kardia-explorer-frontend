import React from 'react'
import { Link } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Table, Tag, Tooltip, Whisper } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { TABLE_CONFIG } from '../../../config';
import { useViewport } from '../../../context/ViewportContext';
import { weiToKAI } from '../../utils/amount';
import { numberFormat } from '../../utils/number';
import { compareString, millisecondToHMS, renderHashStringAndTooltip, renderHashToRedirect } from '../../utils/string';
import { StakingIcon } from '../IconCustom';

const { Column, HeaderCell, Cell } = Table;

export const TransactionHistoryList = ({ transactionList, loading, address, totalTxs, size, page, setSize, setPage }: {
    transactionList: KAITransaction[];
    loading: boolean;
    address: string;
    totalTxs: number;
    size: number;
    page: number;
    setSize: (size: number) => void;
    setPage: (page: number) => void;
}) => {
    const { isMobile } = useViewport()

    return (
        <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                <Table
                    rowHeight={() => 60}
                    height={200}
                    data={transactionList}
                    autoHeight
                    hover={false}
                    loading={loading}
                    wordWrap
                >
                    <Column flexGrow={3} minWidth={isMobile ? 150 : 0} verticalAlign="middle">
                        <HeaderCell><span style={{ marginLeft: 40 }}>Tx Hash</span></HeaderCell>
                        <Cell>
                            {(rowData: KAITransaction) => {
                                return (
                                    <div>
                                        <span className={`container-icon-left ${rowData.status === 0 ? 'icon-tx-error' : ''}`}>
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
                    <Column flexGrow={2} minWidth={isMobile ? 100 : 0} verticalAlign="middle">
                        <HeaderCell>Block Height</HeaderCell>
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
                    <Column flexGrow={3} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
                        <HeaderCell>From</HeaderCell>
                        <Cell>
                            {(rowData: KAITransaction) => {
                                return (
                                    <div>
                                        {
                                            compareString(address, rowData.from) ? renderHashStringAndTooltip(rowData.from, isMobile ? 5 : 12, 4, true) : renderHashToRedirect({
                                                hash: rowData.from,
                                                headCount: isMobile ? 5 : 12,
                                                tailCount: 4,
                                                showTooltip: true,
                                                redirectTo: `/address/${rowData.from}`
                                            })
                                        }
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
                                            compareString(address, rowData.from) ? <Tag color="yellow" className="tab-in-out tab-out">OUT</Tag> : <Tag color="green" className="tab-in-out tab-in">IN</Tag>
                                        }
                                    </div>
                                )
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={3} minWidth={isMobile ? 120 : 0} verticalAlign="middle">
                        <HeaderCell>To</HeaderCell>
                        <Cell>
                            {(rowData: KAITransaction) => {
                                return (
                                    <div>
                                        {
                                            !rowData.isSmcInteraction || !rowData.toName ? (
                                                <>
                                                    {
                                                        compareString(address, rowData.to) ? renderHashStringAndTooltip(rowData.to, isMobile ? 5 : 12, 4, true) : renderHashToRedirect({
                                                            hash: rowData.to,
                                                            headCount: isMobile ? 5 : 12,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            redirectTo: `/address/${rowData.to}`
                                                        })
                                                    }
                                                </>
                                            ) : (
                                                    <>
                                                        <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{rowData.to || '0x'}</Tooltip>}>
                                                            <Link className="text-link" style={{ fontSize: 12, fontWeight: 'bold' }} to={`/address/${rowData.to}`}>
                                                                {rowData.toName}
                                                            </Link>
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
    )
}