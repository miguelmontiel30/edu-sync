'use client';

import { useState, useEffect } from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/core/table';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { supabaseClient } from '@/services/config/supabaseClient';

interface Teacher {
    teacher_id: number;
    school_id: number;
    name: string;
    role: string;
    image: string | null;
    email: string | null;
    phone: string | null;
    delete_flag: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface Group {
    group_id: number;
    grade: number;
    group_name: string;
    school_year_id: number;
    school_year_name: string;
}

export default function AdminTeachersDashboard() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
    const [deletedTeachers, setDeletedTeachers] = useState<Teacher[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<'name' | 'email' | 'role'>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [activeGroups, setActiveGroups] = useState<Group[]>([]);
    const [teacherForm, setTeacherForm] = useState({
        name: '',
        role: '',
        image: '',
        email: '',
        phone: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
    const [isLoadingDeleted, setIsLoadingDeleted] = useState(true);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [teachersByGroup, setTeachersByGroup] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        loadTeachers();
        loadDeletedTeachers();
        loadActiveGroups();
    }, []);

    useEffect(() => {
        async function loadTeachersByGroup() {
            if (!activeGroups[0]?.school_year_name) return;

            try {
                const { data, error } = await supabaseClient
                    .from('group_teachers')
                    .select(`
                        groups!inner (
                            grade,
                            group_name,
                            school_years!inner (
                                name
                            )
                        )
                    `)
                    .eq('delete_flag', false)
                    .eq('groups.school_years.name', activeGroups[0]?.school_year_name);

                if (error) throw error;

                if (data) {
                    const groupCounts: { [key: string]: number } = {};
                    data.forEach((item: any) => {
                        const groupKey = `${item.groups.grade}${item.groups.group_name}`;
                        groupCounts[groupKey] = (groupCounts[groupKey] || 0) + 1;
                    });
                    setTeachersByGroup(groupCounts);
                }
            } catch (error) {
                console.error('Error al cargar profesores por grupo:', error);
            }
        }

        loadTeachersByGroup();
    }, [activeGroups]);

    async function loadTeachers() {
        setIsLoadingTeachers(true);
        try {
            const { data, error } = await supabaseClient
                .from('teachers')
                .select('*')
                .eq('delete_flag', false)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTeachers(data || []);
            setFilteredTeachers(data || []);
        } catch (error) {
            console.error('Error al cargar los profesores:', error);
            alert('Error al cargar los profesores. Por favor recarga la página.');
        } finally {
            setIsLoadingTeachers(false);
        }
    }

    async function loadDeletedTeachers() {
        setIsLoadingDeleted(true);
        try {
            const { data, error } = await supabaseClient
                .from('teachers')
                .select('*')
                .eq('delete_flag', true)
                .order('deleted_at', { ascending: false });

            if (error) throw error;
            setDeletedTeachers(data || []);
        } catch (error) {
            console.error('Error al cargar los profesores eliminados:', error);
        } finally {
            setIsLoadingDeleted(false);
        }
    }

    async function loadActiveGroups() {
        setIsLoadingGroups(true);
        try {
            const { data, error } = await supabaseClient
                .from('groups')
                .select(`
                    group_id,
                    grade,
                    group_name,
                    school_year_id,
                    school_years!inner (
                        name
                    )
                `)
                .eq('delete_flag', false)
                .eq('status', 'active')
                .order('grade', { ascending: true })
                .order('group_name', { ascending: true });

            if (error) throw error;

            if (data) {
                const formattedGroups: Group[] = data.map((group: any) => ({
                    group_id: group.group_id,
                    grade: group.grade,
                    group_name: group.group_name,
                    school_year_id: group.school_year_id,
                    school_year_name: group.school_years.name
                }));
                setActiveGroups(formattedGroups);
            }
        } catch (error) {
            console.error('Error al cargar los grupos activos:', error);
        } finally {
            setIsLoadingGroups(false);
        }
    }

    const handleEdit = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setTeacherForm({
            name: teacher.name,
            role: teacher.role,
            image: teacher.image || '',
            email: teacher.email || '',
            phone: teacher.phone || '',
        });
        setIsModalOpen(true);
    };

