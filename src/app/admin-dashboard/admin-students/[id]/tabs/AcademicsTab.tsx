import React, { useState } from 'react';
import { TabsList, TabsRoot, TabsTrigger, TabsContent } from '@/components/core/tabs';
import NotificationBadge from '@/components/ui/NotificationBadge';
import IconFA from '@/components/ui/IconFA';
import TasksWidget from '../components/widgets/PendingTasksWidget';
import AttendanceWidget from '../components/widgets/AttendanceWidget';
import GradesWidget from '../components/widgets/GradesWidget';
import PendingTasksList from '../components/academics/PendingTasksList';
import TasksDetailView from '../components/academics/TasksDetailView';
import GradesTab from './GradesTab';
import AttendanceHeatmap from '../components/academics/AttendanceHeatmap';
import GroupHistoryView from '../components/academics/GroupHistoryView';
import {
    Attendance,
    AttendanceData,
    DetailedTask,
    Document,
    Grade,
    Message,
    Tab
} from '../module-utils/types';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';

interface AcademicsTabProps {
    attendance: Attendance[];
    attendanceMockData: AttendanceData[];
    grades: Grade[];
    academicTabs: Tab[];
    academicTab: string;
    mockData: {
        detailedTasks: DetailedTask[];
        messages: Message[];
        documents: Document[];
    };
    onChangeAcademicTab: (value: string) => void;
    onMarkTaskComplete: (taskId: string) => Promise<void>;
    onUploadTaskFile: (taskId: string, file: File) => Promise<void>;
}

// Datos de ejemplo para grupos
const mockGroups = [
    {
        id: '1',
        year: '2024-2025',
        name: '4° A - Primaria',
        level: 'Primaria',
        teacher: 'Mtra. Ana García Pérez',
        startDate: '2024-08-15',
        endDate: '2025-07-10'
    },
    {
        id: '2',
        year: '2023-2024',
        name: '3° B - Primaria',
        level: 'Primaria',
        teacher: 'Mtro. Carlos Hernández López',
        startDate: '2023-08-20',
        endDate: '2024-07-05'
    },
    {
        id: '3',
        year: '2022-2023',
        name: '2° A - Primaria',
        level: 'Primaria',
        teacher: 'Mtra. Laura Rodríguez Sánchez',
        startDate: '2022-08-18',
        endDate: '2023-07-07'
    }
];

const AcademicsTab: React.FC<AcademicsTabProps> = ({
    attendance,
    attendanceMockData,
    grades,
    academicTabs,
    academicTab,
    mockData,
    onChangeAcademicTab,
    onMarkTaskComplete,
    onUploadTaskFile
}) => {
    // Estado para controlar si mostrar el dashboard o el detalle
    const [showDashboard, setShowDashboard] = useState(true);

    // Actualizar el efecto cuando cambie la pestaña académica
    React.useEffect(() => {
        // Mostrar dashboard solo cuando no hay pestaña seleccionada o es la inicial
        setShowDashboard(academicTab === '');
    }, [academicTab]);

    // Manejar cambio de pestaña con lógica personalizada
    const handleTabChange = (tabId: string) => {
        onChangeAcademicTab(tabId);
        setShowDashboard(false);
    };

    return (
        <>
            {/* Datos del ciclo escolar actual */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 md:mb-0">
                        Información Académica
                    </h3>
                    <div className="w-full md:w-72">
                        <SelectWithCategories
                            options={[
                                {
                                    label: "Ciclos Actuales",
                                    options: [
                                        { value: '2025-2026', label: '2025-2026 (Actual)' },
                                        { value: '2024-2025', label: '2024-2025' }
                                    ]
                                },
                                {
                                    label: "Ciclos Anteriores",
                                    options: [
                                        { value: '2023-2024', label: '2023-2024' },
                                        { value: '2022-2023', label: '2022-2023' }
                                    ]
                                }
                            ]}
                            onChange={(value: string) => console.log('Ciclo seleccionado:', value)}
                        />
                    </div>
                </div>

                {/* Navegación por pestañas académicas */}
                <div className="mt-6">
                    <TabsRoot defaultValue={academicTab} onValueChange={handleTabChange}>
                        <TabsList className="mb-6">
                            {academicTabs.map(tab => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="px-4 py-2"
                                >
                                    {tab.icon && <IconFA icon={tab.icon} className="mr-2" />} {tab.label}
                                    {tab.id === 'pending-tasks' && mockData.detailedTasks.filter(task => task.status === 'pendiente' || task.status === 'vencida').length > 0 && (
                                        <NotificationBadge
                                            count={mockData.detailedTasks.filter(task => task.status === 'pendiente' || task.status === 'vencida').length}
                                            type="warning"
                                            className="ml-2"
                                        />
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </TabsRoot>
                </div>
            </div>

            {/* Dashboard (Vista de Resumen) */}
            {showDashboard && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Widget de Asistencia */}
                    <div className="lg:col-span-1">
                        <AttendanceWidget attendance={attendance} />
                    </div>

                    {/* Widget de Tareas Pendientes */}
                    <div className="lg:col-span-1">
                        <TasksWidget
                            tasks={mockData.detailedTasks}
                            onMarkComplete={onMarkTaskComplete}
                        />
                    </div>

                    {/* Widget de Calificaciones */}
                    <div className="lg:col-span-1">
                        <GradesWidget grades={grades} />
                    </div>
                </div>
            )}

            {/* Contenido de pestañas (Vista de Detalle) */}
            <div className={`${showDashboard ? 'hidden' : 'block'}`}>
                {academicTab === 'pending-tasks' && (
                    <div className="space-y-6">
                        <PendingTasksList
                            tasks={mockData.detailedTasks}
                            onMarkComplete={onMarkTaskComplete}
                            onUploadTask={onUploadTaskFile}
                        />
                        <TasksDetailView
                            tasks={mockData.detailedTasks}
                            onMarkComplete={onMarkTaskComplete}
                            onUploadTask={onUploadTaskFile}
                        />
                    </div>
                )}

                {academicTab === 'grades' && (
                    <GradesTab grades={grades} />
                )}

                {academicTab === 'attendance' && (
                    <AttendanceHeatmap year={2025} data={attendanceMockData} />
                )}

                {academicTab === 'group-history' && (
                    <GroupHistoryView groups={mockGroups} />
                )}
            </div>
        </>
    );
};

export default AcademicsTab; 