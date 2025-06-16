'use client';

// Components
import ItemsList from '../core/Tables/ItemsList';
import Alert from '@/components/core/alert/Alert';
import MetricsGroup from '../core/Metrics/MetricsGroup';
import SubjectFormModal from './components/SubjectFormModal';
import BarChartsGroup from '../core/BarCharts/BarChartsGroup';
import DeletedItemsList from '../core/Tables/DeletedItemsList';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import DeleteConfirmModal from '../core/Modals/DeleteConfirmModal';
import MetricsChartsWrapper from '@/components/core/metrics/MetricsChartsWrapper';

// Hooks
import { useMetricsConfig, useSubjectManagement, useTableConfig } from './hooks';

export default function AdminSubjectsDashboard() {
    // Subject Management
    const {
        subjects,
        deletedSubjects,
        isModalOpen,
        isDeleteModalOpen,
        selectedSubject,
        subjectToDelete,
        errorAlert,
        loadingState,
        handleEdit,
        handleDelete,
        confirmDelete,
        openModal,
        closeModal,
        setIsDeleteModalOpen,
        handleSaveSubject,
        handleRestore,
    } = useSubjectManagement();

    // Metrics
    const { metricsConfig, chartConfigs } = useMetricsConfig(subjects);

    // Table Configs
    const {
        deletedSubjectListConfig,
        deleteConfirmModalConfig,
        subjectColumns,
        subjectActionButtons,
        subjectListConfig,
    } = useTableConfig({
        handleEdit,
        handleDelete,
    });

    // Cerrar el modal de confirmación de eliminación
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    return (
        <div className="mx-auto max-w-screen-2xl md:p-6">
            <PageBreadcrumb pageTitle="Gestión de materias" />

            {/* Error Alert */}
            {errorAlert && (
                <Alert title={errorAlert.title} message={errorAlert.message} variant="error" />
            )}

            {/* Metrics and Charts Wrapper */}
            <MetricsChartsWrapper title="Estadísticas y Gráficos de Materias">
                <MetricsGroup
                    metricsConfig={metricsConfig}
                    isLoading={loadingState.metrics}
                    isEmpty={subjects.length === 0}
                    emptyMessage="No hay materias activas"
                />

                <BarChartsGroup
                    data={subjects}
                    isLoading={loadingState.subjects}
                    charts={chartConfigs}
                />
            </MetricsChartsWrapper>

            {/* Table */}
            <ItemsList
                items={subjects}
                columns={subjectColumns}
                actionButtons={subjectActionButtons}
                isLoading={loadingState.subjects}
                onAddNew={openModal}
                config={subjectListConfig}
            />

            {/* Lista de materias eliminadas */}
            <DeletedItemsList
                className="mt-6"
                items={deletedSubjects}
                onRestore={handleRestore}
                isLoading={loadingState.deleted}
                config={deletedSubjectListConfig}
            />

            {/* Formulario de Materia */}
            <SubjectFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveSubject}
                selectedSubject={selectedSubject}
                isSaving={loadingState.processing}
            />

            {/* Modal de confirmación de eliminación */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                itemName={subjectToDelete?.name || ''}
                itemType="materia"
                isDeleting={loadingState.processing}
                customMessages={{
                    title: deleteConfirmModalConfig.title,
                    confirmation: deleteConfirmModalConfig.confirmation,
                    recoveryInfo: deleteConfirmModalConfig.recoveryInfo,
                    warningTitle: deleteConfirmModalConfig.warningTitle,
                    warningMessage: deleteConfirmModalConfig.warningMessage,
                    errorTitle: deleteConfirmModalConfig.errorTitle,
                    errorMessage: deleteConfirmModalConfig.errorMessage,
                }}
            />
        </div>
    );
}
