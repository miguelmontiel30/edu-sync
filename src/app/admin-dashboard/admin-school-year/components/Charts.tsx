import { SchoolCycle } from './types';
import { barOptions } from './ChartOptions';
import ReactApexChart from 'react-apexcharts';
import IconFA from '@/components/ui/IconFA';

interface ChartsProps {
    cycles: SchoolCycle[];
    isLoading: boolean;
}

export default function Charts({ cycles, isLoading }: ChartsProps) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Alumnos por Ciclo */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[180px]">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : cycles.length === 0 ? (
                    <>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                Distribución de Alumnos por Ciclo
                            </h3>
                        </div>
                        <div className="custom-scrollbar max-w-full overflow-x-auto h-[180px] flex items-center justify-center">
                            <div className="h-full w-full" style={{ opacity: 0.3 }}>
                                <ReactApexChart
                                    options={{
                                        ...barOptions,
                                        colors: ['#465fff'],
                                        yaxis: {
                                            title: {
                                                text: 'Número de Alumnos',
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
                                        name: 'Alumnos',
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
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                Distribución de Alumnos por Ciclo
                            </h3>
                        </div>
                        <div className="custom-scrollbar max-w-full overflow-x-auto">
                            <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
                                <ReactApexChart
                                    options={{
                                        ...barOptions,
                                        colors: ['#465fff'],
                                        yaxis: {
                                            title: {
                                                text: 'Número de Alumnos',
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
                                        name: 'Alumnos',
                                        data: cycles.map(cycle => cycle.studentsCount)
                                    }]}
                                    type="bar"
                                    height={180}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Promedios por Ciclo */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[180px]">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : cycles.length === 0 ? (
                    <>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                Promedios por Ciclo Escolar
                            </h3>
                        </div>
                        <div className="custom-scrollbar max-w-full overflow-x-auto h-[180px] flex items-center justify-center">
                            <div className="h-full w-full" style={{ opacity: 0.3 }}>
                                <ReactApexChart
                                    options={{
                                        ...barOptions,
                                        colors: ['#10B981'],
                                        yaxis: {
                                            title: {
                                                text: 'Promedio General',
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
                                        name: 'Promedio',
                                        data: [8.5, 9.2, 7.8]
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
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                Promedios por Ciclo Escolar
                            </h3>
                        </div>
                        <div className="custom-scrollbar max-w-full overflow-x-auto">
                            <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
                                <ReactApexChart
                                    options={{
                                        ...barOptions,
                                        colors: ['#10B981'],
                                        yaxis: {
                                            title: {
                                                text: 'Promedio General',
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
                                        name: 'Promedio',
                                        data: cycles.map(cycle => cycle.averageGrade)
                                    }]}
                                    type="bar"
                                    height={180}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 