'use client';

// React
import { useState, useEffect } from 'react';

// Libraries
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

// Components
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/core/table';
import IconFA from '@/components/ui/IconFA';

// Supabase
import { supabaseClient } from '@/services/config/supabaseClient';

interface SchoolCycle {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'inactive' | 'completed';
    groupsCount: number;
    studentsCount: number;
    averageGrade: number;
}

type SortField = 'name' | 'startDate' | 'endDate' | 'groupsCount' | 'studentsCount' | 'averageGrade' | 'status';
type SortDirection = 'asc' | 'desc';

const initialCycles: SchoolCycle[] = [
    {
        id: 1,
        name: 'Ciclo 2023-2024',
        startDate: '2023-09-01',
        endDate: '2024-06-30',
        status: 'active',
        groupsCount: 0,
        studentsCount: 0,
        averageGrade: 0
    },
    {
        id: 2,
        name: 'Ciclo 2022-2023',
        startDate: '2022-09-01',
        endDate: '2023-06-30',
        status: 'completed',
        groupsCount: 0,
        studentsCount: 0,
        averageGrade: 0
    },
];

export default function SchoolYearDashboard() {
    const [cycles, setCycles] = useState<SchoolCycle[]>([]);
    const [filteredCycles, setFilteredCycles] = useState<SchoolCycle[]>([]);
    const [deletedCycles, setDeletedCycles] = useState<SchoolCycle[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<SchoolCycle | null>(null);
    const [cycleForm, setCycleForm] = useState({
        name: '',
        startDate: '',
        endDate: '',
        status: 'inactive' as 'active' | 'inactive' | 'completed'
    });
    const [isLoadingCycles, setIsLoadingCycles] = useState(true);
    const [isLoadingDeleted, setIsLoadingDeleted] = useState(true);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Cargar ciclos escolares al montar el componente
    useEffect(() => {
        loadSchoolYears();
        loadDeletedCycles();
    }, []);

    // Cargar ciclos eliminados
    async function loadDeletedCycles() {
        setIsLoadingDeleted(true);
        try {
            const { data, error } = await supabaseClient
                .from('school_years')
                .select(`
                    *,
                    groups (
                        group_id,
                        students_number,
                        general_average
                    )
                `)
                .eq('delete_flag', true)
                .order('deleted_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const formattedCycles: SchoolCycle[] = data.map(cycle => {
                    const groups = cycle.groups || [];
                    const totalStudents = groups.reduce((acc: number, group: any) => acc + (group.students_number || 0), 0);
                    const averageGrade = groups.length > 0
                        ? groups.reduce((acc: number, group: any) => acc + (group.general_average || 0), 0) / groups.length
                        : 0;

                    return {
                        id: cycle.school_year_id,
                        name: cycle.name,
                        startDate: cycle.start_date,
                        endDate: cycle.end_date,
                        status: cycle.status,
                        groupsCount: groups.length,
                        studentsCount: totalStudents,
                        averageGrade: Number(averageGrade.toFixed(2))
                    };
                });
                setDeletedCycles(formattedCycles);
            }
        } catch (error) {
            console.error('Error al cargar los ciclos eliminados:', error);
        } finally {
            setIsLoadingDeleted(false);
        }
    }

    async function loadSchoolYears() {
        setIsLoadingCycles(true);
        setIsLoadingMetrics(true);
        try {
            const { data, error } = await supabaseClient
                .from('school_years')
                .select(`
                    *,
                    groups (
                        group_id,
                        students_number,
                        general_average
                    )
                `)
                .eq('delete_flag', false)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const formattedCycles: SchoolCycle[] = data.map(cycle => {
                    const groups = cycle.groups || [];
                    const totalStudents = groups.reduce((acc: number, group: any) => acc + (group.students_number || 0), 0);
                    const averageGrade = groups.length > 0
                        ? groups.reduce((acc: number, group: any) => acc + (group.general_average || 0), 0) / groups.length
                        : 0;

                    return {
                        id: cycle.school_year_id,
                        name: cycle.name,
                        startDate: cycle.start_date,
                        endDate: cycle.end_date,
                        status: cycle.status,
                        groupsCount: groups.length,
                        studentsCount: totalStudents,
                        averageGrade: Number(averageGrade.toFixed(2))
                    };
                });
                setCycles(formattedCycles);
            }
        } catch (error) {
            console.error('Error al cargar los ciclos escolares:', error);
            alert('Error al cargar los ciclos escolares. Por favor recarga la página.');
        } finally {
            setIsLoadingCycles(false);
            setIsLoadingMetrics(false);
        }
    }

    const calendarsEvents = {
        primary: 'blue',
        success: 'green',
        danger: 'red',
        warning: 'yellow',
        info: 'cyan'
    };

    const handleEdit = (id: number) => {
        const cycleToEdit = cycles.find(cycle => cycle.id === id);
        if (cycleToEdit) {
            setSelectedCycle(cycleToEdit);
            setCycleForm({
                name: cycleToEdit.name,
                startDate: cycleToEdit.startDate,
                endDate: cycleToEdit.endDate,
                status: cycleToEdit.status
            });
            setIsModalOpen(true);
        }
    };

    async function handleDelete(id: number) {
        if (!confirm('¿Estás seguro de que deseas eliminar este ciclo escolar?')) return;
        setIsSaving(true);
        try {
            const { error } = await supabaseClient
                .from('school_years')
                .update({
                    delete_flag: true,
                    status: 'inactive',
                    deleted_at: new Date().toISOString()
                })
                .eq('school_year_id', id);

            if (error) throw error;

            // Actualizar estado local
            setCycles(prev => prev.filter(cycle => cycle.id !== id));

            // Recargar los ciclos eliminados
            await loadDeletedCycles();
        } catch (error) {
            console.error('Error al eliminar el ciclo escolar:', error);
            alert('Error al eliminar el ciclo escolar. Por favor intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    }

    function openModal() {
        setSelectedCycle(null);
        setCycleForm({
            name: '',
            startDate: '',
            endDate: '',
            status: 'inactive' as 'active' | 'inactive' | 'completed'
        });
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setCycleForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleSelectChange(value: string) {
        if (value === 'activo' || value === 'inactivo' || value === 'finalizado') {
            // Convertir el valor de español a inglés
            const statusMap: { [key: string]: 'active' | 'inactive' | 'completed' } = {
                'activo': 'active',
                'inactivo': 'inactive',
                'finalizado': 'completed'
            };

            setCycleForm(prev => ({
                ...prev,
                status: statusMap[value]
            }));
        }
    }

    async function handleSaveCycle() {
        setIsSaving(true);
        try {
            // Validar que todos los campos estén completados
            if (!cycleForm.name || !cycleForm.startDate || !cycleForm.endDate) {
                alert('Por favor completa todos los campos');
                return;
            }

            // Validar que el status sea uno de los valores permitidos
            if (!['active', 'inactive', 'completed'].includes(cycleForm.status)) {
                throw new Error('Estado inválido. Debe ser: active, inactive o completed');
            }

            if (selectedCycle) {
                // Actualizar ciclo existente
                const { error } = await supabaseClient
                    .from('school_years')
                    .update({
                        name: cycleForm.name,
                        start_date: cycleForm.startDate,
                        end_date: cycleForm.endDate,
                        status: cycleForm.status,
                        updated_at: new Date().toISOString()
                    })
                    .eq('school_year_id', selectedCycle.id);

                if (error) throw error;

                // Actualizar estado local
                setCycles(prev =>
                    prev.map(cycle =>
                        cycle.id === selectedCycle.id
                            ? { ...cycle, ...cycleForm }
                            : cycle
                    )
                );
            } else {
                // Crear nuevo ciclo
                const { data, error } = await supabaseClient
                    .from('school_years')
                    .insert([{
                        name: cycleForm.name,
                        start_date: cycleForm.startDate,
                        end_date: cycleForm.endDate,
                        status: cycleForm.status,
                        school_id: 1 // TODO: Obtener el school_id del usuario actual
                    }])
                    .select();

                if (error) throw error;

                if (data && data.length > 0) {
                    // Actualizar estado local
                    const newCycle: SchoolCycle = {
                        id: data[0].school_year_id,
                        name: data[0].name,
                        startDate: data[0].start_date,
                        endDate: data[0].end_date,
                        status: data[0].status,
                        groupsCount: 0,
                        studentsCount: 0,
                        averageGrade: 0
                    };
                    setCycles(prev => [...prev, newCycle]);
                }
            }
            closeModal();
            await loadSchoolYears();
        } catch (error) {
            console.error('Error al guardar el ciclo escolar:', error);
            alert('Error al guardar el ciclo escolar. Por favor intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    }

    // Función para restaurar un ciclo
    async function handleRestore(id: number) {
        try {
            const { error } = await supabaseClient
                .from('school_years')
                .update({
                    delete_flag: false,
                    deleted_at: null
                })
                .eq('school_year_id', id);

            if (error) throw error;

            // Actualizar estados
            const cycleToRestore = deletedCycles.find(cycle => cycle.id === id);
            if (cycleToRestore) {
                setCycles(prev => [...prev, cycleToRestore]);
                setDeletedCycles(prev => prev.filter(cycle => cycle.id !== id));
            }
        } catch (error) {
            console.error('Error al restaurar el ciclo:', error);
            alert('Error al restaurar el ciclo. Por favor intenta nuevamente.');
        }
    }

    const series = [90];
    const options: ApexOptions = {
        colors: ['#28a745'],
        // colors: ['#465FFF'],
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
                    margin: 5, // margin is in pixels
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

    const [isOpen, setIsOpen] = useState(false);

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
            categories: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
            ],
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
            data: [9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 8.3, 9, 9.1, 9.2, 8.7, 9.6],
        },
    ];

    // Función para manejar el ordenamiento
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Función para ordenar los ciclos
    const sortCycles = (cycles: SchoolCycle[]) => {
        return [...cycles].sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'startDate':
                    comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                    break;
                case 'endDate':
                    comparison = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
                    break;
                case 'groupsCount':
                    comparison = a.groupsCount - b.groupsCount;
                    break;
                case 'studentsCount':
                    comparison = a.studentsCount - b.studentsCount;
                    break;
                case 'averageGrade':
                    comparison = a.averageGrade - b.averageGrade;
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

    // Función para filtrar los ciclos
    const filterCycles = (cycles: SchoolCycle[], term: string) => {
        if (!term) return cycles;
        const searchTermLower = term.toLowerCase();
        return cycles.filter(cycle =>
            cycle.name.toLowerCase().includes(searchTermLower) ||
            cycle.status.toLowerCase().includes(searchTermLower)
        );
    };

    // Efecto para actualizar los ciclos filtrados y ordenados
    useEffect(() => {
        const filtered = filterCycles(cycles, searchTerm);
        const sorted = sortCycles(filtered);
        setFilteredCycles(sorted);
    }, [cycles, searchTerm, sortField, sortDirection]);

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Ciclos escolares" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                {/* Metrics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
                    {/* Total de Ciclos */}
                    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        {isLoadingMetrics ? (
                            <div className="flex items-center justify-center h-full">
                                <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                            </div>
                        ) : cycles.length === 0 ? (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                    <i className="fa-duotone fa-solid fa-calendar fa-xl text-gray-800 dark:text-white/90"></i>
                                </div>
                                <div className="mt-5 flex items-end justify-between">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                            Total de Ciclos
                                        </span>
                                        <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                            {cycles.length}
                                        </h4>
                                    </div>
                                    <Badge color="info">
                                        <span className="font-outfit">
                                            {cycles.filter(cycle => cycle.status === 'active').length} activos
                                        </span>
                                    </Badge>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Total de Alumnos en Ciclos Activos */}
                    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        {isLoadingMetrics ? (
                            <div className="flex items-center justify-center h-full">
                                <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                            </div>
                        ) : cycles.length === 0 ? (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                    <i className="fa-duotone fa-solid fa-user-graduate fa-xl text-gray-800 dark:text-white/90"></i>
                                </div>
                                <div className="mt-5 flex items-end justify-between">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                            Alumnos en Ciclos Activos
                                        </span>
                                        <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                            {cycles.filter(cycle => cycle.status === 'active').reduce((acc, cycle) => acc + cycle.studentsCount, 0)}
                                        </h4>
                                    </div>
                                    <Badge color="success">
                                        <span className="font-outfit">
                                            {cycles.filter(cycle => cycle.status === 'active').length} ciclos
                                        </span>
                                    </Badge>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Promedio General de Ciclos Activos */}
                    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        {isLoadingMetrics ? (
                            <div className="flex items-center justify-center h-full">
                                <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                            </div>
                        ) : cycles.length === 0 ? (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                    <i className="fa-duotone fa-solid fa-graduation-cap fa-xl text-gray-800 dark:text-white/90"></i>
                                </div>
                                <div className="mt-5 flex items-end justify-between">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                            Promedio General
                                        </span>
                                        <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                            {cycles.filter(cycle => cycle.status === 'active').length > 0
                                                ? (cycles.filter(cycle => cycle.status === 'active').reduce((acc, cycle) => acc + cycle.averageGrade, 0) / cycles.filter(cycle => cycle.status === 'active').length).toFixed(2)
                                                : '0.00'
                                            }
                                        </h4>
                                    </div>
                                    <Badge color="warning">
                                        <span className="font-outfit">
                                            {cycles.filter(cycle => cycle.status === 'active' && cycle.averageGrade >= 8).length} ciclos
                                        </span>
                                    </Badge>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Alumnos por Ciclo */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                        {isLoadingMetrics ? (
                            <div className="flex items-center justify-center h-[180px]">
                                <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                            </div>
                        ) : cycles.length === 0 ? (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                        Distribución de Alumnos por Ciclo
                                    </h3>
                                </div>
                                <div className="custom-scrollbar max-w-full overflow-x-auto">
                                    <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
                                        <ReactApexChart
                                            options={{
                                                ...barOptions,
                                                colors: ['#465fff'],
                                                yaxis: {
                                                    title: {
                                                        text: 'Número de Alumnos',
                                                    },
                                                },
                                                xaxis: {
                                                    categories: cycles.map(cycle => cycle.name),
                                                },
                                            }}
                                            series={[{
                                                name: 'Alumnos',
                                                data: cycles.map(cycle => cycle.studentsCount)
                                            }]}
                                            type="bar"
                                            height={180}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Promedios por Ciclo */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                        {isLoadingMetrics ? (
                            <div className="flex items-center justify-center h-[180px]">
                                <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                            </div>
                        ) : cycles.length === 0 ? (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                        Promedios por Ciclo Escolar
                                    </h3>
                                </div>
                                <div className="custom-scrollbar max-w-full overflow-x-auto">
                                    <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
                                        <ReactApexChart
                                            options={{
                                                ...barOptions,
                                                colors: ['#10B981'],
                                                yaxis: {
                                                    title: {
                                                        text: 'Promedio General',
                                                    },
                                                },
                                                xaxis: {
                                                    categories: cycles.map(cycle => cycle.name),
                                                },
                                            }}
                                            series={[{
                                                name: 'Promedio',
                                                data: cycles.map(cycle => cycle.averageGrade)
                                            }]}
                                            type="bar"
                                            height={180}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Historical */}
                <ComponentCard title="Lista de ciclos escolares" desc='Aquí podrás ver todos los ciclos escolares registrados, su información y gestionarlos. Puedes crear nuevos ciclos, editar los existentes o eliminarlos según sea necesario.' className={`w-100 p-4`}>
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:w-64">
                            <Input
                                type="text"
                                placeholder="Buscar ciclos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                startIcon={<i className="fa-duotone fa-solid fa-search text-gray-400"></i>}
                            />
                        </div>
                        <Button
                            variant="primary"
                            startIcon={<i className="fa-duotone fa-solid fa-calendar-pen"></i>}
                            onClick={openModal}
                            disabled={isSaving}
                        >
                            <span className="font-outfit">Nuevo Ciclo Escolar</span>
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoadingCycles ? (
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
                                            onClick={() => handleSort('startDate')}
                                        >
                                            <div className="flex items-center justify-center gap-1">
                                                Fecha de Inicio
                                                {sortField === 'startDate' && (
                                                    <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
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
                                                    <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
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
                                                    <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
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
                                                    <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
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
                                                    color={cycle.status === 'active' ? 'success' : (cycle.status === 'completed' ? 'warning' : 'light')}
                                                >
                                                    <span className="font-outfit">
                                                        {cycle.status === 'active' ? 'activo' : (cycle.status === 'completed' ? 'finalizado' : 'inactivo')}
                                                    </span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <Button
                                                    className="mr-2"
                                                    variant="outline"
                                                    size="sm"
                                                    startIcon={<i className="fa-duotone fa-solid fa-calendar-pen"></i>}
                                                    onClick={() => handleEdit(cycle.id)}
                                                >
                                                    <span className="font-outfit">Editar</span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    startIcon={<i className="fa-duotone fa-solid fa-calendar-xmark"></i>}
                                                    onClick={() => handleDelete(cycle.id)}
                                                >
                                                    <span className="font-outfit">Eliminar</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredCycles.length === 0 && (
                                        <TableRow>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
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
            </div>

            {/* Ciclos Eliminados */}
            <div className="mt-6">
                <button
                    onClick={() => setShowDeleted(!showDeleted)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left dark:border-gray-800 dark:bg-white/[0.03]"
                >
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                            Ciclos Eliminados
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            {deletedCycles.length} ciclos en la papelera
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
                                            <TableCell isHeader>Fecha de Inicio</TableCell>
                                            <TableCell isHeader>Fecha de Fin</TableCell>
                                            <TableCell isHeader>Grupos</TableCell>
                                            <TableCell isHeader>Alumnos</TableCell>
                                            <TableCell isHeader>Promedio</TableCell>
                                            <TableCell isHeader>Estado</TableCell>
                                            <TableCell isHeader>Acciones</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {deletedCycles.map(cycle => (
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
                                                        color={cycle.status === 'active' ? 'success' : (cycle.status === 'completed' ? 'warning' : 'light')}
                                                    >
                                                        <span className="font-outfit">
                                                            {cycle.status === 'active' ? 'activo' : (cycle.status === 'completed' ? 'finalizado' : 'inactivo')}
                                                        </span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        startIcon={<i className="fa-duotone fa-solid fa-rotate-left"></i>}
                                                        onClick={() => handleRestore(cycle.id)}
                                                    >
                                                        <span className="font-outfit">Restaurar</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {deletedCycles.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={8} className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                        No hay ciclos eliminados
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

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                            {selectedCycle ? "Editar ciclo escolar" : "Define un nuevo ciclo escolar"}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            El conjunto de fechas clave que delimitan el periodo académico, en el que se asignan grupos, materias y alumnos para organizar eficazmente el año escolar.
                        </p>
                    </div>
                    <div className="mt-8">
                        <div>
                            <div>
                                <Label htmlFor="cycle-name" className="font-outfit">
                                    Nombre del ciclo escolar
                                </Label>
                                <Input
                                    id="cycle-name"
                                    type="text"
                                    placeholder={`Ej. Ciclo ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`}
                                    onChange={(e) => handleInputChange(e)}
                                    name="name"
                                    defaultValue={cycleForm.name}
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <Label className="font-outfit">
                                Estado del Ciclo
                            </Label>
                            <Select
                                options={[
                                    { value: 'activo', label: 'Activo' },
                                    { value: 'inactivo', label: 'Inactivo' },
                                    { value: 'finalizado', label: 'Finalizado' }
                                ]}
                                placeholder="Seleccione un estado"
                                onChange={(value) => handleSelectChange(value)}
                                defaultValue={cycleForm.status === 'active' ? 'activo' : (cycleForm.status === 'completed' ? 'finalizado' : 'inactivo')}
                            />
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="cycle-start-date" className="font-outfit">
                                Ingrese la fecha de inicio
                            </Label>
                            <Input
                                id="cycle-start-date"
                                type="date"
                                name="startDate"
                                placeholder="Fecha de inicio"
                                onChange={(e) => handleInputChange(e)}
                                defaultValue={cycleForm.startDate}
                            />
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="cycle-end-date" className="font-outfit">
                                Ingrese la fecha de fin
                            </Label>
                            <Input
                                id="cycle-end-date"
                                type="date"
                                name="endDate"
                                placeholder="Fecha de fin"
                                onChange={(e) => handleInputChange(e)}
                                defaultValue={cycleForm.endDate}
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
                            onClick={handleSaveCycle}
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
                                <span className="font-outfit">{selectedCycle ? "Actualizar Ciclo" : "Crear Ciclo"}</span>
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
