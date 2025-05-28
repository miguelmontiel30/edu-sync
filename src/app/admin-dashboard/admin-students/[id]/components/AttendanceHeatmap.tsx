import React, { useState, useMemo } from 'react';
import { AttendanceType, HeatmapProps } from '@/app/admin-dashboard/admin-students/[id]/module-utils/types';
import ComponentCard from '@/components/common/ComponentCard';

interface CellData {
    date: Date;
    type: AttendanceType | 'fuera-de-rango';
    week: number;
    dayIndex: number; // 0 for Mon, 4 for Fri
}

const WEEKS_TO_DISPLAY = 53;
const DAY_LABELS = ['L', 'M', 'X', 'J', 'V'];
const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const CELL_SIZE = 14; // px - aumentado para mejor visibilidad
const CELL_GAP = 3; // px - aumentado para mejor visibilidad
const DAY_LABEL_WIDTH = 30; //px

const AttendanceHeatmap: React.FC<HeatmapProps> = ({ year, data }) => {
    const [tooltip, setTooltip] = useState<{ show: boolean; content: string; x: number; y: number } | null>(null);

    const dataMap = useMemo(() => new Map(data.map(item => [item.date, item.type])), [data]);

    const getFirstMondayOfGrid = (targetYear: number): Date => {
        const jan1 = new Date(targetYear, 0, 1);
        let dayOfWeek = jan1.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const daysToSubtract = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;

        const firstGridDate = new Date(jan1);
        firstGridDate.setDate(jan1.getDate() - daysToSubtract);
        return firstGridDate;
    };

    const firstViewDate = useMemo(() => getFirstMondayOfGrid(year), [year]);

    const cells: CellData[] = useMemo(() => {
        const result: CellData[] = [];
        for (let weekIdx = 0; weekIdx < WEEKS_TO_DISPLAY; weekIdx++) {
            for (let dayOfWeekIdx = 0; dayOfWeekIdx < 5; dayOfWeekIdx++) { // 0 for Mon, 1 for Tue, ...
                const cellDate = new Date(firstViewDate);
                cellDate.setDate(firstViewDate.getDate() + weekIdx * 7 + dayOfWeekIdx);

                let type: AttendanceType | 'fuera-de-rango' = 'sin-registro';
                const inCurrentYear = cellDate.getFullYear() === year;

                if (inCurrentYear) {
                    const dateString = cellDate.toISOString().split('T')[0];
                    type = dataMap.get(dateString) ?? 'sin-registro';
                } else {
                    type = 'fuera-de-rango'; // Mark as outside of current year for styling
                }
                result.push({ date: cellDate, type, week: weekIdx, dayIndex: dayOfWeekIdx });
            }
        }
        return result;
    }, [firstViewDate, year, dataMap]);

    const monthLabelPositions = useMemo(() => {
        const labels: { name: string; week: number }[] = [];
        const mappedWeeks = new Set<number>();

        MONTH_NAMES.forEach((name, monthIndex) => {
            const firstOfMonth = new Date(year, monthIndex, 1);
            const offsetDays = (firstOfMonth.getTime() - firstViewDate.getTime()) / (1000 * 60 * 60 * 24);
            let weekIndex = Math.floor(offsetDays / 7);

            weekIndex = Math.max(0, Math.min(weekIndex, WEEKS_TO_DISPLAY - 1));

            for (let i = 0; i < 3; i++) {
                const targetWeek = weekIndex + i;
                if (targetWeek < WEEKS_TO_DISPLAY && !mappedWeeks.has(targetWeek)) {
                    labels.push({ name, week: targetWeek });
                    mappedWeeks.add(targetWeek);
                    break;
                }
            }
        });
        return labels.sort((a, b) => a.week - b.week);
    }, [year, firstViewDate]);


    const getColorForType = (type: AttendanceType | 'fuera-de-rango'): string => {
        switch (type) {
            case 'fuera-de-rango': return 'bg-gray-100 dark:bg-gray-700/30';
            case 'sin-registro': return 'bg-gray-200 dark:bg-gray-700';
            case 'presente': return 'bg-green-500 dark:bg-green-600';
            case 'retardo': return 'bg-yellow-500 dark:bg-yellow-600';
            case 'ausente': return 'bg-red-500 dark:bg-red-600';
            default: return 'bg-gray-200 dark:bg-gray-700';
        }
    };

    const getTypeLabel = (type: AttendanceType | 'fuera-de-rango'): string => {
        switch (type) {
            case 'fuera-de-rango': return 'Fuera del período';
            case 'sin-registro': return 'Sin registro';
            case 'presente': return 'Presente';
            case 'retardo': return 'Retardo';
            case 'ausente': return 'Ausente';
            default: return 'Desconocido';
        }
    };

    const handleMouseOver = (event: React.MouseEvent<HTMLDivElement>, cell: CellData) => {
        if (cell.type === 'fuera-de-rango') {
            setTooltip(null);
            return;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltip({
            show: true,
            content: `${cell.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}: ${getTypeLabel(cell.type)}`,
            x: window.scrollX + rect.left + rect.width / 2,
            y: window.scrollY + rect.top,
        });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    const totalGridWidth = WEEKS_TO_DISPLAY * (CELL_SIZE + CELL_GAP) - CELL_GAP;

    return (
        <ComponentCard title="Registro de Asistencia" desc="Historial anual de asistencia del estudiante">
            <div className="flex flex-col items-center gap-y-6 pb-4">
                <div className="overflow-x-auto py-4 flex justify-center">
                    <div style={{ width: `${DAY_LABEL_WIDTH + totalGridWidth}px`, minWidth: 'min-content' }}>
                        {/* Month Labels */}
                        <div className="relative h-6 mb-2" style={{ paddingLeft: `${DAY_LABEL_WIDTH}px` }}>
                            {monthLabelPositions.map(({ name, week }) => (
                                <div
                                    key={name}
                                    className="absolute text-xs text-gray-500 dark:text-gray-400"
                                    style={{ left: `${week * (CELL_SIZE + CELL_GAP)}px`, top: 0 }}
                                >
                                    {name}
                                </div>
                            ))}
                        </div>

                        <div className="flex">
                            {/* Day Labels */}
                            <div
                                className="flex flex-col text-xs text-gray-500 dark:text-gray-400 space-y-[3px] shrink-0 justify-around"
                                style={{ width: `${DAY_LABEL_WIDTH}px`, height: `${5 * (CELL_SIZE + CELL_GAP) - CELL_GAP}px` }}
                            >
                                {DAY_LABELS.map((day) => (
                                    <div key={day} style={{ height: `${CELL_SIZE}px` }} className="flex items-center pr-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Heatmap Grid */}
                            <div
                                className="grid grid-flow-col grid-rows-5 gap-[3px]"
                                style={{
                                    width: `${totalGridWidth}px`,
                                    height: `${5 * (CELL_SIZE + CELL_GAP) - CELL_GAP}px`,
                                }}
                            >
                                {cells.map((cell, index) => (
                                    <div
                                        key={index}
                                        className={`rounded-sm ${getColorForType(cell.type)}`}
                                        style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }}
                                        onMouseEnter={(e) => handleMouseOver(e, cell)}
                                        onMouseLeave={handleMouseLeave}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {['sin-registro', 'presente', 'retardo', 'ausente'].map((type) => (
                        <div key={type} className="flex items-center">
                            <div className={`w-4 h-4 mr-1 rounded-sm ${getColorForType(type as AttendanceType)}`}></div>
                            <span>{getTypeLabel(type as AttendanceType)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tooltip */}
            {tooltip && tooltip.show && (
                <div
                    className="fixed bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50 pointer-events-none"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translate(-50%, -100%) translateY(-4px)',
                    }}
                >
                    {tooltip.content}
                </div>
            )}
        </ComponentCard>
    );
};

export default AttendanceHeatmap; 