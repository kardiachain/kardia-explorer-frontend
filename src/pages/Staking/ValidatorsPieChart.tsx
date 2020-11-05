import React, { useEffect, useState } from 'react';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import highcharts3d from 'highcharts/highcharts-3d';
highcharts3d(Highcharts);

const chartConfigDefault = {
    chart: {
        height: 500,
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 30,
            beta: 0
        }
    },
    title: {
        text: 'Validators'
    },
    accessibility: {
        point: {
            valueSuffix: '%',
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 40,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            innerSize: '20%'
        },
        series: {
            states: {
                inactive: {
                    enabled: true,
                    opacity: 1
                }
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.custom}</b><br/> Voting Power: <b>{point.y} %</b><br/>',
                shared: true,
            },
        }
    },
    series: [{
        type: 'pie',
        name: 'VP',
        data: [] as DataChartConfig[],
    }]
}

const ValidatorsPieChart = ({ dataForChart = [] }: { dataForChart: DataChartConfig[] }) => {
    const [chartOptionsConfig, setChartOptionsConfig] = useState({})
    useEffect(() => {
        chartConfigDefault.series[0].data = dataForChart;
        console.log(dataForChart);
        setChartOptionsConfig(chartConfigDefault)
    }, [dataForChart]);


    return (
        <div>
            <HighchartsReact options={chartOptionsConfig} highcharts={Highcharts} />
        </div>
    )
}

export default ValidatorsPieChart;