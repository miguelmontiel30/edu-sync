import React, { useState } from 'react';
import Button from '@/components/core/button/Button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/core/table';
import ComponentCard from '@/components/common/ComponentCard';
import Input from '@/components/form/input/InputField';
import IconFA from '@/components/ui/IconFA';
import { Teacher, SortField, SortDirection } from './types';

interface TeacherListProps {
    teachers: Teacher[];
    isLoading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onAddNew: () => void;
}

export default function TeacherList({ teachers, isLoading, onEdit, onDelete, onAddNew }: TeacherListProps) {
    // Estado local para búsqueda y paginación
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [itemsPerPage] = useState(10);

    // Función para ordenar profesores
    const sortTeachers = (teachersToSort: Teacher[]) => {
        return [...teachersToSort].sort((a, b) => {
            const aValue = a[sortField] || '';
            const bValue = b[sortField] || '';

            // Comparación especial para campos numéricos
            if (sortField === 'groupsCount' || sortField === 'subjectsCount') {
                return sortDirection === 'asc'
                    ? (a[sortField] || 0) - (b[sortField] || 0)
                    : (b[sortField] || 0) - (a[sortField] || 0);
            }

            // Comparación para campos de texto
            const comparison = String(aValue).localeCompare(String(bValue));
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    };

    // Función para filtrar profesores
    const filterTeachers = (teachersToFilter: Teacher[], term: string) => {
        if (!term) return teachersToFilter;

        const lowercaseTerm = term.toLowerCase();
        return teachersToFilter.filter(teacher =>
            teacher.name.toLowerCase().includes(lowercaseTerm) ||
            (teacher.email && teacher.email.toLowerCase().includes(lowercaseTerm)) ||
            (teacher.phone && teacher.phone.toLowerCase().includes(lowercaseTerm))
        );
    };

    // Calcular profesores paginados
    const filteredTeachers = filterTeachers(teachers, searchTerm);
    const sortedTeachers = sortTeachers(filteredTeachers);

    const indexOfLastTeacher = currentPage * itemsPerPage;
    const indexOfFirstTeacher = indexOfLastTeacher - itemsPerPage;
    const currentTeachers = sortedTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
    const totalPages = Math.ceil(sortedTeachers.length / itemsPerPage);

    // Manejar cambio de ordenamiento
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <ComponentCard
            title="Lista de profesores"
            desc="Aquí podrás ver todos los profesores registrados, su información y gestionarlos. Puedes crear nuevos profesores, editar los existentes o eliminarlos según sea necesario."
        >
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-64">
                    <Input
                        type="text"
                        placeholder="Buscar profesores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        startIcon={<IconFA icon="search" className="text-gray-400" />}
                    />
                </div>
                <Button
                    variant="primary"
                    startIcon={<IconFA icon="user-plus" />}
                    onClick={onAddNew}
                >
                    <span className="font-outfit">Nuevo Profesor</span>
                </Button>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : (
                    <Table
                        className="min-w-full"
                        maxHeight="500px"
                        pagination={{
                            currentPage,
                            totalPages,
                            onPageChange: setCurrentPage
                        }}
                    >
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
                                            <IconFA
                                                icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                                                className="text-xs"
                                            />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Email
                                        {sortField === 'email' && (
                                            <IconFA
                                                icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                                                className="text-xs"
                                            />
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
                                            <IconFA
                                                icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                                                className="text-xs"
                                            />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => handleSort('subjectsCount')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Materias
                                        {sortField === 'subjectsCount' && (
                                            <IconFA
                                                icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                                                className="text-xs"
                                            />
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
                            {currentTeachers.map((teacher) => (
                                <TableRow key={teacher.teacher_id}>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <div className="flex items-center justify-center">
                                            {teacher.image_url ? (
                                                <img
                                                    src={teacher.image_url}
                                                    alt={teacher.name}
                                                    className="h-8 w-8 rounded-full mr-2"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                                    <IconFA icon="user" className="text-gray-500" />
                                                </div>
                                            )}
                                            <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                {teacher.name}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                            {teacher.email || 'No disponible'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                            {teacher.groupsCount}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                            {teacher.subjectsCount}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <Button
                                            className="mr-2"
                                            variant="outline"
                                            size="sm"
                                            startIcon={<IconFA icon="pen-to-square" />}
                                            onClick={() => onEdit(teacher.teacher_id)}
                                        >
                                            <span className="font-outfit">Editar</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            startIcon={<IconFA icon="trash" />}
                                            onClick={() => onDelete(teacher.teacher_id)}
                                        >
                                            <span className="font-outfit">Eliminar</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {currentTeachers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="px-5 py-4 text-center sm:px-6">
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                            {searchTerm
                                                ? 'No se encontraron profesores que coincidan con la búsqueda.'
                                                : 'No se encontraron profesores.'}
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