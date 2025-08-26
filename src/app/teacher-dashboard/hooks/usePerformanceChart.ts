import { useMemo } from 'react';
import { ApexOptions } from 'apexcharts';

// Definición local de ChartConfig para desacoplar del componente core
export interface ChartConfig {
    id: string;
    title: string;
    series: { name: string; data: (number | null)[] }[];
    categories: string[];
    options?: ApexOptions;
}

// Tipos locales si son necesarios, o importarlos de module-utils
interface PerformanceData {
    period: string;
    average: number;
    group: string;
}

export const usePerformanceChart = (performanceData: PerformanceData[]) => {
    const chartConfigs = useMemo<ChartConfig[]>(() => {
        const groups = [...new Set(performanceData.map(item => item.group))];

        return groups.map(group => ({
            id: `performance-${group}`,
            title: `Rendimiento - Grupo ${group}`,
            series: [
                {
                    name: 'Promedio',
                    data: performanceData
                        .filter(item => item.group === group)
                        .map(item => item.average),
                },
            ],
            categories: performanceData
                .filter(item => item.group === group)
                .map(item => item.period),
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                },
                yaxis: {
                    min: 0,
                    max: 10,
                    title: {
                        text: 'Promedio',
                    },
                },
                xaxis: {
                    categories: performanceData
                        .filter(item => item.group === group)
                        .map(item => item.period),
                },
            },
        }));
    }, [performanceData]);

    // Los datos para BarChartsGroup deben ser un array plano
    const chartData = useMemo(() => {
        return performanceData;
    }, [performanceData]);

    return {
        chartConfigs,
        chartData,
    };
};
