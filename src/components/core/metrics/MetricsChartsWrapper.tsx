// React
import { useState, ReactNode } from 'react';

// Components
import IconFA from '@/components/ui/IconFA';

interface MetricsChartsWrapperProps {
    readonly children: ReactNode;
    readonly title?: string;
}

export default function MetricsChartsWrapper({
    children,
    title = 'Estadísticas y Gráficos',
}: MetricsChartsWrapperProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            {/* Versión móvil con collapse */}
            <div className="md:hidden">
                <button
                    type="button"
                    className="mb-4 flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <h3 className="font-outfit text-lg font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </h3>
                    <IconFA
                        icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                        className="text-gray-500"
                    />
                </button>

                {isExpanded && children}
            </div>

            {/* Versión desktop sin collapse */}
            <div className="hidden md:block">{children}</div>
        </>
    );
}
