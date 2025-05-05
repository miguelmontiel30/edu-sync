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
    title = "Estadísticas y Gráficos"
}: MetricsChartsWrapperProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            {/* Versión móvil con collapse */}
            <div className="md:hidden">
                <button
                    type="button"
                    className="flex w-full items-center justify-between p-4 bg-white rounded-lg shadow-sm cursor-pointer mb-4 dark:border-gray-800 dark:bg-white/[0.03] border border-gray-200"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                        {title}
                    </h3>
                    <IconFA
                        icon={isExpanded ? "chevron-up" : "chevron-down"}
                        className="text-gray-500"
                    />
                </button>

                {isExpanded && children}
            </div>

            {/* Versión desktop sin collapse */}
            <div className="hidden md:block">
                {children}
            </div>
        </>
    );
}
