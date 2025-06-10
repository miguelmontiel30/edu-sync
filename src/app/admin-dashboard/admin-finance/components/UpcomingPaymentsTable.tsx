import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import DataTable from '@/components/core/table/DataTable';
import Badge from '@/components/core/badge/Badge';
import IconFA from '@/components/ui/IconFA';
import { Column } from '@/components/core/table/module-utils/types';

interface Payment {
    id: number;
    dueDate: string;
    concept: string;
    amount: number;
    daysRemaining: number;
}

interface UpcomingPaymentsTableProps {
    payments: Payment[];
    isLoading: boolean;
}

const UpcomingPaymentsTable: React.FC<UpcomingPaymentsTableProps> = ({ payments, isLoading }) => {
    // Columnas para la tabla de pagos próximos
    const paymentsColumns: Column<Payment>[] = [
        { 
            key: 'dueDate', 
            header: 'Fecha Vencimiento', 
            width: '150px', 
            render: (row: Payment) => new Date(row.dueDate).toLocaleDateString('es-MX') 
        },
        { key: 'concept', header: 'Concepto' },
        { 
            key: 'amount', 
            header: 'Monto', 
            width: '150px',
            render: (row: Payment) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(row.amount)
        },
        { 
            key: 'daysRemaining', 
            header: 'Días Restantes', 
            width: '130px',
            render: (row: Payment) => {
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

    return (
        <ComponentCard title="Próximos Vencimientos" className="p-4">
            <DataTable
                data={payments}
                columns={paymentsColumns}
                keyExtractor={(item) => item.id.toString()}
                isLoading={isLoading}
                searchable
                searchPlaceholder="Buscar vencimientos..."
            />
        </ComponentCard>
    );
};

export default UpcomingPaymentsTable;