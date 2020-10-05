import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { Col, FlexboxGrid, Table } from 'rsuite';
import { renderHashString } from '../../common/utils/string';
import { getBlocks } from '../../service/kai-explorer';

const { Column, HeaderCell, Cell } = Table;

const BlockSection = () => {
    const [blockList, setBlockList] = useState([] as KAITransaction[])
    useEffect(() => {
        const transactions = getBlocks(1, 5);
        setBlockList(transactions)
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
                            label: 'Block time',
                            borderColor: 'rgb(167,129,227)',
                            data: [27, 3, 10, 6, 30, 14, 16]
                        }]
                    }} 
                />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={10}>
                <h3>Latest blocks</h3>
                <Table
                    bordered
                    autoHeight
                    rowHeight={70}
                    data={blockList}
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
}

export default BlockSection;