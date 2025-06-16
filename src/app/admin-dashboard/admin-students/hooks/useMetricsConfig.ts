/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { Student, StudentGroup, StudentMetrics } from '../module-utils/types';
import { studentRepository } from '../module-utils/repository';
import { MetricConfig } from '../../core/Metrics/types';

/**
 * Configuración de gráficos para el dashboard
 */
interface ChartConfig {
    title: string;
    type: string;
    height: number;
    dataKey: string;
    color: string;
    yAxisTitle: string;
    options: any;
    series: any[];
    isEmpty?: boolean;
    blurMessage?: string;
}

/**
 * Tipo de retorno del hook
 */
interface MetricsConfig {
    metricsConfig: MetricConfig[];
    chartConfigs: ChartConfig[];
    metrics: StudentMetrics;
}

/**
 * Hook para configurar las métricas y gráficos del dashboard de estudiantes
 */
export function useMetricsConfig(
    students: Student[],
    studentGroups: StudentGroup[] = [],
): MetricsConfig {
    // Calcular métricas con useMemo para evitar cálculos innecesarios
    const metrics = useMemo(() => {
        return studentRepository.calculateMetrics(students, studentGroups);
    }, [students, studentGroups]);

    // Valores atómicos principales
    const totalStudents = useMemo(() => metrics.total, [metrics]);
    const activeStudents = useMemo(() => metrics.active, [metrics]);
    const maleStudents = useMemo(() => metrics.male, [metrics]);
    const femaleStudents = useMemo(() => metrics.female, [metrics]);

    // Calcular porcentajes
    const activePercentage = useMemo(
        () => (totalStudents ? Math.round((activeStudents / totalStudents) * 100) : 0),
        [totalStudents, activeStudents],
    );
    const malePercentage = useMemo(
        () => (totalStudents ? Math.round((maleStudents / totalStudents) * 100) : 0),
        [totalStudents, maleStudents],
    );

    // Configuración de métricas con valores memorizados
    const metricsConfig = useMemo<MetricConfig[]>(
        () => [
            {
                id: 'total-students',
                icon: 'users',
                title: 'Total Estudiantes',
                value: totalStudents,
                badgeColor: 'primary',
                badgeText: `${activeStudents} activos`,
            },
            {
                id: 'active-students',
                icon: 'user-check',
                title: 'Estudiantes Activos',
                value: activePercentage + '%',
                badgeColor: 'success',
                badgeText: `${activeStudents} de ${totalStudents}`,
            },
            {
                id: 'gender-distribution',
                icon: 'venus-mars',
                title: 'Distribución Género',
                value: `${maleStudents}/${femaleStudents}`,
                badgeColor: 'info',
                badgeText: `${malePercentage}% masculino`,
            },
        ],
        [
            totalStudents,
            activeStudents,
            activePercentage,
            maleStudents,
            femaleStudents,
            malePercentage,
        ],
    );

    // Configuración de gráficos
    const chartConfigs = useMemo<ChartConfig[]>(() => {
        // Preparar datos para gráfico de estudiantes por grado
        const gradeLabels = Object.keys(metrics.byGrade).sort();
        const gradeData = gradeLabels.map(grade => metrics.byGrade[grade] || 0);

        // Preparar datos para gráfico de estudiantes por grupo
        const groupLabels = Object.keys(metrics.byGroup).sort();
        const groupData = groupLabels.map(group => metrics.byGroup[group] || 0);

        // Verificar que haya datos disponibles
        const hasGradeData = gradeLabels.length > 0 && gradeData.some(val => val > 0);
        const hasGroupData = groupLabels.length > 0 && groupData.some(val => val > 0);

        // Datos de ejemplo para gráficos vacíos
        const defaultGradeCategories = ['Grado 1', 'Grado 2', 'Grado 3'];
        const defaultGradeData = [0, 0, 0];

        const defaultGroupCategories = ['Grupo 1A', 'Grupo 2B', 'Grupo 3C'];
        const defaultGroupData = [0, 0, 0];

        return [
            {
                title: 'Estudiantes por Grado',
                type: 'bar',
                height: 350,
                dataKey: 'grade',
                color: '#3B82F6',
                yAxisTitle: 'Número de Estudiantes',
                isEmpty: !hasGradeData,
                blurMessage: 'Registra tus datos para poder ver las métricas',
                options: {
                    chart: {
                        toolbar: {
                            show: false,
                        },
                    },
                    colors: ['#3B82F6'],
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            horizontal: false,
                            columnWidth: '60%',
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    xaxis: {
                        categories: hasGradeData
                            ? gradeLabels.map(g => `Grado ${g}`)
                            : defaultGradeCategories,
                    },
                    yaxis: {
                        title: {
                            text: 'Número de Estudiantes',
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: (val: number) => `${val} estudiantes`,
                        },
                    },
                },
                series: [
                    {
                        name: 'Estudiantes',
                        data: hasGradeData ? gradeData : defaultGradeData,
                    },
                ],
            },
            {
                title: 'Estudiantes por Grupo',
                type: 'bar',
                height: 350,
                dataKey: 'group',
                color: '#10B981',
                yAxisTitle: 'Número de Estudiantes',
                isEmpty: !hasGroupData,
                blurMessage: 'Registra tus datos para poder ver las métricas',
                options: {
                    chart: {
                        toolbar: {
                            show: false,
                        },
                    },
                    colors: ['#10B981'],
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            horizontal: false,
                            columnWidth: '60%',
                        },
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    xaxis: {
                        categories: hasGroupData
                            ? groupLabels.map(g => `Grupo ${g}`)
                            : defaultGroupCategories,
                    },
                    yaxis: {
                        title: {
                            text: 'Número de Estudiantes',
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: (val: number) => `${val} estudiantes`,
                        },
                    },
                },
                series: [
                    {
                        name: 'Estudiantes',
                        data: hasGroupData ? groupData : defaultGroupData,
                    },
                ],
            },
        ];
    }, [metrics]);

    return {
        metricsConfig,
        chartConfigs,
        metrics,
    };
}
