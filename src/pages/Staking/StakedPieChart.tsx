import React, { useEffect, useState } from 'react'
import HighchartsReact from "highcharts-react-official";
import Highcharts, { color } from 'highcharts';

const StakedPieChart = ({dataForChart = {} as StakedPieChartConfig}: {dataForChart: StakedPieChartConfig}) => {

    const [chartOptionsConfig, setChartOptionsConfig] = useState({})

    useEffect(() => {
        chartConfigDefault.series[0].data = [{
            name: 'Validator Stake',
            y: dataForChart.totalValidatorStakedAmount,
            sliced: true,
            selected: true,
            color: '#623555'
        }, {
            name: 'Delegator Stake',
            y: dataForChart.totalDelegatorStakedAmount,
            color: '#e62c2c'
        }]
        setChartOptionsConfig(chartConfigDefault)
    }, [dataForChart])

    let chartConfigDefault = {
        chart: {
            height: 300,
            type: 'pie',
        },
        title: {
            text: ''
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
    return (
        <div>
            <HighchartsReact options={chartOptionsConfig} highcharts={Highcharts}/>
        </div>
    )
}

export default StakedPieChart;