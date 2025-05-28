import { AcademicGoal } from '../module-utils/types';
import ComponentCard from '@/components/common/ComponentCard';

interface AcademicGoalsWidgetProps {
    goals: AcademicGoal[];
}

const AcademicGoalsWidget: React.FC<AcademicGoalsWidgetProps> = ({ goals }) => {
    // Ordenar metas por progreso ascendente
    const sortedGoals = [...goals].sort((a, b) => {
        const progressA = Math.min(100, Math.round((a.current / a.target) * 100));
        const progressB = Math.min(100, Math.round((b.current / b.target) * 100));
        return progressA - progressB;
    });

    // Función para obtener color según progreso
    const getProgressColor = (current: number, target: number): string => {
        const progress = (current / target) * 100;

        if (progress >= 90) return 'bg-green-500';
        if (progress >= 70) return 'bg-green-400';
        if (progress >= 50) return 'bg-yellow-500';
        if (progress >= 30) return 'bg-yellow-400';
        return 'bg-red-500';
    };

    return (
        <ComponentCard title="Progreso de Metas" desc="Objetivos académicos del período actual">
            <div className="space-y-5">
                {sortedGoals.length > 0 ? (
                    sortedGoals.map(goal => {
                        const progressPercent = Math.min(100, Math.round((goal.current / goal.target) * 100));

                        return (
                            <div key={goal.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-medium text-sm">{goal.title}</h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {goal.current}/{goal.target} ({progressPercent}%)
                                    </span>
                                </div>

                                {goal.subject && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        {goal.subject} • {goal.period}
                                    </p>
                                )}

                                {/* Barra de progreso */}
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                                    <div
                                        className={`h-2.5 rounded-full ${getProgressColor(goal.current, goal.target)}`}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                        <p>No hay metas establecidas para este período</p>
                    </div>
                )}

                {/* Botón para añadir nueva meta */}
                <div className="pt-2 text-center">
                    <button type="button" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                        + Establecer nueva meta
                    </button>
                </div>
            </div>
        </ComponentCard>
    );
};

export default AcademicGoalsWidget; 