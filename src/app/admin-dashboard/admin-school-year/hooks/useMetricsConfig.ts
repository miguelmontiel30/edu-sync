import {useMemo} from 'react';
import {SchoolCycle, CYCLE_STATUS} from '../module-utils/types';
import {MetricConfig} from '../../core/Metrics/types';

interface ChartConfig {
    title: string;
    dataKey: string;
    color: string;
    yAxisTitle: string;
}

interface MetricsConfig {
    metricsConfig: MetricConfig[];
    chartConfigs: ChartConfig[];
}

export function useMetricsConfig(cycles: SchoolCycle[]): MetricsConfig {
    // Calcular métricas de manera segura con useMemo y valores atómicos
    const totalCycles = useMemo(() => cycles.length, [cycles]);
    const activeCycles = useMemo(
        () => cycles.filter(cycle => cycle.status === CYCLE_STATUS.ACTIVE).length,
        [cycles],
    );
    const totalStudents = useMemo(
        () => cycles.reduce((acc, cycle) => acc + cycle.studentsCount, 0),
        [cycles],
    );
    const averageGrade = useMemo(
        () =>
            cycles.length > 0
                ? cycles.reduce((acc, cycle) => acc + cycle.averageGrade, 0) / cycles.length
                : 0,
        [cycles],
    );

    // Configurar métricas con valores memorizados
    const metricsConfig = useMemo<MetricConfig[]>(
        () => [
            {
                id: 'total-cycles',
                icon: 'calendar',
                title: 'Total de Ciclos',
                value: totalCycles,
                badgeColor: 'primary',
                badgeText: `${activeCycles} ciclos activos`,
            },
            {
                id: 'total-students',
                icon: 'users',
                title: 'Total de Alumnos',
                value: totalStudents,
            },
            {
                id: 'average-grade',
                icon: 'graduation-cap',
                title: 'Promedio General',
                value: averageGrade,
            },
        ],
        [totalCycles, activeCycles, totalStudents, averageGrade],
    );

    // Configuración de gráficos
    const chartConfigs = useMemo<ChartConfig[]>(
        () => [
            {
                title: 'Promedio General',
                dataKey: 'averageGrade',
                color: '#10B981',
                yAxisTitle: 'Promedio General',
            },
            {
                title: 'Total de Alumnos',
                dataKey: 'studentsCount',
                color: '#465FFF',
                yAxisTitle: 'Total de Alumnos',
            },
        ],
        [],
    );

    return {
        metricsConfig,
        chartConfigs,
    };
}
