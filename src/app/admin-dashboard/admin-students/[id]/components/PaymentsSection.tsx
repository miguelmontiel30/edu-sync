import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/core/table';
import Badge from '@/components/core/badge/Badge';
import { Payment } from '../module-utils/types';

interface PaymentsSectionProps {
    payments: Payment[];
}

const PaymentsSection: React.FC<PaymentsSectionProps> = ({ payments }) => (
    <ComponentCard
        title="Pagos de Colegiatura"
        desc="Historial de pagos realizados"
    >
        <Table>
            <TableHeader>
                <TableRow>
                    <TableCell isHeader>Mes</TableCell>
                    <TableCell isHeader>Monto</TableCell>
                    <TableCell isHeader>Fecha de Pago</TableCell>
                    <TableCell isHeader>Estado</TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {payments.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                            No hay pagos registrados
                        </TableCell>
                    </TableRow>
                ) : (
                    payments.map(payment => (
                        <TableRow key={payment.id}>
                            <TableCell>{payment.month}</TableCell>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell>
                                {payment.payment_date
                                    ? new Date(payment.payment_date).toLocaleDateString('es-MX')
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    color={
                                        payment.status === 'paid' ? 'success' :
                                            payment.status === 'pending' ? 'warning' : 'error'
                                    }
                                >
                                    {payment.status === 'paid' ? 'Pagado' :
                                        payment.status === 'pending' ? 'Pendiente' : 'Vencido'}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    </ComponentCard>
);

export default PaymentsSection; 