    async function handleDelete(id: number) {
        if (!confirm('¿Estás seguro de que deseas eliminar este profesor?')) return;
        setIsSaving(true);
        try {
            const { error } = await supabaseClient
                .from('teachers')
                .update({ delete_flag: true, deleted_at: new Date().toISOString() })
                .eq('teacher_id', id);

            if (error) throw error;
            await loadTeachers();
            await loadDeletedTeachers();
        } catch (error) {
            console.error('Error al eliminar el profesor:', error);
            alert('Error al eliminar el profesor. Por favor intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleRestore(id: number) {
        setIsSaving(true);
        try {
            const { error } = await supabaseClient
                .from('teachers')
                .update({ delete_flag: false, deleted_at: null })
                .eq('teacher_id', id);

            if (error) throw error;
            await loadTeachers();
            await loadDeletedTeachers();
        } catch (error) {
            console.error('Error al restaurar el profesor:', error);
            alert('Error al restaurar el profesor. Por favor intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    }

    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortTeachers = (teachers: Teacher[]) => {
        return [...teachers].sort((a, b) => {
            const aValue = a[sortField] || '';
            const bValue = b[sortField] || '';
            const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    };

    const filterTeachers = (teachers: Teacher[], term: string) => {
        if (!term) return teachers;
        return teachers.filter(teacher =>
            teacher.name.toLowerCase().includes(term.toLowerCase()) ||
            teacher.email?.toLowerCase().includes(term.toLowerCase()) ||
            teacher.role.toLowerCase().includes(term.toLowerCase())
        );
    };

    function openModal() {
        setSelectedTeacher(null);
        setTeacherForm({
            name: '',
            role: '',
            image: '',
            email: '',
            phone: '',
        });
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setSelectedTeacher(null);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string) {
        if (typeof e === 'string') {
            setTeacherForm(prev => ({ ...prev, role: e }));
        } else {
            const { name, value } = e.target;
            setTeacherForm(prev => ({ ...prev, [name]: value }));
        }
    }

    async function handleSaveTeacher() {
        setIsSaving(true);
        try {
            if (selectedTeacher) {
                const { error } = await supabaseClient
                    .from('teachers')
                    .update(teacherForm)
                    .eq('teacher_id', selectedTeacher.teacher_id);

                if (error) throw error;
            } else {
                const { error } = await supabaseClient
                    .from('teachers')
                    .insert([{ ...teacherForm, school_id: 1 }]);

                if (error) {
                    if (error.code === '23505') {
                        alert('Ya existe un profesor registrado con este correo electrónico. Por favor, verifica los datos e intenta nuevamente.');
                        return;
                    }
                    throw error;
                }
            }
            closeModal();
            await loadTeachers();
        } catch (error) {
            console.error('Error al guardar el profesor:', error);
            alert('Error al guardar el profesor. Por favor intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    }

    // Calcular métricas
    const totalTeachers = teachers.length;
    const activeTeachers = teachers.filter(teacher => teacher.role === 'profesor').length;
    const inactiveTeachers = teachers.filter(teacher => teacher.role !== 'profesor').length;

    // Obtener el ciclo escolar activo actual
    const currentSchoolYear = activeGroups[0]?.school_year_name;

    // Configuración de gráficas
    const groupOptions: ApexOptions = {
        chart: {
            type: 'bar',
            height: 180,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '39%',
                borderRadius: 5,
                borderRadiusApplication: 'end',
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => val.toString()
        },
        stroke: {
            show: true,
            width: 4,
            colors: ['transparent']
        },
        xaxis: {
            categories: activeGroups.map(group => `${group.grade}° ${group.group_name}`),
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            labels: {
                style: {
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Número de profesores'
            }
        },
        fill: {
            opacity: 1,
            colors: ['#465fff']
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} profesores`
            }
        }
    };

    const groupSeries = [{
        name: 'Profesores',
        data: activeGroups.map(group => {
            const groupKey = `${group.grade}${group.group_name}`;
            return teachersByGroup[groupKey] || 0;
        })
    }];

    // Calcular profesores paginados
    const indexOfLastTeacher = currentPage * itemsPerPage;
    const indexOfFirstTeacher = indexOfLastTeacher - itemsPerPage;
    const currentTeachers = sortTeachers(filterTeachers(teachers, searchTerm)).slice(indexOfFirstTeacher, indexOfLastTeacher);
    const totalPages = Math.ceil(sortTeachers(filterTeachers(teachers, searchTerm)).length / itemsPerPage);

    return (
        <div className="container mx-auto p-6">
            <PageBreadcrumb pageTitle="Gestión de profesores" />

            {/* Métricas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6 mb-6">
                {/* Total de Profesores */}
                <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    {totalTeachers === 0 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                        </div>
                    )}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                        <i className="fa-duotone fa-solid fa-person-chalkboard fa-xl text-gray-800 dark:text-white/90"></i>
                    </div>
                    <div className="mt-5 flex items-end justify-between">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                Total de Profesores
                            </span>
                            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                {totalTeachers}
                            </h4>
                        </div>
                        <Badge color="info">
                            <span className="font-outfit">
                                {activeTeachers} activos
                            </span>
                        </Badge>
                    </div>
                </div>

                {/* Promedio de Profesores por Grado */}
                <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    {totalTeachers === 0 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                        </div>
                    )}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                        <i className="fa-duotone fa-solid fa-graduation-cap fa-xl text-gray-800 dark:text-white/90"></i>
                    </div>
                    <div className="mt-5 flex items-end justify-between">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                Promedio por Grado
                            </span>
                            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                {Object.keys(teachersByGroup).length > 0
                                    ? (Object.values(teachersByGroup).reduce((a, b) => a + b, 0) / Object.keys(teachersByGroup).length).toFixed(1)
                                    : '0'} profesores
                            </h4>
                        </div>
                        <Badge color="success">
                            <span className="font-outfit">
                                {Object.keys(teachersByGroup).length} grados
                            </span>
                        </Badge>
                    </div>
                </div>

                {/* Profesores Inactivos */}
                <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    {totalTeachers === 0 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                        </div>
                    )}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                        <i className="fa-duotone fa-solid fa-user-slash fa-xl text-gray-800 dark:text-white/90"></i>
                    </div>
                    <div className="mt-5 flex items-end justify-between">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                Profesores Inactivos
                            </span>
                            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                {inactiveTeachers}
                            </h4>
                        </div>
                        <Badge color="warning">
                            <span className="font-outfit">
                                {((inactiveTeachers / totalTeachers) * 100).toFixed(1)}% del total
                            </span>
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
                {/* Profesores por Grupo */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    {isLoadingGroups ? (
                        <div className="flex items-center justify-center h-[180px]">
                            <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                        </div>
                    ) : activeGroups.length === 0 ? (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                    Profesores por Grupo
                                </h3>
                                <Badge color="info">
                                    <span className="font-outfit">
                                        {currentSchoolYear}
                                    </span>
                                </Badge>
                            </div>
                            <div className="custom-scrollbar max-w-full overflow-x-auto">
                                <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
                                    <ReactApexChart
                                        options={groupOptions}
                                        series={groupSeries}
                                        type="bar"
                                        height={180}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tabla Principal */}
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
                            startIcon={<i className="fa-duotone fa-solid fa-search text-gray-400"></i>}
                        />
                    </div>
                    <Button
                        variant="primary"
                        startIcon={<i className="fa-duotone fa-solid fa-user-plus"></i>}
                        onClick={openModal}
                        disabled={isSaving}
                    >
                        <span className="font-outfit">Nuevo Profesor</span>
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    {isLoadingTeachers ? (
                        <div className="flex items-center justify-center h-[200px]">
                            <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
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
                                                <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
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
                                                <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                        onClick={() => handleSort('role')}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            Rol
                                            {sortField === 'role' && (
                                                <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
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
                                            <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                {teacher.name}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                {teacher.email}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                {teacher.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <Button
                                                className="mr-2"
                                                variant="outline"
                                                size="sm"
                                                startIcon={<i className="fa-duotone fa-solid fa-pen-to-square"></i>}
                                                onClick={() => handleEdit(teacher)}
                                            >
                                                <span className="font-outfit">Editar</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                startIcon={<i className="fa-duotone fa-solid fa-trash"></i>}
                                                onClick={() => handleDelete(teacher.teacher_id)}
                                            >
                                                <span className="font-outfit">Eliminar</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {teachers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                {searchTerm ? 'No se encontraron profesores que coincidan con la búsqueda.' : 'No se encontraron profesores.'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </ComponentCard>

            {/* Profesores Eliminados */}
            <div className="mt-6">
                <button
                    onClick={() => setShowDeleted(!showDeleted)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left dark:border-gray-800 dark:bg-white/[0.03]"
                >
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                            Profesores Eliminados
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            {deletedTeachers.length} profesores en la papelera
                        </p>
                    </div>
                    <i className={`fa-duotone fa-solid fa-chevron-${showDeleted ? 'up' : 'down'} text-gray-500 dark:text-gray-400`}></i>
                </button>

                {showDeleted && (
                    <div className="mt-4">
                        <div className="overflow-x-auto">
                            {isLoadingDeleted ? (
                                <div className="flex items-center justify-center h-[200px]">
                                    <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                                </div>
                            ) : (
                                <Table className="min-w-full">
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell isHeader>Nombre</TableCell>
                                            <TableCell isHeader>Email</TableCell>
                                            <TableCell isHeader>Acciones</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {deletedTeachers.map((teacher) => (
                                            <TableRow key={teacher.teacher_id}>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                        {teacher.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                        {teacher.email}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        startIcon={<i className="fa-duotone fa-solid fa-rotate-left"></i>}
                                                        onClick={() => handleRestore(teacher.teacher_id)}
                                                    >
                                                        <span className="font-outfit">Restaurar</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {deletedTeachers.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                        No hay profesores eliminados
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                            {selectedTeacher ? "Editar profesor" : "Define un nuevo profesor"}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            Ingresa la información del profesor para registrarlo en el sistema.
                        </p>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveTeacher(); }} className="mt-8 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={teacherForm.name}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="role">Rol</Label>
                                <Select
                                    options={[
                                        { value: "", label: "Selecciona un rol" },
                                        { value: "profesor", label: "Profesor" },
                                        { value: "coordinador", label: "Coordinador" },
                                        { value: "director", label: "Director" },
                                    ]}
                                    placeholder="Selecciona un rol"
                                    onChange={handleInputChange}
                                    defaultValue={teacherForm.role}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={teacherForm.email}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={teacherForm.phone}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="image">URL de la Imagen</Label>
                                <Input
                                    id="image"
                                    name="image"
                                    value={teacherForm.image}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                            <Button
                                onClick={closeModal}
                                variant="outline"
                                className="sm:w-auto"
                                disabled={isSaving}
                            >
                                <span className="font-outfit">Cancelar</span>
                            </Button>
                            <Button
                                onClick={handleSaveTeacher}
                                variant="primary"
                                className="sm:w-auto"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <i className="fa-duotone fa-solid fa-spinner fa-spin mr-2"></i>
                                        <span className="font-outfit">Guardando...</span>
                                    </>
                                ) : (
                                    <span className="font-outfit">{selectedTeacher ? "Actualizar Profesor" : "Crear Profesor"}</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
} 