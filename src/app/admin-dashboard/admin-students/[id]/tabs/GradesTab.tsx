import React from 'react';
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import ComponentCard from '@/components/common/ComponentCard';
import { Grade } from '../module-utils/types';

interface GradesTabProps {
    grades: Grade[];
}

const GradesTab: React.FC<GradesTabProps> = ({ grades }) => {
    // Calcular estadísticas reales en base a los datos
    const totalGrades = grades.length;
    const passedGrades = grades.filter(g => Number(g.score) >= 6).length;
    const failedGrades = totalGrades - passedGrades;
    const averageScore = totalGrades > 0
        ? grades.reduce((acc, grade) => acc + Number(grade.score), 0) / totalGrades
        : 0;

    return (
        <div className="space-y-6">
            {/* KPI Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Promedio General</p>
                    <h2 className="text-4xl font-bold font-outfit text-primary-600 dark:text-primary-400">
                        {averageScore.toFixed(1)}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-xs mt-2">Ciclo 2025-2026</p>
                </div>

                <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col items-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Materias</p>
                    <div className="flex gap-4 justify-center">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center mb-1">
                                <IconFA icon="check-circle" className="text-success-500 mr-1" />
                                <span className="text-xl font-semibold font-outfit">{passedGrades}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Aprobadas</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center mb-1">
                                <IconFA icon="times-circle" className="text-error-500 mr-1" />
                                <span className="text-xl font-semibold font-outfit">{failedGrades}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Reprobadas</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col items-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Tendencia</p>
                    <div className="flex items-center">
                        <IconFA icon="arrow-up" className="text-success-500 mr-2" />
                        <span className="text-2xl font-semibold font-outfit">5.2%</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">vs periodo anterior</p>
                </div>
            </div>

            {/* Selectors */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-64">
                        <label htmlFor="schoolYearGrades" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ciclo Escolar
                        </label>
                        <select
                            id="schoolYearGrades"
                            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                            defaultValue="2025-2026"
                        >
                            <option value="2025-2026">2025-2026 (Actual)</option>
                            <option value="2024-2025">2024-2025</option>
                            <option value="2023-2024">2023-2024</option>
                        </select>
                    </div>
                    <div className="w-full md:w-64">
                        <label htmlFor="evaluationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tipo de Evaluación
                        </label>
                        <select
                            id="evaluationType"
                            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                            defaultValue="trimestral"
                        >
                            <option value="mensual">Mensual</option>
                            <option value="trimestral">Trimestral</option>
                            <option value="continuo">Evaluación Continua</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-end">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <IconFA icon="file-pdf" /> Exportar PDF
                    </Button>
                </div>
            </div>

            {/* Table */}
            <ComponentCard title="Calificaciones por Materia" className="p-2">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Buscar materia..."
                            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Materia</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trim. 1</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trim. 2</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trim. 3</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Promedio</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comentarios</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {grades.length > 0 ? (
                                grades.map((grade, index) => (
                                    <tr key={grade.id || index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-outfit text-gray-900 dark:text-white">
                                            {grade.subject}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                                            <span className="font-semibold font-outfit text-green-700 dark:text-green-500">
                                                {parseFloat("8.5").toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                                            <span className="font-semibold font-outfit text-green-700 dark:text-green-500">
                                                {parseFloat("8.7").toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                                            <span className="font-semibold font-outfit text-green-700 dark:text-green-500">
                                                {parseFloat("9.0").toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-outfit text-green-700 dark:text-green-500">
                                            {grade.score}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            Buen rendimiento
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No hay calificaciones disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </ComponentCard>

            {/* Subject Cards */}
            <ComponentCard title="Desempeño por Materia" className="p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Matemáticas Card */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-md font-semibold font-outfit text-gray-800 dark:text-white/90">Matemáticas</h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                +3.2%
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="relative h-24 w-24">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold font-outfit text-primary-600 dark:text-primary-400">9.7</span>
                                </div>
                                {/* Aquí iría un componente de gauge circular */}
                                <div className="h-24 w-24 rounded-full border-8 border-primary-500/40 border-t-8 border-t-primary-500 transform -rotate-45"></div>
                            </div>
                            <div className="h-16 w-32">
                                {/* Aquí iría una mini gráfica sparkline */}
                                <div className="h-full w-full flex items-end space-x-1">
                                    <div className="h-8/12 w-2 bg-primary-300 dark:bg-primary-700 rounded-t"></div>
                                    <div className="h-9/12 w-2 bg-primary-400 dark:bg-primary-600 rounded-t"></div>
                                    <div className="h-10/12 w-2 bg-primary-500 rounded-t"></div>
                                    <div className="h-11/12 w-2 bg-primary-600 rounded-t"></div>
                                    <div className="h-full w-2 bg-primary-700 rounded-t"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Español Card */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-md font-semibold font-outfit text-gray-800 dark:text-white/90">Español</h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                +1.5%
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="relative h-24 w-24">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold font-outfit text-blue-600 dark:text-blue-400">8.5</span>
                                </div>
                                {/* Aquí iría un componente de gauge circular */}
                                <div className="h-24 w-24 rounded-full border-8 border-blue-500/40 border-t-8 border-t-blue-500 transform -rotate-90"></div>
                            </div>
                            <div className="h-16 w-32">
                                {/* Aquí iría una mini gráfica sparkline */}
                                <div className="h-full w-full flex items-end space-x-1">
                                    <div className="h-9/12 w-2 bg-blue-300 dark:bg-blue-700 rounded-t"></div>
                                    <div className="h-8/12 w-2 bg-blue-400 dark:bg-blue-600 rounded-t"></div>
                                    <div className="h-9/12 w-2 bg-blue-500 rounded-t"></div>
                                    <div className="h-9/12 w-2 bg-blue-600 rounded-t"></div>
                                    <div className="h-10/12 w-2 bg-blue-700 rounded-t"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ciencias Card */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-md font-semibold font-outfit text-gray-800 dark:text-white/90">Ciencias</h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                +4.8%
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="relative h-24 w-24">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold font-outfit text-yellow-600 dark:text-yellow-400">7.2</span>
                                </div>
                                {/* Aquí iría un componente de gauge circular */}
                                <div className="h-24 w-24 rounded-full border-8 border-yellow-500/40 border-t-8 border-t-yellow-500 transform -rotate-[135deg]"></div>
                            </div>
                            <div className="h-16 w-32">
                                {/* Aquí iría una mini gráfica sparkline */}
                                <div className="h-full w-full flex items-end space-x-1">
                                    <div className="h-6/12 w-2 bg-yellow-300 dark:bg-yellow-700 rounded-t"></div>
                                    <div className="h-7/12 w-2 bg-yellow-400 dark:bg-yellow-600 rounded-t"></div>
                                    <div className="h-7/12 w-2 bg-yellow-500 rounded-t"></div>
                                    <div className="h-8/12 w-2 bg-yellow-600 rounded-t"></div>
                                    <div className="h-8/12 w-2 bg-yellow-700 rounded-t"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historia Card */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-md font-semibold font-outfit text-gray-800 dark:text-white/90">Historia</h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                -0.8%
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="relative h-24 w-24">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold font-outfit text-red-600 dark:text-red-400">6.1</span>
                                </div>
                                {/* Aquí iría un componente de gauge circular */}
                                <div className="h-24 w-24 rounded-full border-8 border-red-500/40 border-t-8 border-t-red-500 transform -rotate-[180deg]"></div>
                            </div>
                            <div className="h-16 w-32">
                                {/* Aquí iría una mini gráfica sparkline */}
                                <div className="h-full w-full flex items-end space-x-1">
                                    <div className="h-5/12 w-2 bg-red-300 dark:bg-red-700 rounded-t"></div>
                                    <div className="h-6/12 w-2 bg-red-400 dark:bg-red-600 rounded-t"></div>
                                    <div className="h-6/12 w-2 bg-red-500 rounded-t"></div>
                                    <div className="h-7/12 w-2 bg-red-600 rounded-t"></div>
                                    <div className="h-6/12 w-2 bg-red-700 rounded-t"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ComponentCard>

            {/* Comparative Chart */}
            <ComponentCard title="Comparativa con el Grupo" className="p-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="flex items-center space-x-2">
                        <button className="flex items-center px-3 py-1 text-xs font-medium rounded-md bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                            <IconFA icon="eye" className="mr-1" /> Mostrar Promedio del Grupo
                        </button>
                    </div>
                </div>

                <div className="h-80">
                    {/* Aquí iría el gráfico comparativo - usando un div simulado por ahora */}
                    <div className="h-full w-full rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-500 font-outfit">Gráfico comparativo de rendimiento</span>
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
};

export default GradesTab; 