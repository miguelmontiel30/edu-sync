'use client';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { ArrowDownIcon, ArrowUpIcon, MoreDotIcon } from '@/icons';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/core/table';
import { supabaseClient } from '@/services/config/supabaseClient';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

interface Student {
    student_id: number;
    first_name: string;
    father_last_name: string;
    mother_last_name: string;
    birth_date: string;
    gender: string;
    curp: string;
    phone: string;
    email: string;
    grade_level: string;
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

interface GroupResponse {
    group_id: number;
    grade: number;
    group_name: string;
    school_year_id: number;
    school_years: {
        name: string;
    };
}

export default function StudentDashboard() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [deletedStudents, setDeletedStudents] = useState<Student[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<'first_name' | 'curp' | 'grade_level'>('first_name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [activeGroups, setActiveGroups] = useState<Group[]>([]);
    const [studentForm, setStudentForm] = useState({
        first_name: '',
        father_last_name: '',
        mother_last_name: '',
        birth_date: '',
        gender: '',
        curp: '',
        phone: '',
        email: '',
        grade_level: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        loadStudents();
        loadDeletedStudents();
        loadActiveGroups();
    }, []);

    async function loadStudents() {
        try {
            const { data, error } = await supabaseClient
                .from('students')
                .select('*')
                .eq('delete_flag', false)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setStudents(data || []);
            setFilteredStudents(data || []);
        } catch (error) {
            console.error('Error al cargar los estudiantes:', error);
            alert('Error al cargar los estudiantes. Por favor recarga la página.');
        }
    }

    async function loadDeletedStudents() {
        try {
            const { data, error } = await supabaseClient
                .from('students')
                .select('*')
                .eq('delete_flag', true)
                .order('deleted_at', { ascending: false });

            if (error) throw error;
            setDeletedStudents(data || []);
        } catch (error) {
            console.error('Error al cargar los estudiantes eliminados:', error);
        }
    }

    async function loadActiveGroups() {
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
        }
    }

    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        setStudentForm({
            first_name: student.first_name,
            father_last_name: student.father_last_name,
            mother_last_name: student.mother_last_name,
            birth_date: student.birth_date,
            gender: student.gender,
            curp: student.curp,
            phone: student.phone,
            email: student.email,
            grade_level: student.grade_level
        });
        setIsModalOpen(true);
    };

    async function handleDelete(id: number) {
        if (!confirm('¿Estás seguro de que deseas eliminar este estudiante?')) return;

        try {
            const { error } = await supabaseClient
                .from('students')
                .update({ delete_flag: true, deleted_at: new Date().toISOString() })
                .eq('student_id', id);

            if (error) throw error;
            loadStudents();
            loadDeletedStudents();
        } catch (error) {
            console.error('Error al eliminar el estudiante:', error);
            alert('Error al eliminar el estudiante. Por favor intenta de nuevo.');
        }
    }

    async function handleRestore(id: number) {
        try {
            const { error } = await supabaseClient
                .from('students')
                .update({ delete_flag: false, deleted_at: null })
                .eq('student_id', id);

            if (error) throw error;
            loadStudents();
            loadDeletedStudents();
        } catch (error) {
            console.error('Error al restaurar el estudiante:', error);
            alert('Error al restaurar el estudiante. Por favor intenta de nuevo.');
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

    const sortStudents = (students: Student[]) => {
        return [...students].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];
            const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    };

    const filterStudents = (students: Student[], term: string) => {
        if (!term) return students;
        return students.filter(student =>
            student.first_name.toLowerCase().includes(term.toLowerCase()) ||
            student.father_last_name.toLowerCase().includes(term.toLowerCase()) ||
            student.mother_last_name?.toLowerCase().includes(term.toLowerCase()) ||
            student.curp.toLowerCase().includes(term.toLowerCase())
        );
    };

    function openModal() {
        setSelectedStudent(null);
        setStudentForm({
            first_name: '',
            father_last_name: '',
            mother_last_name: '',
            birth_date: '',
            gender: '',
            curp: '',
            phone: '',
            email: '',
            grade_level: ''
        });
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setSelectedStudent(null);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string) {
        if (typeof e === 'string') {
            setStudentForm(prev => ({ ...prev, grade_level: e }));
        } else {
            const { name, value } = e.target;
            setStudentForm(prev => ({ ...prev, [name]: value }));
        }
    }

    function handleSelectChange(value: string) {
        setStudentForm(prev => ({ ...prev, grade_level: value }));
    }

    async function handleSaveStudent() {
        try {
            if (selectedStudent) {
                const { error } = await supabaseClient
                    .from('students')
                    .update(studentForm)
                    .eq('student_id', selectedStudent.student_id);

                if (error) throw error;
            } else {
                const { error } = await supabaseClient
                    .from('students')
                    .insert([{ ...studentForm, school_id: 1 }]);

                if (error) {
                    if (error.code === '23505') {
                        alert('Ya existe un estudiante registrado con esta CURP en la escuela. Por favor, verifica los datos e intenta nuevamente.');
                        return;
                    }
                    throw error;
                }
            }
            closeModal();
            loadStudents();
        } catch (error) {
            console.error('Error al guardar el estudiante:', error);
            alert('Error al guardar el estudiante. Por favor intenta de nuevo.');
        }
    }

    // Calcular métricas
    const totalStudents = students.length;
    const activeStudents = students.filter(student => !student.delete_flag).length;
    const inactiveStudents = students.filter(student => student.delete_flag).length;

    // Obtener el ciclo escolar activo actual
    const currentSchoolYear = activeGroups[0]?.school_year_name;

    // Calcular estudiantes por grado solo del ciclo actual
    const studentsByGrade = students.reduce((acc: { [key: string]: number }, student) => {
        // Solo incluir estudiantes que estén en grupos del ciclo actual
        const isInCurrentYear = activeGroups.some(group =>
            `${group.grade}${group.group_name}` === student.grade_level &&
            group.school_year_name === currentSchoolYear
        );
        if (isInCurrentYear) {
            acc[student.grade_level] = (acc[student.grade_level] || 0) + 1;
        }
        return acc;
    }, {});

    // Configuración de gráficas
    const genderOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 180,
        },
        labels: ['Masculino', 'Femenino'],
        colors: ['#465fff', '#10B981'],
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

