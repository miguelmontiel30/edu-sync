import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import DataTable from '@/components/core/table/DataTable';
import Badge from '@/components/core/badge/Badge';
import IconFA from '@/components/ui/IconFA';
import { Column } from '@/components/core/table/module-utils/types';

interface Debtor {
    id: number;
    student: string;
    grade: string;
    amount: number;
    invoiceCount: number;
}

interface TopDebtorsTableProps {
    debtors: Debtor[];
    isLoading: boolean;
}

const TopDebtorsTable: React.FC<TopDebtorsTableProps> = ({ debtors, isLoading }) => {
    // Columnas para la tabla de deudores
    const debtorsColumns: Column<Debtor>[] = [
        { key: 'student', header: 'Estudiante' },
        { key: 'grade', header: 'Grado', width: '130px' },
        { 
            key: 'amount', 
            header: 'Monto Pendiente', 
            width: '160px',
            render: (row: Debtor) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(row.amount)
        },
        { 
            key: 'invoiceCount', 
            header: 'Facturas', 
            width: '100px',
            render: (row: Debtor) => <Badge color="error">{row.invoiceCount}</Badge>
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

    return (
        <ComponentCard title="Top 5 Deudores" className="p-4">
            <DataTable
                data={debtors}
                columns={debtorsColumns}
                keyExtractor={(item) => item.id.toString()}
                isLoading={isLoading}
                searchable
                searchPlaceholder="Buscar deudores..."
            />
        </ComponentCard>
    );
};

export default TopDebtorsTable; 