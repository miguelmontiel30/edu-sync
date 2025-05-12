// React
import { useMemo } from 'react';

// Components
import Badge from '@/components/core/badge/Badge';
import IconFA from '@/components/ui/IconFA';
import { Column } from '@/components/core/table/module-utils/types';

// Core Components
import { ActionButton, ItemsListConfig } from '../../../core/Tables/ItemsList';
import { DeletedItemsListConfig } from '../../../core/Tables/DeletedItemsList';

// Types and utils
import { getStudentStatusColorById } from '../module-utils/utils';
import { Group } from '@/app/admin-dashboard/admin-groups/module-utils/types';
import { Student } from '@/app/admin-dashboard/admin-students/module-utils/types';
import { formatDate, getGenderIconColor } from '@/app/admin-dashboard/admin-students/module-utils/utils';

// Extendemos la interfaz Group para incluir estudiantes asignados
interface GroupWithStudents extends Group {
    students?: Student[];
}

interface TableConfigProps {
    handleEdit: (student: Student) => void;
    handleDelete: (studentGroupId: number) => void;
    handleRestore: (studentGroupId: number) => void;
    selectedGroup?: GroupWithStudents | null;
}

interface StudentTableConfigs {
    // Columnas comunes
    studentColumns: Column<Student>[];
    // Estudiantes activos
    activeStudentActionButtons: ActionButton[];
    activeStudentListConfig: ItemsListConfig<Student>;
    // Estudiantes inactivos (graduados, transferidos, etc.)
    inactiveStudentActionButtons: ActionButton[];
    inactiveStudentListConfig: DeletedItemsListConfig<Student>;
    // Estudiantes eliminados (delete_flag = true)
    deletedStudentActionButtons: ActionButton[];
    deletedStudentListConfig: DeletedItemsListConfig<Student>;
    // Modal de confirmación
    deleteConfirmModalConfig: {
        title: string;
        message: string;
        confirmButton: string;
        cancelButton: string;
        activeWarning: string;
    };
}

/**
 * Hook para configurar las tablas del módulo de estudiantes en grupos
 */
