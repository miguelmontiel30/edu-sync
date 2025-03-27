'use client';
import { useState, useEffect } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/core/table';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { supabaseClient } from '@/services/config/supabaseClient';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { ArrowUpIcon, ArrowDownIcon, MoreDotIcon } from '@/icons';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';

interface Subject {
    id: number;
    name: string;
    description: string;
    groupsCount: number;
    teachersCount: number;
    averageGrade: number;
}

export default function AdminSubjectsDashboard() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [subjectForm, setSubjectForm] = useState({
        name: '',
        description: ''
    });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadSubjects();
    }, []);

    async function loadSubjects() {
        try {
            const { data, error } = await supabaseClient
                .from('subjects')
                .select(`
                    subject_id,
                    name,
                    description,
                    group_subjects (
                        group_id,
                        teacher_id
                    )
                `)
                .eq('delete_flag', false);

            if (error) throw error;

            if (data) {
                // Obtener las calificaciones por separado
                const { data: gradesData } = await supabaseClient
                    .from('grades')
                    .select('grade, subject_id')
                    .eq('delete_flag', false);

                const formattedSubjects = data.map((subject: any) => {
                    // Calcular el promedio real de calificaciones
                    const subjectGrades = gradesData?.filter((g: any) => g.subject_id === subject.subject_id) || [];
                    const averageGrade = subjectGrades.length > 0
                        ? subjectGrades.reduce((acc: number, g: any) => acc + g.grade, 0) / subjectGrades.length
                        : 0;

                    return {
                        id: subject.subject_id,
                        name: subject.name,
                        description: subject.description,
                        groupsCount: subject.group_subjects?.length || 0,
                        teachersCount: new Set(subject.group_subjects?.map((gs: any) => gs.teacher_id) || []).size,
                        averageGrade: Number(averageGrade.toFixed(2))
                    };
                });
                setSubjects(formattedSubjects);
            }
        } catch (error) {
            console.error('Error al cargar las materias:', error);
        }
    }

    function openModal() {
        setSelectedSubject(null);
        setSubjectForm({
            name: '',
            description: ''
        });
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setSubjectForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSave() {
        try {
            if (!subjectForm.name) {
                alert('Por favor completa todos los campos requeridos');
                return;
            }

            if (selectedSubject) {
                // Actualizar materia existente
                const { error } = await supabaseClient
                    .from('subjects')
                    .update({
                        name: subjectForm.name,
                        description: subjectForm.description,
                        updated_at: new Date().toISOString()
                    })
                    .eq('subject_id', selectedSubject.id);

                if (error) throw error;
            } else {
                // Crear nueva materia
                const { error } = await supabaseClient
                    .from('subjects')
                    .insert([{
                        name: subjectForm.name,
                        description: subjectForm.description,
                        school_id: 1 // TODO: Obtener el school_id del usuario actual
                    }]);

                if (error) throw error;
            }

            loadSubjects();
            closeModal();
        } catch (error) {
            console.error('Error al guardar la materia:', error);
            alert('Error al guardar la materia. Por favor intenta nuevamente.');
        }
    }

    async function handleDelete(id: number) {
        try {
            const { error } = await supabaseClient
                .from('subjects')
                .update({
                    delete_flag: true,
                    deleted_at: new Date().toISOString()
                })
                .eq('subject_id', id);

            if (error) throw error;

            setSubjects(prev => prev.filter(subject => subject.id !== id));
        } catch (error) {
            console.error('Error al eliminar la materia:', error);
            alert('Error al eliminar la materia. Por favor intenta nuevamente.');
        }
    }

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

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
            categories: subjects.map(subject => subject.name),
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
                text: 'Promedio general',
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
                formatter: (val: number) => `${val}`,
            },
        },
    };

    const barSeries = [
        {
            name: 'Promedio general',
            data: subjects.map(subject => subject.averageGrade),
        },
    ];

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <PageBreadcrumb pageTitle="Gestión de materias" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                {/* Metrics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                    {/* Metric Item Start */}
                    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        {subjects.length === 0 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        )}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <i className="fa-duotone fa-solid fa-books fa-xl text-gray-800 dark:text-white/90"></i>
                        </div>

                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Total de materias
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    {subjects.length}
                                </h4>
                            </div>
                            <Badge color="success">
                                <ArrowUpIcon />
                                <span className="font-outfit">{subjects.length > 0 ? 'Activas' : '0'}</span>
                            </Badge>
                        </div>
                    </div>
                    {/* Metric Item End */}

                    {/* Metric Item Start */}
                    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        {subjects.length === 0 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        )}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <i className="fa-duotone fa-solid fa-chalkboard-teacher fa-xl text-gray-800 dark:text-white/90"></i>
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Profesores asignados
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    {subjects.reduce((acc, subject) => acc + subject.teachersCount, 0)}
                                </h4>
                            </div>
                            <Badge color="info">
                                <span className="font-outfit">
                                    {subjects.length > 0
                                        ? `Promedio: ${(subjects.reduce((acc, subject) => acc + subject.teachersCount, 0) / subjects.length).toFixed(1)}`
                                        : '0'
                                    }
                                </span>
                            </Badge>
                        </div>
                    </div>
                    {/* Metric Item End */}
                </div>

                {/* Chart */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    {subjects.length === 0 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                            <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                            Promedios por materia
                        </h3>

                        <div className="relative inline-block">
                            <button onClick={toggleDropdown} className="dropdown-toggle">
                                <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                            </button>
                            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
                                <DropdownItem
                                    onItemClick={closeDropdown}
                                    className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                >
                                    Ver más
                                </DropdownItem>
                                <DropdownItem
                                    onItemClick={closeDropdown}
                                    className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                >
                                    Eliminar
                                </DropdownItem>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="custom-scrollbar max-w-full overflow-x-auto">
                        <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
                            <ReactApexChart
                                options={barOptions}
                                series={barSeries}
                                type="bar"
                                height={180}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <ComponentCard title="Lista de materias" className="w-100 p-4">
                    <div className="mb-4 flex justify-end">
                        <Button
                            variant="primary"
                            startIcon={<i className="fa-duotone fa-solid fa-book-medical text-white"></i>}
                            onClick={openModal}
                        >
                            Nueva Materia
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">
                                <Table>
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
                                                Descripción
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
                                                Profesores
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                            >
                                                Promedio
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
                                        {subjects.map((subject) => (
                                            <TableRow key={subject.id}>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                        {subject.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                        {subject.description}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                        {subject.groupsCount}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                        {subject.teachersCount}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                        {subject.averageGrade}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <Button
                                                        className="mr-2"
                                                        variant="outline"
                                                        size="sm"
                                                        startIcon={<i className="fa-duotone fa-solid fa-pen-to-square text-gray-800 dark:text-white/90"></i>}
                                                        onClick={() => {
                                                            setSelectedSubject(subject);
                                                            setSubjectForm({
                                                                name: subject.name,
                                                                description: subject.description
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
                                                        onClick={() => handleDelete(subject.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </ComponentCard>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                            {selectedSubject ? "Editar materia" : "Nueva materia"}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            Define los detalles de la materia.
                        </p>
                    </div>
                    <div className="mt-8">
                        <div className="mt-6">
                            <Label htmlFor="subject-name">
                                Nombre
                            </Label>
                            <Input
                                id="subject-name"
                                type="text"
                                placeholder="Ej. Matemáticas"
                                onChange={handleInputChange}
                                name="name"
                                defaultValue={subjectForm.name}
                            />
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="subject-description">
                                Descripción
                            </Label>
                            <Input
                                id="subject-description"
                                type="text"
                                placeholder="Ej. Matemáticas básicas y avanzadas"
                                onChange={handleInputChange}
                                name="description"
                                defaultValue={subjectForm.description}
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
                            onClick={handleSave}
                            variant="primary"
                            className="sm:w-auto"
                        >
                            {selectedSubject ? "Actualizar" : "Crear"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
} 