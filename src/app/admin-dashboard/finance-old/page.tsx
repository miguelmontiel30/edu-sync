'use client';

// React
import { useState, useEffect } from 'react';

// Next
import dynamic from 'next/dynamic';

// Components
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/core/button/Button';
import Badge from '@/components/core/badge/Badge';
import IconFA from '@/components/ui/IconFA';
import MetricsGroup from '@/app/admin-dashboard/core/Metrics/MetricsGroup';
import { MetricConfig } from '@/app/admin-dashboard/core/Metrics/types';
import DataTable from '@/components/core/table/DataTable';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';

// Types
import { ApexOptions } from 'apexcharts';
import { Column } from '@/components/core/table/module-utils/types';

// Importación dinámica para evitar errores de SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Datos de ejemplo
const mockFinancialData = {
    totalIncome: 5248750.00,
    totalExpenses: 3985320.00,
    netProfit: 1263430.00,
    availableCash: 2156780.00,
    overdueInvoices: {
        amount: 784500.00,
        count: 24
    },
    upcomingPayables: {
        amount: 456280.00,
        daysRemaining: 5
    },
    cashFlowData: [
        { month: 'Ene', income: 458000, expenses: 320000 },
        { month: 'Feb', income: 425000, expenses: 310000 },
        { month: 'Mar', income: 510000, expenses: 348000 },
        { month: 'Abr', income: 492000, expenses: 325000 },
        { month: 'May', income: 486000, expenses: 330000 },
        { month: 'Jun', income: 515000, expenses: 350000 },
        { month: 'Jul', income: 542000, expenses: 370000 },
        { month: 'Ago', income: 485000, expenses: 345000 },
        { month: 'Sep', income: 473000, expenses: 360000 },
        { month: 'Oct', income: 490000, expenses: 342000 },
        { month: 'Nov', income: 478000, expenses: 352000 },
        { month: 'Dic', income: 495000, expenses: 345000 }
    ],
    agingReceivables: [
        { range: '0-30 días', amount: 320000 },
        { range: '31-60 días', amount: 215000 },
        { range: '61-90 días', amount: 125000 },
        { range: '+90 días', amount: 124500 }
    ],
    recentTransactions: [
        { id: 1, date: '2023-12-15', type: 'Colegiatura', concept: 'Pago mensual 3º grado', amount: 3500, status: 'Pagado' },
        { id: 2, date: '2023-12-14', type: 'Reinscripción', concept: 'Anticipo ciclo 2024', amount: 8500, status: 'Pagado' },
        { id: 3, date: '2023-12-13', type: 'Nómina', concept: 'Pago quincenal profesores', amount: -125000, status: 'Procesado' },
        { id: 4, date: '2023-12-10', type: 'Colegiatura', concept: 'Pago mensual 5º grado', amount: 3800, status: 'Pagado' },
        { id: 5, date: '2023-12-08', type: 'Servicios', concept: 'Pago electricidad', amount: -12450, status: 'Procesado' },
        { id: 6, date: '2023-12-05', type: 'Colegiatura', concept: 'Pago mensual 1º grado', amount: 3200, status: 'Pendiente' },
        { id: 7, date: '2023-12-01', type: 'Material', concept: 'Libros de texto', amount: -45000, status: 'Procesado' }
    ],
    upcomingPayments: [
        { id: 1, dueDate: '2023-12-20', concept: 'Nómina quincenal', amount: 138500, daysRemaining: 5 },
        { id: 2, dueDate: '2023-12-25', concept: 'Pago proveedores', amount: 87300, daysRemaining: 10 },
        { id: 3, dueDate: '2023-12-28', concept: 'Impuestos mensuales', amount: 95480, daysRemaining: 13 },
        { id: 4, dueDate: '2024-01-05', concept: 'Servicios de internet', amount: 8500, daysRemaining: 21 },
        { id: 5, dueDate: '2024-01-10', concept: 'Materiales didácticos', amount: 32000, daysRemaining: 26 }
    ],
    topDebtors: [
        { id: 1, student: 'Carlos Méndez Vega', grade: '4º Primaria', amount: 12500, invoiceCount: 3 },
        { id: 2, student: 'Ana Sofía Ramírez', grade: '2º Secundaria', amount: 9800, invoiceCount: 2 },
        { id: 3, student: 'Roberto Gómez Bolaños', grade: '6º Primaria', amount: 7300, invoiceCount: 2 },
        { id: 4, student: 'María José Fernández', grade: '3º Primaria', amount: 6900, invoiceCount: 1 },
        { id: 5, student: 'Jorge Luis Vázquez', grade: '1º Secundaria', amount: 6500, invoiceCount: 1 }
    ],
    financialMetrics: {
        dso: 28, // Days Sales Outstanding (días promedio de cobro)
        operatingMargin: 24.2, // Margen operativo
        payrollCoverageRatio: 2.8, // Ratio de cobertura de nómina
        delinquencyRate: 12.5 // Tasa de morosidad
    }
};

