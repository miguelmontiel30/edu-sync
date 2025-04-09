import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Badge from '@/components/core/badge/Badge';
import IconFA from '@/components/ui/IconFA';
import { Teacher, Group } from './types';
import { getTeachersByGroupChartOptions, getGenderDistributionChartOptions } from './ChartOptions';
import { loadActiveGroups, loadTeachersByGroup } from './services';

interface ChartsProps {
    teachers: Teacher[];
    isLoading: boolean;
}

export default function Charts({ teachers, isLoading }: ChartsProps) {
    const [activeGroups, setActiveGroups] = useState<Group[]>([]);
    const [teachersByGroup, setTeachersByGroup] = useState<{ [key: string]: number }>({});
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setIsLoadingGroups(true);
            try {
                // Cargar grupos activos
                const groupsData = await loadActiveGroups();
                setActiveGroups(groupsData);

                // Si hay grupos, cargar profesores por grupo
                if (groupsData.length > 0) {
                    const teachersData = await loadTeachersByGroup(groupsData[0].school_year_name);
                    setTeachersByGroup(teachersData);
                }
            } catch (error) {
                console.error('Error al cargar datos para gráficos:', error);
            } finally {
                setIsLoadingGroups(false);
            }
        }

        fetchData();
    }, []);

    // Configuración del gráfico de profesores por grupo
    const groupChartOptions = getTeachersByGroupChartOptions(activeGroups, teachersByGroup);
    const groupSeries = [{
        name: 'Profesores',
        data: activeGroups.map(group => {
            const groupKey = `${group.grade}${group.group_name}`;
            return teachersByGroup[groupKey] || 0;
        })
    }];

    // Cálculo para el gráfico de distribución por género
    const maleCount = teachers.filter(t => t.gender === 'Masculino').length;
    const femaleCount = teachers.filter(t => t.gender === 'Femenino').length;
    const totalCount = maleCount + femaleCount;

    // Configuración del gráfico de distribución por género
    const genderChartOptions = getGenderDistributionChartOptions(maleCount, femaleCount);
    const genderSeries = [maleCount, femaleCount];

    // Año escolar actual
    const currentSchoolYear = activeGroups[0]?.school_year_name || 'No disponible';

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
            {/* Gráfico de Profesores por Grupo */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                {isLoading || isLoadingGroups ? (
                    <div className="flex items-center justify-center h-[180px]">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                Profesores por Grupo
                            </h3>
                            <Badge color="info">
                                <span className="font-outfit">
                                    {currentSchoolYear}
                                </span>
                            </Badge>
                        </div>
                        <div className="custom-scrollbar max-w-full overflow-x-auto h-[180px]">
                            <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
                                {activeGroups.length === 0 ? (
                                    <div className="h-full w-full" style={{ opacity: 0.3 }}>
                                        <ReactApexChart
                                            options={{
                                                ...groupChartOptions,
                                                xaxis: {
                                                    ...groupChartOptions.xaxis,
                                                    categories: ['1A', '1B', '2A', '2B', '3A']
                                                }
                                            }}
                                            series={[{
                                                name: 'Profesores',
                                                data: [5, 7, 4, 6, 8]
                                            }]}
                                            type="bar"
                                            height={180}
                                        />
                                    </div>
                                ) : (
                                    <ReactApexChart
                                        options={groupChartOptions}
                                        series={groupSeries}
                                        type="bar"
                                        height={180}
                                    />
                                )}
                            </div>
                        </div>
                        {activeGroups.length === 0 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit text-center px-4">Registra tus datos para poder ver las métricas</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Gráfico de Distribución por Género */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[180px]">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                Distribución por Género
                            </h3>
                            <Badge color="success">
                                <span className="font-outfit">
                                    {totalCount} profesores
                                </span>
                            </Badge>
                        </div>
                        <div className="flex justify-center h-[250px]">
                            {totalCount === 0 ? (
                                <div className="h-full w-full flex justify-center" style={{ opacity: 0.3 }}>
                                    <ReactApexChart
                                        options={genderChartOptions}
                                        series={[15, 25]}
                                        type="donut"
                                        height={250}
                                    />
                                </div>
                            ) : (
                                <ReactApexChart
                                    options={genderChartOptions}
                                    series={genderSeries}
                                    type="donut"
                                    height={250}
                                />
                            )}
                        </div>
                        {totalCount === 0 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit text-center px-4">Registra tus datos para poder ver las métricas</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
} 