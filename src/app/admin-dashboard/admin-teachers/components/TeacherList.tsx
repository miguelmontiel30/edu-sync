// React
import { useEffect, useState } from 'react';

// Components
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import DataTable from '@/components/core/table/DataTable';
import ComponentCard from '@/components/common/ComponentCard';

// Types
import { Teacher, SortField } from './types';
import { SortDirection } from '@/components/core/table/module-utils/types';

// Utils
import { sortTeachers, filterTeachers } from './utils';

interface TeacherListProps {
    readonly teachers: Teacher[];
    readonly isLoading: boolean;
    readonly onEdit: (id: number) => void;
    readonly onDelete: (id: number) => void;
    readonly onAddNew: () => void;
}

export default function TeacherList({
    teachers,
    isLoading,
    onEdit,
    onDelete,
    onAddNew,
}: TeacherListProps) {
    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>(teachers);

    // Efecto para filtrar los profesores cuando cambia el término de búsqueda
    useEffect(() => {
        if (!searchTerm) {
            setFilteredTeachers(teachers);
        } else {
            const filtered = filterTeachers(teachers, searchTerm);
            setFilteredTeachers(filtered);
        }
    }, [teachers, searchTerm]);

    // Manejar la búsqueda desde el DataTable
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Manejar el ordenamiento desde el DataTable
    const handleSort = (field: string, direction: SortDirection) => {
        // Ordenar los profesores según el campo y dirección
        const sorted = sortTeachers(filteredTeachers, field as SortField, direction);

        // Actualizar el estado de los profesores filtrados
        setFilteredTeachers(sorted);
    };

    // Definir las columnas para el DataTable
    const columns = [
        {
            id: 'name',
            label: 'Nombre',
            accessor: 'name',
            key: 'name',
            header: 'Nombre',
            sortable: true,
        },
        {
            id: 'email',
            label: 'Email',
            accessor: 'email',
            key: 'email',
            header: 'Email',
            sortable: true,
            render: (teacher: Teacher) => (
                <span>
                    {teacher.email || <span className="italic text-gray-400">No disponible</span>}
                </span>
            ),
        },
        {
            id: 'phone',
            label: 'Teléfono',
            accessor: 'phone',
            key: 'phone',
            header: 'Teléfono',
            sortable: true,
            render: (teacher: Teacher) => (
                <span>
                    {teacher.phone || <span className="italic text-gray-400">No disponible</span>}
                </span>
            ),
        },
        {
            id: 'groupsCount',
            label: 'Grupos',
            accessor: 'groupsCount',
            key: 'groupsCount',
            header: 'Grupos',
            sortable: true,
            render: (teacher: Teacher) => (
                <div className="text-center">
                    <span className="rounded-md bg-blue-100 px-2 py-1 text-blue-800">
                        {teacher.groupsCount}
                    </span>
                </div>
            ),
        },
        {
            id: 'subjectsCount',
            label: 'Materias',
            accessor: 'subjectsCount',
            key: 'subjectsCount',
            header: 'Materias',
            sortable: true,
            render: (teacher: Teacher) => (
                <div className="text-center">
                    <span className="rounded-md bg-indigo-100 px-2 py-1 text-indigo-800">
                        {teacher.subjectsCount}
                    </span>
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Acciones',
            sortable: false,
            render: (teacher: Teacher) => (
                <div className="flex flex-col justify-center gap-2 sm:flex-row">
                    <Button
                        variant="outline"
                        size="sm"
                        startIcon={<IconFA icon="user-pen" style="duotone" />}
                        onClick={() => onEdit(teacher.teacher_id)}
                    >
                        <span className="font-outfit">Editar</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        startIcon={<IconFA icon="user-xmark" style="duotone" />}
                        onClick={() => onDelete(teacher.teacher_id)}
                    >
                        <span className="font-outfit">Eliminar</span>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <ComponentCard
            title="Lista de profesores"
            desc="Aquí podrás ver todos los profesores registrados, su información y gestionarlos. Puedes crear nuevos profesores, editar los existentes o eliminarlos según sea necesario."
        >
            <div className="mb-4 flex justify-end">
                <Button
                    variant="primary"
                    startIcon={<IconFA icon="user-plus" style="solid" />}
                    onClick={onAddNew}
                >
                    <span className="font-outfit">Nuevo Profesor</span>
                </Button>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="flex h-[200px] items-center justify-center">
                        <IconFA icon="spinner" spin className="text-gray-400" />
                    </div>
                ) : (
                    <DataTable
                        data={filteredTeachers}
                        columns={columns}
                        keyExtractor={teacher => teacher.teacher_id}
                        searchable
                        searchPlaceholder="Buscar por nombre, email, teléfono..."
                        defaultSortField="name"
                        defaultSortDirection="asc"
                        isLoading={isLoading}
                        noDataMessage="No se encontraron profesores."
                        searchNoResultsMessage="No se encontraron profesores que coincidan con la búsqueda."
                        itemsPerPage={10}
                        onSearch={handleSearch}
                        onSort={handleSort}
                    />
                )}
            </div>
        </ComponentCard>
    );
}
