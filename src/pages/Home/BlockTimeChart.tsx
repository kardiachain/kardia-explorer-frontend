import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { useViewport } from '../../context/ViewportContext';

const BlockTimeChart = ({ blockList = [] }: { blockList: KAIBlock[] }) => {

    const [blockTimeData, setBlockTimeData] = useState({})

    const {isMobile} = useViewport()

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
        <Bar
            height={isMobile ? 200 : undefined}
            data={blockTimeData}
            options={options}
        />
    );
}

const options = {
    responsive: true,
    maintainAspectRatio: true,
    tooltips: {
        mode: 'label'
    },
    redraw: true,
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
                // barThickness: 10,
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
                },
                ticks: {
                    beginAtZero: true
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
                },
                ticks: {
                    min: 1
                }
            }
        ]
    },
    animation: {
        easing: 'easeOutQuad',
        duration: 1500
    }
};

const buildLabel = (blockList: KAIBlock[]) => {
    return blockList.map(() => ``)
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
        // borderColor: 'rgba(93, 32, 91, 0.7)',
        borderColor: '#e62c2c',
        // backgroundColor: 'rgba(93, 32, 91, 0.7)',
        backgroundColor: '#e62c2c',
        // pointBorderColor: 'rgba(93, 32, 91, 0.7)',
        pointBorderColor: '#e62c2c',
        // pointBackgroundColor: 'rgba(93, 32, 91, 0.7)',
        pointBackgroundColor: '#e62c2c',
        // pointHoverBackgroundColor: 'rgba(93, 32, 91, 0.7)',
        // pointHoverBorderColor: 'rgba(93, 32, 91, 0.7)',
        pointHoverBackgroundColor: '#e62c2c',
        pointHoverBorderColor: '#e62c2c',
        pointRadius: 3,
        borderWidth: 3,
        yAxisID: 'y-axis-2'
    }
}

const buildBlockTransactionsData = (blockList: KAIBlock[]) => {
    return {
        type: 'bar',
        label: 'Block transactions',
        data: blockList.map((b) => b.transactions || 0),
        fill: false,
        backgroundColor: '#36638A',
        borderColor: '#36638A',
        hoverBackgroundColor: '#36638A',
        hoverBorderColor: '#36638A',
        yAxisID: 'y-axis-1',
    }
}

export default BlockTimeChart;