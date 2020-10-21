import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, FlexboxGrid, Table, Panel } from 'rsuite';
import { kaiValueString } from '../../common/utils/amount';
import { millisecondToHMS, renderHashToRedirect } from '../../common/utils/string';
import { TABLE_CONFIG } from '../../config';
import { useViewport } from '../../context/ViewportContext';
import { getTransactions } from '../../service/kai-explorer';

const { Column, HeaderCell, Cell } = Table;

const TransactionSection = () => {
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const { isMobile } = useViewport();
    const history = useHistory();
    useEffect(() => {
        (async () => {
            const transactions = await getTransactions(1, TABLE_CONFIG.limitDefault);
            setTransactionList(transactions)
        })()
    }, [])
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
                        onRowClick={data => {
                            console.log(data);
                        }}
                    >
                        <Column width={isMobile ? 120 : 350}>
                            <HeaderCell>Tx Hash</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <div>{renderHashToRedirect(rowData.txHash, isMobile ? 10 : 30, () => { history.push(`/tx?hash=${rowData.txHash}`) })}</div>
                                            <div>{millisecondToHMS(rowData.age || 0)}</div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column width={isMobile ? 170 : 350}>
                            <HeaderCell>Detail</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            <div style={{marginBottom: '5px'}}>From: {renderHashToRedirect(rowData.from, isMobile ? 10 : 30, () => { history.push(`/txs?addresses=${rowData.from}`) })} </div>
                                            <div>To: {renderHashToRedirect(rowData.to, isMobile ? 10 : 30, () => { history.push(`/txs?addresses=${rowData.to}`) })}</div>
                                        </div>
                                    );
                                }}
                            </Cell>
                        </Column>
                        <Column align="center" width={200}>
                            <HeaderCell>Value</HeaderCell>
                            <Cell>
                                {(rowData: KAITransaction) => {
                                    return (
                                        <div>
                                            {kaiValueString(rowData.value)}
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