import { Task, TaskPriority, TaskStatus } from '../module-utils/types';
import ComponentCard from '@/components/common/ComponentCard';
import { IconFA } from '@/components/ui';

interface TasksWidgetProps {
    tasks: Task[];
    onMarkComplete: (id: string) => Promise<void>;
}

const TasksWidget: React.FC<TasksWidgetProps> = ({ tasks, onMarkComplete }) => {
    // Filtrar tareas pendientes o en progreso
    const activeTasks = tasks.filter(task => task.status !== 'completada');

    // Ordenar por fecha de vencimiento
    const sortedTasks = [...activeTasks].sort((a, b) => {
        // Primero las vencidas
        if (a.status === 'vencida' && b.status !== 'vencida') return -1;
        if (a.status !== 'vencida' && b.status === 'vencida') return 1;

        // Luego por fecha
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    // Formato de fecha relativa
    const getRelativeDate = (dateStr: string): string => {
        const today = new Date();
        const dueDate = new Date(dateStr);

        // Reset para comparar solo fecha
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);

        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Vencida';
        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Mañana';
        if (diffDays < 7) return `En ${diffDays} días`;

        // Formatear fecha para fechas más lejanas
        return dueDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    // Estilo según prioridad
    const getPriorityColor = (priority: TaskPriority): string => {
        switch (priority) {
            case 'alta': return 'text-red-500';
            case 'media': return 'text-yellow-500';
            case 'baja': return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    // Estilo según estado
    const getStatusStyle = (status: TaskStatus): string => {
        switch (status) {
            case 'vencida': return 'text-red-500 font-medium';
            case 'completada': return 'text-green-500';
            default: return '';
        }
    };

    const handleTaskCheck = async (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
        if (e.target.checked) {
            await onMarkComplete(taskId);
        }
    };

    return (
        <ComponentCard title="Tareas Pendientes" desc="Actividades y proyectos por entregar">
            <div className="divide-y divide-gray-200 dark:divide-gray-700 p-2">
                {sortedTasks.length > 0 ? (
                    sortedTasks.map(task => (
                        <div key={task.id} className="py-3 flex items-center justify-between">
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                    onChange={(e) => handleTaskCheck(e, task.id)}
                                    disabled={task.status === 'vencida'}
                                />
                                <div className="ml-3">
                                    <p className={`font-medium ${getStatusStyle(task.status)}`}>{task.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{task.subject}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-sm ${getPriorityColor(task.priority)} flex items-center`}>
                                    <IconFA icon="circle" className="mr-1" size="xs" />
                                    {getRelativeDate(task.dueDate)}
                                </span>
                                {task.status === 'vencida' && (
                                    <span className="text-xs text-red-500 mt-1">
                                        No entregada
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                        <IconFA icon="check-circle" size="xl" className="text-green-500 mb-2" />
                        <p>No hay tareas pendientes</p>
                    </div>
                )}
            </div>

            {/* Footer con link a más tareas */}
            {tasks.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
                    <a href="#" className="text-primary-500 hover:text-primary-600 text-sm flex items-center justify-center">
                        Ver todas las tareas ({tasks.length})
                        <IconFA icon="chevron-right" className="ml-1" size="xs" />
                    </a>
                </div>
            )}
        </ComponentCard>
    );
};

export default TasksWidget; 