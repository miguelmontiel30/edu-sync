import React from 'react';
import IconFA from '@/components/ui/IconFA';
import ComponentCard from '@/components/common/ComponentCard';
import { Grade } from '../../module-utils/types';

interface GradesWidgetProps {
    grades: Grade[];
}

const GradesWidget: React.FC<GradesWidgetProps> = ({ grades }) => {
    // Calcular promedio de calificaciones
    const averageScore = grades.length > 0
        ? grades.reduce((acc, grade) => acc + Number(grade.score), 0) / grades.length
        : 0;

    // Determinar color basado en el promedio
    const getColorClass = (score: number) => {
        if (score >= 9) return 'text-success-500';
        if (score >= 7) return 'text-primary-500';
        if (score >= 6) return 'text-warning-500';
        return 'text-error-500';
    };

    return (
        <ComponentCard title="Calificaciones" desc="Promedio general y tendencia">
            <div className="p-2 flex flex-col items-center">
                {/* Average Score */}
                <div className="w-full flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Promedio General</span>
                        <span className={`text-3xl font-bold ${getColorClass(averageScore)}`}>
                            {averageScore.toFixed(1)}
                        </span>
                    </div>
                    <div className="flex items-center bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 px-2 py-1 rounded-md">
                        <IconFA icon="arrow-up" className="mr-1" />
                        <span className="text-sm font-medium">5.2%</span>
                    </div>
                </div>

                {/* Mini Chart */}
                <div className="w-full h-24 relative mt-2">
                    {/* Simplified Bar Chart */}
                    <div className="flex items-end justify-between h-full w-full px-2">
                        {[7.8, 8.1, 8.3, 8.0, 8.6, 9.1].map((score, index) => (
                            <div key={index} className="relative group">
                                <div
                                    className={`w-8 rounded-t-md ${getColorClass(score)}`}
                                    style={{
                                        height: `${(score / 10) * 100}%`,
                                        backgroundColor: 'currentColor',
                                        opacity: 0.3
                                    }}
                                >
                                </div>
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {score.toFixed(1)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Target Line */}
                    <div className="absolute left-0 right-0 border-t border-dashed border-primary-500/50 dark:border-primary-400/50" style={{ top: '20%' }}>
                        <span className="absolute right-0 -top-3 text-xs text-primary-500 dark:text-primary-400">
                            Meta: 9.0
                        </span>
                    </div>
                </div>

                {/* Períodos */}
                <div className="w-full flex justify-between px-2 mt-1">
                    {['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene'].map((month, index) => (
                        <span key={index} className="text-xs text-gray-500 dark:text-gray-400">
                            {month}
                        </span>
                    ))}
                </div>
            </div>
        </ComponentCard>
    );
};

export default GradesWidget; 