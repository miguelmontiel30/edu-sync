import React, { useState } from 'react';
import Metrics from './Metrics';
import Charts from './Charts';
import IconFA from '@/components/ui/IconFA';
import { Teacher } from './types';

interface MetricsAndChartsWrapperProps {
    teachers: Teacher[];
    isLoading: boolean;
}

export default function MetricsAndChartsWrapper({ teachers, isLoading }: MetricsAndChartsWrapperProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Contenido de métricas y gráficos
    const content = (
        <>
            <Metrics teachers={teachers} isLoading={isLoading} />
            <Charts teachers={teachers} isLoading={isLoading} />
        </>
    );

    return (
        <>
            {/* Versión móvil con collapse */}
            <div className="md:hidden">
                <div
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm cursor-pointer mb-4"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                        Estadísticas y Gráficos
                    </h3>
                    <IconFA
                        icon={isExpanded ? "chevron-up" : "chevron-down"}
                        className="text-gray-500"
                    />
                </div>

                {isExpanded && content}
            </div>

            {/* Versión desktop sin collapse */}
            <div className="hidden md:block">
                {content}
            </div>
        </>
    );
} 