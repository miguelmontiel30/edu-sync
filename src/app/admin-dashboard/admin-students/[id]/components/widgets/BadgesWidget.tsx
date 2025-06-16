import { useState } from "react";
import IconFA from "@/components/ui/IconFA";
import Image from "next/image";

interface BadgeTooltipProps {
    show: boolean;
    description: string;
    earned: boolean;
}

export const BadgeTooltip: React.FC<BadgeTooltipProps> = ({ show, description, earned }) => {
    if (!show) return null;

    return (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
            <div className={`
                px-3 py-2 rounded-lg text-xs font-medium shadow-lg
                max-w-48 text-center
                ${earned ? 'bg-gray-800 text-white dark:bg-gray-700' : 'bg-gray-600 text-white/90 dark:bg-gray-600'}
                animate-fade-in
            `}>
                {earned ? description : 'Sigue esforzándote para obtener esta insignia'}

                {/* Tooltip Arrow */}
                <div className={`
                    absolute top-full left-1/2 transform -translate-x-1/2
                    border-4 border-transparent
                    ${earned ? 'border-t-gray-800 dark:border-t-gray-700' : 'border-t-gray-600 dark:border-t-gray-600'}
                `}></div>
            </div>
        </div>
    );
};

interface Badge {
    id: string;
    title: string;
    imagePath: string;
    color: 'primary' | 'success' | 'warning' | 'error' | 'info';
    description: string;
    earned: boolean;
}

// Mapa de colores según el tema del proyecto
const colorMap = {
    primary: {
        icon: 'text-white',
        bg: 'from-blue-500 to-blue-600',
        card: 'bg-blue-50 dark:bg-blue-900/20',
    },
    success: {
        icon: 'text-white',
        bg: 'from-green-500 to-green-600',
        card: 'bg-green-50 dark:bg-green-900/20',
    },
    warning: {
        icon: 'text-white',
        bg: 'from-yellow-500 to-yellow-600',
        card: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    error: {
        icon: 'text-white',
        bg: 'from-red-500 to-red-600',
        card: 'bg-red-50 dark:bg-red-900/20',
    },
    info: {
        icon: 'text-white',
        bg: 'from-purple-500 to-purple-600',
        card: 'bg-purple-50 dark:bg-purple-900/20',
    },
};

interface StudentBadgeProps {
    badge: Badge;
}

export const StudentBadge: React.FC<StudentBadgeProps> = ({ badge }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const colors = colorMap[badge.color];

    return (
        <div className="relative">
            <div
                className={`
                    relative flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer h-32
                    transition-all duration-300 ease-out
                    hover:scale-105 hover:shadow-md
                    ${badge.earned ? colors.card : 'bg-gray-100 dark:bg-gray-800/40'}
                    ${badge.earned ? 'opacity-100' : 'opacity-60'}
                `}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {/* Badge Image Container */}
                <div className="w-16 h-16 mb-2 relative">
                    <Image
                        src={badge.imagePath}
                        alt={badge.title}
                        fill
                        sizes="64px"
                        className={`object-contain transition-all duration-300 ${!badge.earned && 'grayscale opacity-50'}`}
                    />
                </div>

                {/* Badge Title */}
                <span className={`
                    text-xs font-medium text-center leading-tight
                    ${badge.earned ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}
                `}>
                    {badge.title}
                </span>

                {/* Earned Indicator */}
                {badge.earned && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
                        <IconFA icon="check" className="text-white text-[8px]" />
                    </div>
                )}

                {/* Lock Icon for Unearned Badges */}
                {!badge.earned && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <IconFA icon="lock" className="text-white text-[8px]" />
                    </div>
                )}
            </div>

            {/* Tooltip */}
            <BadgeTooltip
                show={showTooltip}
                description={badge.description}
                earned={badge.earned}
            />
        </div>
    );
};


const badges: Badge[] = [
    {
        id: 'punctuality',
        title: 'Puntualidad',
        imagePath: '/images/badges/Puntualidad.png',
        color: 'error',
        description: 'Has llegado a tiempo 10 días seguidos',
        earned: true
    },
    {
        id: 'attendance',
        title: 'Asistencia',
        imagePath: '/images/badges/Asistencia.png',
        color: 'primary',
        description: '95% de asistencia este mes',
        earned: true
    },
    {
        id: 'excellence',
        title: 'Excelencia Académica',
        imagePath: '/images/badges/ExcelenciaAcademica.png',
        color: 'warning',
        description: 'Promedio superior a 9.0',
        earned: true
    },
    {
        id: 'behavior',
        title: 'Buen Comportamiento',
        imagePath: '/images/badges/Comportamiento.png',
        color: 'success',
        description: 'Sin reportes negativos en 2 meses',
        earned: true
    },
    {
        id: 'improvement',
        title: 'Mejora Continua',
        imagePath: '/images/badges/MejoraContinua.png',
        color: 'info',
        description: 'Mejoró en 3 materias consecutivas',
        earned: false
    },
    {
        id: 'participation',
        title: 'Participación',
        imagePath: '/images/badges/Participacion.png',
        color: 'warning',
        description: 'Participó activamente en 15 clases',
        earned: true
    }
];

export const BadgesWidget: React.FC = () => {
    const earnedBadges = badges.filter(badge => badge.earned).length;
    const progressPercentage = Math.round((earnedBadges / badges.length) * 100);

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                    <IconFA icon="medal" className="mr-2" />
                    Insignias y Logros
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {earnedBadges} de {badges.length} insignias obtenidas
                </p>
            </div>

            <div className="p-6">
                {/* Badges Grid - Ajustado para mostrar 3 por fila con más espacio */}
                <div className="grid grid-cols-3 gap-6">
                    {badges.map((badge) => (
                        <StudentBadge key={badge.id} badge={badge} />
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span>Progreso</span>
                        <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
