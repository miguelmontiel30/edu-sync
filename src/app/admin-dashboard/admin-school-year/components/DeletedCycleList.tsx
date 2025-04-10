// React
import { useState } from 'react';

// Componentes
import IconFA from '@/components/ui/IconFA';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import { DataTable, Column } from '@/components/core/table';
import ComponentCard from '@/components/common/ComponentCard';

// Utils
import { SchoolCycle } from './types';
import { getStatusColor } from './utils';

interface DeletedCycleListProps {
    readonly cycles: SchoolCycle[];
    readonly isLoading: boolean;
    readonly onRestore: (id: number) => void;
}

export default function DeletedCycleList({ cycles, isLoading, onRestore }: DeletedCycleListProps) {
    const [showDeleted, setShowDeleted] = useState(false);

    // Definir las columnas de la tabla
    const columns: Column<SchoolCycle>[] = [
        {
            key: 'name',
            header: 'Nombre',
            sortable: true,
            render: (cycle) => (
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                    {cycle.name}
                </span>
            )
        },
        {
            key: 'startDate',
            header: 'Fecha de Inicio',
            sortable: true,
            render: (cycle) => (
                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                    {new Date(cycle.startDate).toLocaleDateString()}
                </span>
            )
        },
        {
            key: 'endDate',
            header: 'Fecha de Fin',
            sortable: true,
            render: (cycle) => (
                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                    {new Date(cycle.endDate).toLocaleDateString()}
                </span>
            )
        },
        {
            key: 'groupsCount',
            header: 'Grupos',
            render: (cycle) => (
                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                    {cycle.groupsCount}
                </span>
            )
        },
        {
            key: 'studentsCount',
            header: 'Alumnos',
            render: (cycle) => (
                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                    {cycle.studentsCount}
                </span>
            )
        },
        {
            key: 'averageGrade',
            header: 'Promedio',
            render: (cycle) => (
                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                    {cycle.averageGrade.toFixed(2)}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Estado',
            sortable: true,
            render: (cycle) => (
                <Badge
                    size="sm"
                    color={getStatusColor(cycle.status)}
                >
                    <span className="font-outfit">
                        {cycle.statusName}
                    </span>
                </Badge>
            )
        },
        {
            key: 'actions',
            header: 'Acciones',
            render: (cycle) => (
                <Button
                    variant="outline"
                    size="sm"
                    startIcon={<IconFA icon="rotate-left" style="duotone" />}
                    onClick={() => onRestore(cycle.id)}
                >
                    <span className="font-outfit">Restaurar</span>
                </Button>
            )
        }
    ];

    return (
        <ComponentCard
            title="Ciclos Escolares Eliminados"
            desc="Historial de ciclos escolares que han sido eliminados del sistema."
            className="mt-6"
        >
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleted(!showDeleted)}
                    className="flex items-center gap-1"
                >
                    <IconFA icon={showDeleted ? 'eye-slash' : 'eye'} style="solid" className="text-gray-500" />
                    <span className="font-outfit">{showDeleted ? 'Ocultar' : 'Mostrar'} Eliminados</span>
                </Button>
            </div>

            {showDeleted && (
                <DataTable
                    data={cycles}
                    columns={columns}
                    keyExtractor={(cycle) => cycle.id}
                    searchable={true}
                    searchPlaceholder="Buscar ciclos eliminados..."
                    defaultSortField="name"
                    defaultSortDirection="asc"
                    isLoading={isLoading}
                    noDataMessage="No hay ciclos escolares eliminados"
                    searchNoResultsMessage="No se encontraron ciclos escolares que coincidan con la búsqueda"
                    itemsPerPage={5}
                    maxHeight="400px"
                />
            )}
        </ComponentCard>
    );
} 