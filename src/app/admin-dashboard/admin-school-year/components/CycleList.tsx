import { useState, useEffect } from 'react';
import { SchoolCycle, SortField, SortDirection } from './types';
import { sortCycles, filterCycles, getStatusColor } from './utils';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/core/table';
import IconFA from '@/components/ui/IconFA';
import Input from '@/components/form/input/InputField';
import ComponentCard from '@/components/common/ComponentCard';

interface CycleListProps {
    cycles: SchoolCycle[];
    isLoading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onAddNew: () => void;
}

export default function CycleList({ cycles, isLoading, onEdit, onDelete, onAddNew }: CycleListProps) {
    const [filteredCycles, setFilteredCycles] = useState<SchoolCycle[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Función para manejar el ordenamiento
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Efecto para actualizar los ciclos filtrados y ordenados
    useEffect(() => {
        const filtered = filterCycles(cycles, searchTerm);
        const sorted = sortCycles(filtered, sortField, sortDirection);
        setFilteredCycles(sorted);
    }, [cycles, searchTerm, sortField, sortDirection]);

    return (
        <ComponentCard title="Lista de ciclos escolares" desc='Aquí podrás ver todos los ciclos escolares registrados, su información y gestionarlos. Puedes crear nuevos ciclos, editar los existentes o eliminarlos según sea necesario.' className={`w-100 p-4`}>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-64">
                    <Input
                        type="text"
                        placeholder="Buscar ciclos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        startIcon={<IconFA icon="search" style="solid" className="text-gray-400" />}
                    />
                </div>
                <Button
                    variant="primary"
                    startIcon={<IconFA icon="calendar-pen" style="solid" />}
                    onClick={onAddNew}
                >
                    <span className="font-outfit">Nuevo Ciclo Escolar</span>
                </Button>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : (
                    <Table className="min-w-full">
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Nombre
                                        {sortField === 'name' && (
                                            <IconFA icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} style="solid" className={`text-${sortDirection === 'asc' ? 'primary' : 'gray-400'}`} />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => handleSort('startDate')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Fecha de Inicio
                                        {sortField === 'startDate' && (
                                            <IconFA icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} style="solid" className={`text-${sortDirection === 'asc' ? 'primary' : 'gray-400'}`} />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => handleSort('endDate')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Fecha de Fin
                                        {sortField === 'endDate' && (
                                            <IconFA icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} style="solid" className={`text-${sortDirection === 'asc' ? 'primary' : 'gray-400'}`} />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => handleSort('groupsCount')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Grupos
                                        {sortField === 'groupsCount' && (
                                            <IconFA icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} style="solid" className={`text-${sortDirection === 'asc' ? 'primary' : 'gray-400'}`} />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => handleSort('studentsCount')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Alumnos
                                        {sortField === 'studentsCount' && (
                                            <IconFA icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} style="solid" className={`text-${sortDirection === 'asc' ? 'primary' : 'gray-400'}`} />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => handleSort('averageGrade')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Promedio
                                        {sortField === 'averageGrade' && (
                                            <IconFA icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} style="solid" className={`text-${sortDirection === 'asc' ? 'primary' : 'gray-400'}`} />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Estado
                                        {sortField === 'status' && (
                                            <IconFA icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} style="solid" className={`text-${sortDirection === 'asc' ? 'primary' : 'gray-400'}`} />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                >
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {filteredCycles.map(cycle => (
                                <TableRow key={cycle.id}>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                            {cycle.name}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                            {new Date(cycle.startDate).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                            {new Date(cycle.endDate).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                            {cycle.groupsCount}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                            {cycle.studentsCount}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                            {cycle.averageGrade.toFixed(2)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <Badge
                                            size="sm"
                                            color={getStatusColor(cycle.status)}
                                        >
                                            <span className="font-outfit">
                                                {cycle.statusName}
                                            </span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <Button
                                            className="mr-2"
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
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredCycles.length === 0 && (
                                <TableRow>
                                    <TableCell className="px-5 py-4 text-center sm:px-6" colSpan={8}>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit text-center block">
                                            {searchTerm ? 'No se encontraron ciclos que coincidan con la búsqueda.' : 'No se encontraron ciclos escolares.'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </ComponentCard>
    );
} 