/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { MetricConfig } from '@/app/admin-dashboard/core/Metrics/types';

export function useMetricsConfig(financialData: any) {
    // Configurar métricas KPI basadas en los datos financieros
    const metricsConfig = useMemo<MetricConfig[]>(
        () => [
            {
                id: 'total-income',
                icon: 'circle-dollar-to-slot',
                title: 'Total Ingresos',
                value: new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                }).format(financialData.totalIncome),
                badgeText: '+8.5%',
                badgeColor: 'success',
            },
            {
                id: 'total-expenses',
                icon: 'money-bill-transfer',
                title: 'Total Egresos',
                value: new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                }).format(financialData.totalExpenses),
                badgeText: '+3.2%',
                badgeColor: 'warning',
            },
            {
                id: 'net-profit',
                icon: 'chart-line',
                title: 'Ganancia Neta',
                value: new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                }).format(financialData.netProfit),
                badgeText: '+12.4%',
                badgeColor: 'success',
            },
            {
                id: 'available-cash',
                icon: 'sack-dollar',
                title: 'Saldo Disponible',
                value: new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                }).format(financialData.availableCash),
                badgeText: '+5.8%',
                badgeColor: 'success',
            },
            {
                id: 'overdue-invoices',
                icon: 'file-invoice-dollar',
                title: 'Cuentas por Cobrar Vencidas',
                value: new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                }).format(financialData.overdueInvoices.amount),
                badgeText: `${financialData.overdueInvoices.count} facturas`,
                badgeColor: 'error',
            },
            {
                id: 'upcoming-payables',
                icon: 'calendar-day',
                title: 'Cuentas por Pagar Próximas',
                value: new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                }).format(financialData.upcomingPayables.amount),
                badgeText: `${financialData.upcomingPayables.daysRemaining} días`,
                badgeColor: 'warning',
            },
        ],
        [financialData],
    );

    return { metricsConfig };
}
