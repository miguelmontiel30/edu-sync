'use client';

import React, { useState } from 'react';
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import { Calendar } from '@/components/core/calendar';
import Badge from '@/components/core/badge/Badge';
import MetricsChartsWrapper from '@/components/core/metrics/MetricsChartsWrapper';
import { CalendarEvent } from '@/components/core/calendar/types';
import PerformanceChartGroup from './components/PerformanceChartGroup';
import MessageModal from './components/MessageModal';

// Hooks
import { usePerformanceChart } from './hooks/usePerformanceChart';

// Tipos
interface MetricCardProps {
    title: string;
    value: string | number;
    icon: string;
    badgeText?: string;
    badgeColor?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark';
    tooltip?: string;
    onClick?: () => void;
    id?: string;
}

interface TeacherCalendarProps {
    events: CalendarEvent[];
}

interface Notification {
    id: number;
    type: 'permission' | 'message' | 'alert';
    title: string;
    description: string;
    date: string;
    completed: boolean;
}

interface Task {
    id: number;
    title: string;
    dueDate: string;
    completed: boolean;
    action: 'attendance' | 'grade' | 'report' | string;
}

interface NotificationsAndTasksProps {
    notifications: Notification[];
    tasks: Task[];
}

interface PerformanceData {
    period: string;
    average: number;
    group: string;
}

interface PerformanceChartProps {
    data: PerformanceData[];
}

interface Student {
    id: string;
    name: string;
    avatar: string;
    group: string;
    grade: number;
}

interface StudentsTableProps {
    students: Student[];
}

interface Message {
    id: string;
    sender: string;
    avatar: string;
    text: string;
    timestamp: string;
    unread: boolean;
    isOutgoing?: boolean;
}

interface MessagesProps {
    messages: Message[];
}

