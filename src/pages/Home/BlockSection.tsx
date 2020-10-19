import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { Col, FlexboxGrid, Table } from 'rsuite';
import { renderHashString } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getBlocks } from '../../service/kai-explorer';

const { Column, HeaderCell, Cell } = Table;

const BlockSection = () => {
    const [blockList, setBlockList] = useState([] as KAIBlock[])
    const { isMobile } = useViewport()
    useEffect(() => {
        (async () => {
            const blocks = await getBlocks(1, 5);
            setBlockList(blocks)
        })()
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
                            label: 'Block time',
                            borderColor: 'rgb(167,129,227)',
                            data: [27, 3, 10, 6, 30, 14, 16]
                        }]
                    }} 
                />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={16}>
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
                    <Column width={100}>
                        <HeaderCell>Block height</HeaderCell>
                        <Cell dataKey="blockHeight" />
                    </Column>
                    <Column width={isMobile ? 120 : 300}>
                        <HeaderCell>Block Hash</HeaderCell>
                        <Cell>
                            {(rowData: KAIBlock) => {
                                return (
                                    <div>
                                        <div> {renderHashString(rowData.blockHash, isMobile ? 10 : 30)} </div>
                                        <div>{rowData.time.toLocaleDateString()} </div>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column width={isMobile ? 120 : 300}>
                        <HeaderCell>Block validator</HeaderCell>
                        <Cell>
                            {(rowData: KAIBlock) => {
                                return (
                                    <div>
                                        <div> {renderHashString(rowData.validator.hash, isMobile ? 10 : 30)} </div>
                                        <div>
                                            <a target="_blank" rel="noopener noreferrer" href={`/validator/${rowData.validator.hash}`}>{rowData.validator.label}</a>
                                        </div>
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column width={100}>
                        <HeaderCell>Transactions count</HeaderCell>
                        <Cell dataKey="transactions" />
                    </Column>
                </Table>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default BlockSection;