import React from 'react';
import Badge from '@/components/core/badge/Badge';
import IconFA from '@/components/ui/IconFA';
import { Teacher } from './types';

interface MetricsProps {
    teachers: Teacher[];
    isLoading: boolean;
}

export default function Metrics({ teachers, isLoading }: MetricsProps) {
    // Calcular métricas
    const totalTeachers = teachers.length;

    // Profesores activos (consideramos activos aquellos que tienen al menos un grupo asignado)
    const activeTeachers = teachers.filter(teacher => teacher.groupsCount > 0).length;

    // Profesores con múltiples materias (aquellos que imparten más de una materia)
    const multiSubjectTeachers = teachers.filter(teacher => teacher.subjectsCount > 1).length;

    // Cálculo del promedio de materias por profesor
    const avgSubjectsPerTeacher = totalTeachers > 0
        ? teachers.reduce((acc, teacher) => acc + teacher.subjectsCount, 0) / totalTeachers
        : 0;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6 mb-6">
            {/* Total de Profesores */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[120px]">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : (
                    <>
                        {totalTeachers === 0 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        )}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <IconFA icon="person-chalkboard" style="duotone" className="text-xl text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Total de Profesores
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    {totalTeachers}
                                </h4>
                            </div>
                            <Badge color="info">
                                <span className="font-outfit">
                                    {activeTeachers} activos
                                </span>
                            </Badge>
                        </div>
                    </>
                )}
            </div>

            {/* Promedio de Materias por Profesor */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[120px]">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : (
                    <>
                        {totalTeachers === 0 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        )}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <IconFA icon="books" style="duotone" className="text-xl text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Materias por Profesor
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    {avgSubjectsPerTeacher.toFixed(1)}
                                </h4>
                            </div>
                            <Badge color="success">
                                <span className="font-outfit">
                                    {multiSubjectTeachers} multi-materia
                                </span>
                            </Badge>
                        </div>
                    </>
                )}
            </div>

            {/* Distribución por Género */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[120px]">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : (
                    <>
                        {totalTeachers === 0 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        )}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <IconFA icon="venus-mars" style="duotone" className="text-xl text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Distribución Género
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    {(() => {
                                        const maleCount = teachers.filter(t => t.gender === 'Masculino').length;
                                        const femaleCount = teachers.filter(t => t.gender === 'Femenino').length;
                                        return `${maleCount}M / ${femaleCount}F`;
                                    })()}
                                </h4>
                            </div>
                            <Badge color="warning">
                                <span className="font-outfit">
                                    {(() => {
                                        const femaleCount = teachers.filter(t => t.gender === 'Femenino').length;
                                        const percentage = totalTeachers ? (femaleCount / totalTeachers) * 100 : 0;
                                        return `${percentage.toFixed(0)}% mujeres`;
                                    })()}
                                </span>
                            </Badge>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 