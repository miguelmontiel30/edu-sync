import { useMemo } from 'react';
import { ApexOptions } from 'apexcharts';

export function useChartConfig(financialData: any) {
    // Configuración de gráfico de líneas (Flujo de Caja)
    const cashFlowConfig = useMemo(() => {
        const options: ApexOptions = {
            chart: {
                height: 350,
                type: 'line',
                toolbar: {
                    show: false,
                },
                fontFamily: 'Outfit, sans-serif',
            },
            colors: ['#4F46E5', '#F97316'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: [3, 3],
                curve: 'smooth',
                dashArray: [0, 0],
            },
            xaxis: {
                categories: financialData.cashFlowData.map((item: any) => item.month),
            },
            yaxis: {
                title: {
                    text: 'Monto (MXN)',
                },
                labels: {
                    formatter: (value: number) => {
                        return new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                            maximumFractionDigits: 0,
                        }).format(value);
                    },
                },
            },
            tooltip: {
                y: {
                    formatter: (value: number) => {
                        return new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                        }).format(value);
                    },
                },
            },
            legend: {
                position: 'top',
            },
            grid: {
                borderColor: '#E2E8F0',
            },
        };

        const series = [
            {
                name: 'Ingresos',
                data: financialData.cashFlowData.map((item: any) => item.income),
            },
            {
                name: 'Egresos',
                data: financialData.cashFlowData.map((item: any) => item.expenses),
            },
        ];

        return { options, series };
    }, [financialData]);

    // Configuración de gráfico de barras (Comparativo Mensual)
    const monthlyComparisonConfig = useMemo(() => {
        const options: ApexOptions = {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false,
                },
                fontFamily: 'Outfit, sans-serif',
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 4,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#4F46E5', '#F97316'],
            xaxis: {
                categories: financialData.cashFlowData.map((item: any) => item.month),
            },
            yaxis: {
                title: {
                    text: 'Monto (MXN)',
                },
                labels: {
                    formatter: (value: number) => {
                        return new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                            maximumFractionDigits: 0,
                        }).format(value);
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: (value: number) => {
                        return new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                        }).format(value);
                    },
                },
            },
            legend: {
                position: 'top',
            },
        };

        const series = [
            {
                name: 'Ingresos',
                data: financialData.cashFlowData.map((item: any) => item.income),
            },
            {
                name: 'Egresos',
                data: financialData.cashFlowData.map((item: any) => item.expenses),
            },
        ];

        return { options, series };
    }, [financialData]);

    // Configuración de gráfico de barras (Aging de Cuentas por Cobrar)
    const agingReceivablesConfig = useMemo(() => {
        const options: ApexOptions = {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false,
                },
                fontFamily: 'Outfit, sans-serif',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    borderRadius: 4,
                    distributed: true,
                },
            },
            colors: ['#4F46E5', '#818CF8', '#F97316', '#FB923C'],
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: financialData.agingReceivables.map((item: any) => item.range),
                labels: {
                    formatter: (value: string) => {
                        return new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                            maximumFractionDigits: 0,
                        }).format(Number(value));
                    },
                },
            },
            yaxis: {
                title: {
                    text: 'Rango de días',
                },
            },
            tooltip: {
                y: {
                    formatter: (value: number) => {
                        return new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                        }).format(value);
                    },
                },
            },
            legend: {
                show: false,
            },
        };

        const series = [
            {
                name: 'Monto',
                data: financialData.agingReceivables.map((item: any) => item.amount),
            },
        ];

        return { options, series };
    }, [financialData]);

    return {
        cashFlowConfig,
        monthlyComparisonConfig,
        agingReceivablesConfig,
    };
}
