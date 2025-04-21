import { useState, useEffect } from 'react';
import { SchoolCycle, SortField, SortDirection } from './types';
import { sortCycles, filterCycles, getStatusColor } from './utils';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import DataTable from '@/components/core/table/DataTable';
import IconFA from '@/components/ui/IconFA';
import ComponentCard from '@/components/common/ComponentCard';

interface CycleListProps {
    readonly cycles: SchoolCycle[];
    readonly isLoading: boolean;
    readonly onEdit: (id: number) => void;
    readonly onDelete: (id: number) => void;
    readonly onAddNew: () => void;
}

export default function CycleList({ cycles, isLoading, onEdit, onDelete, onAddNew }: CycleListProps) {
    // States
    const [filteredCycles, setFilteredCycles] = useState<SchoolCycle[]>(cycles);
    const [searchTerm, setSearchTerm] = useState('');

    // Efecto para filtrar los ciclos cuando cambia el término de búsqueda
    useEffect(() => {
        if (!searchTerm) {
            setFilteredCycles(cycles);
        } else {
            const filtered = filterCycles(cycles, searchTerm);
            setFilteredCycles(filtered);
        }
    }, [cycles, searchTerm]);

    // Manejar la búsqueda desde el DataTable
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Manejar el ordenamiento desde el DataTable
    const handleSort = (field: string, direction: SortDirection) => {
        // Ordenar los ciclos según el campo y dirección
        const sorted = sortCycles(filteredCycles, field as SortField, direction);

        // Actualizar el estado de los ciclos filtrados
        setFilteredCycles(sorted);
    };

    // Definir las columnas para el DataTable
    const columns = [
        {
            key: 'name',
            header: 'Nombre',
            sortable: true
        },
        {
            key: 'startDate',
            header: 'Fecha de Inicio',
            sortable: true,
            render: (cycle: SchoolCycle) => (
                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                    {new Date(cycle.startDate).toLocaleDateString()}
                </span>
            )
        },
        {
            key: 'endDate',
            header: 'Fecha de Fin',
            sortable: true,
            render: (cycle: SchoolCycle) => (
                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                    {new Date(cycle.endDate).toLocaleDateString()}
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
                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                    {cycle.averageGrade.toFixed(2)}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Estado',
            sortable: true,
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
        },
        {
            key: 'actions',
            header: 'Acciones',
            sortable: false,
            render: (cycle: SchoolCycle) => (
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        startIcon={<IconFA icon="calendar-pen" style="duotone" />}
                        onClick={() => onEdit(cycle.id)}
                    >
                        <span className="font-outfit">Editar</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        startIcon={<IconFA icon="calendar-xmark" style="duotone" />}
                        onClick={() => onDelete(cycle.id)}
                    >
                        <span className="font-outfit">Eliminar</span>
                    </Button>
                </div>
            )
        }
    ];

    return (
        <ComponentCard title="Lista de ciclos escolares" desc='Aquí podrás ver todos los ciclos escolares registrados, su información y gestionarlos. Puedes crear nuevos ciclos, editar los existentes o eliminarlos según sea necesario.' className={`w-100 p-2`}>
            <div className="mb-4 flex justify-end">
                <Button
                    variant="primary"
                    startIcon={<IconFA icon="calendar-pen" style="solid" />}
                    onClick={onAddNew}
                >
                    <span className="font-outfit">Nuevo Ciclo Escolar</span>
                </Button>
            </div>

            <DataTable
                data={filteredCycles}
                columns={columns}
                keyExtractor={(cycle) => cycle.id}
                searchable={true}
                searchPlaceholder="Buscar ciclos..."
                defaultSortField="name"
                defaultSortDirection="asc"
                isLoading={isLoading}
                noDataMessage="No se encontraron ciclos escolares."
                searchNoResultsMessage="No se encontraron ciclos que coincidan con la búsqueda."
                itemsPerPage={10}
                onSearch={handleSearch}
                onSort={handleSort}
            />
        </ComponentCard>
    );
} 