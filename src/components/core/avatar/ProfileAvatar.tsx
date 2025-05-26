import React from 'react';
import Image from 'next/image';

interface ProfileAvatarProps {
    imageUrl?: string | null;
    name: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    className?: string;
    alt?: string;
    borderColor?: string;
    showBorder?: boolean;
}

/**
 * Componente que muestra una imagen de perfil o un fallback con iniciales cuando no hay imagen
 */
const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    imageUrl,
    name,
    size = 'md',
    className = '',
    alt,
    borderColor = 'border-primary-100',
    showBorder = true
}) => {
    // Obtenemos las iniciales (hasta 2 letras) del nombre
    const getInitials = (name: string): string => {
        if (!name) return '?';

        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }

        // Tomamos la primera letra del primer nombre y la primera letra del primer apellido
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    };

    // Generamos un color pastel basado en el nombre para que sea consistente
    const generateColor = (name: string) => {
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return {
            background: `hsl(${hue}, 70%, 85%)`,
            text: `hsl(${hue}, 70%, 30%)`
        };
    };

    // Configuramos el tamaño del avatar
    const getSizeClass = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number): string => {
        const sizes = {
            xs: 'w-6 h-6 text-xs',
            sm: 'w-8 h-8 text-sm',
            md: 'w-12 h-12 text-base',
            lg: 'w-16 h-16 text-lg',
            xl: 'w-24 h-24 text-xl'
        };

        if (typeof size === 'number') {
            return `w-[${size}px] h-[${size}px] text-[${Math.max(12, size / 3)}px]`;
        }

        return sizes[size] || sizes.md;
    };

    const sizeClass = getSizeClass(size);
    const initials = getInitials(name);
    const colors = generateColor(name);
    const borderClass = showBorder ? `border-4 ${borderColor}` : '';

    return (
        <div className={`relative rounded-full overflow-hidden ${sizeClass} ${className}`}>
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={alt || name}
                    fill
                    className={`object-cover ${borderClass}`}
                />
            ) : (
                <div
                    className={`flex items-center justify-center w-full h-full ${borderClass}`}
                    style={{ backgroundColor: colors.background }}
                >
                    <span style={{ color: colors.text }} className="font-medium">
                        {initials}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProfileAvatar; 