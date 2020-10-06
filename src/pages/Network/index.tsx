import React, { useEffect, useState } from 'react';
import { Graph, GraphConfiguration } from 'react-d3-graph';
import { Col, Grid, Panel, Row, Table, Tag } from 'rsuite';
import { renderHashString } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';

const data = {
    nodes: [
        {
            id: 'KAI-ETH 1',
            color: '#4287f5',
            address: '0x8dB7cF1823fcfa6e9E2063F983b3B96A48EEd5a4',
            peerCount: 100,
            protocol: 'KAI-ETH',
            votingPower: 100,
            status: "online",
            rpcURL: 'http://18.141.217.53:8545'
        },
        {
            id: 'KAI-ETH 2',
            color: '#4287f5',
            address: '0x8dB7cF1823fcfa6e9E2063F983b3B96A48EEd5a4',
            peerCount: 100,
            protocol: 'KAI-ETH',
            votingPower: 100,
            status: "online",
            rpcURL: 'http://18.141.217.53:8545'
        },
        {
            id: 'KAI-ETH 3',
            color: '#4287f5',
            address: '0x8dB7cF1823fcfa6e9E2063F983b3B96A48EEd5a4',
            peerCount: 100,
            protocol: 'KAI-ETH',
            votingPower: 100,
            status: "online",
            rpcURL: 'http://18.141.217.53:8545'
        },
        {
            id: 'KAI-TRX 1',
            color: '#eb2f58',
            address: '0x8dB7cF1823fcfa6e9E2063F983b3B96A48EEd5a4',
            peerCount: 100,
            protocol: 'KAI-TRX',
            votingPower: 100,
            status: "online",
            rpcURL: 'http://18.141.217.53:8545'
        },
        {
            id: 'KAI-NEO 1',
            color: '#e8a02c',
            address: '0x8dB7cF1823fcfa6e9E2063F983b3B96A48EEd5a4',
            peerCount: 100,
            protocol: 'KAI-NEO',
            votingPower: 100,
            status: "online",
            rpcURL: 'http://18.141.217.53:8545'
        },
        {
            id: 'KAI-NEO 2',
            color: '#e8a02c',
            address: '0x8dB7cF1823fcfa6e9E2063F983b3B96A48EEd5a4',
            peerCount: 100,
            protocol: 'KAI-NEO',
            votingPower: 100,
            status: "online",
            rpcURL: 'http://18.141.217.53:8545'
        },
        {
            id: 'KAI 1',
            address: '0x8dB7cF1823fcfa6e9E2063F983b3B96A48EEd5a4',
            peerCount: 100,
            protocol: 'KAI',
            votingPower: 100,
            status: "online",
            rpcURL: 'http://18.141.217.53:8545'
        },
        {
            id: 'KAI 2',
            address: '0x8dB7cF1823fcfa6e9E2063F983b3B96A48EEd5a4',
            peerCount: 100,
            protocol: 'KAI',
            votingPower: 100,
            status: "offline",
            rpcURL: 'http://18.141.217.53:8545'
        },
        {
            id: 'KAI 3',
            address: '0x8dB7cF1823fcfa6e9E2063F983b3B96A48EEd5a4',
            peerCount: 100,
            protocol: 'KAI',
            votingPower: 100,
            status: "offline",
            rpcURL: 'http://18.141.217.53:8545'
        }
    ] as KAINode[],
    links: [
        {source: 'KAI-ETH 1', target: 'KAI 1'},
        {source: 'KAI-ETH 1', target: 'KAI-ETH 2'},
        {source: 'KAI-ETH 1', target: 'KAI-ETH 3'},
        {source: 'KAI-ETH 2', target: 'KAI-ETH 3'},
        {source: 'KAI-ETH 2', target: 'KAI 1'},
        {source: 'KAI-TRX 1', target: 'KAI 1'},
        {source: 'KAI-TRX 1', target: 'KAI 2'},
        {source: 'KAI-NEO 1', target: 'KAI 1'},
        {source: 'KAI-NEO 2', target: 'KAI 1'},
        {source: 'KAI-NEO 1', target: 'KAI-NEO 2'},
        {source: 'KAI 3', target: 'KAI-NEO 2'},
        {source: 'KAI 1', target: 'KAI 2'},
        {source: 'KAI 1', target: 'KAI 3'},
        {source: 'KAI 2', target: 'KAI 3'}
    ],
    focusedNodeId: "KAI 1"
};

const { Column, HeaderCell, Cell } = Table;

const Network = () => {
    const [graphConfig, setGraphConfig] = useState({} as Partial<GraphConfiguration<KAINode, {source: string, target: string}>>)

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

    return (
        <Grid fluid>
            <Row>
                <Col xs={24} sm={24} md={10} style={{padding: 30}}>
                    <Panel bordered header="Kardia network">
                        {
                            graphConfig.width && 
                            <Graph
                                id='kai_network_graph'
                                data={data}
                                config={graphConfig}
                            />
                        }
                    </Panel>
                </Col>
                <Col xs={24} sm={24} md={14} style={{padding: 30}}>
                    <Table
                        bordered
                        autoHeight
                        rowHeight={70}
                        data={data.nodes}
                        onRowClick={data => {
                            console.log(data);
                        }}
                    >
                        <Column width={100} fixed>
                            <HeaderCell>Name</HeaderCell>
                            <Cell dataKey="id" />
                        </Column>
                        <Column width={isMobile ? 120 : 300}>
                            <HeaderCell>Hash</HeaderCell>
                            <Cell>
                                {(rowData: KAINode) => {
                                    return (
                                        <div> {renderHashString(rowData.address, isMobile ? 10 : 30)} </div>
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
                        <Column width={200}>
                            <HeaderCell>RPC URL</HeaderCell>
                            <Cell dataKey="rpcURL" />
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
                    </Table>
                </Col>
            </Row>
        </Grid>
    )
}

export default Network;