/* eslint-disable @typescript-eslint/no-explicit-any */
// React
import { useMemo } from 'react';

// Next
import dynamic from 'next/dynamic';

// ApexCharts
import { ApexOptions } from 'apexcharts';

// Components
import ComponentCard from '@/components/common/ComponentCard';

// Context
import { useTheme } from '@/context/ThemeContext';

// import {Grade} from '@/app/admin-dashboard/admin-students/[id]/module-utils/types';

// Importación dinámica para evitar errores de SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface GradesChartProps {
    grades?: any[];
}

// Datos ficticios mensuales para evaluaciones
const MONTHLY_PERIODS = [
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
];

// Datos ficticios de materias para mostrar en la gráfica
const FICTITIOUS_SUBJECTS = [
    { name: 'Matemáticas', color: '#3b82f6' }, // Azul
    { name: 'Español', color: '#22c55e' }, // Verde
    { name: 'Ciencias', color: '#f59e0b' }, // Amarillo
    { name: 'Historia', color: '#ef4444' }, // Rojo
    { name: 'Inglés', color: '#8b5cf6' }, // Púrpura
    { name: 'Educación Física', color: '#06b6d4' }, // Cyan
    { name: 'Artes', color: '#ec4899' }, // Rosa
    { name: 'Música', color: '#14b8a6' }, // Turquesa
    { name: 'Geografía', color: '#f97316' }, // Naranja
    { name: 'Computación', color: '#64748b' }, // Gris azulado
];

// Genera un número aleatorio entre min y max
const getRandomScore = (min = 6, max = 10) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(1));
};

const GradesChart: React.FC<GradesChartProps> = ({ grades }) => {
    // Acceder al tema actual
    const { isDarkMode } = useTheme();

    // Opciones para la gráfica ajustadas según el tema
    const chartOptions: ApexOptions = useMemo(
        () => ({
            chart: {
                fontFamily: 'Outfit, sans-serif',
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false,
                },
                stacked: false,
                background: 'transparent',
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 5,
                    borderRadiusApplication: 'end',
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: MONTHLY_PERIODS.slice(0, 6), // Mostrar solo los primeros 6 meses
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    style: {
                        fontFamily: 'Outfit, sans-serif',
                        colors: isDarkMode ? '#e5e7eb' : '#374151',
                    },
                },
            },
            yaxis: {
                title: {
                    text: 'Calificación',
                    style: {
                        fontFamily: 'Outfit, sans-serif',
                        color: isDarkMode ? '#e5e7eb' : '#374151',
                    },
                },
                min: 0,
                max: 10,
                forceNiceScale: true,
                labels: {
                    style: {
                        colors: isDarkMode ? '#e5e7eb' : '#374151',
                    },
                },
            },
            fill: {
                opacity: 1,
            },
            legend: {
                show: true,
                position: 'top',
                horizontalAlign: 'left',
                fontFamily: 'Outfit, sans-serif',
                labels: {
                    colors: isDarkMode ? '#e5e7eb' : '#374151',
                },
            },
            tooltip: {
                theme: isDarkMode ? 'dark' : 'light',
                y: {
                    formatter: (val: number) => `${val.toFixed(1)}`,
                },
                style: {
                    fontFamily: 'Outfit, sans-serif',
                },
            },
            grid: {
                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                strokeDashArray: 4,
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
            theme: {
                mode: isDarkMode ? 'dark' : 'light',
            },
        }),
        [isDarkMode],
    );

    // Si tenemos calificaciones reales, usamos esos datos, de lo contrario generamos datos ficticios
    const hasRealData = grades && grades.length > 0;

    // Generar series de datos para ApexCharts
    const series = useMemo(
        () => (hasRealData ? generateSeriesFromGrades(grades!) : generateFictitiousSeries()),
        [hasRealData, grades],
    );

    return (
        <ComponentCard title="Rendimiento Académico" desc="Calificaciones por materia y periodo">
            <div className="h-[350px] md:h-[400px]">
                <ReactApexChart options={chartOptions} series={series} type="bar" height="100%" />
            </div>
        </ComponentCard>
    );
};

// Genera series de datos ficticios para la gráfica
function generateFictitiousSeries() {
    return FICTITIOUS_SUBJECTS.map(subject => {
        return {
            name: subject.name,
            color: subject.color,
            data: Array(6)
                .fill(0)
                .map(() => getRandomScore()),
        };
    });
}

// Genera series a partir de calificaciones reales (no implementado completamente)
function generateSeriesFromGrades(_grades: any[]) {
    // Nota: Esta es una implementación básica que deberías adaptar
    // a tu estructura real de datos de calificaciones

    // Por ahora, simplemente devolvemos datos ficticios
    return generateFictitiousSeries();
}

export default GradesChart;
