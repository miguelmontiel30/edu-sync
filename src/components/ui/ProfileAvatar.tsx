import React from 'react';
import { cn } from '@/lib/utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ProfileAvatarProps {
    /**
     * Nombre completo del usuario
     */
    name: string;

    /**
     * Tamaño del avatar
     * @default 'md'
     */
    size?: AvatarSize;

    /**
     * URL de la imagen del avatar (opcional)
     */
    src?: string;

    /**
     * Clases CSS adicionales
     */
    className?: string;

    /**
     * Si tiene indicador de estado online
     */
    showStatus?: boolean;

    /**
     * Estado del usuario
     */
    status?: 'online' | 'offline' | 'away';
}

/**
 * Genera las iniciales a partir del nombre
 */
const getInitials = (name: string): string => {
    const words = name
        .trim()
        .split(' ')
        .filter(word => word.length > 0);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
};

/**
 * Genera un color consistente basado en el nombre
 */
const getAvatarColor = (name: string): { bg: string; text: string } => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;

    return {
        bg: `hsl(${hue}, 70%, 85%)`,
        text: `hsl(${hue}, 70%, 30%)`,
    };
};

/**
 * Obtiene las clases de tamaño
 */
const getSizeClasses = (size: AvatarSize): { container: string; text: string; status: string } => {
    const sizes = {
        xs: { container: 'h-6 w-6', text: 'text-xs', status: 'h-1.5 w-1.5' },
        sm: { container: 'h-8 w-8', text: 'text-sm', status: 'h-2 w-2' },
        md: { container: 'h-10 w-10', text: 'text-base', status: 'h-2.5 w-2.5' },
        lg: { container: 'h-12 w-12', text: 'text-lg', status: 'h-3 w-3' },
        xl: { container: 'h-16 w-16', text: 'text-xl', status: 'h-4 w-4' },
    };

    return sizes[size];
};

/**
 * Obtiene las clases de color para el estado
 */
const getStatusColor = (status: 'online' | 'offline' | 'away'): string => {
    const colors = {
        online: 'bg-success-500',
        offline: 'bg-gray-400',
        away: 'bg-warning-500',
    };

    return colors[status];
};

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    name,
    size = 'md',
    src,
    className,
    showStatus = false,
    status = 'offline',
}) => {
    const initials = getInitials(name);
    const colors = getAvatarColor(name);
    const sizeClasses = getSizeClasses(size);

    return (
        <div className={cn('relative flex-shrink-0', className)}>
            <div
                className={cn(
                    'flex items-center justify-center overflow-hidden rounded-full font-medium',
                    sizeClasses.container,
                )}
                style={src ? undefined : { backgroundColor: colors.bg }}
            >
                {src ? (
                    <img src={src} alt={name} className="h-full w-full object-cover" />
                ) : (
                    <span
                        className={cn('font-semibold', sizeClasses.text)}
                        style={{ color: colors.text }}
                    >
                        {initials}
                    </span>
                )}
            </div>

            {showStatus && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-900',
                        sizeClasses.status,
                        getStatusColor(status),
                    )}
                />
            )}
        </div>
    );
};

export default ProfileAvatar;
