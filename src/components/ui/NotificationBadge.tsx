import React from 'react';

type BadgeType = 'primary' | 'success' | 'warning' | 'error' | 'info';

interface NotificationBadgeProps {
    count: number;
    type?: BadgeType;
    className?: string;
    showZero?: boolean;
    maxCount?: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
    count,
    type = 'primary',
    className = '',
    showZero = false,
    maxCount = 99
}) => {
    // Si el contador es 0 y no se debe mostrar, no renderizar nada
    if (count === 0 && !showZero) {
        return null;
    }

    // Determina qué texto mostrar según el contador y el máximo
    const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

    // Mapear tipo a clases de Tailwind
    const typeClasses = {
        primary: 'bg-primary-500 text-white',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
    };

    return (
        <span
            className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 
            rounded-full text-xs font-medium ${typeClasses[type]} ${className}`}
        >
            {displayCount}
        </span>
    );
};

export default NotificationBadge; 