// Datos de ejemplo - En producción vendrían de una API
const teacherData = {
    name: 'Ana García',
    activeClasses: 10,
    upcomingEvaluations: [
        { id: 1, subject: 'Matemáticas', group: '3A', date: '2023-05-24' },
        { id: 2, subject: 'Física', group: '5C', date: '2023-05-25' },
        { id: 3, subject: 'Química', group: '4B', date: '2023-05-26' },
    ],
    totalStudents: 248,
    averageGrade: 8.7,
    notifications: [
        {
            id: 1,
            type: 'permission' as const,
            title: 'Solicitud de permiso',
            description: 'Juan Pérez solicita permiso para ausentarse el viernes',
            date: '2023-05-22',
            completed: false,
        },
        {
            id: 2,
            type: 'message' as const,
            title: 'Mensaje de dirección',
            description: 'Reunión de profesores este jueves a las 15:00',
            date: '2023-05-21',
            completed: true,
        },
        {
            id: 3,
            type: 'alert' as const,
            title: 'Alerta de asistencia',
            description: 'María González ha faltado 3 días consecutivos',
            date: '2023-05-20',
            completed: false,
        },
    ],
    tasks: [
        {
            id: 1,
            title: 'Registrar asistencia Grupo 3A',
            dueDate: '2023-05-22',
            completed: false,
            action: 'attendance',
        },
        {
            id: 2,
            title: 'Calificar exámenes de Matemáticas',
            dueDate: '2023-05-23',
            completed: false,
            action: 'grade',
        },
        {
            id: 3,
            title: 'Enviar reporte bimestral',
            dueDate: '2023-05-25',
            completed: true,
            action: 'report',
        },
    ],
    performanceData: [
        { period: 'Ene-Feb', average: 7.8, group: '3A' },
        { period: 'Mar-Abr', average: 8.2, group: '3A' },
        { period: 'May-Jun', average: 8.5, group: '3A' },
        { period: 'Ene-Feb', average: 8.1, group: '4B' },
        { period: 'Mar-Abr', average: 8.4, group: '4B' },
        { period: 'May-Jun', average: 8.7, group: '4B' },
        { period: 'Ene-Feb', average: 7.5, group: '5C' },
        { period: 'Mar-Abr', average: 7.9, group: '5C' },
        { period: 'May-Jun', average: 8.3, group: '5C' },
    ],
    students: [
        {
            id: '1',
            name: 'Ana Pérez García',
            avatar: '/images/user1.jpeg',
            group: '3A',
            grade: 9.5,
        },
        {
            id: '2',
            name: 'Luis García Martínez',
            avatar: '/images/user1.jpeg',
            group: '3A',
            grade: 8.2,
        },
        {
            id: '3',
            name: 'Sofía Rodríguez López',
            avatar: '/images/user1.jpeg',
            group: '4B',
            grade: 9.8,
        },
        {
            id: '4',
            name: 'Javier Fernández H.',
            avatar: '/images/user1.jpeg',
            group: '5C',
            grade: 7.5,
        },
        {
            id: '5',
            name: 'Carmen González S.',
            avatar: '/images/user1.jpeg',
            group: '4B',
            grade: 10,
        },
    ],
    messages: [
        {
            id: '1',
            sender: 'Laura Mtnez (Mamá de Juan)',
            avatar: '/images/user1.jpeg',
            text: 'Buenos días, solo para notificar que Juan no podrá asistir hoy por cita médica.',
            timestamp: '9:30 AM',
            unread: true,
        },
        {
            id: '2',
            sender: 'Carlos Hdz (Papá de María)',
            avatar: '/images/user1.jpeg',
            text: 'Quería preguntar sobre el material para el proyecto de ciencias.',
            timestamp: 'Ayer',
            unread: false,
        },
        {
            id: '3',
            sender: 'Admin Escolar',
            avatar: '/images/EduSync-logo.png',
            text: 'Recordatorio: La junta de personal es mañana a las 10 AM.',
            timestamp: 'Hace 2 días',
            unread: false,
        },
    ],
    events: [
        {
            id: '1',
            title: 'Clase Matemáticas 3A',
            start: '2023-05-22T08:00:00',
            end: '2023-05-22T09:30:00',
            description: '',
            created_by: '',
            school_id: '',
            school_year_id: '',
            event_type_id: '',
            allDay: false,
            extendedProps: {
                calendar: 'primary',
                type: 'class',
                roles: [],
            },
        },
        {
            id: '2',
            title: 'Examen Física 5C',
            start: '2023-05-25T10:00:00',
            end: '2023-05-25T11:30:00',
            description: '',
            created_by: '',
            school_id: '',
            school_year_id: '',
            event_type_id: '',
            allDay: false,
            extendedProps: {
                calendar: 'warning',
                type: 'exam',
                roles: [],
            },
        },
        {
            id: '3',
            title: 'Entrega Proyectos 4B',
            start: '2023-05-26T13:00:00',
            end: '2023-05-26T14:30:00',
            description: '',
            created_by: '',
            school_id: '',
            school_year_id: '',
            event_type_id: '',
            allDay: false,
            extendedProps: {
                calendar: 'success',
                type: 'assignment',
                roles: [],
            },
        },
    ],
};

// Componente para las tarjetas KPI
function MetricCard({
    title,
    value,
    icon,
    badgeText,
    badgeColor,
    tooltip,
    onClick,
}: MetricCardProps) {
    return (
        <div
            className="relative rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
            onClick={onClick}
            title={tooltip}
            role="button"
            tabIndex={0}
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <IconFA
                    icon={icon}
                    style="duotone"
                    size="xl"
                    className="text-gray-800 dark:text-white/90"
                />
            </div>

            <div className="mt-5 flex items-end justify-between">
                <div>
                    <span className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                        {title}
                    </span>

                    <h4 className="mt-2 font-outfit text-title-sm font-bold text-gray-800 dark:text-white/90">
                        {value}
                    </h4>
                </div>

                {badgeText && (
                    <Badge color={badgeColor || 'info'}>
                        <span className="font-outfit">{badgeText}</span>
                    </Badge>
                )}
            </div>
        </div>
    );
}

