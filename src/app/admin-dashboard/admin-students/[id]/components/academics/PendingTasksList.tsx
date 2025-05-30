import React, { useState } from 'react';
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import { NotificationBadge } from '@/components/ui';
import { DetailedTask } from '../../module-utils/types';

interface PendingTasksListProps {
    tasks: DetailedTask[];
    onMarkComplete: (id: string) => Promise<void>;
    onUploadTask: (id: string, file: File) => Promise<void>;
    isLoading?: boolean;
}

const getStatusBadge = (status: DetailedTask['status']) => {
    switch (status) {
        case 'vencida':
            return <NotificationBadge count={1} type="error" className="ml-2" />;
        case 'pendiente':
            return <NotificationBadge count={1} type="warning" className="ml-2" />;
        case 'en-progreso':
            return <NotificationBadge count={1} type="info" className="ml-2" />;
        case 'completada':
            return <NotificationBadge count={1} type="success" className="ml-2" />;
        default:
            return <NotificationBadge count={1} type="info" className="ml-2" />;
    }
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

const PendingTasksList: React.FC<PendingTasksListProps> = ({
    tasks,
    onMarkComplete,
    onUploadTask,
    isLoading = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');

    // Filtrar tareas pendientes y ordenarlas por fecha de entrega
    const pendingTasks = tasks
        .filter(task => task.status === 'pendiente' || task.status === 'en-progreso' || task.status === 'vencida')
        .filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSubject = subjectFilter === 'all' || task.subject === subjectFilter;
            return matchesSearch && matchesSubject;
        })
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    // Extraer materias únicas para el filtro
    const subjects = Array.from(new Set(tasks.map(task => task.subject)));

    // Manejar estado de carga
    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
                <div className="flex items-center space-x-2">
                    <IconFA icon="tasks" className="text-primary-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Tareas Pendientes</h3>
                </div>
                <div className="flex items-center justify-center h-40">
                    <IconFA icon="spinner" spin size="xl" className="text-primary-500" />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <IconFA icon="tasks" className="text-primary-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Tareas Pendientes</h3>
                </div>
                {pendingTasks.length > 0 && (
                    <NotificationBadge
                        count={pendingTasks.length}
                        type={pendingTasks.some(t => t.status === 'vencida') ? 'error' : 'warning'}
                    />
                )}
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-0">
                    <div className="relative">
                        <IconFA icon="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar tareas..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <select
                    className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                >
                    <option value="all">Todas las materias</option>
                    {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
            </div>

            {/* Estado vacío */}
            {pendingTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <IconFA icon="check-circle" size="2xl" className="text-success-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">No hay tareas pendientes</h3>
                    <p className="text-gray-500 dark:text-gray-400">¡Excelente trabajo! El estudiante está al día con sus actividades.</p>
                </div>
            )}

            {/* Lista de tareas pendientes */}
            {pendingTasks.length > 0 && (
                <div className="space-y-3">
                    {pendingTasks.map(task => (
                        <div key={task.id} className="border-l-4 border-primary-200 dark:border-primary-800 pl-4 py-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                            {task.subject}
                                        </span>
                                        {getStatusBadge(task.status)}
                                    </div>

                                    <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        {task.title}
                                    </h4>

                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                        {task.description}
                                    </p>

                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <IconFA icon="calendar-alt" className="text-primary-500" />
                                            <span>Entrega: {formatDate(task.dueDate)}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <IconFA icon="user" className="text-gray-400" />
                                            <span>{task.assignedBy}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onMarkComplete(task.id)}
                                        className="text-success-500"
                                    >
                                        <IconFA icon="check" className="mr-1" />
                                        Completar
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.onchange = (e) => {
                                                const target = e.target as HTMLInputElement;
                                                if (target.files && target.files[0]) {
                                                    onUploadTask(task.id, target.files[0]);
                                                }
                                            };
                                            input.click();
                                        }}
                                    >
                                        <IconFA icon="upload" className="mr-1" />
                                        Subir
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {pendingTasks.length > 5 && (
                <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => console.log('Ver todas las tareas')}
                >
                    Ver todas las tareas
                </Button>
            )}
        </div>
    );
};

export default PendingTasksList;