import React, { useEffect, useState } from 'react';
import {  Graph, GraphConfiguration } from 'react-d3-graph';
import { Col, FlexboxGrid, Icon, Panel, Table } from 'rsuite';
import { renderHashToRedirect } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getNodes } from '../../service/kai-explorer/network';
import SearchSection from '../../common/components/Header/SearchSection';
import { useHistory } from 'react-router-dom';
import './network.css'
// import ForceGraph2D from 'react-force-graph-2d';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
// import ForceGraphVR from 'react-force-graph-vr';
// import ForceGraphAR from 'react-force-graph-ar';

const { Column, HeaderCell, Cell } = Table;

const Network = () => {
    const history = useHistory()
    const [graphConfig, setGraphConfig] = useState({} as any)
    const [graphData, setGraphData] = useState({} as any)

    const { width, height } = useViewport()

    const { isMobile } = useViewport()

    useEffect(() => {
        const graphWidth = width
        const graphHeight = 300
    }, [width, height])

    function genRandomTree(N = 300, reverse = false) {
        return {
          nodes: [...Array(N).keys()].map(i => ({ id: i })),
        links: [...Array(N).keys()]
          .filter(id => id)
          .map(id => ({
            [reverse ? 'target' : 'source']: id,
            [reverse ? 'source' : 'target']: Math.round(Math.random() * (id-1))
          }))
        };
      }

    useEffect(() => {
        (async () => {
            const result = await getNodes()
            let linkArr = [] as any[];
            result.forEach((r1, i1) => {
                result.forEach((r2, i2) => {
                    if(i1 !== i2) {
                        linkArr.push({ source: r1.id, target: r2.id })
                    }
                })
            })

            // console.log(genRandomTree(10));
            


            console.log(result)

            const graphData = {
                nodes: result.map(item => {
                    return {
                        id: item.id
                    }
                }),
                links: result.forEach((r1, i1) => {
                    result.forEach((r2, i2) => {
                        if(i1 !== i2) {
                            linkArr.push({ source: r1.id, target: r2.id })
                        }
                    })
                })
            }

            console.log(graphData);
            
            
            // setGraphData({
            //     nodes: result.map(item => {
            //         return {
            //             id: item.id
            //         }
            //     }),
            //     links: result.forEach((r1, i1) => {
            //         result.forEach((r2, i2) => {
            //             if(i1 !== i2) {
            //                 linkArr.push({ source: r1.id, target: r2.id })
            //             }
            //         })
            //     }),
            //     // links: linkArr,
            // })

            // setGraphData({
            //     nodes: [ 
            //         { 
            //             id: "id1"
            //         },
            //         { 
            //             id: "id2",
            //         },
            //         { 
            //             id: "id3",
            //         }
            //     ],
            //     links: [
            //         {
            //             source: "id1",
            //             target: "id2"
            //         },
            //         {
            //             source: "id1",
            //             target: "id3"
            //         },
            //         {
            //             source: "id3",
            //             target: "id2"
            //         },
            //     ]
            // })
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
                {
                    !isMobile &&
                    <FlexboxGrid.Item componentClass={Col} xs={24} sm={24} md={24} style={{ marginBottom: '25px' }}>
                        <Panel shaded>
                            {
                                // graphConfig.width && graphData.nodes.length > 0 &&
                                // <Graph
                                //     id='kai_network_graph'
                                //     data={graphData}
                                //     config={graphConfig}
                                // />
                                // <ForceGraph3D graphData={graphData}/>
                            }
                            <ForceGraph3D
                                height={500}
                                nodeRelSize={5}
                                graphData={genRandomTree()}
                                nodeColor={() => 'rgb(158, 49, 68)'}
                            />
                        </Panel>
                    </FlexboxGrid.Item>
                }
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