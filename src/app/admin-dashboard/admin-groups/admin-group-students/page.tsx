'use client';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/core/table';
import { supabaseClient } from '@/services/config/supabaseClient';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';

interface Student {
    student_id: number;
    first_name: string;
    father_last_name: string;
    mother_last_name: string;
    curp: string;
    grade_level: string;
    status: string;
}

interface Group {
    group_id: number;
    grade: number;
    group_name: string;
    school_year_id: number;
    school_year_name: string;
}

interface GroupStudent {
    student_group_id: number;
    student_id: number;
    group_id: number;
    enrollment_date: string;
    status: string;
    student: Student;
}

export default function GroupStudentsDashboard() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [groupStudents, setGroupStudents] = useState<GroupStudent[]>([]);
    const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [sortField, setSortField] = useState<'name' | 'curp' | 'status'>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            loadGroupStudents();
            loadAvailableStudents();
        }
    }, [selectedGroup]);

    async function loadGroups() {
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
                setGroups(formattedGroups);
            }
        } catch (error) {
            console.error('Error al cargar los grupos:', error);
            alert('Error al cargar los grupos. Por favor recarga la página.');
        } finally {
            setIsLoadingGroups(false);
        }
    }

    async function loadGroupStudents() {
        if (!selectedGroup) return;
        setIsLoadingStudents(true);
        try {
            const { data, error } = await supabaseClient
                .from('student_groups')
                .select(`
                    student_group_id,
                    student_id,
                    group_id,
                    enrollment_date,
                    status,
                    students (
                        student_id,
                        first_name,
                        father_last_name,
                        mother_last_name,
                        curp,
                        grade_level
                    )
                `)
                .eq('group_id', selectedGroup.group_id)
                .eq('delete_flag', false);

            if (error) throw error;

            if (data) {
                const formattedStudents: GroupStudent[] = data.map((item: any) => ({
                    student_group_id: item.student_group_id,
                    student_id: item.student_id,
                    group_id: item.group_id,
                    enrollment_date: item.enrollment_date,
                    status: item.status,
                    student: {
                        student_id: item.students.student_id,
                        first_name: item.students.first_name,
                        father_last_name: item.students.father_last_name,
                        mother_last_name: item.students.mother_last_name,
                        curp: item.students.curp,
                        grade_level: item.students.grade_level,
                        status: item.status
                    }
                }));
                setGroupStudents(formattedStudents);
            }
        } catch (error) {
            console.error('Error al cargar los estudiantes del grupo:', error);
            alert('Error al cargar los estudiantes del grupo. Por favor recarga la página.');
        } finally {
            setIsLoadingStudents(false);
        }
    }

    async function loadAvailableStudents() {
        if (!selectedGroup) return;
        setIsLoadingMetrics(true);
        try {
            const { data: groupStudents, error: groupError } = await supabaseClient
                .from('student_groups')
                .select(`
                    student_id,
                    groups!inner (
                        school_year_id
                    )
                `)
                .eq('groups.school_year_id', selectedGroup.school_year_id)
                .eq('delete_flag', false);

            if (groupError) throw groupError;

            if (!groupStudents || groupStudents.length === 0) {
                const { data, error } = await supabaseClient
                    .from('students')
                    .select('*')
                    .eq('delete_flag', false);

                if (error) throw error;
                setAvailableStudents(data || []);
                return;
            }

            const { data, error } = await supabaseClient
                .from('students')
                .select('*')
                .eq('delete_flag', false)
                .not('student_id', 'in', `(${groupStudents.map(gs => gs.student_id).join(',')})`);

            if (error) throw error;
            setAvailableStudents(data || []);
        } catch (error) {
            console.error('Error al cargar los estudiantes disponibles:', error);
            alert('Error al cargar los estudiantes disponibles. Por favor recarga la página.');
        } finally {
            setIsLoadingMetrics(false);
        }
    }

    function handleGroupChange(value: string) {
        const group = groups.find(g => `${g.grade}${g.group_name}` === value);
        setSelectedGroup(group || null);
        setSelectedStudents([]);
    }

    async function handleAddStudents() {
        if (!selectedGroup || selectedStudents.length === 0) return;
        setIsSaving(true);
        try {
            // Verificamos si los estudiantes ya existen en cualquier grupo del mismo ciclo escolar (incluyendo los eliminados)
            const { data: existingStudents, error: checkError } = await supabaseClient
                .from('student_groups')
                .select(`
                    student_id,
                    delete_flag,
                    groups!inner (
                        school_year_id
                    )
                `)
                .eq('groups.school_year_id', selectedGroup.school_year_id)
                .in('student_id', selectedStudents);

            if (checkError) throw checkError;

            // Si hay estudiantes que ya existen en algún grupo del ciclo escolar
            if (existingStudents && existingStudents.length > 0) {
                const existingStudentIds = existingStudents.map(es => es.student_id);
                const newStudents = selectedStudents.filter(id => !existingStudentIds.includes(id));

                // Reactivamos los estudiantes eliminados
                const deletedStudents = existingStudents.filter(es => es.delete_flag);
                if (deletedStudents.length > 0) {
                    const { error: updateError } = await supabaseClient
                        .from('student_groups')
                        .update({
                            delete_flag: false,
                            deleted_at: null,
                            status: 'active'
                        })
                        .eq('group_id', selectedGroup.group_id)
                        .in('student_id', deletedStudents.map(es => es.student_id));

                    if (updateError) throw updateError;
                }

                // Si hay nuevos estudiantes, los insertamos
                if (newStudents.length > 0) {
                    const { error: insertError } = await supabaseClient
                        .from('student_groups')
                        .insert(
                            newStudents.map(studentId => ({
                                student_id: studentId,
                                group_id: selectedGroup.group_id,
                                status: 'active',
                                enrollment_date: new Date().toISOString()
                            }))
                        );

                    if (insertError) throw insertError;
                }
            } else {
                // Si no hay estudiantes existentes, insertamos todos
                const { error: insertError } = await supabaseClient
                    .from('student_groups')
                    .insert(
                        selectedStudents.map(studentId => ({
                            student_id: studentId,
                            group_id: selectedGroup.group_id,
                            status: 'active',
                            enrollment_date: new Date().toISOString()
                        }))
                    );

                if (insertError) throw insertError;
            }

            // Actualizar la lista de estudiantes
            await loadGroupStudents();
            await loadAvailableStudents();
            setIsModalOpen(false);
            setSelectedStudents([]);
        } catch (error) {
            console.error('Error al añadir estudiantes al grupo:', error);
            alert('Error al añadir estudiantes al grupo. Por favor intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleRemoveStudent(studentGroupId: number) {
        if (!confirm('¿Estás seguro de que deseas quitar este estudiante del grupo?')) return;
        setIsSaving(true);
        try {
            const { error } = await supabaseClient
                .from('student_groups')
                .update({ delete_flag: true, deleted_at: new Date().toISOString() })
                .eq('student_group_id', studentGroupId);

            if (error) throw error;

            // Actualizar la lista de estudiantes
            await loadGroupStudents();
            await loadAvailableStudents();
        } catch (error) {
            console.error('Error al quitar el estudiante del grupo:', error);
            alert('Error al quitar el estudiante del grupo. Por favor intenta de nuevo.');
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

    const sortStudents = (students: GroupStudent[]) => {
        return [...students].sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'name':
                    comparison = `${a.student.first_name} ${a.student.father_last_name}`.localeCompare(
                        `${b.student.first_name} ${b.student.father_last_name}`
                    );
                    break;
                case 'curp':
                    comparison = a.student.curp.localeCompare(b.student.curp);
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                default:
                    comparison = 0;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    };

    const filterStudents = (students: GroupStudent[], term: string) => {
        if (!term) return students;
        const searchTermLower = term.toLowerCase();
        return students.filter(student =>
            student.student.first_name.toLowerCase().includes(searchTermLower) ||
            student.student.father_last_name.toLowerCase().includes(searchTermLower) ||
            student.student.mother_last_name?.toLowerCase().includes(searchTermLower) ||
            student.student.curp.toLowerCase().includes(searchTermLower)
        );
    };

    // Calcular métricas
    const totalStudents = groupStudents.length;
    const activeStudents = groupStudents.filter(s => s.status === 'active').length;
    const inactiveStudents = groupStudents.filter(s => s.status === 'inactive').length;

    // Configuración de gráficas
    const genderOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 180,
        },
        labels: ['Activos', 'Inactivos'],
        colors: ['#10B981', '#EF4444'],
        legend: {
            position: 'bottom',
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const genderSeries = [activeStudents, inactiveStudents];

    return (
        <div className="container mx-auto p-6">
            <PageBreadcrumb pageTitle="Gestión de Estudiantes por Grupo" />

            {/* Selector de Grupo */}
            <div className="mb-6">
                <Label htmlFor="group-select" className="font-outfit">
                    Seleccionar Grupo
                </Label>
                <div className="relative">
                    <Select
                        options={[
                            { value: "", label: "Selecciona un grupo" },
                            ...groups.map(group => ({
                                value: `${group.grade}${group.group_name}`,
                                label: `${group.grade}° ${group.group_name} - ${group.school_year_name}`
                            }))
                        ]}
                        placeholder="Selecciona un grupo"
                        onChange={handleGroupChange}
                    />
                    {isLoadingGroups && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                        </div>
                    )}
                </div>
            </div>

            {selectedGroup && (
                <>
                    {/* Métricas */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6 mb-6">
                        {/* Total de Estudiantes */}
                        <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                            {isLoadingMetrics ? (
                                <div className="flex items-center justify-center h-full">
                                    <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                                </div>
                            ) : (
                                <>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                        <i className="fa-duotone fa-solid fa-user-graduate fa-xl text-gray-800 dark:text-white/90"></i>
                                    </div>
                                    <div className="mt-5 flex items-end justify-between">
                                        <div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                Total de Estudiantes
                                            </span>
                                            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                                {totalStudents}
                                            </h4>
                                        </div>
                                        <Badge color="info">
                                            <span className="font-outfit">
                                                {activeStudents} activos
                                            </span>
                                        </Badge>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Distribución por Estado */}
                        <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                <i className="fa-duotone fa-solid fa-chart-pie fa-xl text-gray-800 dark:text-white/90"></i>
                            </div>
                            <div className="mt-5 flex items-end justify-between">
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                        Distribución por Estado
                                    </span>
                                    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                        {activeStudents} / {inactiveStudents}
                                    </h4>
                                </div>
                                <Badge color="success">
                                    <span className="font-outfit">
                                        {((activeStudents / totalStudents) * 100).toFixed(1)}% activos
                                    </span>
                                </Badge>
                            </div>
                        </div>

                        {/* Fecha de Inicio */}
                        <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                <i className="fa-duotone fa-solid fa-calendar fa-xl text-gray-800 dark:text-white/90"></i>
                            </div>
                            <div className="mt-5 flex items-end justify-between">
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                        Fecha de Inicio
                                    </span>
                                    <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                        {new Date(selectedGroup.school_year_id).toLocaleDateString()}
                                    </h4>
                                </div>
                                <Badge color="warning">
                                    <span className="font-outfit">
                                        {selectedGroup.school_year_name}
                                    </span>
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Gráfica de Distribución */}
                    <div className="mb-6">
                        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                    Distribución de Estudiantes por Estado
                                </h3>
                            </div>
                            {isLoadingMetrics ? (
                                <div className="flex items-center justify-center h-[180px]">
                                    <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                                </div>
                            ) : (
                                <ReactApexChart
                                    options={genderOptions}
                                    series={genderSeries}
                                    type="donut"
                                    height={180}
                                />
                            )}
                        </div>
                    </div>

                    {/* Tabla de Estudiantes */}
                    <ComponentCard
                        title="Estudiantes del Grupo"
                        desc="Aquí podrás ver todos los estudiantes asignados a este grupo y gestionarlos."
                    >
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative w-full sm:w-64">
                                <Input
                                    type="text"
                                    placeholder="Buscar estudiantes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                    startIcon={<i className="fa-duotone fa-solid fa-search text-gray-400"></i>}
                                />
                            </div>
                            <Button
                                variant="primary"
                                startIcon={<i className="fa-duotone fa-solid fa-user-plus"></i>}
                                onClick={() => setIsModalOpen(true)}
                                disabled={isSaving}
                            >
                                <span className="font-outfit">Añadir Estudiantes</span>
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            {isLoadingStudents ? (
                                <div className="flex items-center justify-center h-[200px]">
                                    <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
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
                                                        <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                                onClick={() => handleSort('curp')}
                                            >
                                                <div className="flex items-center justify-center gap-1">
                                                    CURP
                                                    {sortField === 'curp' && (
                                                        <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
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
                                        {sortStudents(filterStudents(groupStudents, searchTerm)).map((student) => (
                                            <TableRow key={student.student_group_id}>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                        {student.student.first_name} {student.student.father_last_name} {student.student.mother_last_name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                        {student.student.curp}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <Badge
                                                        color={student.status === 'active' ? 'success' : 'error'}
                                                        variant="light"
                                                    >
                                                        <span className="font-outfit">
                                                            {student.status === 'active' ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        startIcon={<i className="fa-duotone fa-solid fa-user-minus"></i>}
                                                        onClick={() => handleRemoveStudent(student.student_group_id)}
                                                    >
                                                        <span className="font-outfit">Quitar</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {groupStudents.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                        {searchTerm ? 'No se encontraron estudiantes que coincidan con la búsqueda.' : 'No hay estudiantes en este grupo.'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </ComponentCard>
                </>
            )}

            {/* Modal para Añadir Estudiantes */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedStudents([]);
                }}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                            Añadir estudiantes al grupo
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            Selecciona los estudiantes que deseas añadir al grupo <strong>{selectedGroup?.grade}° {selectedGroup?.group_name}</strong>.
                        </p>
                    </div>
                    <div className="mt-8">
                        <div className="mb-4">
                            <Input
                                type="text"
                                placeholder="Buscar estudiantes disponibles..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                startIcon={<i className="fa-duotone fa-solid fa-search text-gray-400"></i>}
                            />
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {isLoadingMetrics ? (
                                <div className="flex items-center justify-center h-[200px]">
                                    <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                                </div>
                            ) : (
                                <Table className="min-w-full">
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell isHeader>
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedStudents(availableStudents.map(s => s.student_id));
                                                        } else {
                                                            setSelectedStudents([]);
                                                        }
                                                    }}
                                                    checked={selectedStudents.length === availableStudents.length}
                                                />
                                            </TableCell>
                                            <TableCell isHeader>Nombre</TableCell>
                                            <TableCell isHeader>CURP</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {availableStudents
                                            .filter(student =>
                                                student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                student.father_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                student.mother_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                student.curp.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((student) => (
                                                <TableRow
                                                    key={student.student_id}
                                                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                    onClick={() => {
                                                        if (selectedStudents.includes(student.student_id)) {
                                                            setSelectedStudents(selectedStudents.filter(id => id !== student.student_id));
                                                        } else {
                                                            setSelectedStudents([...selectedStudents, student.student_id]);
                                                        }
                                                    }}
                                                >
                                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                                            checked={selectedStudents.includes(student.student_id)}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                if (e.target.checked) {
                                                                    setSelectedStudents([...selectedStudents, student.student_id]);
                                                                } else {
                                                                    setSelectedStudents(selectedStudents.filter(id => id !== student.student_id));
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                                        <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                            {student.first_name} {student.father_last_name} {student.mother_last_name}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                            {student.curp}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        {availableStudents.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                        No hay estudiantes disponibles para añadir.
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                        <Button
                            onClick={() => {
                                setIsModalOpen(false);
                                setSelectedStudents([]);
                            }}
                            variant="outline"
                            className="sm:w-auto"
                            disabled={isSaving}
                        >
                            <span className="font-outfit">Cancelar</span>
                        </Button>
                        <Button
                            onClick={handleAddStudents}
                            variant="primary"
                            className="sm:w-auto"
                            disabled={selectedStudents.length === 0 || isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <i className="fa-duotone fa-solid fa-spinner fa-spin mr-2"></i>
                                    <span className="font-outfit">Guardando...</span>
                                </>
                            ) : (
                                <span className="font-outfit">Añadir {selectedStudents.length} Estudiantes</span>
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
} 