export function useTableConfig({
    handleEdit,
    handleDelete,
    handleRestore,
    selectedGroup
}: TableConfigProps): StudentTableConfigs {

    // Columnas para la tabla de estudiantes (compartidas entre las tablas)
    const studentColumns: Column<Student>[] = useMemo(() => [
        {
            key: 'full_name',
            header: 'Nombre',
            sortable: true,
            render: (student: Student) => (
                <div className="flex items-center">
                    {student.image_url ? (
                        <img
                            src={student.image_url}
                            alt={student.full_name}
                            className="w-8 h-8 rounded-full mr-2"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                            <IconFA icon="user" className={getGenderIconColor(student.gender?.code)} />
                        </div>
                    )}
                    <span className="font-medium">{student.full_name}</span>
                </div>
            ),
        },
        {
            key: 'curp',
            header: 'CURP',
            sortable: true,
            render: (student: Student) => (
                <span className="text-xs font-mono uppercase">{student.curp}</span>
            ),
        },
        {
            key: 'age',
            header: 'Edad',
            sortable: true,
            render: (student: Student) => (
                <span>{student.age} años</span>
            ),
        },
        {
            key: 'birth_date',
            header: 'Fecha de Nacimiento',
            sortable: true,
            render: (student: Student) => (
                <span>{formatDate(student.birth_date)}</span>
            ),
        },
        {
            key: 'status',
            header: 'Estado',
            sortable: true,
            render: (student: Student) => (
                <Badge
                    variant="light"
                    color={getStudentStatusColorById(student.student_group_status_id as number)}
                >
                    {student.student_group_status?.name || 'No especificado'}
                </Badge>
            ),
        },
        {
            key: 'contact',
            header: 'Contacto',
            render: (student: Student) => (
                <div className="flex flex-col gap-1">
                    {student.email && (
                        <div className="flex items-center text-xs">
                            <IconFA icon="envelope" className="mr-1 text-gray-500" />
                            <span>{student.email}</span>
                        </div>
                    )}
                    {student.phone && (
                        <div className="flex items-center text-xs">
                            <IconFA icon="phone" className="mr-1 text-gray-500" />
                            <span>{student.phone}</span>
                        </div>
                    )}
                </div>
            ),
        },
    ], []);

    // Botones de acción para la tabla de estudiantes activos
    const activeStudentActionButtons: ActionButton[] = useMemo(() => [
        {
            label: 'Cambiar Estado',
            icon: 'pen-to-square',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: (id: string | number) => {
                const studentId = Number(id);
                // Buscar el estudiante correspondiente en activeStudents
                const student = selectedGroup?.students?.find(s => s.id === studentId);
                if (student) {
                    handleEdit(student);
                }
            }
        },
        {
            label: 'Eliminar',
            icon: 'trash',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: (id: string | number) => {
                const studentId = Number(id);
                // Buscar el estudiante correspondiente en activeStudents
                const student = selectedGroup?.students?.find(s => s.id === studentId);
                if (student && student.student_group_id) {
                    handleDelete(student.student_group_id);
                }
            }
        }
    ], [handleEdit, handleDelete, selectedGroup]);

    // Botones de acción para la tabla de estudiantes inactivos
    const inactiveStudentActionButtons: ActionButton[] = useMemo(() => [
        {
            label: 'Cambiar Estado',
            icon: 'pen-to-square',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: (id: string | number) => {
                const studentId = Number(id);
                // Buscar el estudiante correspondiente en inactiveStudents
                const student = selectedGroup?.students?.find(s => s.id === studentId);
                if (student) {
                    handleEdit(student);
                }
            }
        }
    ], [handleEdit, selectedGroup]);

    // Botones de acción para la tabla de estudiantes eliminados
    const deletedStudentActionButtons: ActionButton[] = useMemo(() => [
        {
            label: 'Restaurar',
            icon: 'rotate',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: (id: string | number) => {
                const studentId = Number(id);
                // Buscar el estudiante correspondiente en deletedStudents
                const student = selectedGroup?.students?.find(s => s.id === studentId);
                if (student && student.student_group_id) {
                    handleRestore(student.student_group_id);
                }
            }
        }
    ], [handleRestore, selectedGroup]);

    // Configuración de la tabla de estudiantes activos
    const activeStudentListConfig: ItemsListConfig<Student> = useMemo(() => ({
        title: selectedGroup
            ? `Estudiantes Activos del Grupo ${selectedGroup.grade}° ${selectedGroup.group}`
            : 'Lista de Estudiantes Activos',
        description: selectedGroup
            ? `Alumnos activos asignados al grupo ${selectedGroup.grade}° ${selectedGroup.group} - ${selectedGroup.schoolYear?.name || 'Ciclo escolar actual'}`
            : 'Gestión de estudiantes activos en el grupo',
        addButtonLabel: 'Agregar estudiantes al grupo',
        addButtonIcon: 'user-plus',
        searchPlaceholder: 'Buscar por nombre, CURP...',
        noDataMessage: selectedGroup
            ? `No hay estudiantes activos asignados al grupo ${selectedGroup.grade}° ${selectedGroup.group}`
            : 'No hay estudiantes activos registrados',
        searchNoResultsMessage: 'No se encontraron estudiantes que coincidan con la búsqueda',
        defaultSortField: 'full_name',
        defaultSortDirection: 'asc',
        itemsPerPage: 10,
        searchableFields: ['full_name', 'curp', 'email', 'phone']
    }), [selectedGroup]);

    // Configuración de la tabla de estudiantes inactivos
    const inactiveStudentListConfig: DeletedItemsListConfig<Student> = useMemo(() => ({
        title: 'Estudiantes con Estado Especial',
        description: 'Estudiantes graduados, transferidos o con otro estado no activo',
        noDataMessage: 'No hay estudiantes con estados especiales en este grupo',
        buttonLabel: 'Ver Estudiantes Inactivos',
        defaultSortField: 'full_name',
        defaultSortDirection: 'asc',
        searchPlaceholder: 'Buscar estudiantes inactivos...',
        searchNoResultsMessage: 'No se encontraron estudiantes inactivos que coincidan con la búsqueda',
        itemsPerPage: 5,
        maxHeight: '400px',
        columns: studentColumns,
        restoreButtonLabel: 'Activar en grupo'
    }), [studentColumns]);

    // Configuración de la tabla de estudiantes eliminados
    const deletedStudentListConfig: DeletedItemsListConfig<Student> = useMemo(() => ({
        title: 'Estudiantes Eliminados del Grupo',
        description: 'Estudiantes que han sido dados de baja del grupo pero pueden ser restaurados',
        noDataMessage: 'No hay estudiantes eliminados de este grupo',
        buttonLabel: 'Ver Estudiantes Eliminados',
        defaultSortField: 'deleted_at',
        defaultSortDirection: 'desc',
        searchPlaceholder: 'Buscar estudiantes eliminados...',
        searchNoResultsMessage: 'No se encontraron estudiantes eliminados que coincidan con la búsqueda',
        itemsPerPage: 5,
        maxHeight: '400px',
        columns: studentColumns,
        restoreButtonLabel: 'Restaurar al grupo'
    }), [studentColumns]);

    // Configuración del modal de confirmación de eliminación
    const deleteConfirmModalConfig = useMemo(() => ({
        title: 'Confirmar Eliminación',
        message: 'Estás a punto de eliminar a un estudiante del grupo. Esta acción no eliminará permanentemente al estudiante del sistema, sino que lo marcará como inactivo en este grupo.',
        confirmButton: 'Sí, Eliminar',
        cancelButton: 'Cancelar',
        activeWarning: 'Este estudiante está activo en el grupo. Al eliminarlo, se perderá su asignación actual.'
    }), []);

    return {
        studentColumns,
        activeStudentActionButtons,
        activeStudentListConfig,
        inactiveStudentActionButtons,
        inactiveStudentListConfig,
        deletedStudentActionButtons,
        deletedStudentListConfig,
        deleteConfirmModalConfig,
    };
} 