import React from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel, Icon } from 'rsuite';
import { weiToKAI } from '../../common/utils/amount';
import { millisecondToHMS, renderHashToRedirect } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import './home.css'

const { Column, HeaderCell, Cell } = Table;

const TransactionSection = ({ transactionList = []}: {
    transactionList: KAITransaction[]
}) => {
    const { isMobile } = useViewport();
    const history = useHistory();
    return (
        <Panel shaded>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        autoHeight
                        rowHeight={70}
                        height={400}
                        hover={false}
                        data={transactionList}
                        wordWrap
                    >
                        <Column flexGrow={2}>
                            <HeaderCell>Tx Hash</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <div>
                                                <Icon icon="exchange" style={{ marginRight: '10px' }} />
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
                        <Column flexGrow={2}>
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
                                                <Icon icon="arrow-circle-right" style={{ marginRight: '5px' }}/>To:
                                                {renderHashToRedirect({
                                                hash: rowData.to,
                                                headCount: isMobile ? 4 : 8,
                                                tailCount: 4,
                                                showTooltip: false,
                                                callback: () => { history.push(`/address/${rowData.to}`) }
                                            })}
                                            </div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column align="right" flexGrow={1}>
                            <HeaderCell>Value</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            {weiToKAI(rowData.value)} KAI
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