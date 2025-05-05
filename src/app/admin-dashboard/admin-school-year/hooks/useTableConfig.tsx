import { useMemo } from 'react';

// Components
import Badge from '@/components/core/badge/Badge';
import { createPriorityComparator } from '../../core/Tables/utils';
import { ActionButton, ItemsListConfig } from '../../core/Tables/ItemsList';
import { DeletedItemsListConfig } from '../../core/Tables/DeletedItemsList';

// Types & Utils
import { textStyles } from '../module-utils/theme';
import { SchoolCycle, CYCLE_STATUS } from '../module-utils/types';
import { formatDate, getStatusColor } from '../module-utils/utils';
import { Column } from '@/components/core/table/module-utils/types';

interface TableConfigProps {
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
}

interface TableConfigs {
    cycleColumns: Column<SchoolCycle>[];
    cycleActionButtons: ActionButton[];
    cycleListConfig: ItemsListConfig<SchoolCycle>;
    deletedCycleListConfig: DeletedItemsListConfig<SchoolCycle>;
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

// Mapa de prioridades para los estados (orden personalizado)
const STATUS_PRIORITY: Record<string, number> = {
    [CYCLE_STATUS.ACTIVE]: 1, // Activo - primera posición
    [CYCLE_STATUS.COMPLETED]: 2, // Completado - segunda posición
    [CYCLE_STATUS.INACTIVE]: 3, // Inactivo - tercera posición
};

// Crear un comparador de estados usando la función genérica
const compareByStatus = createPriorityComparator<SchoolCycle>(STATUS_PRIORITY, 'status');

export function useTableConfig({ handleEdit, handleDelete }: TableConfigProps): TableConfigs {
    // Configuración de columnas para ciclos activos
    const cycleColumns: Column<SchoolCycle>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Nombre',
            sortable: true,
            render: (cycle: SchoolCycle) => (
                <span className={textStyles.title}>
                    {cycle.name}
                </span>
            )
        },
        {
            key: 'startDate',
            header: 'Fecha de Inicio',
            sortable: true,
            render: (cycle: SchoolCycle) => (
                <span className={textStyles.normal}>
                    {formatDate(cycle.startDate)}
                </span>
            )
        },
        {
            key: 'endDate',
            header: 'Fecha de Fin',
            sortable: true,
            render: (cycle: SchoolCycle) => (
                <span className={textStyles.normal}>
                    {formatDate(cycle.endDate)}
                </span>
            )
        },
        {
            key: 'groupsCount',
            header: 'Grupos',
            sortable: true
        },
        {
            key: 'studentsCount',
            header: 'Alumnos',
            sortable: true
        },
        {
            key: 'averageGrade',
            header: 'Promedio',
            sortable: true,
            render: (cycle: SchoolCycle) => (
                <span className={textStyles.normal}>
                    {cycle.averageGrade.toFixed(2)}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Estado',
            sortable: true,
            sortFunction: compareByStatus,
            render: (cycle: SchoolCycle) => (
                <Badge
                    size="sm"
                    color={getStatusColor(cycle.status)}
                >
                    <span className="font-outfit">
                        {cycle.statusName}
                    </span>
                </Badge>
            )
        }
    ], []);

    // Configuración de botones de acción
    const cycleActionButtons: ActionButton[] = useMemo(() => [
        {
            label: 'Editar',
            icon: 'calendar-pen',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: (id) => handleEdit(Number(id))
        },
        {
            label: 'Eliminar',
            icon: 'calendar-xmark',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: (id) => handleDelete(Number(id))
        }
    ], [handleEdit, handleDelete]);

    // Configuración de la lista de ciclos activos
    const cycleListConfig: ItemsListConfig<SchoolCycle> = useMemo(() => ({
        title: 'Lista de ciclos escolares',
        description: 'Aquí podrás ver todos los ciclos escolares registrados, su información y gestionarlos. Puedes crear nuevos ciclos, editar los existentes o eliminarlos según sea necesario.',
        addButtonLabel: 'Nuevo Ciclo Escolar',
        addButtonIcon: 'calendar-pen',
        noDataMessage: 'No se encontraron ciclos escolares.',
        searchPlaceholder: 'Buscar ciclos...',
        searchNoResultsMessage: 'No se encontraron ciclos que coincidan con la búsqueda.',
        defaultSortField: 'name',
        defaultSortDirection: 'asc',
        itemsPerPage: 10,
        searchableFields: ['name', 'status', 'statusName']
    }), []);

    // Configuración para la lista de ciclos eliminados
    const deletedCycleListConfig: DeletedItemsListConfig<SchoolCycle> = useMemo(() => ({
        title: 'Ciclos Escolares Eliminados',
        description: 'Historial de ciclos escolares que han sido eliminados del sistema.',
        defaultSortField: 'name',
        defaultSortDirection: 'asc',
        searchPlaceholder: 'Buscar ciclos eliminados...',
        noDataMessage: 'No hay ciclos escolares eliminados',
        searchNoResultsMessage: 'No se encontraron ciclos escolares que coincidan con la búsqueda',
        buttonLabel: 'Ciclos Eliminados',
        itemsPerPage: 5,
        maxHeight: '400px',
        columns: [
            {
                key: 'name',
                header: 'Nombre',
                sortable: true,
                render: (cycle: SchoolCycle) => (
                    <span className={textStyles.title}>
                        {cycle.name}
                    </span>
                )
            },
            {
                key: 'startDate',
                header: 'Fecha de Inicio',
                sortable: true,
                render: (cycle: SchoolCycle) => (
                    <span className={textStyles.normal}>
                        {formatDate(cycle.startDate)}
                    </span>
                )
            },
            {
                key: 'endDate',
                header: 'Fecha de Fin',
                sortable: true,
                render: (cycle: SchoolCycle) => (
                    <span className={textStyles.normal}>
                        {formatDate(cycle.endDate)}
                    </span>
                )
            },
            {
                key: 'groupsCount',
                header: 'Grupos',
                render: (cycle: SchoolCycle) => (
                    <span className={textStyles.normal}>
                        {cycle.groupsCount}
                    </span>
                )
            },
            {
                key: 'studentsCount',
                header: 'Alumnos',
                render: (cycle: SchoolCycle) => (
                    <span className={textStyles.normal}>
                        {cycle.studentsCount}
                    </span>
                )
            },
            {
                key: 'averageGrade',
                header: 'Promedio',
                render: (cycle: SchoolCycle) => (
                    <span className={textStyles.normal}>
                        {cycle.averageGrade.toFixed(2)}
                    </span>
                )
            },
            {
                key: 'status',
                header: 'Estado',
                sortable: true,
                sortFunction: compareByStatus,
                render: (cycle: SchoolCycle) => (
                    <Badge
                        size="sm"
                        color={getStatusColor(cycle.status)}
                    >
                        <span className={textStyles.normal}>
                            {cycle.statusName}
                        </span>
                    </Badge>
                )
            }
        ]
    }), []);

    // Configuración del modal de confirmación de eliminación
    const deleteConfirmModalConfig = useMemo(() => ({
        title: '¿Estás seguro?',
        confirmation: '¿Estás seguro de que deseas eliminar el ciclo ',
        recoveryInfo: 'Esta acción puede ser revertida más adelante desde la sección de ciclos eliminados.',
        warningTitle: '¡Atención!',
        warningMessage: 'Estás a punto de eliminar un ciclo escolar ACTIVO. Esta acción podría afectar negativamente al funcionamiento del sistema. Por favor, asegúrate de completar el ciclo escolar o activar otro ciclo antes de continuar.',
        errorTitle: '¡Error!',
        errorMessage: 'Ocurrió un error al intentar eliminar el ciclo escolar. Por favor, intenta nuevamente.',
    }), []);

    return {
        cycleColumns,
        cycleActionButtons,
        cycleListConfig,
        deletedCycleListConfig,
        deleteConfirmModalConfig
    };
} 