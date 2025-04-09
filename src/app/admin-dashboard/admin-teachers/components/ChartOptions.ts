import {ApexOptions} from 'apexcharts';
import {Group} from './types';

export const getTeachersByGroupChartOptions = (
    activeGroups: Group[],
    teachersByGroup: {[key: string]: number},
): ApexOptions => ({
    chart: {
        type: 'bar',
        height: 180,
        toolbar: {
            show: false,
        },
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '39%',
            borderRadius: 5,
            borderRadiusApplication: 'end',
        },
    },
    dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toString(),
    },
    stroke: {
        show: true,
        width: 4,
        colors: ['transparent'],
    },
    xaxis: {
        categories: activeGroups.map(group => `${group.grade}° ${group.group_name}`),
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
        labels: {
            style: {
                fontSize: '12px',
            },
        },
    },
    yaxis: {
        title: {
            text: 'Número de profesores',
        },
    },
    fill: {
        opacity: 1,
        colors: ['#465fff'],
    },
    tooltip: {
        y: {
            formatter: (val: number) => `${val} profesores`,
        },
    },
});

export const getGenderDistributionChartOptions = (
    maleCount: number,
    femaleCount: number,
): ApexOptions => ({
    chart: {
        type: 'donut',
        height: 180,
        toolbar: {
            show: false,
        },
    },
    colors: ['#3b82f6', '#ec4899'],
    labels: ['Masculino', 'Femenino'],
    dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    plotOptions: {
        pie: {
            donut: {
                size: '65%',
                labels: {
                    show: true,
                    name: {
                        show: true,
                        fontFamily: 'outfit, sans-serif',
                    },
                    value: {
                        show: true,
                        fontFamily: 'outfit, sans-serif',
                        formatter: (val: string) => val.toString(),
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        fontFamily: 'outfit, sans-serif',
                        formatter: () => (maleCount + femaleCount).toString(),
                    },
                },
            },
        },
    },
    stroke: {
        show: false,
    },
    legend: {
        show: true,
        position: 'bottom',
        fontFamily: 'outfit, sans-serif',
    },
});
