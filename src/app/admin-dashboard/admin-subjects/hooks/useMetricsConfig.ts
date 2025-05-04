// React
import {useMemo} from 'react';

// Types
import {Subject} from '../module-utils/types';
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

export function useMetricsConfig(subjects: Subject[]): MetricsConfig {
    // Calcular métricas de manera segura con useMemo y valores atómicos
    const totalSubjects = useMemo(() => subjects.length, [subjects]);
    const activeSubjects = useMemo(
        () => subjects.filter(subject => !subject.deleteFlag).length,
        [subjects],
    );
    const totalGroups = useMemo(
        () => subjects.reduce((acc, subject) => acc + subject.groupsCount, 0),
        [subjects],
    );
    const averageGrade = useMemo(
        () =>
            subjects.length > 0
                ? subjects.reduce((acc, subject) => acc + subject.averageGrade, 0) / subjects.length
                : 0,
        [subjects],
    );

    // Configurar métricas con valores memorizados
    const metricsConfig = useMemo<MetricConfig[]>(
        () => [
            {
                id: 'total-subjects',
                icon: 'book',
                title: 'Total de Materias',
                value: totalSubjects,
                badgeColor: 'primary',
                badgeText: `${activeSubjects} materias activas`,
            },
            {
                id: 'total-groups',
                icon: 'users-class',
                title: 'Total de Grupos',
                value: totalGroups,
            },
            {
                id: 'average-grade',
                icon: 'graduation-cap',
                title: 'Promedio General',
                value: averageGrade.toFixed(2),
            },
        ],
        [totalSubjects, activeSubjects, totalGroups, averageGrade],
    );

    // Configuración de gráficos
    const chartConfigs = useMemo<ChartConfig[]>(
        () => [
            {
                title: 'Promedio por Materia',
                dataKey: 'averageGrade',
                color: '#10B981',
                yAxisTitle: 'Promedio General',
            },
            {
                title: 'Grupos por Materia',
                dataKey: 'groupsCount',
                color: '#465FFF',
                yAxisTitle: 'Cantidad de Grupos',
            },
        ],
        [],
    );

    return {
        metricsConfig,
        chartConfigs,
    };
}
