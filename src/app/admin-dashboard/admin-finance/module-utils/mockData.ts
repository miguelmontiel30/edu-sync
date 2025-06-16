// Datos de ejemplo para el dashboard financiero
export const mockFinancialData = {
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