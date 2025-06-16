/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
// Components
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import AssignGroupStudentsModal from './components/AssignGroupStudentsModal';
import EditGroupStudentModal, { StudentGroupStatus } from './components/EditGroupStudentModal';

// Hooks
import { useGroupStudentsManagement, useTableConfig } from './hooks/index';

// Core Components
import ItemsList from '@/app/admin-dashboard/core/Tables/ItemsList';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';
import DeletedItemsList from '../../core/Tables/DeletedItemsList';
import { STUDENT_GROUP_STATUS } from './module-utils/types';

export default function GroupStudentsDashboard() {
    // Estado de gestión de grupos y estudiantes
    const {
        selectedGroup,
        groupCategories,
        loadingState,
        activeStudents,
        inactiveStudents,
        deletedStudents,
        availableStudents,
        editingStudent,
        isEditModalOpen,
        isModalOpen,
        handleModalOpen,
        handleModalClose,
        handleGroupChange,
        handleDeleteStudent,
        handleRestoreStudent,
        handleAddStudents,
        handleEditModalOpen,
        handleEditModalClose,
        handleUpdateStudentStatus,
    } = useGroupStudentsManagement();

    // Configuración de tabla de estudiantes
    const {
        studentColumns,
        activeStudentActionButtons,
        activeStudentListConfig,
        inactiveStudentListConfig,
        deletedStudentListConfig,
    } = useTableConfig({
        handleDelete: handleDeleteStudent,
        handleRestore: handleRestoreStudent,
        handleEdit: handleEditModalOpen,
        selectedGroup: selectedGroup
            ? {
                  ...selectedGroup,
                  students: [...activeStudents, ...inactiveStudents, ...deletedStudents],
              }
            : null,
    });

    // Opciones de estado para el estudiante en el grupo
    const studentStatusOptions = [
        { value: STUDENT_GROUP_STATUS.STUDENT_GROUP_ACTIVE.toString(), label: 'Activo' },
        { value: STUDENT_GROUP_STATUS.STUDENT_GROUP_INACTIVE.toString(), label: 'Inactivo' },
        { value: STUDENT_GROUP_STATUS.STUDENT_GROUP_GRADUATED.toString(), label: 'Graduado' },
        { value: STUDENT_GROUP_STATUS.STUDENT_GROUP_TRANSFERRED.toString(), label: 'Transferido' },
    ];

    // Función para crear un objeto StudentGroupStatus a partir de un estudiante
    const createStatusFromStudent = (student: any): StudentGroupStatus => {
        if (student.student_group_status) {
            return {
                id: student.student_group_status.status_id.toString(),
                name: student.student_group_status.name,
            };
        }
        return {
            id: student.student_group_status_id?.toString() || '0',
            name: 'Desconocido',
        };
    };

    return (
        <div className="container mx-auto p-6">
            <PageBreadcrumb pageTitle="Gestión de estudiantes por grupo" />

            {/* Selector de Grupo */}
            <ComponentCard
                title="Seleccionar Grupo"
                desc="Selecciona un grupo para gestionar los estudiantes."
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

            {selectedGroup && (
                <>
                    {/* Lista de estudiantes activos */}
                    <ItemsList
                        items={activeStudents}
                        columns={studentColumns}
                        isLoading={loadingState.groupStudents || loadingState.groups}
                        onAddNew={handleModalOpen}
                        actionButtons={activeStudentActionButtons}
                        config={activeStudentListConfig}
                    />

                    {/* Modal para asignar nuevos estudiantes */}
                    <AssignGroupStudentsModal
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                        selectedGroup={selectedGroup}
                        isSaving={loadingState.saving}
                        availableStudents={availableStudents}
                        isLoadingStudents={loadingState.availableStudents}
                        onAddStudents={handleAddStudents}
                    />

                    {/* Modal para editar estado del estudiante */}
                    {isEditModalOpen && editingStudent && (
                        <EditGroupStudentModal
                            isOpen={isEditModalOpen}
                            onClose={handleEditModalClose}
                            studentData={{
                                student: editingStudent,
                                status: createStatusFromStudent(editingStudent),
                            }}
                            isSaving={loadingState.saving}
                            onSave={(_studentId, newStatus) => {
                                if (editingStudent.student_group_id) {
                                    handleUpdateStudentStatus(
                                        editingStudent.student_group_id,
                                        parseInt(newStatus),
                                    );
                                }
                            }}
                            statusOptions={studentStatusOptions}
                        />
                    )}

                    {/* Lista de estudiantes inactivos (graduados, transferidos, etc.) */}
                    <DeletedItemsList
                        className="mt-6"
                        items={inactiveStudents}
                        isLoading={loadingState.groupStudents || loadingState.groups}
                        onRestore={id => {
                            const student = inactiveStudents.find(s => s.id === id);
                            if (student && student.student_group_id) {
                                handleUpdateStudentStatus(
                                    student.student_group_id,
                                    STUDENT_GROUP_STATUS.STUDENT_GROUP_ACTIVE,
                                );
                            }
                        }}
                        config={inactiveStudentListConfig}
                    />

                    {/* Lista de estudiantes eliminados */}
                    <DeletedItemsList
                        className="mt-6"
                        items={deletedStudents}
                        isLoading={loadingState.groupStudents || loadingState.groups}
                        onRestore={id => {
                            const student = deletedStudents.find(s => s.id === id);
                            if (student && student.student_group_id) {
                                handleRestoreStudent(student.student_group_id);
                            }
                        }}
                        config={deletedStudentListConfig}
                    />
                </>
            )}
        </div>
    );
}
