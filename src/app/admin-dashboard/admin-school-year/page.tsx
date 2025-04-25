'use client';

// Components
import CycleFormModal from './components/CycleFormModal';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

// Core
import Alert from '@/components/core/alert/Alert';
import MetricsGroup from '../core/Metrics/MetricsGroup';
import BarChartsGroup from '../core/BarCharts/BarChartsGroup';
import DeleteConfirmModal from '../core/Modals/DeleteConfirmModal';
import MetricsChartsWrapper from '@/components/core/metrics/MetricsChartsWrapper';
import DeletedItemsList from '../core/Tables/DeletedItemsList';
import ItemsList from '../core/Tables/ItemsList';

// Types
import { CYCLE_STATUS } from './module-utils/types';

// Hooks
import {
    useCycleManagement,
    useMetricsConfig,
    useTableConfig
} from './hooks';

export default function SchoolYearDashboard() {
    // Usar hook principal para gestión de ciclos
    const {
        cycles,
        deletedCycles,
        isModalOpen,
        isDeleteModalOpen,
        selectedCycle,
        cycleToDelete,
        errorAlert,
        loadingState,
        handleEdit,
        handleDelete,
        confirmDelete,
        openModal,
        closeModal,
        setIsDeleteModalOpen,
        handleSaveCycle,
        handleRestore
    } = useCycleManagement();

    // Configuración de métricas y gráficos
    const { metricsConfig, chartConfigs } = useMetricsConfig(cycles);

    // Configuraciones de tablas
    const {
        cycleColumns,
        cycleActionButtons,
        cycleListConfig,
        deletedCycleListConfig,
        deleteConfirmModalConfig
    } = useTableConfig({ handleEdit, handleDelete });

    return (
        <div className="mx-auto max-w-screen-2xl md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Ciclos escolares" />

            {/* Error Alert */}
            {errorAlert && (
                <Alert
                    title={errorAlert.title}
                    message={errorAlert.message}
                    variant="error"
                />
            )}

            {/* Metrics and Charts Wrapper */}
            <MetricsChartsWrapper title="Estadísticas y Gráficos de Ciclos Escolares">
                <MetricsGroup
                    metricsConfig={metricsConfig}
                    isLoading={loadingState.metrics}
                    isEmpty={cycles.length === 0}
                    emptyMessage="No hay ciclos activos"
                />

                <BarChartsGroup
                    data={cycles}
                    isLoading={loadingState.cycles}
                    charts={chartConfigs}
                />
            </MetricsChartsWrapper>

            {/* Cycle List */}
            <ItemsList
                items={cycles}
                columns={cycleColumns}
                isLoading={loadingState.cycles}
                onAddNew={openModal}
                config={cycleListConfig}
                actionButtons={cycleActionButtons}
            />

            {/* Deleted Cycles */}
            <DeletedItemsList
                className="mt-6"
                items={deletedCycles}
                onRestore={handleRestore}
                isLoading={loadingState.deleted}
                config={deletedCycleListConfig}
            />

            {/* Form Modal */}
            <CycleFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveCycle}
                selectedCycle={selectedCycle}
                isSaving={loadingState.processing}
                currentCycles={cycles}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={cycleToDelete?.name || ''}
                itemType="ciclo"
                isDeleting={loadingState.processing}
                isActiveItem={cycleToDelete?.status === CYCLE_STATUS.ACTIVE}
                customMessages={deleteConfirmModalConfig}
            />
        </div>
    );
}
