import { SchoolCycle } from './types';
import { barOptions } from './ChartOptions';
import ReactApexChart from 'react-apexcharts';
import IconFA from '@/components/ui/IconFA';

interface ChartsProps {
    readonly cycles: SchoolCycle[];
    readonly isLoading: boolean;
}

interface ChartProps {
    readonly title: string;
    readonly dataKey: keyof SchoolCycle;
    readonly color: string;
    readonly yAxisTitle: string;
}

export default function Charts({ cycles, isLoading }: Readonly<ChartsProps>) {
    const renderChart = ({ title, dataKey, color, yAxisTitle }: ChartProps) => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-[180px]">
                    <IconFA icon="spinner" spin className="text-gray-400" />
                </div>
            );
        }

        if (cycles.length === 0) {
            return (
                <>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                            {title}
                        </h3>
                    </div>
                    <div className="custom-scrollbar max-w-full overflow-x-auto h-[180px] flex items-center justify-center">
                        <div className="h-full w-full" style={{ opacity: 0.3 }}>
                            <ReactApexChart
                                options={{
                                    ...barOptions,
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
                                        ...barOptions.chart,
                                        fontFamily: 'Outfit, sans-serif',
                                    }
                                }}
                                series={[{
                                    name: yAxisTitle,
                                    data: [30, 45, 20]
                                }]}
                                type="bar"
                                height={180}
                            />
                        </div>
                    </div>
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                        <span className="text-lg font-semibold text-white font-outfit text-center px-4">Registra tus datos para poder ver las métricas</span>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                        {title}
                    </h3>
                </div>
                <div className="custom-scrollbar max-w-full overflow-x-auto">
                    <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
                        <ReactApexChart
                            options={{
                                ...barOptions,
                                colors: [color],
                                yaxis: {
                                    title: {
                                        text: yAxisTitle,
                                    },
                                },
                                xaxis: {
                                    categories: cycles.map(cycle => cycle.name),
                                },
                                chart: {
                                    ...barOptions.chart,
                                    fontFamily: 'Outfit, sans-serif',
                                }
                            }}
                            series={[{
                                name: yAxisTitle,
                                data: cycles.map(cycle => cycle[dataKey] as number)
                            }]}
                            type="bar"
                            height={180}
                        />
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="grid my-6 grid-cols-1 gap-6 md:grid-cols-2">
            {/* Alumnos por Ciclo */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                {renderChart({ title: 'Distribución de Alumnos por Ciclo', dataKey: 'studentsCount', color: '#465fff', yAxisTitle: 'Número de Alumnos' })}
            </div>

            {/* Promedios por Ciclo */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                {renderChart({ title: 'Promedios por Ciclo Escolar', dataKey: 'averageGrade', color: '#10B981', yAxisTitle: 'Promedio General' })}
            </div>
        </div>
    );
} 