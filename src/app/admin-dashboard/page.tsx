'use client';
import ChartTab from '@/components/common/ChartTab';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/core/badge/Badge';
import { ApexOptions } from 'apexcharts';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { supabaseClient } from '@/services/config/supabaseClient';
import Link from 'next/link';
import IconFA from '@/components/ui/IconFA';

export default function AdminMainContent() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalGroups: 0,
        averageGrade: 0,
        recentStudents: 0,
    });
    const [monthlyGrades, setMonthlyGrades] = useState<number[]>([]);
    const [monthlyAttendance, setMonthlyAttendance] = useState<number[]>([]);
    const [bestGroups, setBestGroups] = useState<Array<{ grade: number; average: number }>>([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        try {
            // Obtener estadísticas generales
            const { data: studentsData } = await supabaseClient
                .from('students')
                .select('student_id, created_at')
                .eq('delete_flag', false);

            const { data: teachersData } = await supabaseClient
                .from('teachers')
                .select('teacher_id')
                .eq('delete_flag', false);

            const { data: groupsData } = await supabaseClient
                .from('groups')
                .select('group_id, grade, general_average')
                .eq('delete_flag', false);

            // Calcular estudiantes recientes (últimos 30 días)
            const recentStudents =
                studentsData?.filter(student => {
                    const studentDate = new Date(student.created_at);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return studentDate >= thirtyDaysAgo;
                }).length || 0;

            // Calcular promedio general
            const totalAverage =
                groupsData?.reduce((acc, group) => acc + (group.general_average || 0), 0) || 0;
            const averageGrade = groupsData?.length ? totalAverage / groupsData.length : 0;

            // Obtener mejores grupos por grado
            const bestGroupsByGrade =
                groupsData
                    ?.reduce((acc: any[], group) => {
                        const existingGrade = acc.find(g => g.grade === group.grade);
                        if (!existingGrade || existingGrade.average < group.general_average) {
                            const index = existingGrade ? acc.indexOf(existingGrade) : -1;
                            if (index !== -1)
                                acc[index] = { grade: group.grade, average: group.general_average };
                            else acc.push({ grade: group.grade, average: group.general_average });
                        }
                        return acc;
                    }, [])
                    .sort((a, b) => a.grade - b.grade) || [];

            setStats({
                totalStudents: studentsData?.length || 0,
                totalTeachers: teachersData?.length || 0,
                totalGroups: groupsData?.length || 0,
                averageGrade,
                recentStudents,
            });

            setBestGroups(bestGroupsByGrade);

            // Datos de ejemplo para gráficos (reemplazar con datos reales cuando estén disponibles)
            setMonthlyGrades([9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 8.3, 9.0, 9.1, 9.2, 8.7, 9.6]);
            setMonthlyAttendance([
                90.5, 93.2, 95.3, 94.4, 95.5, 96.6, 98.3, 99.0, 99.1, 99.2, 98.7, 99.6,
            ]);
        } catch (error) {
            console.error('Error al cargar datos del dashboard:', error);
        }
    }

    const barOptions: ApexOptions = {
        colors: ['#465fff'],
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
            categories: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
            ],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left',
            fontFamily: 'Outfit',
        },
        yaxis: {
            title: {
                text: 'Promedio general',
            },
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
        },
    };

    const barSeries = [
        {
            name: 'Promedio general',
            data: monthlyGrades,
        },
    ];

    const lineOptions: ApexOptions = {
        legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'left',
        },
        colors: ['#465FFF', '#9CB9FF'],
        chart: {
            fontFamily: 'Outfit, sans-serif',
            height: 310,
            type: 'line',
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: 'straight',
            width: [2, 2],
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0,
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: {
                size: 6,
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: true,
            x: {
                format: 'dd MMM yyyy',
            },
        },
        xaxis: {
            type: 'category',
            categories: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
            ],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px',
                    colors: ['#6B7280'],
                },
            },
            title: {
                text: '',
                style: {
                    fontSize: '0px',
                },
            },
        },
    };

    const lineSeries = [
        {
            name: 'Promedio de asistencia',
            data: monthlyAttendance,
        },
        {
            name: 'Promedio esperado',
            data: monthlyAttendance.map(val => Math.min(val + 2, 100)),
        },
    ];

    const bestGroupsSeries = [
        {
            name: 'Promedio',
            data: bestGroups.map(group => group.average),
        },
    ];

    const bestGroupsOptions: ApexOptions = {
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
                barHeight: '50%',
                borderRadius: 5,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => val.toFixed(1),
        },
        xaxis: {
            categories: bestGroups.map(group => `${group.grade}°`),
            title: {
                text: 'Grupos',
            },
        },
        yaxis: {
            title: {
                text: 'Promedio',
            },
        },
        grid: {
            borderColor: '#e7e7e7',
            strokeDashArray: 4,
        },
        tooltip: {
            x: {
                formatter: (val: number) => `${val}`,
            },
        },
        fill: {
            colors: ['#465FFF'],
        },
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <PageBreadcrumb pageTitle="Inicio" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                {/* Accesos Rápidos */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
                    <Link href="/admin-dashboard/admin-groups">
                        <div className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] md:p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                                <i className="fa-duotone fa-solid fa-users-medical fa-xl text-blue-600 dark:text-blue-500"></i>
                            </div>
                            <div className="mt-5">
                                <span className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                                    Grupos
                                </span>
                                <h4 className="mt-2 font-outfit text-title-sm font-bold text-gray-800 dark:text-white/90">
                                    {stats.totalGroups}
                                </h4>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin-dashboard/admin-students">
                        <div className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] md:p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-500/10">
                                <i className="fa-duotone fa-solid fa-user-graduate fa-xl text-green-600 dark:text-green-500"></i>
                            </div>
                            <div className="mt-5">
                                <span className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                                    Alumnos
                                </span>
                                <h4 className="mt-2 font-outfit text-title-sm font-bold text-gray-800 dark:text-white/90">
                                    {stats.totalStudents}
                                </h4>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin-dashboard/admin-teachers">
                        <div className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] md:p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/10">
                                <i className="fa-duotone fa-solid fa-chalkboard-teacher fa-xl text-purple-600 dark:text-purple-500"></i>
                            </div>
                            <div className="mt-5">
                                <span className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                                    Profesores
                                </span>
                                <h4 className="mt-2 font-outfit text-title-sm font-bold text-gray-800 dark:text-white/90">
                                    {stats.totalTeachers}
                                </h4>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin-dashboard/admin-subjects">
                        <div className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] md:p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/10">
                                <i className="fa-duotone fa-solid fa-book fa-xl text-orange-600 dark:text-orange-500"></i>
                            </div>
                            <div className="mt-5">
                                <span className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                                    Materias
                                </span>
                                <h4 className="mt-2 font-outfit text-title-sm font-bold text-gray-800 dark:text-white/90">
                                    Ver
                                </h4>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Métricas Principales */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <i className="fa-duotone fa-solid fa-graduation-cap fa-xl text-gray-800 dark:text-white/90"></i>
                        </div>

                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                                    Promedio General
                                </span>
                                <h4 className="mt-2 font-outfit text-title-sm font-bold text-gray-800 dark:text-white/90">
                                    {stats.averageGrade.toFixed(1)}
                                </h4>
                            </div>
                            <Badge color="success">
                                <IconFA icon="arrow-up" className="text-success-500" />
                                {stats.recentStudents} nuevos
                            </Badge>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <IconFA icon="box" className="text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                                    Asistencia
                                </span>
                                <h4 className="mt-2 font-outfit text-title-sm font-bold text-gray-800 dark:text-white/90">
                                    {monthlyAttendance[monthlyAttendance.length - 1]}%
                                </h4>
                            </div>

                            <Badge color="success">
                                <IconFA icon="arrow-up" className="text-success-500" />
                                {(
                                    ((monthlyAttendance[monthlyAttendance.length - 1] -
                                        monthlyAttendance[monthlyAttendance.length - 2]) /
                                        monthlyAttendance[monthlyAttendance.length - 2]) *
                                    100
                                ).toFixed(1)}
                                %
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-outfit text-lg font-semibold text-gray-800 dark:text-white/90">
                                Calificaciones por Mes
                            </h3>
                        </div>

                        <div className="custom-scrollbar max-w-full overflow-x-auto">
                            <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
                                <ReactApexChart
                                    options={barOptions}
                                    series={barSeries}
                                    type="bar"
                                    height={180}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
                            <div className="w-full">
                                <h3 className="font-outfit text-lg font-semibold text-gray-800 dark:text-white/90">
                                    Asistencia Diaria
                                </h3>
                                <p className="mt-1 font-outfit text-theme-sm text-gray-500 dark:text-gray-400">
                                    Seguimiento de asistencia mensual
                                </p>
                            </div>
                            <div className="flex w-full items-start gap-3 sm:justify-end">
                                <ChartTab />
                            </div>
                        </div>

                        <div className="custom-scrollbar max-w-full overflow-x-auto">
                            <div className="min-w-[1000px] xl:min-w-full">
                                <ReactApexChart
                                    options={lineOptions}
                                    series={lineSeries}
                                    type="area"
                                    height={310}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mejores Grupos */}
                <ComponentCard title="Mejores Grupos por Grado" className="xl:p-6">
                    <div className="overflow-x-auto">
                        <ReactApexChart
                            options={bestGroupsOptions}
                            series={bestGroupsSeries}
                            type="bar"
                            height={350}
                        />
                    </div>
                </ComponentCard>
            </div>
        </div>
    );
}
