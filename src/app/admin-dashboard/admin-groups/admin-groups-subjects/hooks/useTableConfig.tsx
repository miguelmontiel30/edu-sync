// React
import { useMemo } from 'react';

// Components
import IconFA from '@/components/ui/IconFA';
import Badge from '@/components/core/badge/Badge';

// Types
import { Group } from '@/app/admin-dashboard/admin-groups/module-utils/types';
import { GroupSubjectAssignment, TeacherInfo, DeletedGroupSubject } from '../module-utils/types';
import { Column } from '@/components/core/table/module-utils/types';
import { ActionButton } from '@/app/admin-dashboard/core/Tables/ItemsList';
import { DeletedItemsListConfig } from '@/app/admin-dashboard/core/Tables/DeletedItemsList';

// Utilidades
import { formatDate } from '@/utils/dates';

interface TableConfigProps {
    handleEditAssignment: (assignment: GroupSubjectAssignment) => void;
    handleShowDeleteConfirm: (assignment: GroupSubjectAssignment) => void;
    handleRestoreSubject?: (deletedSubjectId: number) => void;
    selectedGroup: Group | null;
    groupAssignments: GroupSubjectAssignment[];
}

export const useTableConfig = ({
    handleEditAssignment,
    handleShowDeleteConfirm,
    handleRestoreSubject,
    selectedGroup,
    groupAssignments,
}: TableConfigProps) => {
    // Columnas para materias
    const subjectColumns: Column<GroupSubjectAssignment>[] = useMemo(
        () => [
            {
                key: 'subject_name',
                header: 'Materia',
                render: (item: GroupSubjectAssignment) => (
                    <div className="flex items-center justify-center">
                        <IconFA icon="book" className="mr-2 text-indigo-600" />
                        <span className="font-outfit text-sm font-bold">
                            {item.subject?.name || 'Materia sin nombre'}
                        </span>
                    </div>
                ),
            },
            {
                key: 'subject_description',
                header: 'Descripción',
                render: (item: GroupSubjectAssignment) => (
                    <span className="font-outfit text-sm">
                        {item.subject?.description || 'Sin descripción'}
                    </span>
                ),
            },
            {
                key: 'teacher',
                header: 'Profesor Asignado',
                render: (item: GroupSubjectAssignment) => {
                    const teacher: TeacherInfo | null = item.teacherData;
                    if (teacher) {
                        // Obtener la primera letra del nombre
                        const firstLetter = teacher.first_name.charAt(0).toUpperCase();

                        // Generar un color pastel basado en el nombre para que sea consistente
                        const hash = teacher.first_name
                            .split('')
                            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        const hue = hash % 360;
                        const pastelColor = `hsl(${hue}, 70%, 85%)`;
                        const textColor = `hsl(${hue}, 70%, 30%)`;

                        return (
                            <div className="flex items-center justify-center">
                                <div
                                    className="mr-2 flex h-8 w-8 items-center justify-center rounded-full"
                                    style={{ backgroundColor: pastelColor }}
                                >
                                    <span
                                        className="text-sm font-semibold"
                                        style={{ color: textColor }}
                                    >
                                        {firstLetter}
                                    </span>
                                </div>

                                <span className="ml-2 font-outfit text-sm">
                                    {`${teacher.first_name} ${teacher.father_last_name} ${teacher.mother_last_name || ''}`}
                                </span>
                            </div>
                        );
                    } else {
                        return (
                            <Badge variant="light" color="warning">
                                <IconFA icon="exclamation-circle" className="mr-1" />
                                Sin asignar
                            </Badge>
                        );
                    }
                },
            },
            {
                key: 'student_count',
                header: 'Alumnos',
                render: (item: GroupSubjectAssignment) => (
                    <div className="flex items-center">
                        <IconFA icon="users" className="mr-2 text-blue-600" />
                        <span className="font-outfit text-sm font-bold">
                            {item.student_count || 0}
                        </span>
                    </div>
                ),
            },
        ],
        [],
    );

    // Botones de acción para materias
    const subjectActionButtons: ActionButton[] = useMemo(
        () => [
            {
                label: 'Editar asignación',
                icon: 'pen-to-square',
                variant: 'outline',
                onClick: (id: number | string) => {
                    const assignment = groupAssignments.find(a => a.id === id);
                    if (assignment) {
                        handleEditAssignment(assignment);
                    }
                },
                showCondition: (item: GroupSubjectAssignment) =>
                    item.group_subject_id !== undefined,
            },
            {
                label: 'Eliminar asignación',
                icon: 'trash',
                variant: 'outline',
                className: 'text-red-500 hover:bg-red-50 hover:border-red-300',
                onClick: (id: number | string) => {
                    const assignment = groupAssignments.find(a => a.id === id);
                    if (assignment) {
                        handleShowDeleteConfirm(assignment);
                    }
                },
                showCondition: (item: GroupSubjectAssignment) =>
                    item.group_subject_id !== undefined,
            },
        ],
        [groupAssignments, handleEditAssignment, handleShowDeleteConfirm],
    );

    // Configuración para la lista de materias
    const subjectListConfig = useMemo(
        () => ({
            title: 'Materias del grupo',
            description: selectedGroup
                ? `Materias asignadas al grupo ${selectedGroup.grade}° ${selectedGroup.group}`
                : 'Selecciona un grupo para ver sus materias',
            emptyMessage: 'No hay materias asignadas a este grupo',
            addNewLabel: 'Agregar materia',
            tableClassName: 'w-full',
            enableRowSelection: false,
            enableGlobalFilter: true,
            globalFilterPlaceholder: 'Buscar materias...',
            searchableFields: [
                'subject.name',
                'subject.description',
                'teacherData.first_name',
                'teacherData.father_last_name',
            ],
        }),
        [selectedGroup],
    );

    // Configuración para el modal de eliminación
    const deleteConfirmModalConfig = useMemo(
        () => ({
            title: 'Eliminar materia de este grupo',
            description:
                'Esta acción eliminará la materia del grupo actual, pero no afectará a la materia en otros grupos.',
            confirmButton: 'Eliminar materia',
            cancelButton: 'Cancelar',
        }),
        [],
    );

    // Configuración para la lista de materias eliminadas
    const deletedSubjectsListConfig: DeletedItemsListConfig<DeletedGroupSubject> = useMemo(
        () => ({
            title: 'Materias Eliminadas',
            description: 'Historial de materias que han sido eliminadas de este grupo.',
            defaultSortField: 'deleted_at',
            defaultSortDirection: 'desc',
            searchPlaceholder: 'Buscar materias eliminadas...',
            noDataMessage: 'No hay materias eliminadas en este grupo',
            searchNoResultsMessage:
                'No se encontraron materias eliminadas que coincidan con la búsqueda',
            buttonLabel: 'Materias Eliminadas',
            itemsPerPage: 5,
            maxHeight: '400px',
            columns: [
                {
                    key: 'subject_name',
                    header: 'Materia',
                    sortable: true,
                    render: (item: DeletedGroupSubject) => (
                        <div className="flex items-center justify-center">
                            <IconFA icon="book" className="mr-2 text-indigo-600" />
                            <span className="font-outfit text-sm font-medium">
                                {item.subject?.name || 'Materia sin nombre'}
                            </span>
                        </div>
                    ),
                },
                {
                    key: 'deleted_at',
                    header: 'Fecha de eliminación',
                    sortable: true,
                    render: (item: DeletedGroupSubject) => (
                        <span className="font-outfit text-sm">
                            {formatDate(item.deleted_at) || 'Sin fecha'}
                        </span>
                    ),
                },
                {
                    key: 'teacher',
                    header: 'Profesor',
                    render: (item: DeletedGroupSubject) => {
                        if (item.teacher) {
                            return (
                                <span className="font-outfit text-sm">
                                    {`${item.teacher.first_name} ${item.teacher.father_last_name || ''}`}
                                </span>
                            );
                        }
                        return (
                            <Badge variant="light" color="warning">
                                Sin profesor
                            </Badge>
                        );
                    },
                },
            ],
        }),
        [handleRestoreSubject],
    );

    return {
        subjectColumns,
        subjectActionButtons,
        subjectListConfig,
        deleteConfirmModalConfig,
        deletedSubjectsListConfig,
    };
};
