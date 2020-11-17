import React, { useEffect, useState } from 'react';
import { Col, FlexboxGrid, Icon, Panel, Table } from 'rsuite';
import { randomRGBColor, renderHashToRedirect } from '../../common/utils/string';
import { useViewport } from '../../context/ViewportContext';
import { getNodes } from '../../service/kai-explorer/network';
import { useHistory } from 'react-router-dom';
import './network.css'
import { ForceGraph3D } from 'react-force-graph';
import SearchSection from '../../common/components/Header/SearchSection';

const { Column, HeaderCell, Cell } = Table;

const Network = () => {
    const history = useHistory()
    const [graphData, setGraphData] = useState({} as any)
    const [networks, setNetworks] = useState([] as KAINode[])
    const { isMobile } = useViewport()

    useEffect(() => {
        (async () => {
            const result = await getNodes()
            setNetworks(result)
            let linkArr = [] as any[];
            
            result.forEach((r) => {
                // Random links number for each node
                for (let i = 0; i < r.peerCount; i++) {
                    const nodeRandom = Math.floor(Math.random() * result?.length);
                    linkArr.push({ source: r.id, target: result[nodeRandom].id })
                }
            })
            const graphData = {
                nodes: result.map(item => {
                    // Random color for each node
                    const colorRandom = randomRGBColor()
                    return {
                        id: item.id,
                        // color: "#e62c2c"
                        color: colorRandom
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
                        showNavInfo={false}
                        height={500}
                        nodeRelSize={8}
                        graphData={graphData}
                        nodeResolution={30}
                        nodeLabel="id"
                        numDimensions={3}
                    /> : <></>
            }
            <div className="container">
                <SearchSection />
                <div className="block-title" style={{ padding: '0px 5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Icon className="highlight" icon="connectdevelop" size={"2x"} />
                        <p style={{ marginLeft: '12px' }} className="title">Network</p>
                    </div>
                </div>
                <FlexboxGrid>
                    <FlexboxGrid.Item componentClass={Col} xs={24} sm={24} md={24}>
                        <Panel shaded>
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                                    <Table
                                        autoHeight
                                        rowHeight={60}
                                        data={networks}
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
        </div>
    )
}

export default Network;