    const genderSeries = [
        students.filter(s => s.gender === 'Masculino').length,
        students.filter(s => s.gender === 'Femenino').length
    ];

    const gradeOptions: ApexOptions = {
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
            enabled: false
        },
        stroke: {
            show: true,
            width: 4,
            colors: ['transparent']
        },
        xaxis: {
            categories: Object.keys(studentsByGrade).sort(),
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            title: {
                text: 'Número de estudiantes'
            }
        },
        fill: {
            opacity: 1,
            colors: ['#465fff']
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} estudiantes`
            }
        }
    };

    const gradeSeries = [{
        name: 'Estudiantes',
        data: Object.keys(studentsByGrade).sort().map(grade => studentsByGrade[grade])
    }];

    // Calcular estudiantes paginados
    const indexOfLastStudent = currentPage * itemsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
    const currentStudents = sortStudents(filterStudents(students, searchTerm)).slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(sortStudents(filterStudents(students, searchTerm)).length / itemsPerPage);

    return (
        <div className="container mx-auto p-6">
            <PageBreadcrumb pageTitle="Gestión de Estudiantes" />

            {/* Métricas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6 mb-6">
                {/* Total de Estudiantes */}
                <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    {totalStudents === 0 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                        </div>
                    )}
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
                </div>

                {/* Promedio de Estudiantes por Grado */}
                <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    {totalStudents === 0 && (
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
                                {Object.keys(studentsByGrade).length > 0
                                    ? (Object.values(studentsByGrade).reduce((a, b) => a + b, 0) / Object.keys(studentsByGrade).length).toFixed(1)
                                    : '0'} estudiantes
                            </h4>
                        </div>
                        <Badge color="success">
                            <span className="font-outfit">
                                {Object.keys(studentsByGrade).length} grados
                            </span>
                        </Badge>
                    </div>
                </div>

                {/* Estudiantes Inactivos */}
                <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    {totalStudents === 0 && (
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
                                Estudiantes Inactivos
                            </span>
                            <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                {inactiveStudents}
                            </h4>
                        </div>
                        <Badge color="warning">
                            <span className="font-outfit">
                                {((inactiveStudents / totalStudents) * 100).toFixed(1)}% del total
                            </span>
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
                {/* Distribución por Género */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    {totalStudents === 0 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                            Distribución por Género
                        </h3>
                    </div>
                    <ReactApexChart
                        options={genderOptions}
                        series={genderSeries}
                        type="donut"
                        height={180}
                    />
                </div>

                {/* Estudiantes por Grado */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    {totalStudents === 0 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                            Estudiantes por Grado
                        </h3>
                    </div>
                    <ReactApexChart
                        options={gradeOptions}
                        series={gradeSeries}
                        type="bar"
                        height={180}
                    />
                </div>
            </div>

            {/* Tabla Principal */}
            <ComponentCard
                title="Lista de estudiantes"
                desc="Aquí podrás ver todos los estudiantes registrados, su información y gestionarlos. Puedes crear nuevos estudiantes, editar los existentes o eliminarlos según sea necesario."
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
                        onClick={openModal}
                    >
                        <span className="font-outfit">Nuevo Estudiante</span>
                    </Button>
                </div>

                <div className="overflow-x-auto">
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
                                    onClick={() => handleSort('first_name')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Nombre
                                        {sortField === 'first_name' && (
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
                                    onClick={() => handleSort('grade_level')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        Grado
                                        {sortField === 'grade_level' && (
                                            <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                >
                                    Estado
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
                            {currentStudents.map((student) => (
                                <TableRow key={student.student_id}>
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
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                            {student.grade_level}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <Badge
                                            color={student.delete_flag ? 'error' : 'success'}
                                            variant="light"
                                        >
                                            <span className="font-outfit">
                                                {student.delete_flag ? 'Eliminado' : 'Activo'}
                                            </span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                        <Button
                                            className="mr-2"
                                            variant="outline"
                                            size="sm"
                                            startIcon={<i className="fa-duotone fa-solid fa-pen-to-square"></i>}
                                            onClick={() => handleEdit(student)}
                                        >
                                            <span className="font-outfit">Editar</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            startIcon={<i className="fa-duotone fa-solid fa-trash"></i>}
                                            onClick={() => handleDelete(student.student_id)}
                                        >
                                            <span className="font-outfit">Eliminar</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {students.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="px-5 py-4 text-center sm:px-6">
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                            {searchTerm ? 'No se encontraron estudiantes que coincidan con la búsqueda.' : 'No se encontraron estudiantes.'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </ComponentCard>

            {/* Estudiantes Eliminados */}
            <div className="mt-6">
                <button
                    onClick={() => setShowDeleted(!showDeleted)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left dark:border-gray-800 dark:bg-white/[0.03]"
                >
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                            Estudiantes Eliminados
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            {deletedStudents.length} estudiantes en la papelera
                        </p>
                    </div>
                    <i className={`fa-duotone fa-solid fa-chevron-${showDeleted ? 'up' : 'down'} text-gray-500 dark:text-gray-400`}></i>
                </button>

                {showDeleted && (
                    <div className="mt-4">
                        <div className="overflow-x-auto">
                            <Table className="min-w-full">
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                    <TableRow>
                                        <TableCell isHeader>Nombre</TableCell>
                                        <TableCell isHeader>CURP</TableCell>
                                        <TableCell isHeader>Grado</TableCell>
                                        <TableCell isHeader>Acciones</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {deletedStudents.map((student) => (
                                        <TableRow key={student.student_id}>
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
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                    {student.grade_level}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    startIcon={<i className="fa-duotone fa-solid fa-rotate-left"></i>}
                                                    onClick={() => handleRestore(student.student_id)}
                                                >
                                                    <span className="font-outfit">Restaurar</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {deletedStudents.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                    No hay estudiantes eliminados
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
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
                            {selectedStudent ? "Editar estudiante" : "Define un nuevo estudiante"}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            Ingresa la información del estudiante para registrarlo en el sistema.
                        </p>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveStudent(); }} className="mt-8 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="first_name">Nombre(s)</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={studentForm.first_name}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="father_last_name">Apellido Paterno</Label>
                                <Input
                                    id="father_last_name"
                                    name="father_last_name"
                                    value={studentForm.father_last_name}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="mother_last_name">Apellido Materno</Label>
                                <Input
                                    id="mother_last_name"
                                    name="mother_last_name"
                                    value={studentForm.mother_last_name}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                                <Input
                                    id="birth_date"
                                    name="birth_date"
                                    type="date"
                                    value={studentForm.birth_date}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="gender">Género</Label>
                                <Select
                                    options={[
                                        { value: "", label: "Selecciona un género" },
                                        { value: "Masculino", label: "Masculino" },
                                        { value: "Femenino", label: "Femenino" },
                                    ]}
                                    placeholder="Selecciona un género"
                                    onChange={handleInputChange}
                                    defaultValue={studentForm.gender}
                                />
                            </div>
                            <div>
                                <Label htmlFor="curp">CURP</Label>
                                <Input
                                    id="curp"
                                    name="curp"
                                    value={studentForm.curp}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={studentForm.phone}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={studentForm.email}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="grade_level">Grupo</Label>
                                <Select
                                    options={[
                                        { value: "", label: "Selecciona un grupo" },
                                        ...activeGroups.map(group => ({
                                            value: `${group.grade}${group.group_name}`,
                                            label: `${group.grade}° ${group.group_name} - ${group.school_year_name}`
                                        }))
                                    ]}
                                    placeholder="Selecciona un grupo"
                                    onChange={(value) => handleSelectChange(value)}
                                    defaultValue={studentForm.grade_level}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                            <Button
                                onClick={closeModal}
                                variant="outline"
                                className="sm:w-auto"
                            >
                                <span className="font-outfit">Cancelar</span>
                            </Button>
                            <Button
                                onClick={handleSaveStudent}
                                variant="primary"
                                className="sm:w-auto"
                            >
                                <span className="font-outfit">{selectedStudent ? "Actualizar Estudiante" : "Crear Estudiante"}</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
} 