// Componente para el calendario integrado
function TeacherCalendar({ events }: TeacherCalendarProps) {
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleEventClick = (info: any) => {
        setSelectedEvent(info.event);
        setIsModalOpen(true);
    };

    const handleDateSelect = (selectInfo: any) => {
        // Implementar lógica para crear nuevo evento
        console.log('Date selected', selectInfo);
    };

    const handleAddEventClick = () => {
        setSelectedEvent(null);
        setIsModalOpen(true);
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Calendario Semanal
                </h3>
                <Button
                    variant="primary"
                    size="sm"
                    startIcon={<IconFA icon="plus" />}
                    onClick={handleAddEventClick}
                >
                    Nuevo Evento
                </Button>
            </div>

            <Calendar
                events={events}
                isLoading={false}
                onDateSelect={handleDateSelect}
                onEventClick={handleEventClick}
                onAddEventClick={handleAddEventClick}
            />

            {isModalOpen && selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                            <button onClick={() => setIsModalOpen(false)}>
                                <IconFA icon="times" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                                <IconFA icon="calendar" className="mr-2" />
                                {new Date(selectedEvent.start).toLocaleDateString()}
                            </p>
                            <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                                <IconFA icon="clock" className="mr-2" />
                                {new Date(selectedEvent.start).toLocaleTimeString()} -{' '}
                                {new Date(selectedEvent.end).toLocaleTimeString()}
                            </p>
                        </div>

                        <div className="flex justify-end space-x-2">
                            {selectedEvent.extendedProps?.type === 'exam' && (
                                <Button
                                    variant="primary"
                                    startIcon={<IconFA icon="check-square" />}
                                >
                                    Registrar Notas
                                </Button>
                            )}
                            {selectedEvent.extendedProps?.type === 'class' && (
                                <Button variant="primary" startIcon={<IconFA icon="user-check" />}>
                                    Marcar Asistencia
                                </Button>
                            )}
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Componente para notificaciones y tareas pendientes
function NotificationsAndTasks({ notifications, tasks }: NotificationsAndTasksProps) {
    const [activeTab, setActiveTab] = useState('notifications');

    const toggleTask = (taskId: number) => {
        // Implementar lógica para marcar/desmarcar tarea
        console.log('Toggle task', taskId);
    };

    const handleAction = (item: Notification | Task, action: string) => {
        // Implementar lógica para acciones rápidas
        console.log('Action', action, 'for item', item);
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                        activeTab === 'notifications'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400 border-b-2'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('notifications')}
                >
                    Notificaciones
                </button>
                <button
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                        activeTab === 'tasks'
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400 border-b-2'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    onClick={() => setActiveTab('tasks')}
                >
                    Tareas Pendientes
                </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4">
                {activeTab === 'notifications' ? (
                    <div className="space-y-3">
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`rounded-lg border p-3 ${
                                    notification.completed
                                        ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                                        : 'border-primary-100 bg-primary-50 dark:border-primary-900/30 dark:bg-primary-900/10'
                                }`}
                            >
                                <div className="flex items-start">
                                    <div className="mr-3 mt-0.5">
                                        {notification.type === 'permission' && (
                                            <IconFA icon="envelope" className="text-blue-500" />
                                        )}
                                        {notification.type === 'message' && (
                                            <IconFA icon="bell" className="text-green-500" />
                                        )}
                                        {notification.type === 'alert' && (
                                            <IconFA
                                                icon="triangle-exclamation"
                                                className="text-amber-500"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                            {notification.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {notification.description}
                                        </p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-xs text-gray-500 dark:text-gray-500">
                                                {notification.date}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAction(notification, 'view')}
                                            >
                                                Ver
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                className={`rounded-lg border p-3 ${
                                    task.completed
                                        ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                                        : 'border-amber-100 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-900/10'
                                }`}
                            >
                                <div className="flex items-start">
                                    <div className="mr-3 mt-0.5">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => toggleTask(task.id)}
                                            className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4
                                            className={`text-sm font-medium ${
                                                task.completed
                                                    ? 'text-gray-500 line-through dark:text-gray-400'
                                                    : 'text-gray-900 dark:text-white'
                                            }`}
                                        >
                                            {task.title}
                                        </h4>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-xs text-gray-500 dark:text-gray-500">
                                                Vence: {task.dueDate}
                                            </span>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleAction(task, task.action)}
                                                disabled={task.completed}
                                            >
                                                {task.action === 'attendance' &&
                                                    'Registrar Asistencia'}
                                                {task.action === 'grade' && 'Calificar'}
                                                {task.action === 'report' && 'Ver Reporte'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Componente para la tabla de estudiantes
function StudentsTable({ students }: StudentsTableProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Mis Estudiantes
                </h3>
                <Button variant="outline" size="sm" startIcon={<IconFA icon="users" />}>
                    Ver Todos
                </Button>
            </div>
            <div className="max-h-[300px] space-y-3 overflow-y-auto">
                {students.map(student => (
                    <div
                        key={student.id}
                        className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                        <div className="flex items-center">
                            <img
                                src={student.avatar}
                                alt={student.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="ml-3">
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {student.name}
                                </p>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Grupo {student.group}
                                </span>
                            </div>
                        </div>
                        <div className="hidden text-right md:block">
                            <p className="font-medium text-gray-900 dark:text-white">
                                {student.grade.toFixed(1)}
                            </p>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Promedio
                            </span>
                        </div>
                        <Button variant="outline" size="sm">
                            Ver Perfil
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Componente para mensajes recientes
function Messages({ messages }: MessagesProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeConversation, setActiveConversation] = useState<{
        contact: {
            id: string;
            name: string;
            avatar: string;
        };
        messages: Message[];
    } | null>(null);

    const handleMessageClick = (message: Message) => {
        // Simulamos una conversación completa basada en el mensaje seleccionado
        const conversationMessages = [
            message,
            {
                id: `reply-${message.id}`,
                sender: 'Ana García',
                avatar: '/images/user1.jpeg',
                text: 'Gracias por la información. Lo tendré en cuenta.',
                timestamp: 'Ahora',
                unread: false,
                isOutgoing: true,
            },
        ];

        setActiveConversation({
            contact: {
                id: message.id,
                name: message.sender,
                avatar: message.avatar,
            },
            messages: conversationMessages,
        });
        setIsModalOpen(true);
    };

    const handleSendMessage = (text: string) => {
        if (activeConversation) {
            // En una implementación real, aquí enviarías el mensaje a un API
            console.log(`Enviando mensaje a ${activeConversation.contact.name}: ${text}`);

            // Simulamos añadir el mensaje a la conversación
            const newMessage = {
                id: `new-${Date.now()}`,
                sender: 'Ana García',
                avatar: '/images/user1.jpeg',
                text: text,
                timestamp: 'Ahora',
                unread: false,
                isOutgoing: true,
            };

            setActiveConversation({
                ...activeConversation,
                messages: [...activeConversation.messages, newMessage],
            });
        }
    };

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Mensajes Recientes
                    </h3>
                    <Button variant="outline" size="sm" startIcon={<IconFA icon="inbox" />}>
                        Bandeja
                    </Button>
                </div>
                <div className="max-h-[300px] space-y-4 overflow-y-auto">
                    {messages.map(message => (
                        <div
                            key={message.id}
                            className="flex cursor-pointer items-start rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            onClick={() => handleMessageClick(message)}
                        >
                            <img
                                src={message.avatar}
                                alt={message.sender}
                                className="h-9 w-9 rounded-full object-cover"
                            />
                            <div className="ml-3 flex-1">
                                <div className="flex items-baseline justify-between">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {message.sender}
                                    </p>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {message.timestamp}
                                    </span>
                                </div>
                                <p
                                    className={`mt-1 text-sm text-gray-600 dark:text-gray-300 ${
                                        message.unread ? 'font-bold' : ''
                                    }`}
                                >
                                    {message.text.length > 60
                                        ? `${message.text.substring(0, 60)}...`
                                        : message.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <MessageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                activeConversation={activeConversation}
                onSendMessage={handleSendMessage}
            />
        </>
    );
}

// Componente para acciones rápidas
function QuickActions() {
    const actions = [
        { icon: 'user-check', label: 'Registrar Asistencia', action: 'attendance' },
        { icon: 'clipboard-check', label: 'Agregar Calificación', action: 'grade' },
        { icon: 'comment-dots', label: 'Enviar Mensaje', action: 'message' },
        { icon: 'bullhorn', label: 'Crear Anuncio', action: 'announce' },
    ];

    return (
        <div className="sticky bottom-0 z-10 rounded-t-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900 md:static md:rounded-2xl md:p-5">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white md:mb-4">
                Acciones Rápidas
            </h3>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
                {actions.map(action => (
                    <button
                        key={action.action}
                        className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-3 text-center transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                        onClick={() => console.log('Quick action:', action.action)}
                    >
                        <IconFA
                            icon={action.icon}
                            style="duotone"
                            size="lg"
                            className="text-primary-500 mb-2"
                        />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function TeacherDashboardPage() {
    const metricsConfig: MetricCardProps[] = [
        {
            id: 'active-classes',
            title: 'Clases Activas',
            value: teacherData.activeClasses,
            icon: 'chalkboard-teacher',
            badgeText: '2 hoy',
            badgeColor: 'primary',
            tooltip: 'Número total de grupos asignados',
            onClick: () => console.log('Navigate to classes'),
        },
        {
            id: 'upcoming-evaluations',
            title: 'Próximas Evaluaciones',
            value: teacherData.upcomingEvaluations.length,
            icon: 'clipboard-check',
            badgeText: `${teacherData.upcomingEvaluations[0]?.subject} - ${teacherData.upcomingEvaluations[0]?.date}`,
            badgeColor: 'warning',
            tooltip: 'Evaluaciones programadas próximamente',
            onClick: () => console.log('Navigate to evaluations'),
        },
        {
            id: 'total-students',
            title: 'Estudiantes a Cargo',
            value: teacherData.totalStudents,
            icon: 'user-graduate',
            badgeText: `${teacherData.activeClasses} grupos`,
            badgeColor: 'success',
            tooltip: 'Total de alumnos únicos en todos tus grupos',
            onClick: () => console.log('Navigate to students'),
        },
        {
            id: 'average-grade',
            title: 'Promedio General',
            value: teacherData.averageGrade.toFixed(1),
            icon: 'chart-line',
            badgeText: '+0.3 vs anterior',
            badgeColor: 'info',
            tooltip: 'Nota media ponderada de todas tus calificaciones',
            onClick: () => console.log('Navigate to grades'),
        },
    ];

    // Hook para la configuración de la gráfica de rendimiento
    const { chartConfigs } = usePerformanceChart(teacherData.performanceData);

    return (
        <div className="space-y-6">
            {/* Encabezado y Bienvenida */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        ¡Hola, {teacherData.name}!
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Aquí tienes un resumen de tu jornada.
                    </p>
                </div>
            </div>

            {/* Hero Cards KPI */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metricsConfig.map(metric => (
                    <MetricCard key={metric.id} {...metric} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left column */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <TeacherCalendar events={teacherData.events} />
                    <StudentsTable students={teacherData.students} />
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-6">
                    <QuickActions />
                    <NotificationsAndTasks
                        notifications={teacherData.notifications}
                        tasks={teacherData.tasks}
                    />
                    <Messages messages={teacherData.messages} />
                </div>
            </div>

            {/* Performance Chart con Wrapper */}
            <MetricsChartsWrapper title="Rendimiento por Periodo">
                <PerformanceChartGroup
                    charts={chartConfigs}
                    isLoading={false} // Puedes conectar un estado de carga real aquí
                />
            </MetricsChartsWrapper>
        </div>
    );
}
