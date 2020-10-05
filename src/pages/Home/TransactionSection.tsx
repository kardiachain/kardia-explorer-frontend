import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Col, FlexboxGrid, Table } from 'rsuite';
import { renderHashString } from '../../common/utils/string';
import { getTransactions } from '../../service/kai-explorer';

const { Column, HeaderCell, Cell } = Table;

const TransactionSection = () => {
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    useEffect(() => {
        const transactions = getTransactions(1, 5);
        setTransactionList(transactions)
    }, [])
    return (
        <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={14}>
                <Line 
                    options={{ maintainAspectRatio: false }}
                    height={400}
                    data={{
                        labels: ['1', '2', '3', '4', '5', '6', '7'],
                        datasets: [{
                            label: 'Live TPS',
                            borderColor: 'rgb(255, 99, 132)',
                            data: [0.0133, 0.0139, 0.0135, 0.0132, 0.0132, 0.013, 0.01345]
                        }]
                    }} 
                />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                <h3>Latest transactions</h3>
                <Table
                    bordered
                    autoHeight
                    rowHeight={70}
                    data={transactionList}
                    onRowClick={data => {
                        console.log(data);
                    }}
                >
                    <Column width={140}>
                        <HeaderCell>Tx Hash</HeaderCell>
                        <Cell>
                            {(rowData: any) => {
                                return (
                                    <div>
                                        <div> {renderHashString(rowData.txHash)} </div>
                                        <div>{rowData.time.toLocaleDateString()} </div>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column width={400}>
                        <HeaderCell>Detail</HeaderCell>
                        <Cell>
                            {(rowData: any) => {
                                return (
                                    <div>
                                        <div>From: {renderHashString(rowData.from, 30)} </div>
                                        <div>To: {renderHashString(rowData.to, 30)} </div>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column align="center">
                        <HeaderCell>Value</HeaderCell>
                        <Cell dataKey="value" />
                    </Column>
                </Table>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
};

export default TransactionSection;