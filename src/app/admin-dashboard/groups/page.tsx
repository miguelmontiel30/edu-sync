'use client';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import {Dropdown} from '@/components/ui/dropdown/Dropdown';
import {DropdownItem} from '@/components/ui/dropdown/DropdownItem';
import {ArrowDownIcon, ArrowUpIcon, MoreDotIcon} from '@/icons';
import {ApexOptions} from 'apexcharts';
import {useState} from 'react';
import ReactApexChart from 'react-apexcharts';
import {Table, TableBody, TableCell, TableHeader, TableRow} from '@/components/core/table';
// import Image from 'next/image';
import {Group} from '@/utils/interfaces/Group.interface';
import {GroupStatus} from '@/utils/enums/Group.enum';

export default function GroupDashboard() {
    // const [cycles, setCycles] = useState<SchoolCycle[]>(initialCycles);

    // const handleEdit = (id: number) => {
    //     // Lógica para editar el ciclo escolar
    //     console.log('Editar ciclo:', id);
    // };

    // const handleDelete = (id: number) => {
    //     // Lógica para eliminar el ciclo escolar
    //     setCycles(prev => prev.filter(cycle => cycle.id !== id));
    // };

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

    // Define the table data using the interface
    const tableData: Group[] = [
        {
            id: 1,
            grade: 3,
            group: 'F',
            teachers: [
                {
                    id: 5,
                    name: 'Roberto',
                    role: 'Profesor',
                    image: 'https://randomuser.me/api/portraits/men/59.jpg',
                },
                {
                    id: 4,
                    name: 'Rachel',
                    role: 'Profesor',
                    image: 'https://randomuser.me/api/portraits/men/33.jpg',
                },
            ],
            schoolYear: {
                id: 2,
                name: 'Ciclo 2022-2023',
                startDate: '2022-09-01',
                endDate: '2023-06-30',
                status: 'inactive',
            },
            studentsNumber: 31,
            subjectsNumber: 10,
            status: GroupStatus.Active,
            generalAverage: 9.62,
            createdAt: '2024-08-10',
            updatedAt: '2020-07-22',
        },
        {
            id: 2,
            grade: 3,
            group: 'D',
            teachers: [
                {
                    id: 1,
                    name: 'Lee',
                    role: 'Profesor',
                    image: 'https://randomuser.me/api/portraits/men/34.jpg',
                },
                {
                    id: 2,
                    name: 'James',
                    role: 'Profesor',
                    image: 'https://randomuser.me/api/portraits/men/74.jpg',
                },
            ],
            schoolYear: {
                id: 2,
                name: 'Ciclo 2022-2023',
                startDate: '2022-09-01',
                endDate: '2023-06-30',
                status: 'inactive',
            },
            studentsNumber: 21,
            subjectsNumber: 5,
            status: GroupStatus.Inactive,
            generalAverage: 6.19,
            createdAt: '2023-08-08',
            updatedAt: '2022-04-17',
        },
        {
            id: 3,
            grade: 6,
            group: 'D',
            teachers: [
                {
                    id: 2,
                    name: 'Elizabeth',
                    role: 'Profesor',
                    image: 'https://randomuser.me/api/portraits/men/58.jpg',
                },
                {
                    id: 3,
                    name: 'George',
                    role: 'Profesor',
                    image: 'https://randomuser.me/api/portraits/men/12.jpg',
                },
            ],
            schoolYear: {
                id: 3,
                name: 'Ciclo 2021-2022',
                startDate: '2021-09-01',
                endDate: '2022-06-30',
                status: 'inactive',
            },
            studentsNumber: 36,
            subjectsNumber: 5,
            status: GroupStatus.Completed,
            generalAverage: 8.4,
            createdAt: '2020-08-23',
            updatedAt: '2021-01-26',
        },
        {
            id: 4,
            grade: 2,
            group: 'D',
            teachers: [
                {
                    id: 1,
                    name: 'Gary',
                    role: 'Profesor',
                    image: 'https://randomuser.me/api/portraits/men/28.jpg',
                },
                {
                    id: 1,
                    name: 'Bryan',
                    role: 'Profesor',
                    image: 'https://randomuser.me/api/portraits/men/89.jpg',
                },
                {
                    id: 5,
                    name: 'Eddie',
                    role: 'Profesor',
                    image: 'https://randomuser.me/api/portraits/men/89.jpg',
                },
            ],
            schoolYear: {
                id: 3,
                name: 'Ciclo 2021-2022',
                startDate: '2021-09-01',
                endDate: '2022-06-30',
                status: 'inactive',
            },
            studentsNumber: 23,
            subjectsNumber: 6,
            status: GroupStatus.Active,
            generalAverage: 6.89,
            createdAt: '2024-11-26',
            updatedAt: '2022-01-19',
        },
        {
            id: 5,
            grade: 5,
            group: 'F',
            teachers: [
                {
                    id: 5,
                    name: 'Kara',
                    role: 'Profesor',
                    image: 'https://randomuser.me/api/portraits/men/60.jpg',
                },
            ],
            schoolYear: {
                id: 2,
                name: 'Ciclo 2022-2023',
                startDate: '2022-09-01',
                endDate: '2023-06-30',
                status: 'inactive',
            },
            studentsNumber: 31,
            subjectsNumber: 5,
            status: GroupStatus.Active,
            generalAverage: 8.44,
            createdAt: '2020-07-04',
            updatedAt: '2020-07-21',
        },
    ];

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Mis grupos" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                {/* Metrics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                    {/* <!-- Metric Item Start --> */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <i className="fa-duotone fa-solid fa-diploma fa-xl"></i>
                        </div>

                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Total de grupos concluidos
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                                    2,350
                                </h4>
                            </div>
                            <Badge color="success">
                                <ArrowUpIcon />
                                Grupos 12.5%
                            </Badge>
                        </div>
                    </div>
                    {/* <!-- Metric Item End --> */}

                    {/* <!-- Metric Item Start --> */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <i className="fa-duotone fa-solid fa-graduation-cap fa-xl"></i>
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Total de grupos activos
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                                    10
                                </h4>
                            </div>

                            <Badge color="error">
                                <ArrowDownIcon className="text-error-500" />
                                9.05%
                            </Badge>
                        </div>
                    </div>
                    {/* <!-- Metric Item End --> */}
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Calificaciones
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
                                    View More
                                </DropdownItem>
                                <DropdownItem
                                    onItemClick={closeDropdown}
                                    className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                >
                                    Delete
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

                {/* Historical */}
                <ComponentCard title="Ciclos escolares" className={`w-100 p-4`}>
                    <div className="mb-4 items-center justify-end">
                        <Button
                            variant="primary"
                            startIcon={<i className="fa-duotone fa-solid fa-users-medical"></i>}
                        >
                            Nuevo Grupo
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">
                                <Table>
                                    {/* Table Header */}
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                Grado
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                Grupo
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                Profesores a cargo
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                Ciclo escolar
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                No. de alumnos
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                No. de materias
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                Estado
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                Promedio general
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    {/* Table Body */}
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {tableData.map((group: Group) => (
                                            <TableRow key={group.id}>
                                                {/* Grado */}
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    {group.grade}
                                                </TableCell>

                                                {/* Grupo */}
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    {group.group}
                                                </TableCell>

                                                {/* Profesores a cargo */}
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
                                                                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                                                                    {teacher.name}
                                                                </span>
                                                                <span className="block text-xs text-gray-500 dark:text-gray-400">
                                                                    {teacher.role}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </TableCell>

                                                {/* Ciclo escolar */}
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    {group.schoolYear.name}
                                                </TableCell>

                                                {/* No. de alumnos */}
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    {group.studentsNumber}
                                                </TableCell>

                                                {/* No. de materias */}
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    {group.subjectsNumber}
                                                </TableCell>

                                                {/* Estado */}
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <Badge
                                                        size="sm"
                                                        color={
                                                            group.status === GroupStatus.Active
                                                                ? 'success'
                                                                : group.status ===
                                                                    GroupStatus.Pending
                                                                  ? 'warning'
                                                                  : 'error'
                                                        }
                                                    >
                                                        {group.status}
                                                    </Badge>
                                                </TableCell>

                                                {/* Promedio general */}
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    {group.generalAverage}
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
        </div>
    );
}
