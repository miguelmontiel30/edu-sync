// React
import React, { useMemo } from 'react';

// Components
import Badge from '@/components/core/badge/Badge';
import { ActionButton, ItemsListConfig } from '../../core/Tables/ItemsList';
import { DeletedItemsListConfig } from '../../core/Tables/DeletedItemsList';

// Types & Utils
import { Subject, SubjectStatus } from '../module-utils/types';
import { Column } from '@/components/core/table/module-utils/types';
interface TableConfigProps {
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
}

interface TableConfigs {
    subjectColumns: Column<Subject>[];
    subjectActionButtons: ActionButton[];
    subjectListConfig: ItemsListConfig<Subject>;
    deletedSubjectListConfig: DeletedItemsListConfig<Subject>;
    deleteConfirmModalConfig: {
        title: string;
        confirmation: string;
        recoveryInfo: string;
        warningTitle: string;
        warningMessage: string;
        errorTitle: string;
        errorMessage: string;
    };
}

export function useTableConfig({ handleEdit, handleDelete }: TableConfigProps): TableConfigs {
    // Configuración de columnas para materias activas
    const subjectColumns: Column<Subject>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Nombre',
            sortable: true,
            render: (subject: Subject) => (
                <span className="text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                    {subject.name}
                </span>
            )
        },
        {
            key: 'description',
            header: 'Descripción',
            sortable: true,
            render: (subject: Subject) => (
                <span className="text-sm text-gray-700 dark:text-white/70 font-outfit">
                    {subject.description}
                </span>
            )
        },
        {
            key: 'groupsCount',
            header: 'Grupos',
            sortable: true,
            render: (subject: Subject) => (
                <span className="text-sm text-gray-700 dark:text-white/70 font-outfit">
                    {subject.groupsCount}
                </span>
            )
        },
        {
            key: 'teachersCount',
            header: 'Profesores',
            sortable: true,
            render: (subject: Subject) => (
                <span className="text-sm text-gray-700 dark:text-white/70 font-outfit">
                    {subject.teachersCount}
                </span>
            )
        },
        {
            key: 'averageGrade',
            header: 'Promedio',
            sortable: true,
            render: (subject: Subject) => (
                <span className="text-sm text-gray-700 dark:text-white/70 font-outfit">
                    {subject.averageGrade.toFixed(2)}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Estado',
            sortable: true,
            render: (subject: Subject) => (
                <span className="text-sm text-gray-700 dark:text-white/70 font-outfit">
                    <Badge
                        size="sm"
                        variant={'light'}
                        color={subject?.status?.name === SubjectStatus.ACTIVE ? 'success' : subject?.status?.name === SubjectStatus.INACTIVE ? 'dark' : 'primary'}
                    >
                        {subject.status?.name}
                    </Badge>
                </span>
            )
        }
    ], []);

    // Configuración de botones de acción
    const subjectActionButtons: ActionButton[] = useMemo(() => [
        {
            label: 'Editar',
            icon: 'pen-to-square',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: id => handleEdit(Number(id))
        },
        {
            label: 'Eliminar',
            icon: 'trash',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: id => handleDelete(Number(id))
        }
    ], [handleEdit, handleDelete]);

    // Configuración de la lista de materias activas
    const subjectListConfig: ItemsListConfig<Subject> = useMemo(() => ({
        title: 'Lista de materias',
        description: 'Aquí podrás ver todas las materias registradas, su información y gestionarlas. Puedes crear nuevas materias, editar las existentes o eliminarlas según sea necesario.',
        addButtonLabel: 'Nueva Materia',
        addButtonIcon: 'book-medical',
        noDataMessage: 'No se encontraron materias.',
        searchPlaceholder: 'Buscar materias...',
        searchNoResultsMessage: 'No se encontraron materias que coincidan con la búsqueda.',
        defaultSortField: 'name',
        defaultSortDirection: 'asc',
        itemsPerPage: 10,
        searchableFields: ['name', 'description']
    }), []);

    // Configuración para la lista de materias eliminadas
    const deletedSubjectListConfig: DeletedItemsListConfig<Subject> = useMemo(() => ({
        title: 'Materias Eliminadas',
        description: 'Historial de materias que han sido eliminadas del sistema.',
        defaultSortField: 'name',
        defaultSortDirection: 'asc',
        searchPlaceholder: 'Buscar materias eliminadas...',
        noDataMessage: 'No hay materias eliminadas',
        searchNoResultsMessage: 'No se encontraron materias que coincidan con la búsqueda',
        buttonLabel: 'Materias Eliminadas',
        itemsPerPage: 5,
        maxHeight: '400px',
        columns: [
            {
                key: 'name',
                header: 'Nombre',
                sortable: true,
                render: (subject: Subject) => (
                    <span className="text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                        {subject.name}
                    </span>
                )
            },
            {
                key: 'description',
                header: 'Descripción',
                sortable: true,
                render: (subject: Subject) => (
                    <span className="text-sm text-gray-700 dark:text-white/70 font-outfit">
                        {subject.description}
                    </span>
                )
            },
            {
                key: 'groupsCount',
                header: 'Grupos',
                render: (subject: Subject) => (
                    <span className="text-sm text-gray-700 dark:text-white/70 font-outfit">
                        {subject.groupsCount}
                    </span>
                )
            },
            {
                key: 'teachersCount',
                header: 'Profesores',
                render: (subject: Subject) => (
                    <span className="text-sm text-gray-700 dark:text-white/70 font-outfit">
                        {subject.teachersCount}
                    </span>
                )
            },
            {
                key: 'averageGrade',
                header: 'Promedio',
                render: (subject: Subject) => (
                    <span className="text-sm text-gray-700 dark:text-white/70 font-outfit">
                        {subject.averageGrade.toFixed(2)}
                    </span>
                )
            },
        ]
    }), []);

    // Configuración del modal de confirmación de eliminación
    const deleteConfirmModalConfig = useMemo(() => ({
        title: '¿Estás seguro?',
        confirmation: '¿Estás seguro de que deseas eliminar la materia ',
        recoveryInfo: 'Esta acción puede ser revertida más adelante desde la sección de materias eliminadas.',
        warningTitle: '¡Atención!',
        warningMessage: 'Estás a punto de eliminar una materia. Esta acción podría afectar a los grupos y evaluaciones asociados. Asegúrate de que no exista información importante vinculada a esta materia antes de continuar.',
        errorTitle: '¡Error!',
        errorMessage: 'Ocurrió un error al intentar eliminar la materia. Por favor, intenta nuevamente.',
    }), []);

    return {
        subjectColumns,
        subjectActionButtons,
        subjectListConfig,
        deletedSubjectListConfig,
        deleteConfirmModalConfig
    };
} 