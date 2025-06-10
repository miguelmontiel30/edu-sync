'use client';

import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';

interface Payment {
    id: string;
    studentName: string;
    concept: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    status: 'paid' | 'pending' | 'overdue';
}

interface PaymentsMadeTableProps {
    payments: Payment[];
    groupId: string;
    isLoading: boolean;
}

// Datos de ejemplo para la tabla
const mockPayments: Payment[] = [
    {
        id: 'p001',
        studentName: 'Juan Pérez García',
        concept: 'Colegiatura Agosto',
        amount: 2500,
        paymentDate: '2023-08-05',
        paymentMethod: 'Transferencia',
        status: 'paid'
    },
    {
        id: 'p002',
        studentName: 'María López Sánchez',
        concept: 'Materiales escolares',
        amount: 750,
        paymentDate: '2023-08-03',
        paymentMethod: 'Efectivo',
        status: 'paid'
    },
    {
        id: 'p003',
        studentName: 'Carlos Rodríguez Flores',
        concept: 'Colegiatura Agosto',
        amount: 2500,
        paymentDate: '2023-08-01',
        paymentMethod: 'Tarjeta',
        status: 'paid'
    },
    {
        id: 'p004',
        studentName: 'Ana Martínez Vega',
        concept: 'Inscripción',
        amount: 5000,
        paymentDate: '2023-07-28',
        paymentMethod: 'Transferencia',
        status: 'paid'
    },
    {
        id: 'p005',
        studentName: 'Roberto Sánchez Díaz',
        concept: 'Transporte Agosto',
        amount: 800,
        paymentDate: '2023-08-02',
        paymentMethod: 'Efectivo',
        status: 'paid'
    }
];

export default function PaymentsMadeTable({ payments = mockPayments, groupId: _groupId, isLoading }: PaymentsMadeTableProps) {
    // Formato de moneda para cantidades
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    // Formato de fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const tableHeader = (
        <div className="flex justify-between items-center w-full">
            <div className="text-lg font-semibold">
                Pagos realizados - {mockPayments.length} registros
            </div>
            <Button variant="primary" size="sm">
                <IconFA icon="file-export" className="mr-2" />
                Exportar
            </Button>
        </div>
    );

    return (
        <ComponentCard
            title={tableHeader}
            className="shadow-md"
        >
            <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Estudiante
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Concepto
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Importe
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Fecha de pago
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Método de pago
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Cargando...
                                </td>
                            </tr>
                        ) : payments.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No hay pagos registrados para este grupo
                                </td>
                            </tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {payment.studentName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {payment.concept}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatCurrency(payment.amount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(payment.paymentDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {payment.paymentMethod}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Pagado
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="px-2 py-1"
                                            >
                                                <IconFA icon="eye" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="px-2 py-1"
                                            >
                                                <IconFA icon="print" />
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