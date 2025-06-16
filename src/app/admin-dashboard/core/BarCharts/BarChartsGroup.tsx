// Next
import dynamic from 'next/dynamic';

// Libraries
import { ApexOptions } from 'apexcharts';
import IconFA from '@/components/ui/IconFA';

// Importación dinámica para evitar errores de SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Opciones base para las gráficas de barras
export const defaultBarOptions: ApexOptions = {
    chart: {
        fontFamily: 'Outfit, sans-serif',
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
        enabled: false,
    },
    stroke: {
        show: true,
        width: 4,
        colors: ['transparent'],
    },
    xaxis: {
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
        labels: {
            style: {
                fontFamily: 'Outfit, sans-serif',
            },
        },
    },
    legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        fontFamily: 'Outfit, sans-serif',
    },
    grid: {
        yaxis: {
            lines: {
                show: true,
            },
        },
    },
    fill: {
        opacity: 1,
    },
    tooltip: {
        x: {
            show: false,
        },
        y: {
            formatter: (val: number) => `${val}`,
        },
        style: {
            fontFamily: 'Outfit, sans-serif',
        },
    },
};

// Interfaz genérica para cualquier tipo de dato
export interface ChartData {
    id: number | string;
    name: string;
    [key: string]: any;
}

interface ChartConfig {
    readonly title: string;
    readonly dataKey: string;
    readonly color: string;
    readonly yAxisTitle: string;
    readonly isEmpty?: boolean;
    readonly blurMessage?: string;
}

export interface BarChartProps {
    readonly chartConfig: ChartConfig;
    readonly data: ChartData[];
    readonly isLoading: boolean;
    readonly emptyMessage?: string;
    readonly customOptions?: Partial<ApexOptions>;
}

interface BarChartsGroupProps {
    readonly data: ChartData[];
    readonly isLoading: boolean;
    readonly charts: ChartConfig[];
    readonly emptyMessage?: string;
    readonly customOptions?: Partial<ApexOptions>;
    readonly className?: string;
}

/**
 * Componente para renderizar una gráfica de barras individual
 */
export function BarChart({
    chartConfig,
    data,
    isLoading,
    emptyMessage = 'Registra tus datos para poder ver las métricas',
    customOptions,
}: Readonly<BarChartProps>) {
    const { title, dataKey, color, yAxisTitle, isEmpty, blurMessage } = chartConfig;

    if (isLoading) {
        return (
            <div className="flex h-[180px] items-center justify-center">
                <IconFA icon="spinner" spin className="text-gray-400" />
            </div>
        );
    }

    // Verificar si los datos son válidos (hay datos y tienen la propiedad dataKey)
    const hasValidData =
        data && data.length > 0 && data.some(item => typeof item[dataKey] === 'number');

    // Si isEmpty está definido explícitamente, usar ese valor; de lo contrario, usar la lógica existente
    const shouldShowEmpty = isEmpty !== undefined ? isEmpty : !hasValidData;
    const emptyDisplayMessage = blurMessage || emptyMessage;

    if (shouldShowEmpty) {
        return (
            <>
                <div className="flex items-center justify-between">
                    <h3 className="font-outfit text-lg font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </h3>
                </div>
                <div className="custom-scrollbar flex h-[180px] max-w-full items-center justify-center overflow-x-auto">
                    <div className="h-full w-full" style={{ opacity: 0.3 }}>
                        <ReactApexChart
                            options={{
                                ...defaultBarOptions,
                                colors: [color],
                                yaxis: {
                                    title: {
                                        text: yAxisTitle,
                                    },
                                },
                                xaxis: {
                                    categories: ['Ejemplo 1', 'Ejemplo 2', 'Ejemplo 3'],
                                },
                                chart: {
                                    ...defaultBarOptions.chart,
                                    fontFamily: 'Outfit, sans-serif',
                                },
                                ...customOptions,
                            }}
                            series={[
                                {
                                    name: yAxisTitle,
                                    data: [30, 45, 20],
                                },
                            ]}
                            type="bar"
                            height={180}
                        />
                    </div>
                </div>
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                    <span className="px-4 text-center font-outfit text-lg font-semibold text-white">
                        {emptyDisplayMessage}
                    </span>
                </div>
            </>
        );
    }

    // Extraer datos válidos para el gráfico
    const chartData = data
        .filter(item => typeof item[dataKey] === 'number')
        .map(item => ({
            name: item.name || 'Sin nombre',
            value: item[dataKey] || 0,
        }));

    // Asegurarse de que siempre haya al menos un elemento en el array de datos
    if (chartData.length === 0) {
        chartData.push({ name: 'Sin datos', value: 0 });
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h3 className="font-outfit text-lg font-semibold text-gray-800 dark:text-white/90">
                    {title}
                </h3>
            </div>
            <div className="custom-scrollbar max-w-full overflow-x-auto">
                <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
                    <ReactApexChart
                        options={{
                            ...defaultBarOptions,
                            colors: [color],
                            yaxis: {
                                title: {
                                    text: yAxisTitle,
                                },
                            },
                            xaxis: {
                                categories: chartData.map(item => item.name),
                            },
                            chart: {
                                ...defaultBarOptions.chart,
                                fontFamily: 'Outfit, sans-serif',
                            },
                            ...customOptions,
                        }}
                        series={[
                            {
                                name: yAxisTitle,
                                data: chartData.map(item => item.value),
                            },
                        ]}
                        type="bar"
                        height={180}
                    />
                </div>
            </div>
        </>
    );
}

/**
 * Componente principal para renderizar un grupo de gráficas de barras
 */
export default function BarChartsGroup({
    data,
    isLoading,
    charts,
    emptyMessage,
    customOptions,
    className = 'grid my-6 grid-cols-1 gap-6 md:grid-cols-2',
}: Readonly<BarChartsGroupProps>) {
    return (
        <div className={className}>
            {charts.map(chartConfig => (
                <div
                    key={`chart-${chartConfig.title}-${chartConfig.dataKey}`}
                    className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
                >
                    <BarChart
                        chartConfig={chartConfig}
                        data={data}
                        isLoading={isLoading}
                        emptyMessage={emptyMessage}
                        customOptions={customOptions}
                    />
                </div>
            ))}
        </div>
    );
}
