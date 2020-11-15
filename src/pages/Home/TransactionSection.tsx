import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel, Icon } from 'rsuite';
import { weiToKAI } from '../../common/utils/amount';
import { numberFormat } from '../../common/utils/number';
import { millisecondToHMS, renderHashToRedirect } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import './home.css'

const { Column, HeaderCell, Cell } = Table;

const TransactionSection = ({ transactionList = [] }: {
    transactionList: KAITransaction[]
}) => {
    const { isMobile } = useViewport();
    const history = useHistory();
    return (
        <Panel shaded>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        rowHeight={70}
                        height={420}
                        hover={false}
                        data={transactionList}
                        wordWrap
                    >
                        <Column flexGrow={2} minWidth={isMobile ? 110 : 0}>
                            <HeaderCell>Tx Hash</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <div>
                                                <Icon className="highlight" icon="exchange" style={{ marginRight: '10px' }} />
                                                {renderHashToRedirect({
                                                    hash: rowData.txHash,
                                                    headCount: isMobile ? 4 : 8,
                                                    showTooltip: false,
                                                    callback: () => { history.push(`/tx/${rowData.txHash}`) }
                                                })}
                                            </div>
                                            <div>{millisecondToHMS(rowData.age || 0)}</div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column flexGrow={2} minWidth={isMobile ? 150 : 0}>
                            <HeaderCell>Detail</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <div style={{ marginBottom: '5px' }}>
                                                From:
                                                {renderHashToRedirect({
                                                hash: rowData.from,
                                                headCount: isMobile ? 4 : 8,
                                                tailCount: 4,
                                                showTooltip: false,
                                                callback: () => { history.push(`/address/${rowData.from}`) }
                                            })}
                                            </div>
                                            <div>
                                                {
                                                    rowData.to !== "0x" ? (
                                                        <>
                                                            <Icon className="highlight" icon="arrow-circle-right" style={{ marginRight: '5px' }} />To:
                                                            {renderHashToRedirect({
                                                                hash: rowData.to,
                                                                headCount: isMobile ? 4 : 8,
                                                                tailCount: 4,
                                                                showTooltip: false,
                                                                callback: () => { history.push(`/address/${rowData.to}`) }
                                                            })}
                                                        </>
                                                    ) : (
                                                            <>
                                                                <Icon className="highlight" icon="file-text-o" style={{ marginRight: '5px' }} />To:
                                                                <Link style={{marginLeft: 5, fontSize: 12, fontWeight: 'bold'}} to={`/address/${rowData.contractAddress || "0x"}`}>Contract Creation</Link>
                                                            </>
                                                        )
                                                }
                                            </div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column align="right" minWidth={isMobile ? 100 : 0} flexGrow={1}>
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
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </Panel>
    )
};

export default TransactionSection;