export default function FinanceDashboardPage() {
    // Estados para filtros
    const [dateRange, setDateRange] = useState('month');
    const [schoolYear, setSchoolYear] = useState('all');
    const [transactionType, setTransactionType] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Aquí iría la lógica para cargar datos reales basados en los filtros
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
    }, [dateRange, schoolYear, transactionType]);

    // Configuración de métricas KPI
    const metricsConfig: MetricConfig[] = [
        {
            id: 'total-income',
            icon: 'circle-dollar-to-slot',
            title: 'Total Ingresos',
            value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(mockFinancialData.totalIncome),
            badgeText: '+8.5%',
            badgeColor: 'success'
        },
        {
            id: 'total-expenses',
            icon: 'money-bill-transfer',
            title: 'Total Egresos',
            value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(mockFinancialData.totalExpenses),
            badgeText: '+3.2%',
            badgeColor: 'warning'
        },
        {
            id: 'net-profit',
            icon: 'chart-line',
            title: 'Ganancia Neta',
            value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(mockFinancialData.netProfit),
            badgeText: '+12.4%',
            badgeColor: 'success'
        },
        {
            id: 'available-cash',
            icon: 'sack-dollar',
            title: 'Saldo Disponible',
            value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(mockFinancialData.availableCash),
            badgeText: '+5.8%',
            badgeColor: 'success'
        },
        {
            id: 'overdue-invoices',
            icon: 'file-invoice-dollar',
            title: 'Cuentas por Cobrar Vencidas',
            value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(mockFinancialData.overdueInvoices.amount),
            badgeText: `${mockFinancialData.overdueInvoices.count} facturas`,
            badgeColor: 'error'
        },
        {
            id: 'upcoming-payables',
            icon: 'calendar-day',
            title: 'Cuentas por Pagar Próximas',
            value: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(mockFinancialData.upcomingPayables.amount),
            badgeText: `${mockFinancialData.upcomingPayables.daysRemaining} días`,
            badgeColor: 'warning'
        }
    ];

    // Configuración de gráfico de líneas (Flujo de Caja)
    const cashFlowOptions: ApexOptions = {
        chart: {
            height: 350,
            type: 'line',
            toolbar: {
                show: false,
            },
            fontFamily: 'Outfit, sans-serif',
        },
        colors: ['#4F46E5', '#F97316'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: [3, 3],
            curve: 'smooth',
            dashArray: [0, 0],
        },
        xaxis: {
            categories: mockFinancialData.cashFlowData.map(item => item.month),
        },
        yaxis: {
            title: {
                text: 'Monto (MXN)',
            },
            labels: {
                formatter: (value) => {
                    return new Intl.NumberFormat('es-MX', { 
                        style: 'currency', 
                        currency: 'MXN',
                        maximumFractionDigits: 0 
                    }).format(value);
                }
            }
        },
        tooltip: {
            y: {
                formatter: (value) => {
                    return new Intl.NumberFormat('es-MX', { 
                        style: 'currency', 
                        currency: 'MXN' 
                    }).format(value);
                }
            }
        },
        legend: {
            position: 'top',
        },
        grid: {
            borderColor: '#E2E8F0',
        }
    };

    const cashFlowSeries = [
        {
            name: 'Ingresos',
            data: mockFinancialData.cashFlowData.map(item => item.income)
        },
        {
            name: 'Egresos',
            data: mockFinancialData.cashFlowData.map(item => item.expenses)
        }
    ];

    // Configuración de gráfico de barras (Comparativo Mensual)
    const monthlyComparisonOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false,
            },
            fontFamily: 'Outfit, sans-serif',
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        colors: ['#4F46E5', '#F97316'],
        xaxis: {
            categories: mockFinancialData.cashFlowData.map(item => item.month),
        },
        yaxis: {
            title: {
                text: 'Monto (MXN)'
            },
            labels: {
                formatter: (value) => {
                    return new Intl.NumberFormat('es-MX', { 
                        style: 'currency', 
                        currency: 'MXN',
                        maximumFractionDigits: 0 
                    }).format(value);
                }
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: (value) => {
                    return new Intl.NumberFormat('es-MX', { 
                        style: 'currency', 
                        currency: 'MXN' 
                    }).format(value);
                }
            }
        },
        legend: {
            position: 'top',
        }
    };

    const monthlyComparisonSeries = [
        {
            name: 'Ingresos',
            data: mockFinancialData.cashFlowData.map(item => item.income)
        },
        {
            name: 'Egresos',
            data: mockFinancialData.cashFlowData.map(item => item.expenses)
        }
    ];

    // Configuración de gráfico de barras (Aging de Cuentas por Cobrar)
    const agingReceivablesOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false,
            },
            fontFamily: 'Outfit, sans-serif',
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
                distributed: true,
            },
        },
        colors: ['#4F46E5', '#818CF8', '#F97316', '#FB923C'],
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: mockFinancialData.agingReceivables.map(item => item.range),
            labels: {
                formatter: (value) => {
                    return new Intl.NumberFormat('es-MX', { 
                        style: 'currency', 
                        currency: 'MXN',
                        maximumFractionDigits: 0 
                    }).format(Number(value));
                }
            }
        },
        yaxis: {
            title: {
                text: 'Rango de días'
            }
        },
        tooltip: {
            y: {
                formatter: (value) => {
                    return new Intl.NumberFormat('es-MX', { 
                        style: 'currency', 
                        currency: 'MXN' 
                    }).format(value);
                }
            }
        },
        legend: {
            show: false
        }
    };

    const agingReceivablesSeries = [
        {
            name: 'Monto',
            data: mockFinancialData.agingReceivables.map(item => item.amount)
        }
    ];

    // Columnas para las tablas
    const transactionsColumns: Column<any>[] = [
        { key: 'date', header: 'Fecha', width: '120px', render: (row: any) => new Date(row.date).toLocaleDateString('es-MX') },
        { key: 'type', header: 'Tipo', width: '130px' },
        { key: 'concept', header: 'Concepto' },
        { 
            key: 'amount', 
            header: 'Monto', 
            width: '150px',
            render: (row: any) => {
                const formattedAmount = new Intl.NumberFormat('es-MX', { 
                    style: 'currency', 
                    currency: 'MXN' 
                }).format(row.amount);
                return <span className={row.amount < 0 ? 'text-red-500' : 'text-green-500'}>{formattedAmount}</span>;
            } 
        },
        { 
            key: 'status', 
            header: 'Estado', 
            width: '120px',
            render: (row: any) => {
                let color: 'primary' | 'success' | 'error' | 'warning' = 'primary';
                
                if (row.status === 'Pagado' || row.status === 'Procesado') color = 'success';
                else if (row.status === 'Pendiente') color = 'warning';
                else if (row.status === 'Cancelado') color = 'error';
                
                return <Badge color={color}>{row.status}</Badge>;
            } 
        },
        { 
            key: 'actions', 
            header: 'Acciones', 
            width: '100px',
            render: () => (
                <div className="flex space-x-2">
                    <button type="button" className="text-blue-500 hover:text-blue-700">
                        <IconFA icon="eye" style="duotone" />
                    </button>
                    <button type="button" className="text-green-500 hover:text-green-700">
                        <IconFA icon="print" style="duotone" />
                    </button>
                </div>
            ) 
        }
    ];

    const upcomingPaymentsColumns: Column<any>[] = [
        { key: 'dueDate', header: 'Fecha Vencimiento', width: '150px', render: (row: any) => new Date(row.dueDate).toLocaleDateString('es-MX') },
        { key: 'concept', header: 'Concepto' },
        { 
            key: 'amount', 
            header: 'Monto', 
            width: '150px',
            render: (row: any) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(row.amount)
        },
        { 
            key: 'daysRemaining', 
            header: 'Días Restantes', 
            width: '130px',
            render: (row: any) => {
                let color: 'primary' | 'success' | 'error' | 'warning' = 'primary';
                
                if (row.daysRemaining > 10) color = 'success';
                else if (row.daysRemaining > 5) color = 'warning';
                else color = 'error';
                
                return <Badge color={color}>{row.daysRemaining} días</Badge>;
            }
        },
        { 
            key: 'actions', 
            header: 'Acciones', 
            width: '120px',
            render: () => (
                <div className="flex space-x-2">
                    <button type="button" className="text-green-500 hover:text-green-700">
                        <IconFA icon="check-circle" style="duotone" />
                    </button>
                    <button type="button" className="text-blue-500 hover:text-blue-700">
                        <IconFA icon="calendar-plus" style="duotone" />
                    </button>
                </div>
            ) 
        }
    ];

    const topDebtorsColumns: Column<any>[] = [
        { key: 'student', header: 'Estudiante' },
        { key: 'grade', header: 'Grado', width: '130px' },
        { 
            key: 'amount', 
            header: 'Monto Pendiente', 
            width: '160px',
            render: (row: any) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(row.amount)
        },
        { 
            key: 'invoiceCount', 
            header: 'Facturas', 
            width: '100px',
            render: (row: any) => <Badge color="error">{row.invoiceCount}</Badge>
        },
        { 
            key: 'actions', 
            header: 'Acciones', 
            width: '120px',
            render: () => (
                <div className="flex space-x-2">
                    <button type="button" className="text-blue-500 hover:text-blue-700">
                        <IconFA icon="envelope" style="duotone" />
                    </button>
                    <button type="button" className="text-green-500 hover:text-green-700">
                        <IconFA icon="phone" style="duotone" />
                    </button>
                </div>
            ) 
        }
    ];

    // Opciones para selectores
    const dateRangeOptions = [
        {
            label: 'Períodos',
            options: [
                { value: 'today', label: 'Hoy' },
                { value: 'week', label: 'Últimos 7 días' },
                { value: 'month', label: 'Mes en curso' },
                { value: 'custom', label: 'Personalizado' }
            ]
        }
    ];

    const schoolYearOptions = [
        {
            label: 'Ciclos Escolares',
            options: [
                { value: 'all', label: 'Todos los ciclos' },
                { value: '2023-2024', label: 'Ciclo 2023-2024' },
                { value: '2022-2023', label: 'Ciclo 2022-2023' },
                { value: '2021-2022', label: 'Ciclo 2021-2022' }
            ]
        }
    ];

    const transactionTypeOptions = [
        {
            label: 'Tipos de Transacción',
            options: [
                { value: 'all', label: 'Todas las transacciones' },
                { value: 'tuition', label: 'Colegiaturas' },
                { value: 'registration', label: 'Reinscripciones' },
                { value: 'payroll', label: 'Nómina' },
                { value: 'supplies', label: 'Material escolar' },
                { value: 'services', label: 'Servicios' },
                { value: 'other', label: 'Otros' }
            ]
        }
    ];

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <PageBreadcrumb pageTitle="Dashboard Financiero" />

            {/* Barra de filtros */}
            <div className="mb-6">
                <ComponentCard title="Filtros" className="p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Rango de Fecha
                            </label>
                            <SelectWithCategories
                                options={dateRangeOptions}
                                placeholder="Seleccione un rango"
                                onChange={setDateRange}
                                defaultValue={dateRange}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Ciclo Escolar
                            </label>
                            <SelectWithCategories
                                options={schoolYearOptions}
                                placeholder="Seleccione un ciclo"
                                onChange={setSchoolYear}
                                defaultValue={schoolYear}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tipo de Transacción
                            </label>
                            <SelectWithCategories
                                options={transactionTypeOptions}
                                placeholder="Seleccione un tipo"
                                onChange={setTransactionType}
                                defaultValue={transactionType}
                            />
                        </div>
                    </div>
                </ComponentCard>
            </div>

            {/* Accesos rápidos */}
            <div className="mb-6 flex flex-wrap gap-4">
                <Button
                    variant="primary"
                    className="flex items-center gap-2"
                    onClick={() => {}}
                >
                    <IconFA icon="file-invoice-dollar" style="duotone" />
                    <span>Generar Nueva Factura</span>
                </Button>
                <Button
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={() => {}}
                >
                    <IconFA icon="money-check-dollar-pen" style="duotone" />
                    <span>Procesar Nómina</span>
                </Button>
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {}}
                >
                    <IconFA icon="file-export" style="duotone" />
                    <span>Exportar Reporte</span>
                </Button>
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {}}
                >
                    <IconFA icon="gears" style="duotone" />
                    <span>Configurar Parámetros</span>
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="mb-6">
                <MetricsGroup
                    metricsConfig={metricsConfig}
                    isLoading={isLoading}
                />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                <ComponentCard title="Flujo de Caja" className="p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-[350px]">
                            <IconFA icon="spinner" spin className="text-gray-400" />
                        </div>
                    ) : (
                        <ReactApexChart
                            options={cashFlowOptions}
                            series={cashFlowSeries}
                            type="line"
                            height={350}
                        />
                    )}
                </ComponentCard>

                <ComponentCard title="Comparativo Mensual" className="p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-[350px]">
                            <IconFA icon="spinner" spin className="text-gray-400" />
                        </div>
                    ) : (
                        <ReactApexChart
                            options={monthlyComparisonOptions}
                            series={monthlyComparisonSeries}
                            type="bar"
                            height={350}
                        />
                    )}
                </ComponentCard>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
                <ComponentCard title="Aging de Cuentas por Cobrar" className="p-4 lg:col-span-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-[350px]">
                            <IconFA icon="spinner" spin className="text-gray-400" />
                        </div>
                    ) : (
                        <ReactApexChart
                            options={agingReceivablesOptions}
                            series={agingReceivablesSeries}
                            type="bar"
                            height={350}
                        />
                    )}
                </ComponentCard>

                <ComponentCard title="Métricas de Salud Financiera" className="p-4 lg:col-span-2">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                            <span className="text-sm text-gray-500">Días Promedio de Cobro</span>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">{mockFinancialData.financialMetrics.dso}</span>
                                <span className="ml-1 text-sm text-gray-500">días</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                            <span className="text-sm text-gray-500">Margen Operativo</span>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">{mockFinancialData.financialMetrics.operatingMargin}%</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                            <span className="text-sm text-gray-500">Cobertura de Nómina</span>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">{mockFinancialData.financialMetrics.payrollCoverageRatio}x</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                            <span className="text-sm text-gray-500">Tasa de Morosidad</span>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">{mockFinancialData.financialMetrics.delinquencyRate}%</span>
                            </div>
                        </div>
                    </div>
                </ComponentCard>
            </div>

            {/* Tablas detalladas */}
            <div className="grid grid-cols-1 gap-6 mb-6">
                <ComponentCard title="Últimas Transacciones" className="p-4">
                    <DataTable
                        data={mockFinancialData.recentTransactions}
                        columns={transactionsColumns}
                        keyExtractor={(item) => item.id.toString()}
                        isLoading={isLoading}
                        searchable
                        searchPlaceholder="Buscar transacciones..."
                    />
                </ComponentCard>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                <ComponentCard title="Próximos Vencimientos" className="p-4">
                    <DataTable
                        data={mockFinancialData.upcomingPayments}
                        columns={upcomingPaymentsColumns}
                        keyExtractor={(item) => item.id.toString()}
                        isLoading={isLoading}
                        searchable
                        searchPlaceholder="Buscar vencimientos..."
                    />
                </ComponentCard>

                <ComponentCard title="Top 5 Deudores" className="p-4">
                    <DataTable
                        data={mockFinancialData.topDebtors}
                        columns={topDebtorsColumns}
                        keyExtractor={(item) => item.id.toString()}
                        isLoading={isLoading}
                        searchable
                        searchPlaceholder="Buscar deudores..."
                    />
                </ComponentCard>
            </div>

            {/* Panel de Alertas */}
            <div className="mb-6">
                <ComponentCard title="Alertas y Recordatorios" className="p-4">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                            <div className="flex-shrink-0">
                                <IconFA icon="triangle-exclamation" size="xl" className="text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Alerta: Nómina pendiente</h3>
                                <p className="text-red-700 dark:text-red-300">El proceso de nómina quincenal vence en 2 días y aún no ha sido procesado.</p>
                            </div>
                            <div className="ml-auto">
                                <Button
                                    variant="danger"
                                    className="flex items-center gap-2"
                                    onClick={() => {}}
                                >
                                    <span>Procesar ahora</span>
                                </Button>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                            <div className="flex-shrink-0">
                                <IconFA icon="bell" size="xl" className="text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400">Recordatorio: Facturas mensuales</h3>
                                <p className="text-amber-700 dark:text-amber-300">Las facturas de colegiatura del mes siguiente deben generarse en los próximos 5 días.</p>
                            </div>
                            <div className="ml-auto">
                                <Button
                                    variant="warning"
                                    className="flex items-center gap-2"
                                    onClick={() => {}}
                                >
                                    <span>Programar</span>
                                </Button>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                            <div className="flex-shrink-0">
                                <IconFA icon="info-circle" size="xl" className="text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400">Información: Conciliación bancaria</h3>
                                <p className="text-blue-700 dark:text-blue-300">Es recomendable realizar la conciliación bancaria del mes en curso.</p>
                            </div>
                            <div className="ml-auto">
                                <Button
                                    variant="info"
                                    className="flex items-center gap-2"
                                    onClick={() => {}}
                                >
                                    <span>Iniciar</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </div>
    );
} 