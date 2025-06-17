/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import dynamic from 'next/dynamic';
import ComponentCard from '@/components/common/ComponentCard';
import IconFA from '@/components/ui/IconFA';

// Importación dinámica para evitar errores de SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface FinancialChartsProps {
    cashFlowConfig: {
        options: any;
        series: any[];
    };
    monthlyComparisonConfig: {
        options: any;
        series: any[];
    };
    agingReceivablesConfig: {
        options: any;
        series: any[];
    };
    isLoading: boolean;
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({
    cashFlowConfig,
    monthlyComparisonConfig,
    agingReceivablesConfig,
    isLoading,
}) => {
    return (
        <>
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-1">
                <ComponentCard title="Flujo de Caja" className="p-4">
                    {isLoading ? (
                        <div className="flex h-[350px] items-center justify-center">
                            <IconFA icon="spinner" spin className="text-gray-400" />
                        </div>
                    ) : (
                        <ReactApexChart
                            options={cashFlowConfig.options}
                            series={cashFlowConfig.series}
                            type="line"
                            height={350}
                        />
                    )}
                </ComponentCard>

                <ComponentCard title="Comparativo Mensual" className="p-4">
                    {isLoading ? (
                        <div className="flex h-[350px] items-center justify-center">
                            <IconFA icon="spinner" spin className="text-gray-400" />
                        </div>
                    ) : (
                        <ReactApexChart
                            options={monthlyComparisonConfig.options}
                            series={monthlyComparisonConfig.series}
                            type="bar"
                            height={350}
                        />
                    )}
                </ComponentCard>
            </div>

            <div className="mb-6">
                <ComponentCard title="Aging de Cuentas por Cobrar" className="p-4">
                    {isLoading ? (
                        <div className="flex h-[350px] items-center justify-center">
                            <IconFA icon="spinner" spin className="text-gray-400" />
                        </div>
                    ) : (
                        <ReactApexChart
                            options={agingReceivablesConfig.options}
                            series={agingReceivablesConfig.series}
                            type="bar"
                            height={350}
                        />
                    )}
                </ComponentCard>
            </div>
        </>
    );
};

export default FinancialCharts;
