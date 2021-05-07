import React from 'react';
import { Link } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel, Icon, Whisper, Tooltip } from 'rsuite';
import { millisecondToHMS, renderHashToRedirect, renderStringAndTooltip, weiToKAI, numberFormat } from '../../common';
import { useViewport } from '../../context/ViewportContext';
import './home.css'

const { Column, HeaderCell, Cell } = Table;

const TransactionSection = ({ transactionList = [] }: {
    transactionList: KAITransaction[]
}) => {
    const { isMobile } = useViewport();
    return (
        <Panel shaded className="panel-bg-gray">
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        rowHeight={70}
                        height={400}
                        hover={false}
                        data={transactionList}
                        wordWrap
                        autoHeight={isMobile ? true : false}
                    >
                        <Column flexGrow={2} minWidth={150} verticalAlign="middle">
                            <HeaderCell><span style={{ marginLeft: 40 }}>Tx Hash</span></HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <span className={`container-icon-left ${rowData.status === 0 ? 'icon-tx-error' : ''}`}>
                                                <Icon icon={!rowData.isSmcInteraction ? "exchange" : "file-text-o"} className="gray-highlight" />
                                            </span>
                                            <span className="container-content-right" style={{ display: 'inline-block' }}>
                                                {renderHashToRedirect({
                                                    hash: rowData.txHash,
                                                    headCount: isMobile ? 4 : 8,
                                                    showTooltip: false,
                                                    redirectTo: `/tx/${rowData.txHash}`
                                                })}
                                                <div className="fs-12">{millisecondToHMS(rowData.age || 0)}</div>
                                            </span>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column flexGrow={2} minWidth={180} verticalAlign="middle">
                            <HeaderCell>Detail</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <span className="container-content-right">
                                                <span style={{ marginRight: 5, fontSize: 12 }}>From:</span>
                                                {renderHashToRedirect({
                                                    hash: rowData.from,
                                                    headCount: isMobile ? 4 : 8,
                                                    tailCount: 4,
                                                    showTooltip: false,
                                                    redirectTo: `/address/${rowData.from}`
                                                })}
                                                <div>
                                                    <span style={{ marginRight: 5, fontSize: 12 }}>To:</span>
                                                    {
                                                        !rowData.isSmcInteraction || !rowData.toName ? (
                                                            <span>
                                                                {renderHashToRedirect({
                                                                    hash: rowData.to,
                                                                    headCount: isMobile ? 4 : 8,
                                                                    tailCount: 4,
                                                                    showTooltip: false,
                                                                    redirectTo: `/address/${rowData.to}`
                                                                })}
                                                            </span>
                                                        ) : (
                                                                <>
                                                                    {
                                                                        rowData.to ? (
                                                                            <Whisper placement="autoVertical" trigger="hover" speaker={<Tooltip className="custom-tooltip">{rowData.to}</Tooltip>}>
                                                                                <Link className="text-link" style={{ fontSize: 14 }} to={`/address/${rowData.to}`}>
                                                                                    {
                                                                                        renderStringAndTooltip({
                                                                                            str: rowData.toName,
                                                                                            headCount: 15,
                                                                                            showTooltip: false
                                                                                        })
                                                                                    }
                                                                                </Link>
                                                                            </Whisper>
                                                                        ) : (
                                                                            renderStringAndTooltip({
                                                                                str: rowData.toName,
                                                                                headCount: 15,
                                                                                showTooltip: false
                                                                            })
                                                                        )
                                                                    }
                                                                </>
                                                            )
                                                    }
                                                </div>
                                            </span>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column align="right" verticalAlign="middle" flexGrow={1} minWidth={70}>
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
                    </Table>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </Panel>
    )
};

export default TransactionSection;