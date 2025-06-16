// Tipos para el módulo financiero

export interface FinancialData {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    availableCash: number;
    overdueInvoices: {
        amount: number;
        count: number;
    };
    upcomingPayables: {
        amount: number;
        daysRemaining: number;
    };
    cashFlowData: CashFlowItem[];
    agingReceivables: AgingReceivable[];
    recentTransactions: Transaction[];
    upcomingPayments: Payment[];
    topDebtors: Debtor[];
    financialMetrics: FinancialMetrics;
}

export interface CashFlowItem {
    month: string;
    income: number;
    expenses: number;
}

export interface AgingReceivable {
    range: string;
    amount: number;
}

export interface Transaction {
    id: number;
    date: string;
    type: string;
    concept: string;
    amount: number;
    status: string;
}

export interface Payment {
    id: number;
    dueDate: string;
    concept: string;
    amount: number;
    daysRemaining: number;
}

export interface Debtor {
    id: number;
    student: string;
    grade: string;
    amount: number;
    invoiceCount: number;
}

export interface FinancialMetrics {
    dso: number; // Days Sales Outstanding (días promedio de cobro)
    operatingMargin: number; // Margen operativo
    payrollCoverageRatio: number; // Ratio de cobertura de nómina
    delinquencyRate: number; // Tasa de morosidad
}

export interface FinancialFilters {
    dateRange: string;
    schoolYear: string;
    transactionType: string;
} 