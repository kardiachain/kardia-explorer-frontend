import React, { useEffect, useState } from 'react';
import {  GraphConfiguration } from 'react-d3-graph';
import { Col, FlexboxGrid, Icon, Panel, Table } from 'rsuite';
import { renderHashToRedirect } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getNodes } from '../../service/kai-explorer/network';
import SearchSection from '../../common/components/Header/SearchSection';
import { useHistory } from 'react-router-dom';
import './network.css'

const { Column, HeaderCell, Cell } = Table;

const Network = () => {
    const history = useHistory()
    const [graphConfig, setGraphConfig] = useState({} as Partial<GraphConfiguration<KAINode, { source: string, target: string }>>)
    const [graphData, setGraphData] = useState<any>({ nodes: [], links: [], focusedNodeId: "" })

    const { width, height } = useViewport()

    const { isMobile } = useViewport()

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
            console.log(result);
            
            setGraphData({
                nodes: result,
                links: [
                    { source: 'KAI-Bootnode-1', target: 'KAI-Bootnode-2' },
                    { source: 'KAI-Bootnode-1', target: 'KAI-Bootnode-3' },
                    { source: 'KAI-Bootnode-1', target: 'KAI-Genesis-Validator-1' },
                    { source: 'KAI-Bootnode-1', target: 'KAI-Genesis-Validator-2' },
                    { source: 'KAI-Bootnode-1', target: 'KAI-Genesis-Validator-3' },
                    { source: 'KAI-Bootnode-2', target: 'KAI-Bootnode-3' },
                    { source: 'KAI-Bootnode-2', target: 'KAI-Genesis-Validator-1' },
                    { source: 'KAI-Bootnode-2', target: 'KAI-Genesis-Validator-2' },
                    { source: 'KAI-Bootnode-2', target: 'KAI-Genesis-Validator-3' },
                    { source: 'KAI-Bootnode-3', target: 'KAI-Genesis-Validator-1' },
                    { source: 'KAI-Bootnode-3', target: 'KAI-Genesis-Validator-2' },
                    { source: 'KAI-Bootnode-3', target: 'KAI-Genesis-Validator-3' },
                ],
                focusedNodeId: result[0] ? result[0].id : ""
            })
        })()
    }, [])

    return (
        <div className="container">
            <SearchSection />
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="connectdevelop" size={"2x"} />
                    <p style={{ marginLeft: '12px' }} className="title">Network</p>
                </div>
            </div>
            <FlexboxGrid>
                {/* {
                !isMobile && 
                <FlexboxGrid.Item componentClass={Col} xs={24} sm={24} md={10}>
                    <Panel bordered header="Kardia Network">
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
            } */}
                <FlexboxGrid.Item componentClass={Col} xs={24} sm={24} md={24}>
                    <Panel shaded>
                        <FlexboxGrid justify="space-between">
                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                <Table
                                    autoHeight
                                    rowHeight={60}
                                    data={graphData.nodes}
                                    hover={false}
                                    wordWrap
                                >
                                    <Column width={30} verticalAlign="middle" align="center">
                                        <HeaderCell></HeaderCell>
                                        <Cell>
                                            {(rowData: KAINode) => {
                                                if (rowData.status === "online") {
                                                    return <div className="dot-status online"></div>
                                                }
                                                return <div className="dot-status offline"></div>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} minWidth={isMobile ? 130 : 0} verticalAlign="middle">
                                        <HeaderCell>Name</HeaderCell>
                                        <Cell>
                                            {(rowData: KAINode) => {
                                                return (
                                                    <div>
                                                        {isMobile ? <></> : <Icon className="highlight" icon="connectdevelop" style={{ marginRight: '5px' }} />}
                                                        {rowData.id}
                                                    </div>
                                                )
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={3} minWidth={isMobile ? 110 : 0} verticalAlign="middle" align="center">
                                        <HeaderCell>Address</HeaderCell>
                                        <Cell>
                                            {(rowData: KAINode) => {
                                                return (
                                                    <div>
                                                        {renderHashToRedirect({
                                                            hash: rowData.address,
                                                            headCount: isMobile ? 5 : 20,
                                                            tailCount: 4,
                                                            showTooltip: true,
                                                            callback: () => { history.push(`/address/${rowData.address}`) }
                                                        })}
                                                    </div>
                                                );
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column flexGrow={2} verticalAlign="middle" align="center">
                                        <HeaderCell>Protocol</HeaderCell>
                                        <Cell dataKey="protocol" />
                                    </Column>
                                    <Column flexGrow={1} verticalAlign="middle" align="center">
                                        <HeaderCell>Peer count</HeaderCell>
                                        <Cell dataKey="peerCount" />
                                    </Column>
                                </Table>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}

export default Network;