import React from 'react';
import { cn } from '@/lib/utils';

export type IconStyle = 'solid' | 'regular' | 'light' | 'duotone' | 'brands';
export type IconSize = 'xs' | 'sm' | 'lg' | 'xl' | '2xl';

export interface IconFAProps {
    /**
     * Nombre del icono (sin el prefijo fa-)
     * @example 'user', 'home', 'chart-mixed-up-circle-dollar'
     */
    icon: string;

    /**
     * Estilo del icono
     * @default 'solid'
     */
    style?: IconStyle;

    /**
     * Tamaño del icono
     * @example 'xs', 'sm', 'lg', 'xl', '2xl'
     */
    size?: IconSize;

    /**
     * Clases adicionales para el icono
     */
    className?: string;

    /**
     * Si es true, el icono se mostrará fijo en ancho
     * @default false
     */
    fixedWidth?: boolean;

    /**
     * Si es true, el icono se mostrará con animación de spinner
     * @default false
     */
    spin?: boolean;

    /**
     * Si es true, el icono se mostrará con animación de pulso
     * @default false
     */
    pulse?: boolean;

    /**
     * Si es true, el icono se mostrará invertido horizontalmente
     * @default false
     */
    flip?: boolean;

    /**
     * Si es true, el icono se mostrará rotado
     * @example 90, 180, 270
     */
    rotate?: 90 | 180 | 270;
}

/**
 * Componente de icono FontAwesome que estandariza el uso de iconos en la aplicación
 */
const IconFA: React.FC<IconFAProps> = ({
    icon,
    style = 'solid',
    size,
    className,
    fixedWidth = false,
    spin = false,
    pulse = false,
    flip = false,
    rotate,
    ...props
}) => {
    // Construir la clase base del icono según el estilo
    const stylePrefix =
        style === 'solid'
            ? 'fa-solid'
            : style === 'regular'
              ? 'fa-regular'
              : style === 'light'
                ? 'fa-light'
                : style === 'brands'
                  ? 'fa-brands'
                  : 'fa-duotone';

    // Construir todas las clases
    const iconClass = cn(
        stylePrefix,
        `fa-${icon}`,
        size && `fa-${size}`,
        fixedWidth && 'fa-fw',
        spin && 'fa-spin',
        pulse && 'fa-pulse',
        flip && 'fa-flip',
        rotate && `fa-rotate-${rotate}`,
        className,
    );

    return <i className={iconClass} {...props} />;
};

export default IconFA;
