import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { useViewport } from '../../context/ViewportContext';

const BlockTimeChart = ({ blockList = [] }: { blockList: KAIBlock[] }) => {

    const [blockTimeData, setBlockTimeData] = useState({})

    const {isMobile} = useViewport();

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
    legend: {
        labels: {
            fontColor: "white"
        }
    },
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
                    labelString: 'Transactions',
                    fontColor: 'white'
                },
                ticks: {
                    beginAtZero: true,
                    fontColor: 'white'
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
                    labelString: 'Time (s)',
                    fontColor: 'white'
                },
                ticks: {
                    min: 4,
                    fontColor: 'white'
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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const gradient = ctx.createLinearGradient(0, 100, 400, 0);
    gradient.addColorStop(0, '#5DD0A5');
    gradient.addColorStop(1, '#437CCB');

    for (let index = 1; index < blockList.length; index++) {
        blockTimeList.push(((new Date(blockList[index]?.time)).getTime() - (new Date(blockList[index - 1]?.time)).getTime())/1000)
    }

    return {
        label: 'Block time',
        type: 'line',
        data: blockTimeList,
        fill: false,
        borderColor: gradient,
        backgroundColor: gradient,
        pointBorderColor: ' #FFFFFF',
        pointBackgroundColor: gradient,
        pointHoverBackgroundColor: gradient,
        pointHoverBorderColor: gradient,
        pointRadius: 5,
        borderWidth: 3,
        yAxisID: 'y-axis-2'
    }
}

const buildBlockTransactionsData = (blockList: KAIBlock[]) => {

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const gradient = ctx.createLinearGradient(0, 100, 0, 300);
    gradient.addColorStop(0, '#6E5CE6');
    gradient.addColorStop(1, '#C047FD');

    return {
        type: 'bar',
        label: 'Block transactions',
        data: blockList.map((b) => b.transactions || 0),
        fill: false,
        backgroundColor: gradient,
        borderColor: gradient,
        hoverBackgroundColor: gradient,
        hoverBorderColor: gradient,
        yAxisID: 'y-axis-1',
    }
}

export default BlockTimeChart;