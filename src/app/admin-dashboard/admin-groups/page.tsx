'use client';

// Components
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Alert from '@/components/core/alert/Alert';

// Hooks
import { useGroupManagement, useMetricsConfig, useTableConfig } from './hooks';

// Types
import { GROUP_STATUS } from './module-utils/types';

// Components
import ItemsList from '../core/Tables/ItemsList';
import MetricsGroup from '../core/Metrics/MetricsGroup';
import GroupFormModal from './components/GroupFormModal';
import DeletedItemsList from '../core/Tables/DeletedItemsList';
import DeleteConfirmModal from '../core/Modals/DeleteConfirmModal';
import BarChartsGroup, { ChartData } from '../core/BarCharts/BarChartsGroup';
import MetricsChartsWrapper from '@/components/core/metrics/MetricsChartsWrapper';

export default function GroupDashboard() {
    // Usar hook principal para gestión de grupos
    const {
        groups,
        deletedGroups,
        schoolYears,
        isModalOpen,
        isDeleteModalOpen,
        selectedGroup,
        groupToDelete,
        errorAlert,
        loadingState,
        handleEdit,
        handleDelete,
        confirmDelete,
        openModal,
        closeModal,
        setIsDeleteModalOpen,
        handleSaveGroup,
        handleRestore
    } = useGroupManagement();

    // Configuración de métricas y gráficos
    const { metricsConfig, chartConfigs } = useMetricsConfig(groups);

    // Configuraciones de tablas
    const {
        groupColumns,
        groupActionButtons,
        groupListConfig,
        deletedGroupListConfig,
        deleteConfirmModalConfig
    } = useTableConfig({ handleEdit, handleDelete });

    // Adaptar los grupos al formato ChartData para los gráficos
    const chartGroups: ChartData[] = groups.map(group => ({
        id: group.id,
        name: `${group.grade}° ${group.group}`,
        studentsNumber: group.studentsNumber,
        generalAverage: group.generalAverage,
        status: group.status_id
    }));

    return (
        <div className="mx-auto max-w-screen-2xl md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Grupos" />

            {/* Error Alert - Solo mostrar errores que no sean del formulario */}
            {errorAlert && !isModalOpen && (
                <Alert
                    title={errorAlert.title}
                    message={errorAlert.message}
                    variant="error"
                />
            )}

            {/* Metrics and Charts Wrapper */}
            <MetricsChartsWrapper title="Estadísticas y Gráficos de Grupos">
                <MetricsGroup
                    metricsConfig={metricsConfig}
                    isLoading={loadingState.metrics}
                    isEmpty={groups.length === 0}
                    emptyMessage="No hay grupos activos"
                />

                <BarChartsGroup
                    data={chartGroups}
                    isLoading={loadingState.groups}
                    charts={chartConfigs}
                />
            </MetricsChartsWrapper>

            {/* Groups List */}
            <ItemsList
                items={groups}
                columns={groupColumns}
                isLoading={loadingState.groups}
                onAddNew={openModal}
                config={groupListConfig}
                actionButtons={groupActionButtons}
            />

            {/* Deleted Groups */}
            <DeletedItemsList
                className="mt-6"
                items={deletedGroups}
                onRestore={handleRestore}
                isLoading={loadingState.deleted}
                config={deletedGroupListConfig}
            />

            {/* Form Modal */}
            <GroupFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveGroup}
                selectedGroup={selectedGroup}
                isSaving={loadingState.processing}
                schoolYears={schoolYears}
                errorAlert={isModalOpen ? errorAlert : null}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen && !!groupToDelete}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={groupToDelete ? `${groupToDelete.grade}° ${groupToDelete.group}` : ''}
                itemType="grupo"
                isDeleting={loadingState.processing}
                isActiveItem={groupToDelete?.status_id === GROUP_STATUS.ACTIVE}
                customMessages={deleteConfirmModalConfig}
            />
        </div>
    );
}
