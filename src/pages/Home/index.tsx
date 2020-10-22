import React, { useEffect, useState } from 'react';
import SearchSection from './SearchSection';
import './home.css'
import { Divider, FlexboxGrid, Col, Grid, Row } from 'rsuite';
import TransactionSection from './TransactionSection';
import BlockSection from './BlockSection';
import { Bar } from 'react-chartjs-2';
import { useViewport } from '../../context/ViewportContext';
import { getBlocks } from '../../service/kai-explorer';

const options = {
    responsive: true,
    tooltips: {
        mode: 'label'
    },
    elements: {
        line: {
            fill: false
        }
    },
    scales: {
        xAxes: [
            {
                display: true,
                gridLines: {
                    display: false
                }
            }
        ],
        yAxes: [
            {
                type: 'linear',
                display: true,
                position: 'left',
                id: 'y-axis-1',
                gridLines: {
                    display: false
                },
                labels: {
                    show: true
                }
            },
            {
                type: 'linear',
                display: true,
                position: 'right',
                id: 'y-axis-2',
                gridLines: {
                    display: false
                },
                labels: {
                    show: true
                }
            }
        ]
    },
    animation: {
        easing: 'easeOutQuad',
        duration: 1000
    }
};

const BLOCK_COUNT = 31;

const buildLabel = (blockList: KAIBlock[]) => {
    return blockList.map((b) => `Block ${b.blockHeight}`)
}

const buildBlockTimeData = (blockList: KAIBlock[]) => {
    const blockTimeList = []

    for (let index = 1; index < blockList.length; index++) {
        blockTimeList.push(blockList[index].time.getTime() - blockList[index - 1].time.getTime())
    }

    return {
        label: 'Block time',
        type: 'line',
        data: blockTimeList,
        fill: false,
        borderColor: '#EC932F',
        backgroundColor: '#EC932F',
        pointBorderColor: '#EC932F',
        pointBackgroundColor: '#EC932F',
        pointHoverBackgroundColor: '#EC932F',
        pointHoverBorderColor: '#EC932F',
        yAxisID: 'y-axis-2'
    }
}

const buildBlockTransactionsData = (blockList: KAIBlock[]) => {
    return {
        type: 'bar',
        label: 'Block transactions',
        data: blockList.map((b) => b.transactions || 0),
        fill: false,
        backgroundColor: '#71B37C',
        borderColor: '#71B37C',
        hoverBackgroundColor: '#71B37C',
        hoverBorderColor: '#71B37C',
        yAxisID: 'y-axis-1'
    }
}

const Home = () => {
    const { isMobile } = useViewport()

    const [blockTimeData, setBlockTimeData] = useState({})
    const [blockHeight, setBlockHeight] = useState(0)
    const [blocks, setBlocks] = useState<KAIBlock[]>([]);

    const fetchBlockChart = async () => {
        const blockList = await getBlocks(1, BLOCK_COUNT)
        blockList[0] && setBlockHeight(blockList[0].blockHeight)
        const originBlockList = JSON.parse(JSON.stringify(blockList))
        setBlocks(originBlockList.slice(originBlockList.length - 10).reverse())
        blockList.reverse()

        const newData = {
            labels: buildLabel(blockList.slice(1)),
            datasets: [buildBlockTimeData(blockList), buildBlockTransactionsData(blockList.slice(1))]
        }
        setBlockTimeData(newData)
    }

    useEffect(() => {
        const loop = setInterval(fetchBlockChart, 2000)
        return () => {
            clearInterval(loop)
        }
    }, [])

    return (
        <React.Fragment>
            <SearchSection blockHeight={blockHeight} />
            <div className="home-container">
                <Divider />
                <Grid fluid>
                    <Row>
                        <Col xs={24} sm={24} md={24}>
                            <Bar
                                height={isMobile ? 50 : 70}
                                data={blockTimeData}
                                options={options}
                            />
                        </Col>
                    </Row>
                </Grid>
                <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={10} sm={24}>
                        <BlockSection blockList={blocks} />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={14} sm={24}>
                        <TransactionSection />
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                <Divider />
            </div>
        </React.Fragment>
    )
}

export default Home;