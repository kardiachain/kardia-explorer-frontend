import React, { useEffect, useState } from 'react';
import { Graph, GraphConfiguration } from 'react-d3-graph';
import { Col, Grid, Panel, Row, Table, Tag } from 'rsuite';
import { renderHashString } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getNodes } from '../../service/kai-explorer/network';

// const data = {
//     nodes: [
//         {
//             id: 'node1',
//             color: '#4287f5',
//             address: '0xc1fe56e3f58d3244f606306611a5d10c8333f1f6',
//             peerCount: 5,
//             protocol: 'KAI',
//             votingPower: 100,
//             status: "online",
//             rpcURL: 'http://18.141.217.53:8545',
//             isValidator: true
//         },
//         {
//             id: 'node2',
//             color: '#4287f5',
//             address: '0x7cefc13b6e2aedeedfb7cb6c32457240746baee5',
//             peerCount: 5,
//             protocol: 'KAI',
//             votingPower: 100,
//             status: "online",
//             rpcURL: 'http://18.141.217.53:8545',
//             isValidator: true
//         },
//         {
//             id: 'node3',
//             color: '#4287f5',
//             address: '0xff3dac4f04ddbd24de5d6039f90596f0a8bb08fd',
//             peerCount: 5,
//             protocol: 'KAI',
//             votingPower: 100,
//             status: "online",
//             rpcURL: 'http://18.141.217.53:8545',
//             isValidator: true
//         },
//         {
//             id: 'node4',
//             color: '#4287f5',
//             address: '0x8dB7cF1823fcfa6e9E2063F983b3B96A48EEd5a4',
//             peerCount: 100,
//             protocol: 'KAI',
//             votingPower: 100,
//             status: "online",
//             rpcURL: 'http://18.141.217.53:8545',
//             isValidator: false
//         },
//         {
//             id: 'node5',
//             color: '#4287f5',
//             address: '0x8dB7cF1823fcfa6e9E2063F983b3B96A48EEd5a4',
//             peerCount: 100,
//             protocol: 'KAI',
//             votingPower: 100,
//             status: "online",
//             rpcURL: 'http://18.141.217.53:8545',
//             isValidator: false
//         },
//         {
//             id: 'node6',
//             color: '#4287f5',
//             address: '0x8dB7cF1823fcfa6e9E2063F983b3B96A48EEd5a4',
//             peerCount: 100,
//             protocol: 'KAI',
//             votingPower: 100,
//             status: "online",
//             rpcURL: 'http://18.141.217.53:8545',
//             isValidator: false
//         }
//     ] as KAINode[],
//     links: [
//         {source: 'node1', target: 'node2'},
//         {source: 'node1', target: 'node3'},
//         {source: 'node1', target: 'node4'},
//         {source: 'node1', target: 'node5'},
//         {source: 'node1', target: 'node6'},
//         {source: 'node2', target: 'node3'},
//         {source: 'node2', target: 'node4'},
//         {source: 'node2', target: 'node5'},
//         {source: 'node2', target: 'node6'},
//         {source: 'node3', target: 'node4'},
//         {source: 'node3', target: 'node5'},
//         {source: 'node3', target: 'node6'},
//     ],
//     focusedNodeId: "node1"
// };

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
                    {source: 'node1', target: 'node2'},
                    {source: 'node1', target: 'node3'},
                    {source: 'node1', target: 'node4'},
                    {source: 'node1', target: 'node5'},
                    {source: 'node1', target: 'node6'},
                    {source: 'node2', target: 'node3'},
                    {source: 'node2', target: 'node4'},
                    {source: 'node2', target: 'node5'},
                    {source: 'node2', target: 'node6'},
                    {source: 'node3', target: 'node4'},
                    {source: 'node3', target: 'node5'},
                    {source: 'node3', target: 'node6'},
                ],
                focusedNodeId: result[0].id
            })
        })()
    }, [])

    return (
        <Grid fluid>
            <Row>
                {
                    !isMobile && 
                    <Col xs={24} sm={24} md={10} style={{padding: 30}}>
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
                    </Col>
                }
                <Col xs={24} sm={24} md={14} style={{padding: 30}}>
                    <Table
                        bordered
                        autoHeight
                        rowHeight={70}
                        data={graphData.nodes.filter((v: any) => v.isValidator)}
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
                        <Column width={100}>
                            <HeaderCell>Voting power</HeaderCell>
                            <Cell dataKey="votingPower" />
                        </Column>
                        {/* <Column width={200}>
                            <HeaderCell>RPC URL</HeaderCell>
                            <Cell dataKey="rpcURL" />
                        </Column> */}
                    </Table>
                </Col>
            </Row>
        </Grid>
    )
}

export default Network;