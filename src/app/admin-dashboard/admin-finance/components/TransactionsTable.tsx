import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import DataTable from '@/components/core/table/DataTable';
import Badge from '@/components/core/badge/Badge';
import IconFA from '@/components/ui/IconFA';
import { Column } from '@/components/core/table/module-utils/types';

interface Transaction {
    id: number;
    date: string;
    type: string;
    concept: string;
    amount: number;
    status: string;
}

interface TransactionsTableProps {
    transactions: Transaction[];
    isLoading: boolean;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, isLoading }) => {
    // Columnas para la tabla de transacciones
    const transactionsColumns: Column<Transaction>[] = [
        { 
            key: 'date', 
            header: 'Fecha', 
            width: '120px', 
            render: (row: Transaction) => new Date(row.date).toLocaleDateString('es-MX') 
        },
        { key: 'type', header: 'Tipo', width: '130px' },
        { key: 'concept', header: 'Concepto' },
        { 
            key: 'amount', 
            header: 'Monto', 
            width: '150px',
            render: (row: Transaction) => {
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
            render: (row: Transaction) => {
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
                    <button className="text-blue-500 hover:text-blue-700">
                        <IconFA icon="eye" style="duotone" />
                    </button>
                    <button className="text-green-500 hover:text-green-700">
                        <IconFA icon="print" style="duotone" />
                    </button>
                </div>
            ) 
        }
    ];

    return (
        <ComponentCard title="Últimas Transacciones" className="p-4">
            <DataTable
                data={transactions}
                columns={transactionsColumns}
                keyExtractor={(item) => item.id.toString()}
                isLoading={isLoading}
                searchable={true}
                searchPlaceholder="Buscar transacciones..."
            />
        </ComponentCard>
    );
};

export default TransactionsTable; 