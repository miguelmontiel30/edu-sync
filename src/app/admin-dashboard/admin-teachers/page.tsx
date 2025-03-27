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
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    subjectsCount: number;
    groupsCount: number;
    averageGrade: number;
}

export default function AdminTeachersDashboard() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [teacherForm, setTeacherForm] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'teacher'
    });

    useEffect(() => {
        loadTeachers();
    }, []);

    async function loadTeachers() {
        try {
            const { data, error } = await supabaseClient
                .from('teachers')
                .select(`
                    teacher_id,
                    name,
                    email,
                    phone,
                    role,
                    group_subjects (
                        subject_id,
                        group_id
                    )
                `)
                .eq('delete_flag', false)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                // Obtener las calificaciones por separado
                const { data: gradesData } = await supabaseClient
                    .from('grades')
                    .select('grade, teacher_id')
                    .eq('delete_flag', false);

                const formattedTeachers = data.map(teacher => {
                    // Calcular estadísticas reales
                    const uniqueSubjects = new Set(teacher.group_subjects?.map((gs: any) => gs.subject_id) || []);
                    const uniqueGroups = new Set(teacher.group_subjects?.map((gs: any) => gs.group_id) || []);

                    // Calcular promedio de calificaciones
                    const teacherGrades = gradesData?.filter((g: any) => g.teacher_id === teacher.teacher_id) || [];
                    const averageGrade = teacherGrades.length > 0
                        ? teacherGrades.reduce((acc: number, g: any) => acc + g.grade, 0) / teacherGrades.length
                        : 0;

                    return {
                        id: teacher.teacher_id,
                        name: teacher.name,
                        email: teacher.email,
                        phone: teacher.phone,
                        role: teacher.role,
                        subjectsCount: uniqueSubjects.size,
                        groupsCount: uniqueGroups.size,
                        averageGrade: Number(averageGrade.toFixed(2))
                    };
                });
                console.log('Profesores cargados:', formattedTeachers);
                setTeachers(formattedTeachers);
            }
        } catch (error) {
            console.error('Error al cargar los profesores:', error);
        }
    }

    function openModal() {
        setSelectedTeacher(null);
        setTeacherForm({
            name: '',
            email: '',
            phone: '',
            role: 'teacher'
        });
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setTeacherForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSaveTeacher() {
        try {
            if (!teacherForm.name || !teacherForm.email || !teacherForm.phone) {
                alert('Por favor completa todos los campos requeridos');
                return;
            }

            if (selectedTeacher) {
                // Actualizar profesor existente
                const { error } = await supabaseClient
                    .from('teachers')
                    .update({
                        name: teacherForm.name,
                        email: teacherForm.email,
                        phone: teacherForm.phone,
                        role: teacherForm.role,
                        updated_at: new Date().toISOString()
                    })
                    .eq('teacher_id', selectedTeacher.id);

                if (error) throw error;
            } else {
                // Crear nuevo profesor
                const { data, error } = await supabaseClient
                    .from('teachers')
                    .insert([{
                        name: teacherForm.name,
                        email: teacherForm.email,
                        phone: teacherForm.phone,
                        role: teacherForm.role,
                        school_id: 1 // TODO: Obtener el school_id del usuario actual
                    }])
                    .select();

                if (error) throw error;
                console.log('Profesor creado:', data); // Para debugging
            }

            await loadTeachers(); // Esperar a que se carguen los datos actualizados
            closeModal();
        } catch (error) {
            console.error('Error al guardar el profesor:', error);
            alert('Error al guardar el profesor. Por favor intenta nuevamente.');
        }
    }

    async function handleDelete(id: number) {
        try {
            const { error } = await supabaseClient
                .from('teachers')
                .update({
                    delete_flag: true,
                    deleted_at: new Date().toISOString()
                })
                .eq('teacher_id', id);

            if (error) throw error;

            setTeachers(prev => prev.filter(teacher => teacher.id !== id));
        } catch (error) {
            console.error('Error al eliminar el profesor:', error);
            alert('Error al eliminar el profesor. Por favor intenta nuevamente.');
        }
    }

    const series = [90];
    const options: ApexOptions = {
        colors: ['#28a745'],
        chart: {
            fontFamily: 'Outfit, sans-serif',
            type: 'radialBar',
            height: 330,
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            radialBar: {
                startAngle: -85,
                endAngle: 85,
                hollow: {
                    size: '80%',
                },
                track: {
                    background: '#E4E7EC',
                    strokeWidth: '100%',
                    margin: 5,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: '36px',
                        fontWeight: '600',
                        offsetY: -40,
                        color: '#1D2939',
                        formatter: function (val) {
                            return val + '%';
                        },
                    },
                },
            },
        },
        fill: {
            type: 'solid',
            colors: ['#465FFF'],
        },
        stroke: {
            lineCap: 'round',
        },
        labels: ['Progress'],
    };

    const barOptions: ApexOptions = {
        colors: ['#465fff'],
        chart: {
            fontFamily: 'Outfit, sans-serif',
            type: 'bar',
            height: 180,
            toolbar: {
                show: false,
            },
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
            enabled: false,
        },
        stroke: {
            show: true,
            width: 4,
            colors: ['transparent'],
        },
        xaxis: {
            categories: teachers.map(teacher => teacher.name),
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left',
            fontFamily: 'Outfit',
        },
        yaxis: {
            title: {
                text: 'Materias Asignadas',
            },
        },
        grid: {
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            x: {
                show: false,
            },
            y: {
                formatter: (val: number) => `${val} materias`,
            },
        },
    };

    const barSeries = [
        {
            name: 'Materias Asignadas',
            data: teachers.map(teacher => teacher.subjectsCount),
        },
    ];

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <PageBreadcrumb pageTitle="Gestión de profesores" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                {/* Metrics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                    {/* Total de Profesores */}
                    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        {teachers.length === 0 && (
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
                                    {teachers.length}
                                </h4>
                            </div>
                            <Badge color="success">
                                <span className="font-outfit">
                                    {teachers.length > 0
                                        ? `Activos: ${teachers.length}`
                                        : '0'
                                    }
                                </span>
                            </Badge>
                        </div>
                    </div>

                    {/* Profesores por Materia */}
                    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        {teachers.length === 0 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Próximamente</span>
                            </div>
                        )}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <i className="fa-duotone fa-solid fa-book fa-xl text-gray-800 dark:text-white/90"></i>
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Materias Asignadas
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    {teachers.reduce((acc, teacher) => acc + teacher.subjectsCount, 0)}
                                </h4>
                            </div>
                            <Badge color="info">
                                <span className="font-outfit">Promedio: {(teachers.reduce((acc, teacher) => acc + teacher.subjectsCount, 0) / teachers.length || 0).toFixed(1)}</span>
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="relative rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
                    {teachers.length === 0 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <span className="text-lg font-semibold text-white font-outfit">Próximamente</span>
                        </div>
                    )}
                    <div className="shadow-default rounded-2xl bg-white px-5 pb-11 pt-5 dark:bg-gray-900 sm:px-6 sm:pt-6">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                    Promedios por Profesor
                                </h3>
                                <p className="mt-1 text-theme-sm font-normal text-gray-500 dark:text-gray-400 font-outfit">
                                    Muestra el promedio general de cada profesor
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="max-h-[330px]">
                                <ReactApexChart
                                    options={barOptions}
                                    series={barSeries}
                                    type="bar"
                                    height={180}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <ComponentCard title="Lista de Profesores" className="w-100 p-4">
                    <div className="mb-4 flex justify-end">
                        <Button
                            variant="primary"
                            startIcon={<i className="fa-duotone fa-solid fa-person-plus text-white"></i>}
                            onClick={openModal}
                        >
                            <span className="font-outfit">Nuevo Profesor</span>
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <Table className="min-w-full">
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                    >
                                        Nombre
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                    >
                                        Email
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                    >
                                        Teléfono
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                    >
                                        Materias
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                    >
                                        Grupos
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
                                {teachers.map(teacher => (
                                    <TableRow key={teacher.id}>
                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
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
                                                {teacher.phone}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                {teacher.subjectsCount}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                {teacher.groupsCount}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <Button
                                                className="mr-2"
                                                variant="outline"
                                                size="sm"
                                                startIcon={<i className="fa-duotone fa-solid fa-pen-to-square text-gray-800 dark:text-white/90"></i>}
                                                onClick={() => {
                                                    setSelectedTeacher(teacher);
                                                    setTeacherForm({
                                                        name: teacher.name,
                                                        email: teacher.email,
                                                        phone: teacher.phone,
                                                        role: teacher.role
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                startIcon={<i className="fa-duotone fa-solid fa-trash text-gray-800 dark:text-white/90"></i>}
                                                onClick={() => handleDelete(teacher.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {teachers.length === 0 && (
                                    <TableRow>
                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                No se encontraron profesores.
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </ComponentCard>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                            {selectedTeacher ? "Editar profesor" : "Nuevo profesor"}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            Ingresa los datos del profesor.
                        </p>
                    </div>
                    <div className="mt-8">
                        <div>
                            <Label htmlFor="teacher-name">
                                Nombre completo
                            </Label>
                            <Input
                                id="teacher-name"
                                type="text"
                                placeholder="Ingresa el nombre completo"
                                onChange={handleInputChange}
                                name="name"
                                defaultValue={teacherForm.name}
                            />
                        </div>
                        <div className="mt-6">
                            <Label htmlFor="teacher-email">
                                Correo electrónico
                            </Label>
                            <Input
                                id="teacher-email"
                                type="email"
                                placeholder="Ingresa el correo electrónico"
                                onChange={handleInputChange}
                                name="email"
                                defaultValue={teacherForm.email}
                            />
                        </div>
                        <div className="mt-6">
                            <Label htmlFor="teacher-phone">
                                Teléfono
                            </Label>
                            <Input
                                id="teacher-phone"
                                type="tel"
                                placeholder="Ingresa el número de teléfono"
                                onChange={handleInputChange}
                                name="phone"
                                defaultValue={teacherForm.phone}
                            />
                        </div>
                        <div className="mt-6">
                            <Label>
                                Rol
                            </Label>
                            <Select
                                options={[
                                    { value: 'teacher', label: 'Profesor' },
                                    { value: 'coordinator', label: 'Coordinador' },
                                    { value: 'principal', label: 'Director' }
                                ]}
                                placeholder="Seleccione un rol"
                                onChange={(value) => handleInputChange({ target: { name: 'role', value } } as any)}
                                defaultValue={teacherForm.role}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                        <Button
                            onClick={closeModal}
                            variant="outline"
                            className="sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSaveTeacher}
                            variant="primary"
                            className="sm:w-auto"
                        >
                            {selectedTeacher ? "Actualizar" : "Crear"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
} 