import React from 'react';
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import NotificationBadge from '@/components/ui/NotificationBadge';

// Interfaz adaptada para coincidir con la que se usa en el componente principal
export interface Task {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    status: string;
    priority: string;
    assignedBy: string;
}

interface TasksWidgetProps {
    tasks: Task[];
    onMarkComplete: (id: string) => Promise<void>;
    isLoading?: boolean;
}

const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case 'vencida':
            return <NotificationBadge count={1} type="error" className="ml-2" />;
        case 'pendiente':
            return <NotificationBadge count={1} type="warning" className="ml-2" />;
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

const PendingTasksWidget: React.FC<TasksWidgetProps> = ({ tasks, onMarkComplete, isLoading = false }) => {
    // Ordenar tareas por prioridad y fecha
    const sortedTasks = [...tasks].sort((a, b) => {
        const priorityOrder: Record<string, number> = { alta: 0, media: 1, baja: 2 };
        const aPriority = priorityOrder[a.priority.toLowerCase()] || 3;
        const bPriority = priorityOrder[b.priority.toLowerCase()] || 3;

        if (aPriority !== bPriority) return aPriority - bPriority;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    const handleMarkComplete = async (id: string) => {
        await onMarkComplete(id);
    };

    // Renderizar estado de carga
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
                {tasks.length > 0 && (
                    <NotificationBadge
                        count={tasks.length}
                        type={tasks.some(t => t.status.toLowerCase() === 'vencida') ? 'error' : 'warning'}
                    />
                )}
            </div>

            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                    <IconFA icon="check-circle" size="2xl" className="text-success-500 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No hay tareas pendientes</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">El estudiante está al día con sus actividades</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedTasks.map((task) => (
                        <div key={task.id} className="border-l-4 border-primary-200 dark:border-primary-800 pl-4 py-2">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                            {task.subject}
                                        </span>
                                        {getStatusBadge(task.status)}
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-1">
                                        {task.title}
                                    </h4>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <IconFA icon="calendar" className="text-gray-400 dark:text-gray-500" />
                                            <span>{formatDate(task.dueDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <IconFA icon="user" className="text-gray-400 dark:text-gray-500" />
                                            <span>{task.assignedBy}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {getPriorityIcon(task.priority)}
                                            <span className="capitalize">{task.priority}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMarkComplete(task.id)}
                                    className="ml-2"
                                >
                                    <IconFA icon="check" className="text-success-500" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {tasks.length > 3 && (
                        <Button
                            variant="outline"
                            className="w-full mt-2"
                        >
                            Ver todas las tareas
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PendingTasksWidget;