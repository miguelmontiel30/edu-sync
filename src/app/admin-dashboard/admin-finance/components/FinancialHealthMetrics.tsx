import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import IconFA from '@/components/ui/IconFA';

interface FinancialMetrics {
    dso: number;
    operatingMargin: number;
    payrollCoverageRatio: number;
    delinquencyRate: number;
}

interface FinancialHealthMetricsProps {
    metrics: FinancialMetrics;
    isLoading: boolean;
}

const FinancialHealthMetrics: React.FC<FinancialHealthMetricsProps> = ({ metrics, isLoading }) => {
    if (isLoading) {
        return (
            <ComponentCard title="Métricas de Salud Financiera" className="p-4">
                <div className="flex items-center justify-center h-[200px]">
                    <IconFA icon="spinner" spin className="text-gray-400" />
                </div>
            </ComponentCard>
        );
    }

    return (
        <ComponentCard title="Métricas de Salud Financiera" className="p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <span className="text-sm text-gray-500">Días Promedio de Cobro</span>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.dso}</span>
                        <span className="ml-1 text-sm text-gray-500">días</span>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <span className="text-sm text-gray-500">Margen Operativo</span>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.operatingMargin}%</span>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <span className="text-sm text-gray-500">Cobertura de Nómina</span>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.payrollCoverageRatio}x</span>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <span className="text-sm text-gray-500">Tasa de Morosidad</span>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.delinquencyRate}%</span>
                    </div>
                </div>
            </div>
        </ComponentCard>
    );
};

export default FinancialHealthMetrics; 