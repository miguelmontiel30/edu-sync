'use client';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import {Dropdown} from '@/components/ui/dropdown/Dropdown';
import {DropdownItem} from '@/components/ui/dropdown/DropdownItem';
import {ArrowDownIcon, ArrowUpIcon, BoxIconLine, MoreDotIcon} from '@/icons';
import {ApexOptions} from 'apexcharts';
import {useState} from 'react';
import ReactApexChart from 'react-apexcharts';

interface SchoolCycle {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
}

const initialCycles: SchoolCycle[] = [
    {
        id: 1,
        name: 'Ciclo 2023-2024',
        startDate: '2023-09-01',
        endDate: '2024-06-30',
        status: 'activo',
    },
    {
        id: 2,
        name: 'Ciclo 2022-2023',
        startDate: '2022-09-01',
        endDate: '2023-06-30',
        status: 'finalizado',
    },
];

export default function FormElements() {
    const [cycles, setCycles] = useState<SchoolCycle[]>(initialCycles);

    const handleEdit = (id: number) => {
        // Lógica para editar el ciclo escolar
        console.log('Editar ciclo:', id);
    };

    const handleDelete = (id: number) => {
        // Lógica para eliminar el ciclo escolar
        setCycles(prev => prev.filter(cycle => cycle.id !== id));
    };

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

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Mis ciclos escolares" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                {/* Metrics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                    {/* <!-- Metric Item Start --> */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <i className="fa-duotone fa-solid fa-graduation-cap fa-xl"></i>
                        </div>

                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Ciclos concluidos
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                                    20
                                </h4>
                            </div>
                            <Badge color="success">
                                <ArrowUpIcon />
                                Alumnos Totales: 30,500
                            </Badge>
                        </div>
                    </div>
                    {/* <!-- Metric Item End --> */}

                    {/* <!-- Metric Item Start --> */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <BoxIconLine className="text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Orders
                                </span>
                                <h4 className="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">
                                    5,359
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

                {/* Chart */}
                <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="shadow-default rounded-2xl bg-white px-5 pb-11 pt-5 dark:bg-gray-900 sm:px-6 sm:pt-6">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                    Ciclo actual (2024-2025)
                                </h3>
                                <p className="mt-1 text-theme-sm font-normal text-gray-500 dark:text-gray-400">
                                    Muestra el promedio general del actual ciclo escolar
                                </p>
                            </div>
                            <div className="relative inline-block">
                                <button onClick={toggleDropdown} className="dropdown-toggle">
                                    <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
                                </button>
                                <Dropdown
                                    isOpen={isOpen}
                                    onClose={closeDropdown}
                                    className="w-40 p-2"
                                >
                                    <DropdownItem
                                        tag="a"
                                        onItemClick={closeDropdown}
                                        className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                    >
                                        View More
                                    </DropdownItem>
                                    <DropdownItem
                                        tag="a"
                                        onItemClick={closeDropdown}
                                        className="flex w-full rounded-lg text-left font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                    >
                                        Delete
                                    </DropdownItem>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="max-h-[330px]">
                                <ReactApexChart
                                    options={options}
                                    series={series}
                                    type="radialBar"
                                    height={330}
                                />
                            </div>

                            <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
                                +10% desde la ultima evaluación
                            </span>
                        </div>
                        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
                            Ya casi se cumple la meta de este ciclo escolar, ¡Vamos muy bien!
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
                        <div>
                            <p className="mb-1 text-center text-theme-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                                Promedio general del ciclo
                            </p>
                            <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                                8.9
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
                                        fill="#D92D20"
                                    />
                                </svg>
                            </p>
                        </div>

                        <div className="h-7 w-px bg-gray-200 dark:bg-gray-800"></div>

                        <div>
                            <p className="mb-1 text-center text-theme-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                                Calificaciones del ultimo periodo
                            </p>
                            <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                                9.2
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                                        fill="#039855"
                                    />
                                </svg>
                            </p>
                        </div>

                        <div className="h-7 w-px bg-gray-200 dark:bg-gray-800"></div>

                        <div>
                            <p className="mb-1 text-center text-theme-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                                Comparación con el ciclo anterior
                            </p>
                            <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
                                15%
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                                        fill="#039855"
                                    />
                                </svg>
                            </p>
                        </div>
                    </div>
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
                            startIcon={<i className="fa-duotone fa-solid fa-calendar-pen"></i>}
                        >
                            Nuevo Ciclo Escolar
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 bg-white">
                            <thead>
                                <tr className="bg-gray-100 text-sm uppercase leading-normal text-gray-600">
                                    <th className="px-4 py-3 text-center">Nombre</th>
                                    <th className="px-4 py-3 text-center">Fecha de Inicio</th>
                                    <th className="px-4 py-3 text-center">Fecha de Fin</th>
                                    <th className="px-4 py-3 text-center">Estado</th>
                                    <th className="px-4 py-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-light text-gray-600">
                                {cycles.map(cycle => (
                                    <tr
                                        key={cycle.id}
                                        className="border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="whitespace-nowrap px-4 py-3 text-center">
                                            {cycle.name}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-center">
                                            {cycle.startDate}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-center">
                                            {cycle.endDate}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-center">
                                            {cycle.status}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Button
                                                className="mr-2"
                                                variant="outline"
                                                size="sm"
                                                startIcon={
                                                    <i className="fa-duotone fa-solid fa-calendar-pen"></i>
                                                }
                                                onClick={() => handleEdit(cycle.id)}
                                            >
                                                Editar
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                startIcon={
                                                    <i className="fa-duotone fa-solid fa-calendar-xmark"></i>
                                                }
                                                onClick={() => handleDelete(cycle.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {cycles.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-3 text-center">
                                            No se encontraron ciclos escolares.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </ComponentCard>
            </div>
        </div>
    );
}
