import React from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel, Button } from 'rsuite';
import { weiToKAI } from '../../common/utils/amount';
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
        <Panel header="Latest transactions" shaded>
            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Table
                        autoHeight
                        rowHeight={70}
                        height={400}
                        hover={false}
                        data={transactionList}
                        loading={transactionList.length === 0}
                    >
                        <Column width={isMobile ? 120 : 350}>
                            <HeaderCell>Tx Hash</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <div>{renderHashToRedirect(rowData.txHash, isMobile ? 10 : 30, () => { history.push(`/tx/${rowData.txHash}`) })}</div>
                                            <div>{millisecondToHMS(rowData.age || 0)}</div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={isMobile ? 170 : 320}>
                            <HeaderCell>Detail</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <div style={{ marginBottom: '5px' }}>From: {renderHashToRedirect(rowData.from, isMobile ? 10 : 30, () => { history.push(`/txs?addresses=${rowData.from}`) })} </div>
                                            <div>To: {renderHashToRedirect(rowData.to, isMobile ? 10 : 30, () => { history.push(`/txs?addresses=${rowData.to}`) })}</div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column align="center" width={170}>
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
                <Button className="button-view-all" onClick={() => { history.push('/txs') }}>View all transactions</Button>
            </FlexboxGrid>
        </Panel>
    )
};

export default TransactionSection;