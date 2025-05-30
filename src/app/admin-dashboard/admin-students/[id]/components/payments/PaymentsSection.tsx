import React from 'react';
import { Payment } from '../../module-utils/types';
import ComponentCard from '@/components/common/ComponentCard';
import IconFA from '@/components/ui/IconFA';

interface PaymentsSectionProps {
    payments: Payment[];
}

const PaymentsSection: React.FC<PaymentsSectionProps> = ({ payments }) => {
    return (
        <ComponentCard title="Pagos Recientes" desc="Últimos pagos registrados del estudiante">
            <div className="space-y-2 p-4">
                {payments && payments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Concepto</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monto</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                {payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{payment.month || payment.concept}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('es-MX') :
                                                new Date(payment.date || new Date()).toLocaleDateString('es-MX')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${payment.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${payment.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                {payment.status === 'paid' ? 'Pagado' :
                                                    payment.status === 'pending' ? 'Pendiente' :
                                                        'Vencido'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <IconFA icon="receipt" className="text-gray-300 dark:text-gray-600 text-3xl mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">No hay pagos registrados</p>
                    </div>
                )}
            </div>
        </ComponentCard>
    );
};

export default PaymentsSection; 