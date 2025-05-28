import React from 'react';
import IconFA from '@/components/ui/IconFA';
import ComponentCard from '@/components/common/ComponentCard';
import { Badge } from '../module-utils/types';

interface RewardsWidgetProps {
    badges?: Badge[];
}

const EXAMPLE_BADGES: Badge[] = [
    { id: 1, icon: 'trophy', name: 'Excelencia Académica', obtained: true, color: 'primary' },
    { id: 2, icon: 'medal', name: 'Asistencia Perfecta', obtained: true, color: 'success' },
    { id: 3, icon: 'star', name: 'Mejor Compañero', obtained: true, color: 'warning' },
    { id: 4, icon: 'graduation-cap', name: 'Honor al Mérito', obtained: false },
    { id: 5, icon: 'award', name: 'Líder del Mes', obtained: true, color: 'error' },
    { id: 6, icon: 'certificate', name: 'Esfuerzo Constante', obtained: false },
    { id: 7, icon: 'crown', name: 'Excelente Conducta', obtained: true, color: 'info' },
    { id: 8, icon: 'shield', name: 'Deportista Destacado', obtained: false }
];

const getColorClasses = (color?: string, obtained: boolean = false) => {
    if (!obtained) return 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500';

    const colorMap = {
        primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
        success: 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400',
        warning: 'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
        error: 'bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400',
        info: 'bg-info-100 text-info-600 dark:bg-info-900/30 dark:text-info-400'
    };

    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
};

const RewardsWidget: React.FC<RewardsWidgetProps> = ({ badges = EXAMPLE_BADGES }) => {
    const obtainedCount = badges.filter(badge => badge.obtained).length;

    return (
        <ComponentCard className="p-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-outfit font-semibold text-gray-800 dark:text-white/90">
                        Insignias y Logros
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {obtainedCount} de {badges.length} insignias obtenidas
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {badges.map((badge) => (
                    <div
                        key={badge.id}
                        className="flex flex-col items-center text-center group"
                    >
                        <div className={`
                            relative w-12 h-12 flex items-center justify-center mb-2
                        `}>
                            {/* Círculo de fondo exterior */}
                            <div className={`
                                absolute inset-0 rounded-full opacity-20
                                ${getColorClasses(badge.color, badge.obtained)}
                            `} />

                            {/* Círculo de fondo interior */}
                            <div className={`
                                absolute inset-1 rounded-full
                                ${getColorClasses(badge.color, badge.obtained)}
                            `} />

                            {/* Icono */}
                            <IconFA
                                icon={badge.icon}
                                style={badge.obtained ? 'duotone' : 'light'}
                                className={`
                                    text-xl relative z-10
                                    ${badge.obtained ? '' : 'opacity-40'}
                                `}
                            />
                        </div>
                        <span className={`
                            text-xs font-medium truncate w-full
                            ${badge.obtained
                                ? `${badge.color ? `text-${badge.color}-700 dark:text-${badge.color}-400` : 'text-gray-700 dark:text-gray-200'}`
                                : 'text-gray-400 dark:text-gray-500'
                            }
                        `}>
                            {badge.name}
                        </span>
                    </div>
                ))}
            </div>
        </ComponentCard>
    );
};

export default RewardsWidget; 