import React, { useState } from 'react';
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import NotificationBadge from '@/components/ui/NotificationBadge';

// Tipos
export interface DetailedTask {
    id: string;
    title: string;
    subject: string;
    description: string;
    assignedDate: string;
    dueDate: string;
    status: 'pendiente' | 'en-progreso' | 'completada' | 'vencida';
    type: 'academica' | 'material';
    materials: string[];
    teacherNotes?: string;
    assignedBy: string;
    priority: string;
}

interface TasksDetailViewProps {
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

const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
        case 'alta':
            return <IconFA icon="arrow-up" className="text-error-500" />;
        case 'media':
            return <IconFA icon="minus" className="text-warning-500" />;
        case 'baja':
            return <IconFA icon="arrow-down" className="text-success-500" />;
        default:
            return <IconFA icon="minus" className="text-gray-500 dark:text-gray-400" />;
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

const TasksDetailView: React.FC<TasksDetailViewProps> = ({
    tasks,
    onMarkComplete,
    onUploadTask,
    isLoading = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [groupBy, setGroupBy] = useState('none');

    // Extraer materias únicas para el filtro
    const subjects = Array.from(new Set(tasks.map(task => task.subject)));

    // Filtrar tareas según criterios
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = subjectFilter === 'all' || task.subject === subjectFilter;
        const matchesType = typeFilter === 'all' || task.type === typeFilter;

        return matchesSearch && matchesSubject && matchesType;
    });

    // Agrupar tareas si es necesario
    const groupedTasks = groupBy === 'subject'
        ? filteredTasks.reduce((groups, task) => {
            const key = task.subject;
            if (!groups[key]) groups[key] = [];
            groups[key].push(task);
            return groups;
        }, {} as Record<string, DetailedTask[]>)
        : { 'Todas las tareas': filteredTasks };

    // Manejar estado de carga
    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
                <div className="flex items-center space-x-2">
                    <IconFA icon="book" className="text-primary-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Tareas Detalladas</h3>
                </div>
                <div className="flex items-center justify-center h-60">
                    <IconFA icon="spinner" spin size="xl" className="text-primary-500" />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <IconFA icon="book" className="text-primary-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Tareas Detalladas</h3>
                </div>
                {filteredTasks.length > 0 && (
                    <NotificationBadge
                        count={filteredTasks.length}
                        type={filteredTasks.some(t => t.status === 'vencida') ? 'error' : 'warning'}
                    />
                )}
            </div>

            {/* Filtros y búsqueda */}
            <div className="flex flex-wrap gap-4 mb-6">
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

                <div className="flex flex-wrap gap-2">
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

                    <select
                        className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">Todos los tipos</option>
                        <option value="academica">Tareas académicas</option>
                        <option value="material">Materiales</option>
                    </select>

                    <select
                        className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                    >
                        <option value="none">Sin agrupar</option>
                        <option value="subject">Agrupar por materia</option>
                    </select>
                </div>
            </div>

            {/* Estado vacío */}
            {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <IconFA icon="check-circle" size="2xl" className="text-success-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-2">No hay tareas que mostrar</h3>
                    <p className="text-gray-500 dark:text-gray-400">¡Excelente trabajo! Has completado todas tus tareas.</p>
                </div>
            )}

            {/* Lista de tareas agrupadas */}
            {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
                <div key={groupName} className="mb-6">
                    {groupBy !== 'none' && groupTasks.length > 0 && (
                        <div className="flex items-center gap-2 mb-3 py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <IconFA icon="folder" className="text-primary-500" />
                            <h4 className="text-base font-medium text-gray-800 dark:text-white/90">
                                {groupName} ({groupTasks.length})
                            </h4>
                        </div>
                    )}

                    {groupTasks.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Materia</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tarea</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fechas</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prioridad</th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                                    {groupTasks.map((task) => (
                                        <tr key={task.id}>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                                    {task.subject}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="max-w-xs">
                                                    <div className="text-sm font-medium text-gray-800 dark:text-white/90">{task.title}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.description}</div>
                                                    {task.teacherNotes && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                                            <IconFA icon="comment" className="inline mr-1 text-gray-400" /> {task.teacherNotes}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                        <IconFA icon="calendar-plus" className="text-gray-400 dark:text-gray-500" />
                                                        <span>Asignada: {formatDate(task.assignedDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300 font-medium mt-1">
                                                        <IconFA icon="calendar-check" className="text-primary-500" />
                                                        <span>Entrega: {formatDate(task.dueDate)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getStatusBadge(task.status)}
                                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 capitalize">{task.status.replace('-', ' ')}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm">
                                                    {getPriorityIcon(task.priority)}
                                                    <span className="capitalize text-gray-600 dark:text-gray-300">{task.priority}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex space-x-2">
                                                    {task.status !== 'completada' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => onMarkComplete(task.id)}
                                                            className="text-success-500"
                                                        >
                                                            <IconFA icon="check" className="mr-1" />
                                                            Completar
                                                        </Button>
                                                    )}
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TasksDetailView; 