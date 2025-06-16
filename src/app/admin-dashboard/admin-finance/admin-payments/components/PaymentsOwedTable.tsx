'use client';

import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';

interface PaymentOwed {
    id: string;
    studentName: string;
    concept: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'overdue';
    daysOverdue?: number;
}

interface PaymentsOwedTableProps {
    paymentsOwed: PaymentOwed[];
    groupId: string;
    isLoading: boolean;
}

// Datos de ejemplo para la tabla
const mockPaymentsOwed: PaymentOwed[] = [
    {
        id: 'po001',
        studentName: 'Luis González Torres',
        concept: 'Colegiatura Septiembre',
        amount: 2500,
        dueDate: '2023-09-10',
        status: 'pending',
    },
    {
        id: 'po002',
        studentName: 'Patricia Ramírez Ortega',
        concept: 'Colegiatura Agosto',
        amount: 2500,
        dueDate: '2023-08-10',
        status: 'overdue',
        daysOverdue: 25,
    },
    {
        id: 'po003',
        studentName: 'Alejandro Castro Medina',
        concept: 'Inscripción',
        amount: 5000,
        dueDate: '2023-08-20',
        status: 'overdue',
        daysOverdue: 15,
    },
    {
        id: 'po004',
        studentName: 'Sofía Torres Luna',
        concept: 'Materiales escolares',
        amount: 750,
        dueDate: '2023-09-05',
        status: 'pending',
    },
];

export default function PaymentsOwedTable({
    paymentsOwed = mockPaymentsOwed,
    groupId: _groupId,
    isLoading,
}: PaymentsOwedTableProps) {
    // Formato de moneda para cantidades
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
    };

    // Formato de fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    const tableHeader = (
        <div className="flex w-full items-center justify-between">
            <div className="text-lg font-semibold">
                Pagos pendientes - {mockPaymentsOwed.length} registros
            </div>
            <Button variant="primary" size="sm">
                <IconFA icon="file-export" className="mr-2" />
                Exportar
            </Button>
        </div>
    );

    return (
        <ComponentCard title={tableHeader} className="shadow-md">
            <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                            >
                                Estudiante
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                            >
                                Concepto
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                            >
                                Importe
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                            >
                                Fecha límite
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                            >
                                Estado
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                            >
                                Días vencido
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                            >
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                                >
                                    Cargando...
                                </td>
                            </tr>
                        ) : paymentsOwed.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                                >
                                    No hay pagos pendientes para este grupo
                                </td>
                            </tr>
                        ) : (
                            paymentsOwed.map(payment => (
                                <tr key={payment.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {payment.studentName}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {payment.concept}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {formatCurrency(payment.amount)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(payment.dueDate)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {payment.status === 'pending' ? (
                                            <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs font-semibold leading-5 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                Pendiente
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                Vencido
                                            </span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {payment.daysOverdue ? (
                                            <span className="font-medium text-red-600">
                                                {payment.daysOverdue} días
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="px-3 py-1"
                                            >
                                                <IconFA icon="money-bill" className="mr-2" />
                                                Registrar pago
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="px-2 py-1"
                                            >
                                                <IconFA icon="envelope" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </ComponentCard>
    );
}
