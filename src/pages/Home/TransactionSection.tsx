import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Col, FlexboxGrid, Table } from 'rsuite';
import { renderHashString } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getTransactions } from '../../service/kai-explorer';

const { Column, HeaderCell, Cell } = Table;

const TransactionSection = () => {
    const [transactionList, setTransactionList] = useState([] as KAITransaction[])
    const { isMobile } = useViewport();
    useEffect(() => {
        const transactions = getTransactions(1, 5);
        setTransactionList(transactions)
    }, [])
    return (
        <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={8}>
                <Line 
                    options={{ 
                        maintainAspectRatio: false,
                        scales : {
                            xAxes : [ {
                                gridLines : {
                                    display : false
                                }
                            } ],
                            yAxes : [ {
                                gridLines : {
                                    display : false
                                }
                            } ]
                        }
                    }}
                    height={isMobile ? 200 : 400}
                    data={{
                        labels: ['1', '2', '3', '4', '5', '6', '7'],
                        datasets: [{
                            label: 'TPS',
                            borderColor: 'rgb(255, 99, 132)',
                            data: [0.0133, 0.0139, 0.0135, 0.0132, 0.0132, 0.013, 0.01345]
                        }]
                    }} 
                />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={16}>
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
                    <Column width={isMobile ? 120 : 300}>
                        <HeaderCell>Tx Hash</HeaderCell>
                        <Cell>
                            {(rowData: any) => {
                                return (
                                    <div>
                                        <div> {renderHashString(rowData.txHash, isMobile ? 10 : 30)} </div>
                                        <div>{rowData.time.toLocaleDateString()} </div>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column width={isMobile ? 170 : 300}>
                        <HeaderCell>Detail</HeaderCell>
                        <Cell>
                            {(rowData: any) => {
                                return (
                                    <div>
                                        <div>From: {renderHashString(rowData.from, isMobile ? 10 : 30)} </div>
                                        <div>To: {renderHashString(rowData.to, isMobile ? 10 : 30)} </div>
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