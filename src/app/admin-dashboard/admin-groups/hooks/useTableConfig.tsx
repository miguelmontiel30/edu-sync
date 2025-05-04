// React    
import { useMemo } from 'react';

// Components
import IconFA from '@/components/ui/IconFA';
import Badge from '@/components/core/badge/Badge';

// Types
import { Group, GROUP_STATUS } from '../module-utils/types';
import { ActionButton, ItemsListConfig } from '../../core/Tables/ItemsList';

interface TableConfigProps {
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
}

// Definir tipos para evitar errores
type BadgeColor = 'success' | 'warning' | 'error' | 'info' | undefined;

/**
 * Obtiene el color del badge según el estado del ciclo escolar
 */
function getSchoolYearBadgeColor(status: string): BadgeColor {
    switch (status) {
        case 'active':
            return 'success';
        case 'completed':
            return 'info';
        case 'inactive':
            return 'warning';
        default:
            return undefined;
    }
}

/**
 * Obtiene el nombre descriptivo en español del estado del ciclo escolar
 */
function getSchoolYearStatusLabel(status: string): string {
    switch (status) {
        case 'active':
            return 'Activo';
        case 'inactive':
            return 'Inactivo';
        case 'completed':
            return 'Finalizado';
        default:
            return 'Desconocido';
    }
}

