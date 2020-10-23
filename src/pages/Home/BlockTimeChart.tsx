import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { Panel } from 'rsuite';

const BlockTimeChart = ({ blockList = [] }: { blockList: KAIBlock[] }) => {

    const [blockTimeData, setBlockTimeData] = useState({})

    useEffect(() => {
        if (blockList.length > 0) {
            const newData = {
                labels: buildLabel(blockList.slice(1)),
                datasets: [buildBlockTimeData(blockList), buildBlockTransactionsData(blockList.slice(1))]
            }
            setBlockTimeData(newData)
        }
    }, [blockList]);

    return (
        <React.Fragment>
            <div className="blocktime-chart-container">
                <Panel >
                    <Bar
                        height={350}
                        data={blockTimeData}
                        options={options}
                    />
                </Panel>
            </div>
        </React.Fragment>
    );
}

const options = {
    // responsive: true,
    maintainAspectRatio: false,
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
                },
                barPercentage: 1,
                minBarLength: 2,
                barThickness: 10,
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
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Transactions'
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
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Time (s)'
                }
            }
        ]
    },
    animation: {
        easing: 'easeOutQuad',
        duration: 1000
    }
};

const buildLabel = (blockList: KAIBlock[]) => {
    return blockList.map((b) => ``)
}

const buildBlockTimeData = (blockList: KAIBlock[]) => {
    const blockTimeList = [] as any[]

    for (let index = 1; index < blockList.length; index++) {
        blockTimeList.push(((new Date(blockList[index]?.time)).getTime() - (new Date(blockList[index - 1]?.time)).getTime())/1000)
    }

    return {
        label: 'Block time',
        type: 'line',
        data: blockTimeList,
        fill: false,
        borderColor: 'rgba(93, 32, 91, 0.7)',
        backgroundColor: 'rgba(93, 32, 91, 0.7)',
        pointBorderColor: 'rgba(93, 32, 91, 0.7)',
        pointBackgroundColor: 'rgba(93, 32, 91, 0.7)',
        pointHoverBackgroundColor: 'rgba(93, 32, 91, 0.7)',
        pointHoverBorderColor: 'rgba(93, 32, 91, 0.7)',
        borderWidth:1,
        yAxisID: 'y-axis-2'
    }
}

const buildBlockTransactionsData = (blockList: KAIBlock[]) => {
    return {
        type: 'bar',
        label: 'Block transactions',
        data: blockList.map((b) => b.transactions || 0),
        fill: false,
        backgroundColor: 'rgba(77, 113, 255, 1)',
        borderColor: 'rgba(77, 113, 255, 1)',
        hoverBackgroundColor: 'rgba(77, 113, 255, 1)',
        hoverBorderColor: 'rgba(77, 113, 255, 1)',
        yAxisID: 'y-axis-1',
    }
}

export default BlockTimeChart;