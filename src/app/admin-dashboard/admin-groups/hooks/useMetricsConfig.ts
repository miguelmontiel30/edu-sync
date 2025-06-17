import { useMemo } from 'react';
import { Group, GROUP_STATUS } from '../module-utils/types';
import { MetricConfig } from '../../core/Metrics/types';

export function useMetricsConfig(groups: Group[]) {
    // Cálculo de métricas
    const metrics = useMemo(() => {
        const activeGroups = groups.filter(group => group.status_id === GROUP_STATUS.ACTIVE);
        const totalStudents = groups.reduce((acc, group) => acc + group.studentsNumber, 0);
        const generalAverage =
            groups.length > 0
                ? groups.reduce((acc, group) => acc + group.generalAverage, 0) / groups.length
                : 0;

        return {
            totalGroups: groups.length,
            activeGroups: activeGroups.length,
            totalStudents,
            averageGrade: generalAverage,
        };
    }, [groups]);

    // Configuración de indicadores de métricas
    const metricsConfig = useMemo<MetricConfig[]>(
        () => [
            {
                id: 'total-groups',
                title: 'Total de Grupos',
                value: metrics.totalGroups,
                icon: 'users',
                badgeText: `${metrics.activeGroups} activos`,
                badgeColor: 'info',
            },
            {
                id: 'total-students',
                title: 'Total de Alumnos',
                value: metrics.totalStudents,
                icon: 'user-graduate',
                badgeText: `${metrics.activeGroups} grupos`,
                badgeColor: 'success',
            },
            {
                id: 'average-grade',
                title: 'Promedio General',
                value: metrics.averageGrade.toFixed(2),
                icon: 'graduation-cap',
                badgeText: `${groups.filter(group => group.generalAverage >= 8).length} grupos`,
                badgeColor: 'warning',
            },
        ],
        [metrics, groups],
    );

    // Configuración de gráficos
    const chartConfigs = useMemo(
        () => [
            {
                title: 'Distribución de alumnos por grupo',
                dataKey: 'studentsNumber',
                color: '#465fff',
                yAxisTitle: 'Número de Alumnos',
                isEmpty:
                    groups.filter(group => group.status_id === GROUP_STATUS.ACTIVE).length === 0,
                blurMessage: 'No hay suficientes datos para mostrar la distribución de alumnos',
            },
            {
                title: 'Promedios por Grado',
                dataKey: 'generalAverage',
                color: '#10B981',
                yAxisTitle: 'Promedio General',
                isEmpty: groups.length === 0,
                blurMessage: 'No hay suficientes datos para mostrar promedios por grado',
            },
        ],
        [groups],
    );

    return { metricsConfig, chartConfigs };
}