export function useTableConfig({ handleEdit, handleDelete }: TableConfigProps) {
    // Columnas para la tabla de grupos
    const groupColumns = useMemo(() => [
        {
            key: 'grade',
            header: 'Grado',
            sortable: true,
            render: (item: Group) => (
                <span className="text-gray-800 dark:text-white/90 font-outfit">{item.grade}</span>
            ),
        },
        {
            key: 'group',
            header: 'Grupo',
            sortable: true,
            render: (item: Group) => (
                <span className="text-gray-800 dark:text-white/90 font-outfit">{item.group}</span>
            ),
        },
        {
            key: 'teachers',
            header: 'Profesores a cargo',
            render: (item: Group) => (
                <>
                    {item.teachers.map(teacher => (
                        <div
                            key={teacher.id}
                            className="flex items-center gap-2"
                        >
                            <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
                                {teacher.image ? (
                                    <img
                                        src={teacher.image}
                                        alt={teacher.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <IconFA icon="user" className="text-gray-500" />
                                )}
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                    {teacher.name}
                                </span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400 font-outfit">
                                    {teacher.role}
                                </span>
                            </div>
                        </div>
                    ))}
                    {item.teachers.length === 0 && (
                        <span className="text-gray-500 dark:text-gray-400 font-outfit">Sin profesores asignados</span>
                    )}
                </>
            ),
        },
        {
            key: 'schoolYear',
            header: 'Ciclo escolar',
            render: (item: Group) => (
                <span className="text-gray-800 dark:text-white/90 font-outfit">
                    {item.schoolYear?.name || 'Sin ciclo escolar'}

                    <div className="flex items-center justify-center gap-2 mt-2">
                        <Badge
                            size="sm"
                            color={getSchoolYearBadgeColor(item.schoolYear?.status)}
                        >
                            <span className="font-outfit">
                                {getSchoolYearStatusLabel(item.schoolYear?.status)}
                            </span>
                        </Badge>
                    </div>
                </span>
            ),
        },
        {
            key: 'studentsNumber',
            header: 'No. de alumnos',
            sortable: true,
            render: (item: Group) => (
                <span className="text-gray-800 dark:text-white/90 font-outfit">{item.studentsNumber}</span>
            ),
        },
        {
            key: 'subjectsNumber',
            header: 'No. de materias',
            sortable: true,
            render: (item: Group) => (
                <span className="text-gray-800 dark:text-white/90 font-outfit">{item.subjectsNumber}</span>
            ),
        },
        {
            key: 'status',
            header: 'Estado',
            sortable: true,
            render: (item: Group) => (
                <Badge
                    size="sm"
                    color={
                        Number(item.status_id) === Number(GROUP_STATUS.ACTIVE)
                            ? 'success'
                            : Number(item.status_id) === Number(GROUP_STATUS.INACTIVE)
                                ? 'warning'
                                : 'primary'
                    }
                >
                    <span className="font-outfit">{item.statusName}</span>
                </Badge>
            ),
        },
        {
            key: 'generalAverage',
            header: 'Promedio general',
            sortable: true,
            render: (item: Group) => (
                <span className="text-gray-800 dark:text-white/90 font-outfit">{item.generalAverage.toFixed(2)}</span>
            ),
        },
    ], []);

    // Botones de acción para la tabla de grupos
    const groupActionButtons: ActionButton[] = useMemo(() => [
        {
            label: 'Editar',
            icon: 'pen-to-square',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: (id: string | number) => handleEdit(Number(id))
        },
        {
            label: 'Eliminar',
            icon: 'trash',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: (id: string | number) => handleDelete(Number(id))
        },
    ], [handleEdit, handleDelete]);

    // Configuración de la lista de grupos
    const groupListConfig: ItemsListConfig<Group> = useMemo(() => ({
        title: 'Lista de grupos',
        description: 'Aquí podrás ver todos los grupos registrados, su información y gestionarlos. Puedes crear nuevos grupos, editar los existentes o eliminarlos según sea necesario.',
        addButtonLabel: 'Nuevo Grupo',
        addButtonIcon: 'users-medical',
        searchPlaceholder: 'Buscar grupos...',
        emptyMessage: 'No se encontraron grupos.',
        searchNoResultsMessage: 'No se encontraron grupos que coincidan con la búsqueda.',
        searchableFields: ['grade', 'group', 'status', 'statusName'],
        defaultSortField: 'grade',
        defaultSortDirection: 'asc',
        columns: groupColumns,
        actionButtons: groupActionButtons,
    }), []);

    // Configuración de la lista de grupos eliminados
    const deletedGroupListConfig = useMemo(() => ({
        title: 'Grupos Eliminados',
        description: 'Grupos en la papelera',
        emptyMessage: 'No hay grupos eliminados',
        columns: [
            {
                key: 'grade',
                header: 'Grado',
                render: (item: Group) => (
                    <span className="text-gray-800 dark:text-white/90 font-outfit">{item.grade}</span>
                ),
            },
            {
                key: 'group',
                header: 'Grupo',
                render: (item: Group) => (
                    <span className="text-gray-800 dark:text-white/90 font-outfit">{item.group}</span>
                ),
            },
            {
                key: 'schoolYear',
                header: 'Ciclo escolar',
                render: (item: Group) => (
                    <span className="text-gray-800 dark:text-white/90 font-outfit">
                        {item.schoolYear?.name || 'Sin ciclo escolar'}

                        <div className="flex items-center justify-center gap-2 mt-2">
                            <Badge
                                size="sm"
                                color={getSchoolYearBadgeColor(item.schoolYear?.status)}
                            >
                                <span className="font-outfit">
                                    {getSchoolYearStatusLabel(item.schoolYear?.status)}
                                </span>
                            </Badge>
                        </div>
                    </span>
                ),
            },
            {
                key: 'studentsNumber',
                header: 'No. de alumnos',
                render: (item: Group) => (
                    <span className="text-gray-800 dark:text-white/90 font-outfit">{item.studentsNumber}</span>
                ),
            },
            {
                key: 'status',
                header: 'Estado',
                render: (item: Group) => (
                    <Badge
                        size="sm"
                        color={
                            Number(item.status_id) === Number(GROUP_STATUS.ACTIVE)
                                ? 'success'
                                : Number(item.status_id) === Number(GROUP_STATUS.INACTIVE)
                                    ? 'error'
                                    : 'warning'
                        }
                    >
                        <span className="font-outfit">{item.statusName}</span>
                    </Badge>
                )
            },
        ],
        buttonLabel: 'Grupos eliminados'
    }), []);

    // Configuración de mensajes para el modal de confirmación de eliminación
    const deleteConfirmModalConfig = useMemo(() => ({
        title: 'Confirmar eliminación',
        message: '¿Estás seguro de que deseas eliminar este grupo?',
        warningMessage: 'Esta acción moverá el grupo a la papelera y podrás restaurarlo más tarde si lo necesitas.',
        dangerMessage: 'Este grupo está activo y tiene estudiantes asociados. Al eliminarlo, se perderá la asociación con los estudiantes.',
        confirmButton: 'Eliminar grupo',
        cancelButton: 'Cancelar',
    }), []);

    return {
        groupColumns,
        groupActionButtons,
        groupListConfig,
        deletedGroupListConfig,
        deleteConfirmModalConfig
    };
} 