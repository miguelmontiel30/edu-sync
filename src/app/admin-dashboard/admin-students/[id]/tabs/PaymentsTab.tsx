import React from 'react';
import PaymentsSection from '../components/payments/PaymentsSection';
import { Payment } from '../module-utils/types';
import ComponentCard from '@/components/common/ComponentCard';

interface PaymentsTabProps {
    payments: Payment[];
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ payments }) => {
    return (
        <div className="grid grid-cols-1 gap-6">
            {/* Pagos recientes */}
            <PaymentsSection payments={payments} />

            {/* Historial completo de pagos */}
            <ComponentCard title="Historial Completo de Pagos" desc="Registro de todos los pagos realizados">
                <p className="text-gray-500 dark:text-gray-400 p-4">
                    Aquí se mostraría un historial completo de todos los pagos realizados por el estudiante,
                    incluyendo matrículas, mensualidades, servicios adicionales y otros conceptos.
                </p>
            </ComponentCard>
        </div>
    );
};

export default PaymentsTab; 