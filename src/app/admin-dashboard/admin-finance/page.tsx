'use client';

// Components
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';

// Core
import MetricsGroup from '../core/Metrics/MetricsGroup';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';

// Module Components
import FinancialCharts from './components/FinancialCharts';
import FiltersBar from './components/FiltersBar';
import QuickActions from './components/QuickActions';
import FinancialHealthMetrics from './components/FinancialHealthMetrics';
import TransactionsTable from './components/TransactionsTable';
import UpcomingPaymentsTable from './components/UpcomingPaymentsTable';
import TopDebtorsTable from './components/TopDebtorsTable';

// Hooks
import { 
    useFinancialData, 
    useMetricsConfig,
    useChartConfig
} from './hooks';

export default function FinanceDashboardPage() {
    const {
        financialData,
        filters,
        isLoading,
        handleFilterChange
    } = useFinancialData();

    // Configuración de métricas KPI
    const { metricsConfig } = useMetricsConfig(financialData);

    // Configuración de gráficos
    const { 
        cashFlowConfig, 
        monthlyComparisonConfig, 
        agingReceivablesConfig 
    } = useChartConfig(financialData);

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <PageBreadcrumb pageTitle="Dashboard Financiero" />

            {/* Barra de filtros */}
            <div className="mb-6">
                <FiltersBar 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    isLoading={isLoading}
                />
            </div>

            {/* Accesos rápidos */}
            <div className="mb-6">
                <QuickActions />
            </div>


            {/* KPI Cards */}
            <div className="mb-6">
                <MetricsGroup
                    metricsConfig={metricsConfig}
                    isLoading={isLoading}
                />
            </div>


            {/* Gráficos */}
            <div className="mb-6">
                <FinancialCharts 
                    cashFlowConfig={cashFlowConfig}
                    monthlyComparisonConfig={monthlyComparisonConfig}
                    agingReceivablesConfig={agingReceivablesConfig}
                    isLoading={isLoading}
                />
            </div>

            {/* Métricas de Salud Financiera */}
            <div className="mb-6">
                <FinancialHealthMetrics 
                    metrics={financialData.financialMetrics}
                    isLoading={isLoading}
                />
            </div>

            {/* Tablas detalladas */}
            <div className="grid grid-cols-1 gap-6 mb-6">
                <TransactionsTable 
                    transactions={financialData.recentTransactions}
                    isLoading={isLoading}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                <UpcomingPaymentsTable 
                    payments={financialData.upcomingPayments}
                    isLoading={isLoading}
                />

                <TopDebtorsTable 
                    debtors={financialData.topDebtors}
                    isLoading={isLoading}
                />
            </div>

            
        </div>
    );
} 