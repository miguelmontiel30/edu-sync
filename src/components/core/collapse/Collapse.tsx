// React
import { useState, ReactNode } from 'react';

// Components
import IconFA from '@/components/ui/IconFA';

export interface CollapseProps {
    readonly children: ReactNode;
    readonly title: string;
    readonly className?: string;
    readonly headerClassName?: string;
    readonly contentClassName?: string;
    readonly icon?: string;
    readonly defaultExpanded?: boolean;
    readonly expandedOnDesktop?: boolean;
    readonly desktopBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function Collapse({
    children,
    title,
    className = '',
    headerClassName = '',
    contentClassName = '',
    icon,
    defaultExpanded = false,
    expandedOnDesktop = true,
    desktopBreakpoint = 'md'
}: CollapseProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    // Determinar qué icono mostrar
    const displayIcon = icon || (isExpanded ? 'chevron-up' : 'chevron-down');

    return (
        <div className={`rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden ${className}`}>
            <button
                type="button"
                className={`flex items-center justify-between p-4 w-full cursor-pointer ${headerClassName}`}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
            >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                    {title}
                </h3>
                <IconFA
                    icon={displayIcon}
                    className="text-gray-500"
                />
            </button>

            {/* Contenido móvil - colapsable */}
            <div className={`${desktopBreakpoint}:hidden`}>
                {isExpanded && (
                    <div className={`p-4 pt-0 ${contentClassName}`}>
                        {children}
                    </div>
                )}
            </div>

            {/* Contenido desktop - visible o colapsable según configuración */}
            <div className={`hidden ${desktopBreakpoint}:block`}>
                {(expandedOnDesktop || isExpanded) && (
                    <div className={`p-4 pt-0 ${contentClassName}`}>
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
} 