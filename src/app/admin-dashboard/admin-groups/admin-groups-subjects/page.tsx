'use client';

// Components
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import AssignTeacherModal from './components/AssignTeacherModal';
import AddSubjectModal from './components/AddSubjectModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

// Hooks
import { useGroupTeachersManagement, useTableConfig } from './hooks';

// Core Components
import ItemsList from '@/app/admin-dashboard/core/Tables/ItemsList';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';
import { useState } from 'react';
import { GroupSubjectAssignment, DeletedGroupSubject } from './module-utils/types';
import DeletedItemsList from '../../core/Tables/DeletedItemsList';

export default function GroupTeachersDashboard() {
    // Estado local para el modal de confirmación de eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState<GroupSubjectAssignment | null>(
        null,
    );

    // Estado de gestión de profesores y materias por grupo
    const {
        selectedGroup,
        groupCategories,
        loadingState,
        isTeacherModalOpen,
        isSubjectModalOpen,
        availableTeachers,
        availableSubjects,
        groupAssignments,
        deletedSubjects,
        editingAssignment,
        handleGroupChange,
        handleTeacherModalClose,
        handleSubjectModalOpen,
        handleSubjectModalClose,
        handleAssignTeacher,
        handleAddSubject,
        handleDeleteSubject,
        handleEditAssignment,
        handleRestoreSubject,
    } = useGroupTeachersManagement();

    // Handlers para el modal de confirmación de eliminación
    const handleShowDeleteConfirm = (assignment: GroupSubjectAssignment) => {
        setAssignmentToDelete(assignment);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setAssignmentToDelete(null);
    };

    const confirmDeleteSubject = () => {
        if (assignmentToDelete && assignmentToDelete.group_subject_id) {
            handleDeleteSubject(assignmentToDelete.group_subject_id);
            handleCloseDeleteModal();
        }
    };

    // Configuración de tabla de materias
    const {
        subjectColumns,
        subjectActionButtons,
        subjectListConfig,
        deleteConfirmModalConfig,
        deletedSubjectsListConfig,
    } = useTableConfig({
        handleEditAssignment,
        handleShowDeleteConfirm,
        handleRestoreSubject,
        selectedGroup,
        groupAssignments,
    });

    return (
        <div className="container mx-auto p-6">
            <PageBreadcrumb pageTitle="Gestión de materias por grupo" />

            {/* Selector de Grupo */}
            <ComponentCard
                title="Seleccionar Grupo"
                desc="Selecciona un grupo para gestionar las materias y profesores."
                className="mb-6"
            >
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

            {/* Mostrar contenido solo cuando se ha seleccionado un grupo */}
            {selectedGroup && (
                <>
                    {/* Lista de materias del grupo */}
                    <div className="mt-6">
                        <ItemsList
                            items={groupAssignments}
                            columns={subjectColumns}
                            isLoading={loadingState.groupSubjects || loadingState.groups}
                            onAddNew={handleSubjectModalOpen}
                            actionButtons={subjectActionButtons}
                            config={{
                                ...subjectListConfig,
                                title: `Materias del grupo ${selectedGroup.grade}° ${selectedGroup.group}`,
                                description:
                                    'Gestiona las materias asignadas al grupo y sus profesores',
                                addButtonLabel: 'Agregar materia',
                                searchPlaceholder: 'Buscar materia...',
                                noDataMessage: 'No hay materias asignadas a este grupo',
                                searchableFields: [
                                    'subject.name',
                                    'subject.description',
                                    'teacherData.first_name',
                                    'teacherData.father_last_name',
                                ],
                            }}
                        />
                    </div>

                    {/* Modal para asignar profesores a materias */}
                    <AssignTeacherModal
                        isOpen={isTeacherModalOpen}
                        onClose={handleTeacherModalClose}
                        selectedGroup={selectedGroup}
                        selectedAssignment={editingAssignment}
                        availableTeachers={availableTeachers}
                        isSaving={loadingState.saving}
                        onAssignTeacher={handleAssignTeacher}
                    />

                    {/* Modal para agregar materias al grupo */}
                    <AddSubjectModal
                        isOpen={isSubjectModalOpen}
                        onClose={handleSubjectModalClose}
                        selectedGroup={selectedGroup}
                        availableSubjects={availableSubjects}
                        availableTeachers={availableTeachers}
                        isSaving={loadingState.saving}
                        onAddSubject={handleAddSubject}
                        groupAssignments={groupAssignments}
                    />

                    {/* Modal para confirmar eliminación de materia */}
                    <DeleteConfirmModal
                        isOpen={isDeleteModalOpen}
                        onClose={handleCloseDeleteModal}
                        onConfirm={confirmDeleteSubject}
                        itemName={assignmentToDelete?.subject?.name || ''}
                        itemType="materia"
                        isLoading={loadingState.saving}
                        customMessages={deleteConfirmModalConfig}
                    />

                    {/* Lista de materias eliminadas */}
                    <DeletedItemsList<DeletedGroupSubject>
                        items={deletedSubjects}
                        config={deletedSubjectsListConfig}
                        isLoading={loadingState.deletedSubjects}
                        onRestore={handleRestoreSubject}
                        className="mt-6"
                    />
                </>
            )}
        </div>
    );
}
