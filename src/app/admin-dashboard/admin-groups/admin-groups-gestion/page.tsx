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
        isLoading,
        isModalOpen,
        groupStudents,
        isLoadingStudents,
        availableStudents,
        isLoadingAvailableStudents,
        isSaving,
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
                        isLoading={isLoadingStudents || isLoading}
                        onAddNew={handleModalOpen}
                        actionButtons={studentActionButtons}
                        config={studentListConfig}
                    />

                    <AssignGroupStudentsModal
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                        selectedGroup={selectedGroup}
                        isSaving={isSaving}
                        availableStudents={availableStudents}
                        isLoadingStudents={isLoadingAvailableStudents}
                        onAddStudents={handleAddStudents}
                    />
                </>
            )}
        </div>
    );
}