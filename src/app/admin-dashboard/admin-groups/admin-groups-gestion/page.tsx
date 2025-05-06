'use client';
// Components
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import AssignGroupStudentsModal from './components/AssignGroupStudentsModal';

// Hooks
import { useGroupStudentsManagement, useTableConfig } from './hooks/index';

// Core Components
import ItemsList from '../../core/Tables/ItemsList';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';

export default function GroupStudentsDashboard() {
    // Estado de gestión de grupos y estudiantes
    const {
        selectedGroup,
        groupCategories,
        loadingState,
        isModalOpen,
        groupStudents,
        availableStudents,
        handleModalOpen,
        handleModalClose,
        handleGroupChange,
        handleDeleteStudent,
        handleAddStudents
    } = useGroupStudentsManagement();

    // Configuración de tabla de estudiantes
    const {
        studentColumns,
        studentActionButtons,
        studentListConfig,
    } = useTableConfig({
        handleDelete: handleDeleteStudent,
        selectedGroup
    });

    return (
        <div className="container mx-auto p-6">
            <PageBreadcrumb pageTitle="Gestión de estudiantes por grupo" />

            {/* Selector de Grupo */}
            <ComponentCard title="Seleccionar Grupo" desc="Selecciona un grupo para gestionar los estudiantes." className={`mb-6`}>
                <div className="mb-6 px-4">
                    <Label htmlFor="group-select" className="font-outfit">
                        Seleccionar Grupo
                    </Label>

                    <div className="relative">
                        <SelectWithCategories
                            options={groupCategories}
                            placeholder="Selecciona un grupo"
                            onChange={handleGroupChange}
                        />
                    </div>
                </div>
            </ComponentCard>

            {selectedGroup && (
                <>
                    <ItemsList
                        items={groupStudents}
                        columns={studentColumns}
                        isLoading={loadingState.groupStudents || loadingState.groups} // Usar estado de carga combinado
                        onAddNew={handleModalOpen}
                        actionButtons={studentActionButtons}
                        config={studentListConfig}
                    />

                    <AssignGroupStudentsModal
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                        selectedGroup={selectedGroup}
                        isSaving={loadingState.saving} // Usar estado de guardado
                        availableStudents={availableStudents}
                        isLoadingStudents={loadingState.availableStudents} // Usar estado de carga de disponibles
                        onAddStudents={handleAddStudents}
                    />
                </>
            )}
        </div>
    );
}