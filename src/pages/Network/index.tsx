import React, { useEffect, useState } from 'react';
import { Graph, GraphConfiguration } from 'react-d3-graph';
import { Col, FlexboxGrid, Panel, Table, Tag } from 'rsuite';
import { renderHashString } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getNodes } from '../../service/kai-explorer/network';

const { Column, HeaderCell, Cell } = Table;

const Network = () => {
    const [graphConfig, setGraphConfig] = useState({} as Partial<GraphConfiguration<KAINode, {source: string, target: string}>>)
    const [graphData, setGraphData] = useState<any>({nodes: [], links: [], focusedNodeId: ""})

    const {width, height} = useViewport()

    const {isMobile} = useViewport()

    useEffect(() => {
        const graphWidth = width / 3
        const graphHeight = height * 70 / 100
        
        setGraphConfig({
            nodeHighlightBehavior: true,
            node: {
                color: 'lightgreen',
                size: 120,
                highlightStrokeColor: 'blue'
            },
            link: {
                highlightColor: 'lightblue'
            },
            height: graphHeight,
            width: graphWidth,
            panAndZoom: true,
            focusZoom: 10,
            minZoom: 1,
            maxZoom: 20,
            d3: {
                alphaTarget: 0.05,
                gravity: -100,
                linkLength: 100,
                linkStrength: 1,
                disableLinkForce: false
            }
        })
    }, [width, height])

    useEffect(() => {
        (async () => {
            const result = await getNodes()
            setGraphData({
                nodes: result,
                links: [
                    {source: 'KAI-Bootnode-1', target: 'KAI-Bootnode-2'},
                    {source: 'KAI-Bootnode-1', target: 'KAI-Bootnode-3'},
                    {source: 'KAI-Bootnode-1', target: 'KAI-Genesis-Validator-1'},
                    {source: 'KAI-Bootnode-1', target: 'KAI-Genesis-Validator-2'},
                    {source: 'KAI-Bootnode-1', target: 'KAI-Genesis-Validator-3'},
                    {source: 'KAI-Bootnode-2', target: 'KAI-Bootnode-3'},
                    {source: 'KAI-Bootnode-2', target: 'KAI-Genesis-Validator-1'},
                    {source: 'KAI-Bootnode-2', target: 'KAI-Genesis-Validator-2'},
                    {source: 'KAI-Bootnode-2', target: 'KAI-Genesis-Validator-3'},
                    {source: 'KAI-Bootnode-3', target: 'KAI-Genesis-Validator-1'},
                    {source: 'KAI-Bootnode-3', target: 'KAI-Genesis-Validator-2'},
                    {source: 'KAI-Bootnode-3', target: 'KAI-Genesis-Validator-3'},
                ],
                focusedNodeId: result[0] ? result[0].id : ""
            })
        })()
    }, [])

    return (
        <FlexboxGrid style={{width: '100%'}}>
            {
                !isMobile && 
                <FlexboxGrid.Item componentClass={Col} xs={24} sm={24} md={10} style={{padding: 30}}>
                    <Panel bordered header="Kardia network">
                        {
                            graphConfig.width && graphData.nodes.length > 0 &&
                            <Graph
                                id='kai_network_graph'
                                data={graphData}
                                config={graphConfig}
                            />
                        }
                    </Panel>
                </FlexboxGrid.Item>
            }
            <FlexboxGrid.Item componentClass={Col} xs={24} sm={24} md={14} style={{padding: 30}}>
                <Table
                    bordered
                    autoHeight
                    rowHeight={70}
                    // data={graphData.nodes.filter((v: any) => v.isValidator)}
                    data={graphData.nodes}
                    onRowClick={data => {
                        console.log(data);
                    }}
                >
                    <Column width={100} fixed>
                        <HeaderCell>Name</HeaderCell>
                        <Cell dataKey="id" />
                    </Column>
                    <Column width={100}>
                        <HeaderCell>Status</HeaderCell>
                        <Cell>
                            {(rowData: KAINode) => {
                                if (rowData.status === "online") {
                                    return <Tag color="green">Online</Tag>
                                }
                                return <Tag color="red">Offline</Tag>
                            }}
                        </Cell>
                    </Column>
                    <Column width={isMobile ? 120 : 500}>
                        <HeaderCell>Address</HeaderCell>
                        <Cell>
                            {(rowData: KAINode) => {
                                return (
                                    <div> {renderHashString(rowData.address, isMobile ? 10 : 40)} </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column width={100}>
                        <HeaderCell>Protocol</HeaderCell>
                        <Cell dataKey="protocol" />
                    </Column>
                    <Column width={100}>
                        <HeaderCell>Peer count</HeaderCell>
                        <Cell dataKey="peerCount" />
                    </Column>
                    {/* <Column width={100}>
                        <HeaderCell>Voting power</HeaderCell>
                        <Cell dataKey="votingPower" />
                    </Column> */}
                    {/* <Column width={200}>
                        <HeaderCell>RPC URL</HeaderCell>
                        <Cell dataKey="rpcURL" />
                    </Column> */}
                </Table>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default Network;