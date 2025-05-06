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
import { Student } from '@/app/admin-dashboard/admin-students/module-utils/types';
import { formatDate, getStudentStatusColor, getGenderIconColor } from '@/app/admin-dashboard/admin-students/module-utils/utils';
import { Group } from '@/app/admin-dashboard/admin-groups/module-utils/types';

// Extendemos la interfaz Group para incluir estudiantes asignados
interface GroupWithStudents extends Group {
    students?: Student[];
}

interface TableConfigProps {
    handleDelete: (studentId: number) => void;
    selectedGroup?: GroupWithStudents | null;
}

interface StudentTableConfigs {
    studentColumns: Column<Student>[];
    studentActionButtons: ActionButton[];
    studentListConfig: ItemsListConfig<Student>;
    deletedStudentListConfig: DeletedItemsListConfig<Student>;
    deleteConfirmModalConfig: {
        title: string;
        message: string;
        confirmButton: string;
        cancelButton: string;
        activeWarning: string;
    };
}

/**
 * Hook para configurar las tablas del módulo de estudiantes
 */
export function useTableConfig({
    handleDelete,
    selectedGroup
}: TableConfigProps): StudentTableConfigs {


    // Columnas para la tabla de estudiantes
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
                    color={getStudentStatusColor(student.status?.status_id || 7)}
                >
                    {student.status?.name || 'No especificado'}
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

    // Columnas para la tabla de estudiantes eliminados
    const deletedStudentColumns: Column<Student>[] = useMemo(() => [
        {
            key: 'full_name',
            header: 'Nombre',
            sortable: true,
            render: (student: Student) => (
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                        <IconFA icon="user" className={getGenderIconColor(student.gender?.code)} />
                    </div>
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
            key: 'deleted_at',
            header: 'Eliminado el',
            sortable: true,
            render: (student: Student) => (
                <span>{formatDate(student.deleted_at || '')}</span>
            ),
        },
    ], []);

    // Botones de acción para la tabla de estudiantes
    const studentActionButtons: ActionButton[] = useMemo(() => [
        {
            label: 'Eliminar',
            icon: 'trash',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: (id: string | number) => handleDelete(Number(id))
        }
    ], [handleDelete]);

    // Configuración de la tabla de estudiantes
    const studentListConfig: ItemsListConfig<Student> = useMemo(() => ({
        title: selectedGroup
            ? `Estudiantes del Grupo ${selectedGroup.grade}° ${selectedGroup.group}`
            : 'Lista de Estudiantes',
        description: selectedGroup
            ? `Alumnos asignados al grupo ${selectedGroup.grade}° ${selectedGroup.group} - ${selectedGroup.schoolYear?.name || 'Ciclo escolar actual'}`
            : 'Gestión de estudiantes activos en el sistema',
        addButtonLabel: 'Agregar estudiantes al grupo',
        addButtonIcon: 'user-plus',
        searchPlaceholder: 'Buscar por nombre, CURP...',
        noDataMessage: selectedGroup
            ? `No hay estudiantes asignados al grupo ${selectedGroup.grade}° ${selectedGroup.group}`
            : 'No hay estudiantes registrados',
        searchNoResultsMessage: 'No se encontraron estudiantes que coincidan con la búsqueda',
        defaultSortField: 'full_name',
        defaultSortDirection: 'asc',
        itemsPerPage: 10,
        searchableFields: ['full_name', 'curp', 'email', 'phone']
    }), [selectedGroup]);

    // Configuración de la tabla de estudiantes eliminados
    const deletedStudentListConfig: DeletedItemsListConfig<Student> = useMemo(() => ({
        title: 'Estudiantes Eliminados',
        description: 'Estudiantes que han sido dados de baja del sistema',
        noDataMessage: 'No hay estudiantes eliminados',
        buttonLabel: 'Estudiantes Eliminados',
        defaultSortField: 'deleted_at',
        defaultSortDirection: 'desc',
        searchPlaceholder: 'Buscar estudiantes eliminados...',
        searchNoResultsMessage: 'No se encontraron estudiantes eliminados que coincidan con la búsqueda',
        itemsPerPage: 5,
        maxHeight: '400px',
        columns: deletedStudentColumns
    }), [deletedStudentColumns]);

    // Configuración del modal de confirmación de eliminación
    const deleteConfirmModalConfig = useMemo(() => ({
        title: 'Confirmar Eliminación',
        message: 'Estás a punto de eliminar a un estudiante. Esta acción no eliminará permanentemente al estudiante del sistema, sino que lo marcará como inactivo.',
        confirmButton: 'Sí, Eliminar',
        cancelButton: 'Cancelar',
        activeWarning: 'Este estudiante está activo. Al eliminarlo, se perderán sus asignaciones a grupos y todas sus relaciones activas.'
    }), []);

    return {
        studentColumns,
        studentActionButtons,
        studentListConfig,
        deletedStudentListConfig,
        deleteConfirmModalConfig,
    };
} 