import React, { useEffect, useState } from 'react'
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';

const chartConfigDefault = {
    chart: {
        height: 300,
        type: 'pie',
    },
    title: {
        text: 'Stakes'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Value',
        colorByPoint: true,
        data: [] as any[]
    }]
}

const StakedPieChart = ({ dataForChart = {} as StakedPieChartConfig }: { dataForChart: StakedPieChartConfig }) => {

    const [chartOptionsConfig, setChartOptionsConfig] = useState({})

    useEffect(() => {
        const newConfig = JSON.parse(JSON.stringify(chartConfigDefault))
        newConfig.series[0].data = [{
            name: "Validators' Staked",
            y: dataForChart.totalValidatorStakedAmount,
            sliced: true,
            selected: true,
            color: '#623555'
        }, {
            name: "Delegators' Staked",
            y: dataForChart.totalDelegatorStakedAmount,
            color: '#e62c2c'
        }]
        setChartOptionsConfig(newConfig)
    }, [dataForChart])

    return (
        <HighchartsReact options={chartOptionsConfig} highcharts={Highcharts} />
    )
}

export default StakedPieChart;