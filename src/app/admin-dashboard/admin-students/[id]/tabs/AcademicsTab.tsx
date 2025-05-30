import React from 'react';
import { TabsList, TabsRoot, TabsTrigger, TabsContent } from '@/components/core/tabs';
import { NotificationBadge } from '@/components/ui';
import IconFA from '@/components/ui/IconFA';
import TasksWidget from '../components/widgets/PendingTasksWidget';
import AttendanceWidget from '../components/widgets/AttendanceWidget';
import PendingTasksList from '../components/academics/PendingTasksList';
import TasksDetailView from '../components/academics/TasksDetailView';
import GradesTab from './GradesTab';
import AttendanceHeatmap from '../components/academics/AttendanceHeatmap';
import {
    Attendance,
    AttendanceData,
    DetailedTask,
    Document,
    Grade,
    Message,
    Tab
} from '../module-utils/types';

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
    return (
        <>
            {/* Datos del ciclo escolar actual */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 md:mb-0">
                        Información Académica
                    </h3>
                    <div className="w-full md:w-72">
                        <label htmlFor="schoolYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ciclo Escolar
                        </label>
                        <select
                            id="schoolYear"
                            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                            defaultValue="2025-2026"
                        >
                            <option value="2025-2026">2025-2026 (Actual)</option>
                            <option value="2024-2025">2024-2025</option>
                            <option value="2023-2024">2023-2024</option>
                            <option value="2022-2023">2022-2023</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Columna izquierda */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Asistencia */}
                    <AttendanceWidget attendance={attendance} />

                    {/* Tareas pendientes */}
                    <TasksWidget
                        tasks={mockData.detailedTasks}
                        onMarkComplete={onMarkTaskComplete}
                    />
                </div>

                {/* Columna derecha */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Navegación por pestañas */}
                    <TabsRoot defaultValue={academicTab} onValueChange={onChangeAcademicTab}>
                        <TabsList className="mb-6">
                            {academicTabs.map(tab => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="px-4 py-2"
                                >
                                    {tab.icon && <IconFA icon={tab.icon} className="mr-2" />} {tab.label}
                                    {tab.id === 'documents' && mockData.documents.filter(doc => doc.status === 'pendiente').length > 0 && (
                                        <NotificationBadge count={mockData.documents.filter(doc => doc.status === 'pendiente').length} type="warning" className="ml-2" />
                                    )}
                                    {tab.id === 'communications' && mockData.messages.filter(msg => msg.status === 'no-leido' && msg.sender.type !== 'estudiante').length > 0 && (
                                        <NotificationBadge count={mockData.messages.filter(msg => msg.status === 'no-leido' && msg.sender.type !== 'estudiante').length} type="error" className="ml-2" />
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="pending-tasks">
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
                        </TabsContent>

                        <TabsContent value="grades">
                            <GradesTab grades={grades} />
                        </TabsContent>

                        <TabsContent value="attendance">
                            <AttendanceHeatmap year={2025} data={attendanceMockData} />
                        </TabsContent>
                    </TabsRoot>
                </div>
            </div>
        </>
    );
};

export default AcademicsTab; 