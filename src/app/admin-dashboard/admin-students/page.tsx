'use client';

// React
import { useMemo } from 'react';
// Next
import { useRouter } from 'next/navigation';

// Components
import StudentFormModal from './components/StudentFormModal';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

// Core
import Alert from '@/components/core/alert/Alert';
import MetricsGroup from '../core/Metrics/MetricsGroup';
import BarChartsGroup from '../core/BarCharts/BarChartsGroup';
import DeleteConfirmModal from '../core/Modals/DeleteConfirmModal';
import MetricsChartsWrapper from '@/components/core/metrics/MetricsChartsWrapper';
import DeletedItemsList from '../core/Tables/DeletedItemsList';
import ItemsList from '../core/Tables/ItemsList';

// Hooks
import {
    useStudentManagement,
    useMetricsConfig,
    useTableConfig
} from './hooks';


export default function StudentsDashboard() {
    const router = useRouter();
    
    // Usar hook principal para gestión de estudiantes
    const {
        students,
        deletedStudents,
        studentGroups,
        isModalOpen,
        isDeleteModalOpen,
        selectedStudent,
        studentToDelete,
        errorAlert,
        loadingState,
        handleEdit,
        handleDelete,
        confirmDelete,
        openModal,
        closeModal,
        setIsDeleteModalOpen,
        handleSaveStudent,
        handleRestore
    } = useStudentManagement();

    // Configuración de métricas y gráficos
    const { metricsConfig, chartConfigs } = useMetricsConfig(students, studentGroups);

    // Adaptar los datos de estudiantes para el componente de gráficos
    const chartData = useMemo(() => {
        // Verificar si hay estudiantes
        if (!students || students.length === 0) {
            // Devolvemos datos mínimos necesarios
            return [
                {
                    id: 0,
                    name: 'Sin datos',
                    full_name: 'Sin datos',
                    status_id: 0,
                    gender_id: 0
                }
            ];
        }

        // Tenemos estudiantes, los mapeamos con solo las propiedades necesarias
        return students.map(student => ({
            ...student,
            name: student.full_name || 'Sin nombre'
        }));
    }, [students]);

    // Configuraciones de tablas
    const {
        studentColumns,
        studentActionButtons,
        studentListConfig,
        deletedStudentListConfig,
        deleteConfirmModalConfig
    } = useTableConfig({
        handleEdit,
        handleDelete,
        students
    });

    // Navegar al perfil del estudiante
    const handleRowClick = (student: any) => {
        router.push(`/admin-dashboard/admin-students/${student.id}`);
    };

    return (
        <div className="mx-auto max-w-screen-2xl md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Estudiantes" />

            {/* Error Alert */}
            {errorAlert && (
                <Alert
                    title={errorAlert.title}
                    message={errorAlert.message}
                    variant="error"
                />
            )}

            {/* Metrics and Charts Wrapper */}
            <MetricsChartsWrapper title="Estadísticas y Gráficos de Estudiantes">
                <MetricsGroup
                    metricsConfig={metricsConfig}
                    isLoading={loadingState.metrics}
                    isEmpty={students.length === 0}
                    emptyMessage="No hay estudiantes registrados"
                />

                <BarChartsGroup
                    data={chartData}
                    isLoading={loadingState.students}
                    charts={chartConfigs}
                    emptyMessage="No hay suficientes datos para mostrar gráficas"
                />
            </MetricsChartsWrapper>

            {/* Students List */}
            <ItemsList
                items={students}
                columns={studentColumns}
                isLoading={loadingState.students}
                onAddNew={openModal}
                onRowClick={handleRowClick}
                config={studentListConfig}
                actionButtons={studentActionButtons}
            />

            {/* Deleted Students */}
            <DeletedItemsList
                className="mt-6"
                items={deletedStudents}
                onRestore={handleRestore}
                isLoading={loadingState.deleted}
                config={deletedStudentListConfig}
            />

            {/* Form Modal */}
            <StudentFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveStudent}
                selectedStudent={selectedStudent}
                isSaving={loadingState.processing}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={studentToDelete?.full_name || ''}
                itemType="estudiante"
                isDeleting={loadingState.processing}
                isActiveItem
                customMessages={deleteConfirmModalConfig}
            />
        </div>
    );
} 