import React from 'react';
import Metrics from './Metrics';
import Charts from './Charts';
import MetricsChartsWrapper from '@/components/core/metrics/MetricsChartsWrapper';
import { SchoolCycle } from './types';

interface MetricsAndChartsWrapperProps {
    readonly cycles: SchoolCycle[];
    readonly isLoading: boolean;
}

export default function MetricsAndChartsWrapper({ cycles, isLoading }: Readonly<MetricsAndChartsWrapperProps>) {
    return (
        <MetricsChartsWrapper title="Estadísticas y Gráficos de Ciclos Escolares">
            <Metrics cycles={cycles} isLoading={isLoading} />
            <Charts cycles={cycles} isLoading={isLoading} />
        </MetricsChartsWrapper>
    );
} 