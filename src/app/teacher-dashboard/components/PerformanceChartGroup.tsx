'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { ChartConfig } from '../hooks/usePerformanceChart';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PerformanceChartGroupProps {
    charts: ChartConfig[];
    isLoading: boolean;
}

const PerformanceChart: React.FC<{ config: ChartConfig; isLoading: boolean }> = ({
    config,
    isLoading,
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || isLoading) {
        return (
            <div className="flex h-80 w-full items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <p>Cargando gráfico...</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                {config.title}
            </h3>
            <ReactApexChart
                options={config.options}
                series={config.series}
                type="bar"
                height={350}
            />
        </div>
    );
};

const PerformanceChartGroup: React.FC<PerformanceChartGroupProps> = ({ charts, isLoading }) => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {charts.map(chartConfig => (
                <PerformanceChart key={chartConfig.id} config={chartConfig} isLoading={isLoading} />
            ))}
        </div>
    );
};

export default PerformanceChartGroup;
