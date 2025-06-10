'use client';

// Components
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';

// Core
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';

// Module Components
import GroupSelector from './components/GroupSelector';
import PaymentsMadeTable from './components/PaymentsMadeTable';
import PaymentsOwedTable from './components/PaymentsOwedTable';
import FiltersBar from './components/FiltersBar';

// Hooks
import { usePaymentsData } from './hooks/usePaymentsData';
import { useRouter } from 'next/navigation';

export default function PaymentsManagementPage() {
    const router = useRouter();
    const {
        paymentsData,
        selectedGroup,
        isLoading,
        handleGroupChange,
        filters,
        handleFilterChange
    } = usePaymentsData();

    const handleGeneratePayment = () => {
        router.push('/admin-dashboard/admin-finance/admin-payments/generate-payment');
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <PageBreadcrumb pageTitle="Gestión de Pagos" />

            {/* Barra de filtros */}
            <div className="mb-6">
                <FiltersBar 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    isLoading={isLoading}
                />
            </div>

            {/* Botón para generar pagos */}
            <div className="mb-6 flex justify-end">
                <Button 
                    variant="primary" 
                    onClick={handleGeneratePayment}
                >
                    <IconFA icon="plus" className="mr-2" />
                    Generar pago
                </Button>
            </div>

            {/* Selector de grupo */}
            <div className="mb-6">
                <ComponentCard 
                    title="Seleccionar Grupo"
                    className="shadow-md p-4"
                >
                    <GroupSelector 
                        selectedGroup={selectedGroup}
                        onGroupChange={handleGroupChange}
                        isLoading={isLoading}
                    />
                </ComponentCard>
            </div>

            {selectedGroup && (
                <>
                    {/* Tabla de pagos realizados */}
                    <div className="mb-6">
                        <PaymentsMadeTable 
                            payments={paymentsData.paymentsMade}
                            groupId={selectedGroup}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Tabla de pagos adeudados */}
                    <div className="mb-6">
                        <PaymentsOwedTable 
                            paymentsOwed={paymentsData.paymentsOwed}
                            groupId={selectedGroup}
                            isLoading={isLoading}
                        />
                    </div>
                </>
            )}
        </div>
    );
} 