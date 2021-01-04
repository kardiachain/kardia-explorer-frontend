import React, { useEffect, useState } from 'react'
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';

const chartConfigDefault = {
    chart: {
        height: 300,
        type: 'pie',
        backgroundColor: '#555770'
    },
    title: {
        text: '',
        style: {
            "color": "white"
        }
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
        },
        series: {
            shadow: true
        }
    },
    legend: {
        itemStyle: {
            color: '#FFFFFF'
        }
    },
    series: [{
        borderWidth: 5,
        borderColor: `rgba(255, 255, 255, .5)`,
        name: 'Value',
        colorByPoint: true,
        data: [] as any[],
        shadow: true
    }],
    credits: {
        enabled: false
    }
}

const StakedPieChart = ({ dataForChart = {} as StakedPieChartConfig }: { dataForChart: StakedPieChartConfig }) => {

    const [chartOptionsConfig, setChartOptionsConfig] = useState({})

    useEffect(() => {
        const newConfig = JSON.parse(JSON.stringify(chartConfigDefault))
        newConfig.series[0].data = [{
            name: "Validators Stakes",
            y: Number(dataForChart.totalValidatorStakedAmount),
            sliced: true,
            selected: true,
            color: '#24BD71'
        }, {
            name: "Delegators Stakes",
            y: Number(dataForChart.totalDelegatorStakedAmount),
            color: '#A9EFCC',
        }]
        setChartOptionsConfig(newConfig)
    }, [dataForChart])

    return (
        <HighchartsReact options={chartOptionsConfig} highcharts={Highcharts} />
    )
}

export default StakedPieChart;