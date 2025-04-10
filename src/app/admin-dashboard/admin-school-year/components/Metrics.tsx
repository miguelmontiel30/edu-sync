import { SchoolCycle } from './types';
import Badge from '@/components/core/badge/Badge';
import IconFA from '@/components/ui/IconFA';

interface MetricsProps {
    readonly cycles: SchoolCycle[];
    readonly isLoading: boolean;
}

export default function Metrics({ cycles, isLoading }: MetricsProps) {
    const calculateAverageGrade = (cycles: SchoolCycle[]) => {
        const activeCycles = cycles.filter(cycle => cycle.status === "1");
        if (activeCycles.length === 0) return '0.00';
        const total = activeCycles.reduce((acc, cycle) => acc + cycle.averageGrade, 0);
        return (total / activeCycles.length).toFixed(2);
    };

    const renderMetricCard = (icon: string, title: string, value: React.ReactNode, badge?: React.ReactNode) => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <IconFA icon="spinner" spin className="text-gray-400" />
                </div>
            );
        }

        if (cycles.length === 0) {
            return (
                <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                        <IconFA icon={icon} style="duotone" size="xl" className="text-gray-800 dark:text-white/90" />
                    </div>
                    <div className="mt-5 flex items-end justify-between">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                {title}
                            </span>
                            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                {value}
                            </h4>
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                    <IconFA icon={icon} style="duotone" size="xl" className="text-gray-800 dark:text-white/90" />
                </div>
                <div className="mt-5 flex items-end justify-between">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            {title}
                        </span>
                        <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                            {value}
                        </h4>
                    </div>
                    {badge}
                </div>
            </>
        );
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
            {/* Total de Ciclos */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                {renderMetricCard(
                    "calendar",
                    "Total de Ciclos",
                    cycles.length,
                    <Badge color="info">
                        <span className="font-outfit">
                            {cycles.filter(cycle => cycle.status === "3").length === 1
                                ? "1 completado"
                                : `${cycles.filter(cycle => cycle.status === "3").length} completados`}
                        </span>
                    </Badge>
                )}
            </div>

            {/* Total de Alumnos en Ciclos Activos */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                {renderMetricCard(
                    "user-graduate",
                    "Alumnos en Ciclos Activos",
                    cycles.filter(cycle => cycle.status === "1").reduce((acc, cycle) => acc + cycle.studentsCount, 0),
                    <Badge color="info">
                        <span className="font-outfit">
                            {cycles.filter(cycle => cycle.status === "1").length === 1
                                ? "1 ciclo activo"
                                : `${cycles.filter(cycle => cycle.status === "1").length} ciclos activos`}
                        </span>
                    </Badge>
                )}
            </div>

            {/* Promedio General de Ciclos Activos */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                {renderMetricCard(
                    "graduation-cap",
                    "Promedio General",
                    calculateAverageGrade(cycles),
                    <Badge color="info">
                        <span className="font-outfit">
                            {cycles.filter(cycle => cycle.status === "1" && cycle.averageGrade >= 8).length} ciclos
                        </span>
                    </Badge>
                )}
            </div>
        </div>
    );
} 