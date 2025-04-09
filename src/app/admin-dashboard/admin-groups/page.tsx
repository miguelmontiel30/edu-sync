'use client';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';
import { ArrowDownIcon, ArrowUpIcon, MoreDotIcon } from '@/icons';
import { ApexOptions } from 'apexcharts';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/core/table';
// import Image from 'next/image';
import { Group } from '@/utils/interfaces/Group.interface';
import { GroupStatus } from '@/utils/enums/Group.enum';
import { supabaseClient } from '@/services/config/supabaseClient';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';
import Switch from '@/components/form/switch/Switch';

export default function GroupDashboard() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
    const [deletedGroups, setDeletedGroups] = useState<Group[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnlyActiveCycles, setShowOnlyActiveCycles] = useState(true);
    const [sortField, setSortField] = useState<'grade' | 'group' | 'studentsNumber' | 'subjectsNumber' | 'generalAverage' | 'status'>('grade');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [schoolYears, setSchoolYears] = useState<Array<{ id: number; name: string; status: string }>>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [groupForm, setGroupForm] = useState({
        grade: '',
        group: '',
        schoolYearId: '',
        status: GroupStatus.Active
    });

    // Cargar grupos y ciclos escolares al montar el componente
    useEffect(() => {
        loadGroups();
        loadDeletedGroups();
        loadSchoolYears();
    }, []);

    async function loadGroups() {
        try {
            const { data, error } = await supabaseClient
                .from('groups')
                .select(`
                    *,
                    school_years (
                        school_year_id,
                        name,
                        start_date,
                        end_date,
                        status
                    ),
                    group_teachers (
                        teachers (
                            teacher_id,
                            name,
                            role,
                            image
                        )
                    ),
                    student_groups (
                        students (
                            student_id,
                            first_name,
                            father_last_name,
                            mother_last_name,
                            created_at
                        )
                    ),
                    grades (
                        grade_id,
                        grade,
                        subject_id
                    )
                `)
                .eq('delete_flag', false)
                .order('created_at', { ascending: false });

            console.log(data);

            if (error) throw error;

            if (data) {
                const formattedGroups: Group[] = data.map(group => {
                    // Calcular promedio general
                    const grades = group.grades || [];
                    const averageGrade = grades.length > 0
                        ? grades.reduce((acc: number, grade: { grade: number }) => acc + grade.grade, 0) / grades.length
                        : 0;

                    // Obtener estudiantes recientes (últimos 30 días)
                    const students = group.student_groups?.map((sg: { students: any }) => sg.students).flat() || [];
                    const recentStudents = students.filter((student: { created_at: string }) => {
                        const studentDate = new Date(student.created_at);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return studentDate >= thirtyDaysAgo;
                    });

                    return {
                        id: group.group_id,
                        grade: group.grade,
                        group: group.group_name,
                        teachers: group.group_teachers?.map((gt: { teachers: any }) => gt.teachers) || [],
                        schoolYear: {
                            id: group.school_years.school_year_id,
                            name: group.school_years.name,
                            startDate: group.school_years.start_date,
                            endDate: group.school_years.end_date,
                            status: group.school_years.status
                        },
                        studentsNumber: students.length,
                        subjectsNumber: group.subjects_number,
                        status: group.status,
                        generalAverage: averageGrade,
                        attendancePercentage: 0, // Por ahora lo dejamos en 0 ya que no tenemos la tabla de asistencia
                        recentStudents: recentStudents.length,
                        createdAt: group.created_at,
                        updatedAt: group.updated_at
                    };
                });
                setGroups(formattedGroups);
            }
        } catch (error) {
            console.error('Error al cargar los grupos:', error);
            alert('Error al cargar los grupos. Por favor recarga la página.');
        }
    }

    async function loadDeletedGroups() {
        try {
            const { data, error } = await supabaseClient
                .from('groups')
                .select(`
                    *,
                    school_years (
                        school_year_id,
                        name,
                        start_date,
                        end_date,
                        status
                    ),
                    group_teachers (
                        teachers (
                            teacher_id,
                            name,
                            role,
                            image
                        )
                    ),
                    student_groups (
                        students (
                            student_id,
                            first_name,
                            father_last_name,
                            mother_last_name,
                            created_at
                        )
                    ),
                    grades (
                        grade_id,
                        grade,
                        subject_id
                    )
                `)
                .eq('delete_flag', true)
                .order('deleted_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const formattedGroups: Group[] = data.map(group => {
                    const grades = group.grades || [];
                    const averageGrade = grades.length > 0
                        ? grades.reduce((acc: number, grade: { grade: number }) => acc + grade.grade, 0) / grades.length
                        : 0;

                    const students = group.student_groups?.map((sg: { students: any }) => sg.students).flat() || [];
                    const recentStudents = students.filter((student: { created_at: string }) => {
                        const studentDate = new Date(student.created_at);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return studentDate >= thirtyDaysAgo;
                    });

                    return {
                        id: group.group_id,
                        grade: group.grade,
                        group: group.group_name,
                        teachers: group.group_teachers?.map((gt: { teachers: any }) => gt.teachers) || [],
                        schoolYear: {
                            id: group.school_years.school_year_id,
                            name: group.school_years.name,
                            startDate: group.school_years.start_date,
                            endDate: group.school_years.end_date,
                            status: group.school_years.status
                        },
                        studentsNumber: students.length,
                        subjectsNumber: group.subjects_number,
                        status: group.status,
                        generalAverage: averageGrade,
                        attendancePercentage: 0,
                        recentStudents: recentStudents.length,
                        createdAt: group.created_at,
                        updatedAt: group.updated_at
                    };
                });
                setDeletedGroups(formattedGroups);
            }
        } catch (error) {
            console.error('Error al cargar los grupos eliminados:', error);
        }
    }

    async function loadSchoolYears() {
        try {
            const { data, error } = await supabaseClient
                .from('school_years')
                .select('school_year_id, name, status')
                .eq('delete_flag', false)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                setSchoolYears(data.map(year => ({
                    id: year.school_year_id,
                    name: year.name,
                    status: year.status
                })));
            }
        } catch (error) {
            console.error('Error al cargar los ciclos escolares:', error);
        }
    }

    // Actualizar loadSchoolYears cuando cambie selectedGroup
    useEffect(() => {
        loadSchoolYears();
    }, [selectedGroup]);

    const handleEdit = (id: number) => {
        const groupToEdit = groups.find(group => group.id === id);
        if (groupToEdit) {
            setSelectedGroup(groupToEdit);
            setGroupForm({
                grade: groupToEdit.grade.toString(),
                group: groupToEdit.group,
                schoolYearId: groupToEdit.schoolYear.id.toString(),
                status: groupToEdit.status as GroupStatus,
            });
            setIsModalOpen(true);
        }
    };

    async function handleDelete(id: number) {
        try {
            const { error } = await supabaseClient
                .from('groups')
                .update({
                    delete_flag: true,
                    status: GroupStatus.Inactive,
                    deleted_at: new Date().toISOString()
                })
                .eq('group_id', id);

            if (error) throw error;

            // Actualizar estado local
            setGroups(prev => prev.filter(group => group.id !== id));

            // Recargar los grupos eliminados
            await loadDeletedGroups();
        } catch (error) {
            console.error('Error al eliminar el grupo:', error);
            alert('Error al eliminar el grupo. Por favor intenta nuevamente.');
        }
    }

    // Función para restaurar un grupo
    async function handleRestore(id: number) {
        try {
            const { error } = await supabaseClient
                .from('groups')
                .update({
                    delete_flag: false,
                    deleted_at: null
                })
                .eq('group_id', id);

            if (error) throw error;

            // Actualizar estados
            const groupToRestore = deletedGroups.find(group => group.id === id);
            if (groupToRestore) {
                setGroups(prev => [...prev, groupToRestore]);
                setDeletedGroups(prev => prev.filter(group => group.id !== id));
            }
        } catch (error) {
            console.error('Error al restaurar el grupo:', error);
            alert('Error al restaurar el grupo. Por favor intenta nuevamente.');
        }
    }

    // Función para manejar el ordenamiento
    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Función para ordenar los grupos
    const sortGroups = (groups: Group[]) => {
        return [...groups].sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'grade':
                    comparison = a.grade - b.grade;
                    break;
                case 'group':
                    comparison = a.group.localeCompare(b.group);
                    break;
                case 'studentsNumber':
                    comparison = a.studentsNumber - b.studentsNumber;
                    break;
                case 'subjectsNumber':
                    comparison = a.subjectsNumber - b.subjectsNumber;
                    break;
                case 'generalAverage':
                    comparison = a.generalAverage - b.generalAverage;
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

    // Función para filtrar los grupos
    const filterGroups = (groups: Group[], term: string) => {
        let filtered = groups;

        // Filtrar por término de búsqueda
        if (term) {
            const searchTermLower = term.toLowerCase();
            filtered = filtered.filter(group =>
                group.group.toLowerCase().includes(searchTermLower) ||
                group.grade.toString().includes(searchTermLower) ||
                group.status.toLowerCase().includes(searchTermLower)
            );
        }

        // Filtrar por ciclos activos si está habilitado
        if (showOnlyActiveCycles) {
            filtered = filtered.filter(group =>
                group.schoolYear?.status === 'active' || group.schoolYear?.status === 'vigent'
            );
        }

        return filtered;
    };

    // Efecto para actualizar los grupos filtrados y ordenados
    useEffect(() => {
        const filtered = filterGroups(groups, searchTerm);
        const sorted = sortGroups(filtered);
        setFilteredGroups(sorted);
    }, [groups, searchTerm, sortField, sortDirection, showOnlyActiveCycles]);

    function openModal() {
        setSelectedGroup(null);
        setGroupForm({
            grade: '',
            group: '',
            schoolYearId: '',
            status: GroupStatus.Active
        });
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setGroupForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleSelectChange(value: string) {
        if (value === 'activo' || value === 'inactivo' || value === 'finalizado') {
            const statusMap: { [key: string]: GroupStatus } = {
                'activo': GroupStatus.Active,
                'inactivo': GroupStatus.Inactive,
                'finalizado': GroupStatus.Completed
            };

            setGroupForm(prev => ({
                ...prev,
                status: statusMap[value]
            }));
        }
    }

    async function handleSaveGroup() {
        try {
            // Validar que todos los campos estén completados
            if (!groupForm.grade || !groupForm.group || !groupForm.schoolYearId) {
                alert('Por favor completa todos los campos requeridos');
                return;
            }

            if (selectedGroup) {
                // Actualizar grupo existente
                const { error } = await supabaseClient
                    .from('groups')
                    .update({
                        grade: parseInt(groupForm.grade),
                        group_name: groupForm.group,
                        school_year_id: parseInt(groupForm.schoolYearId),
                        status: groupForm.status,
                        updated_at: new Date().toISOString()
                    })
                    .eq('group_id', selectedGroup.id);

                if (error) throw error;
            } else {
                // Verificar si ya existe un grupo con el mismo grado y nombre en el mismo ciclo escolar
                const { data: existingGroup, error: checkError } = await supabaseClient
                    .from('groups')
                    .select('group_id, group_name')
                    .eq('school_id', 1) // TODO: Obtener el school_id del usuario actual
                    .eq('school_year_id', parseInt(groupForm.schoolYearId))
                    .eq('grade', parseInt(groupForm.grade))
                    .eq('group_name', groupForm.group)
                    .eq('delete_flag', false)
                    .single();

                if (checkError && checkError.code !== 'PGRST116') { // PGRST116 es "no se encontraron resultados"
                    throw checkError;
                }

                if (existingGroup) {
                    alert(`Ya existe un grupo ${groupForm.group} en el grado ${groupForm.grade} para el ciclo escolar seleccionado. Por favor, seleccione un nombre de grupo diferente.`);
                    return;
                }

                // Crear nuevo grupo
                const { data, error } = await supabaseClient
                    .from('groups')
                    .insert([{
                        grade: parseInt(groupForm.grade),
                        group_name: groupForm.group,
                        school_year_id: parseInt(groupForm.schoolYearId),
                        status: groupForm.status,
                        school_id: 1 // TODO: Obtener el school_id del usuario actual
                    }])
                    .select();

                if (error) throw error;
            }

            // Recargar los datos después de cualquier operación exitosa
            await loadGroups();
            closeModal();
        } catch (error) {
            console.error('Error al guardar el grupo:', error);
            alert('Error al guardar el grupo. Por favor intenta nuevamente.');
        }
    }

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
            categories: Array.from(new Set(groups.map(group => group.grade))).sort(),
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
            data: Array.from(new Set(groups.map(group => group.grade)))
                .sort()
                .map(grade => {
                    const gradeGroups = groups.filter(group => group.grade === grade);
                    const average = gradeGroups.reduce((acc, group) => acc + (group.generalAverage || 0), 0) / gradeGroups.length;
                    return Number(average.toFixed(2));
                }),
        },
    ];

    // Función para obtener las opciones de ciclos escolares
    const getGroupedSchoolYears = () => {
        const categories = [];

        // Agregar ciclos activos
        const activeYears = schoolYears.filter(year => year.status === 'active');
        if (activeYears.length > 0) {
            categories.push({
                label: 'Ciclos Activos',
                options: activeYears.map(year => ({
                    value: year.id.toString(),
                    label: year.name
                }))
            });
        }

        // Agregar ciclos vigentes
        const vigentYears = schoolYears.filter(year => year.status === 'vigent');
        if (vigentYears.length > 0) {
            categories.push({
                label: 'Ciclos Vigentes',
                options: vigentYears.map(year => ({
                    value: year.id.toString(),
                    label: year.name
                }))
            });
        }

        // Agregar ciclos finalizados
        const completedYears = schoolYears.filter(year => year.status === 'completed');
        if (completedYears.length > 0) {
            categories.push({
                label: 'Ciclos Finalizados',
                options: completedYears.map(year => ({
                    value: year.id.toString(),
                    label: year.name
                }))
            });
        }

        return categories;
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Mis Grupos" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                {/* Metrics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
                    {/* Total de Grupos */}
                    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        {groups.length === 0 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        )}
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <i className="fa-duotone fa-solid fa-users fa-xl text-gray-800 dark:text-white/90"></i>
                        </div>

                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    Total de Grupos
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    {groups.length}
                                </h4>
                            </div>
                            <Badge color="info">
                                <span className="font-outfit">
                                    {groups.filter(group => group.status === GroupStatus.Active).length} activos
                                </span>
                            </Badge>
                        </div>
                    </div>

                    {/* Total de Alumnos */}
                    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        {groups.length === 0 && (
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
                                    Total de Alumnos
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    {groups.reduce((acc, group) => acc + group.studentsNumber, 0)}
                                </h4>
                            </div>
                            <Badge color="success">
                                <span className="font-outfit">
                                    {groups.filter(group => group.status === GroupStatus.Active).length} grupos
                                </span>
                            </Badge>
                        </div>
                    </div>

                    {/* Promedio General */}
                    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        {groups.length === 0 && (
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
                                    Promedio General
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90 font-outfit">
                                    {groups.length > 0
                                        ? (groups.reduce((acc, group) => acc + group.generalAverage, 0) / groups.length).toFixed(2)
                                        : '0.00'
                                    }
                                </h4>
                            </div>
                            <Badge color="warning">
                                <span className="font-outfit">
                                    {groups.filter(group => group.generalAverage >= 8).length} grupos
                                </span>
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Alumnos por Grupo */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                        {groups.length === 0 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                Distribución de alumnos por grupo
                            </h3>
                            <Badge color="success">
                                <span className="font-outfit">Grupos activos: {groups.filter(group => group.status === GroupStatus.Active).length}</span>
                            </Badge>
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
                                            categories: groups
                                                .filter(group => group.status === GroupStatus.Active)
                                                .sort((a, b) => a.grade - b.grade || a.group.localeCompare(b.group))
                                                .map(group => `${group.grade}° ${group.group}`),
                                        },
                                    }}
                                    series={[{
                                        name: 'Alumnos',
                                        data: groups
                                            .filter(group => group.status === GroupStatus.Active)
                                            .sort((a, b) => a.grade - b.grade || a.group.localeCompare(b.group))
                                            .map(group => group.studentsNumber)
                                    }]}
                                    type="bar"
                                    height={180}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Promedios por Grado */}
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                        {groups.length === 0 && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-semibold text-white font-outfit">Sin datos</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                                Promedios por Grado
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
                                            categories: Array.from(new Set(groups.map(group => group.grade))).sort(),
                                        },
                                    }}
                                    series={[{
                                        name: 'Promedio',
                                        data: Array.from(new Set(groups.map(group => group.grade)))
                                            .sort()
                                            .map(grade => {
                                                const gradeGroups = groups.filter(group => group.grade === grade);
                                                const average = gradeGroups.reduce((acc, group) => acc + group.generalAverage, 0) / gradeGroups.length;
                                                return Number(average.toFixed(2));
                                            })
                                    }]}
                                    type="bar"
                                    height={180}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Historical */}
                <ComponentCard title="Lista de grupos" desc='Aquí podrás ver todos los grupos registrados, su información y gestionarlos. Puedes crear nuevos grupos, editar los existentes o eliminarlos según sea necesario.' className={`w-100 p-4`}>

                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Input
                                    type="text"
                                    placeholder="Buscar grupos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                    startIcon={<i className="fa-duotone fa-solid fa-search text-gray-400"></i>}
                                />
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            startIcon={<i className="fa-duotone fa-solid fa-users-medical"></i>}
                            onClick={openModal}
                        >
                            <span className="font-outfit">Nuevo Grupo</span>
                        </Button>
                    </div>

                    <div className="flex justify-end">
                        <div className="flex items-center gap-2">
                            <Label className="font-outfit text-sm">Solo grupos activos</Label>
                            <Switch
                                label=""
                                defaultChecked={showOnlyActiveCycles}
                                onChange={(checked) => setShowOnlyActiveCycles(checked)}
                                color="blue"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table className="min-w-full">
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                        onClick={() => handleSort('grade')}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            Grado
                                            {sortField === 'grade' && (
                                                <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                        onClick={() => handleSort('group')}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            Grupo
                                            {sortField === 'group' && (
                                                <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                    >
                                        Profesores a cargo
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                    >
                                        Ciclo escolar
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                        onClick={() => handleSort('studentsNumber')}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            No. de alumnos
                                            {sortField === 'studentsNumber' && (
                                                <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                        onClick={() => handleSort('subjectsNumber')}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            No. de materias
                                            {sortField === 'subjectsNumber' && (
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
                                        className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                        onClick={() => handleSort('generalAverage')}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            Promedio general
                                            {sortField === 'generalAverage' && (
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
                                {filteredGroups.map((group: Group) => (
                                    <TableRow key={group.id}>
                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-gray-800 dark:text-white/90 font-outfit">{group.grade}</span>
                                        </TableCell>

                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-gray-800 dark:text-white/90 font-outfit">{group.group}</span>
                                        </TableCell>

                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            {group.teachers.map(teacher => (
                                                <div
                                                    key={teacher.id}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div className="h-8 w-8 overflow-hidden rounded-full">
                                                        {/* <Image
                                                            width={32}
                                                            height={32}
                                                            src={teacher.image}
                                                            alt={teacher.name}
                                                        /> */}
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                            {teacher.name}
                                                        </span>
                                                        <span className="block text-xs text-gray-500 dark:text-gray-400 font-outfit">
                                                            {teacher.role}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </TableCell>

                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-gray-800 dark:text-white/90 font-outfit">
                                                {group.schoolYear?.name || 'Sin ciclo escolar'}
                                                <div className="flex items-center justify-center gap-2">
                                                    <Badge
                                                        size="sm"
                                                        color={
                                                            group.schoolYear?.status === 'active'
                                                                ? 'success'
                                                                : 'warning'
                                                        }
                                                    >
                                                        <span className="font-outfit">{group.schoolYear?.status}</span>
                                                    </Badge>
                                                </div>
                                            </span>
                                        </TableCell>

                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-gray-800 dark:text-white/90 font-outfit">{group.studentsNumber}</span>
                                        </TableCell>

                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-gray-800 dark:text-white/90 font-outfit">{group.subjectsNumber}</span>
                                        </TableCell>

                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <Badge
                                                size="sm"
                                                color={
                                                    group.status === GroupStatus.Active
                                                        ? 'success'
                                                        : group.status === GroupStatus.Pending
                                                            ? 'warning'
                                                            : 'error'
                                                }
                                            >
                                                <span className="font-outfit">{group.status}</span>
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-gray-800 dark:text-white/90 font-outfit">{group.generalAverage.toFixed(2)}</span>
                                        </TableCell>

                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                            <Button
                                                className="mr-2"
                                                variant="outline"
                                                size="sm"
                                                startIcon={<i className="fa-duotone fa-solid fa-pen-to-square text-gray-800 dark:text-white/90"></i>}
                                                onClick={() => handleEdit(group.id)}
                                            >
                                                <span className="font-outfit">Editar</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                startIcon={<i className="fa-duotone fa-solid fa-trash text-gray-800 dark:text-white/90"></i>}
                                                onClick={() => handleDelete(group.id)}
                                            >
                                                <span className="font-outfit">Eliminar</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredGroups.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="px-5 py-4 text-center sm:px-6">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                {searchTerm ? 'No se encontraron grupos que coincidan con la búsqueda.' : 'No se encontraron grupos.'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </ComponentCard>
            </div>

            {/* Grupos Eliminados */}
            <div className="mt-6">
                <button
                    onClick={() => setShowDeleted(!showDeleted)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 text-left dark:border-gray-800 dark:bg-white/[0.03]"
                >
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit">
                            Grupos Eliminados
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            {deletedGroups.length} grupos en la papelera
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
                                        <TableCell isHeader>Grado</TableCell>
                                        <TableCell isHeader>Grupo</TableCell>
                                        <TableCell isHeader>Profesores a cargo</TableCell>
                                        <TableCell isHeader>Ciclo escolar</TableCell>
                                        <TableCell isHeader>No. de alumnos</TableCell>
                                        <TableCell isHeader>No. de materias</TableCell>
                                        <TableCell isHeader>Estado</TableCell>
                                        <TableCell isHeader>Promedio general</TableCell>
                                        <TableCell isHeader>Acciones</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {deletedGroups.map(group => (
                                        <TableRow key={group.id}>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-gray-800 dark:text-white/90 font-outfit">{group.grade}</span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-gray-800 dark:text-white/90 font-outfit">{group.group}</span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                {group.teachers.map(teacher => (
                                                    <div
                                                        key={teacher.id}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className="h-8 w-8 overflow-hidden rounded-full">
                                                            {/* <Image
                                                                width={32}
                                                                height={32}
                                                                src={teacher.image}
                                                                alt={teacher.name}
                                                            /> */}
                                                        </div>
                                                        <div>
                                                            <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                                {teacher.name}
                                                            </span>
                                                            <span className="block text-xs text-gray-500 dark:text-gray-400 font-outfit">
                                                                {teacher.role}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-gray-800 dark:text-white/90 font-outfit">{group.schoolYear.name}</span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-gray-800 dark:text-white/90 font-outfit">{group.studentsNumber}</span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-gray-800 dark:text-white/90 font-outfit">{group.subjectsNumber}</span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <Badge
                                                    size="sm"
                                                    color={
                                                        group.status === GroupStatus.Active
                                                            ? 'success'
                                                            : group.status === GroupStatus.Pending
                                                                ? 'warning'
                                                                : 'error'
                                                    }
                                                >
                                                    <span className="font-outfit">{group.status}</span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-gray-800 dark:text-white/90 font-outfit">{group.generalAverage.toFixed(2)}</span>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-center sm:px-6">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    startIcon={<i className="fa-duotone fa-solid fa-rotate-left"></i>}
                                                    onClick={() => handleRestore(group.id)}
                                                >
                                                    <span className="font-outfit">Restaurar</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {deletedGroups.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={9} className="px-5 py-4 text-center sm:px-6">
                                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                    No hay grupos eliminados
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

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                            {selectedGroup ? "Editar grupo" : "Crear nuevo grupo"}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            {selectedGroup
                                ? "Modifica los detalles del grupo según sea necesario."
                                : "Completa los campos para crear un nuevo grupo."
                            }
                        </p>
                    </div>
                    <div className="mt-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="group-grade" className="font-outfit">
                                    Grado
                                </Label>
                                <Input
                                    id="group-grade"
                                    type="number"
                                    placeholder="Ej. 1"
                                    onChange={(e) => handleInputChange(e)}
                                    name="grade"
                                    defaultValue={groupForm.grade}
                                />
                            </div>
                            <div>
                                <Label htmlFor="group-name" className="font-outfit">
                                    Grupo
                                </Label>
                                <Input
                                    id="group-name"
                                    type="text"
                                    placeholder="Ej. A"
                                    onChange={(e) => handleInputChange(e)}
                                    name="group"
                                    defaultValue={groupForm.group}
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="group-school-year" className="font-outfit">
                                Ciclo Escolar
                            </Label>
                            <SelectWithCategories
                                options={getGroupedSchoolYears()}
                                placeholder="Seleccione un ciclo escolar"
                                onChange={(value) => handleInputChange({ target: { name: 'schoolYearId', value } } as any)}
                                defaultValue={groupForm.schoolYearId}
                            />
                        </div>

                        <div className="mt-6">
                            <Label className="font-outfit">
                                Estado del Grupo
                            </Label>
                            <SelectWithCategories
                                options={[
                                    {
                                        label: 'Estados Disponibles',
                                        options: [
                                            { value: 'activo', label: 'Activo' },
                                            { value: 'inactivo', label: 'Inactivo' },
                                            { value: 'finalizado', label: 'Finalizado' }
                                        ]
                                    }
                                ]}
                                placeholder="Seleccione un estado"
                                onChange={(value) => handleSelectChange(value)}
                                defaultValue={groupForm.status === GroupStatus.Active ? 'activo' : (groupForm.status === GroupStatus.Completed ? 'finalizado' : 'inactivo')}
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
                            onClick={handleSaveGroup}
                            variant="primary"
                            className="sm:w-auto"
                        >
                            <span className="font-outfit">{selectedGroup ? "Actualizar Grupo" : "Crear Grupo"}</span>
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
