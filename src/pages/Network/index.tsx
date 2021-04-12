import React, { useEffect, useRef, useState } from 'react';
import { Col, FlexboxGrid, Icon, Panel, Table } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import { getNodes } from '../../service';
import './network.css'
import { ForceGraph3D } from 'react-force-graph';
import {SearchSection, renderHashToRedirect, renderStringAndTooltip, colors} from '../../common';

const { Column, HeaderCell, Cell } = Table;

const Network = () => {
    const [graphData, setGraphData] = useState({} as any)
    const [networks, setNetworks] = useState([] as KAINode[])
    const { isMobile } = useViewport()
    const fgRef = useRef({} as any);
    const distance = 250;
    const peerSimolation = 3;

    useEffect(() => {
        fgRef && fgRef.current && fgRef.current.cameraPosition && fgRef.current.cameraPosition({ z: distance });
        
        let angle = 0;

        const autoOrbite = setInterval(() => {
            fgRef && fgRef.current && fgRef.current.cameraPosition && fgRef.current.cameraPosition({
                x: distance * Math.sin(angle),
                z: distance * Math.cos(angle)
            });
            angle += Math.PI / 180;
        }, 40);

        return () => clearInterval(autoOrbite);
    }, []);

    useEffect(() => {
        (async () => {
            const result = await getNodes()
            setNetworks(result)

            let linkArr = [] as any[];
            result.forEach((r) => {
                for (let i = 0; i < peerSimolation; i++) {
                    const nodeRandom = Math.floor(Math.random() * (result?.length - 1));
                    const targetValue = result[nodeRandom]?.nodeName;
                    if (targetValue !== r.nodeName) {
                        linkArr.push({ source: r.nodeName, target: targetValue })
                    }
                }
            });

            const graphData = {
                nodes: result.map((item, index) => {
                    const colorIndexRandom = Math.floor(Math.random() * (colors?.length - 1)) || 0;
                    return {
                        id: item.nodeName,
                        color: colors[index] || colors[colorIndexRandom]
                    }
                }),
                links: linkArr
            }
            setGraphData(graphData)
        })()
    }, [])

    return (
        <div className="network-container">
            {
                graphData?.nodes?.length > 0 ?
                    <ForceGraph3D
                        ref={fgRef}
                        showNavInfo={false}
                        height={500}
                        nodeRelSize={4}
                        graphData={graphData}
                        nodeResolution={30}
                        nodeLabel="id"
                        numDimensions={3}
                        linkOpacity={0.1}
                        linkDirectionalParticles={0.5}
                        linkDirectionalParticleWidth={1}
                        enableNodeDrag={false}
                        linkCurvature={0.3}
                    /> : <></>
            }
            <div className="container">
                <SearchSection />
                <div style={{ marginBottom: 16 }}>
                    <div className="title header-title">
                        Network
                    </div>
                </div>
                <FlexboxGrid>
                    <FlexboxGrid.Item componentClass={Col} xs={24} sm={24} md={24}>
                        <Panel shaded className="panel-bg-gray">
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                    <Table
                                        autoHeight
                                        rowHeight={() => 80}
                                        data={networks}
                                        hover={false}
                                        wordWrap
                                    >
                                        <Column flexGrow={2} minWidth={isMobile ? 150 : 250} verticalAlign="middle">
                                            <HeaderCell><span style={{ marginLeft: 40 }}>Name</span></HeaderCell>
                                            <Cell>
                                                {(rowData: KAINode) => {
                                                    return (
                                                        <div>
                                                            <span className="container-icon-left">
                                                                <Icon icon="globe2" className="gray-highlight" />
                                                            </span>
                                                            <span className="container-content-right middle-vertical">
                                                                {
                                                                    renderStringAndTooltip({
                                                                        str: rowData.nodeName,
                                                                        headCount: isMobile ? 12 : 25,
                                                                        showTooltip: true
                                                                    })
                                                                }
                                                            </span>
                                                        </div>
                                                    )
                                                }}
                                            </Cell>
                                        </Column>
                                        <Column flexGrow={2} minWidth={isMobile ? 110 : 0} verticalAlign="middle">
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
                                                                redirectTo: `/address/${rowData.address}`
                                                            })}
                                                        </div>
                                                    );
                                                }}
                                            </Cell>
                                        </Column>
                                        <Column flexGrow={1} minWidth={isMobile ? 120 : 0} verticalAlign="middle">
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
        </div>
    )
}

export default Network;