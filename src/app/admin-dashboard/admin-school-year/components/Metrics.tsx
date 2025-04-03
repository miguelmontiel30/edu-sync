import { SchoolCycle } from './types';
import Badge from '@/components/core/badge/Badge';
import IconFA from '@/components/ui/IconFA';

interface MetricsProps {
    cycles: SchoolCycle[];
    isLoading: boolean;
}

export default function Metrics({ cycles, isLoading }: MetricsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
            {/* Total de Ciclos */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : cycles.length === 0 ? (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <IconFA icon="calendar" style="duotone" size="xl" className="text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Total de Ciclos
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    0
                                </h4>
                            </div>
                        </div>
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <span className="text-lg font-semibold text-white font-outfit text-center px-4">Registra tus datos para poder ver las métricas</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <IconFA icon="calendar" style="duotone" size="xl" className="text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Total de Ciclos
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    {cycles.length}
                                </h4>
                            </div>
                            <Badge color="info">
                                <span className="font-outfit">
                                    {cycles.filter(cycle => cycle.status === "1").length} activos
                                </span>
                            </Badge>
                        </div>
                    </>
                )}
            </div>

            {/* Total de Alumnos en Ciclos Activos */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : cycles.length === 0 ? (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <IconFA icon="user-graduate" style="duotone" size="xl" className="text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Alumnos en Ciclos Activos
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    0
                                </h4>
                            </div>
                        </div>
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <span className="text-lg font-semibold text-white font-outfit text-center px-4">Registra tus datos para poder ver las métricas</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <IconFA icon="user-graduate" style="duotone" size="xl" className="text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Alumnos en Ciclos Activos
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    {cycles.filter(cycle => cycle.status === "1").reduce((acc, cycle) => acc + cycle.studentsCount, 0)}
                                </h4>
                            </div>
                            <Badge color="success">
                                <span className="font-outfit">
                                    {cycles.filter(cycle => cycle.status === "1").length} ciclos
                                </span>
                            </Badge>
                        </div>
                    </>
                )}
            </div>

            {/* Promedio General de Ciclos Activos */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : cycles.length === 0 ? (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <IconFA icon="graduation-cap" style="duotone" size="xl" className="text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Promedio General
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    0.00
                                </h4>
                            </div>
                        </div>
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <span className="text-lg font-semibold text-white font-outfit text-center px-4">Registra tus datos para poder ver las métricas</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <IconFA icon="graduation-cap" style="duotone" size="xl" className="text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Promedio General
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    {cycles.filter(cycle => cycle.status === "1").length > 0
                                        ? (cycles.filter(cycle => cycle.status === "1").reduce((acc, cycle) => acc + cycle.averageGrade, 0) / cycles.filter(cycle => cycle.status === "1").length).toFixed(2)
                                        : '0.00'
                                    }
                                </h4>
                            </div>
                            <Badge color="warning">
                                <span className="font-outfit">
                                    {cycles.filter(cycle => cycle.status === "1" && cycle.averageGrade >= 8).length} ciclos
                                </span>
                            </Badge>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 