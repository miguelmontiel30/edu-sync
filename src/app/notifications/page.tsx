'use client';

import React, { useState, useMemo } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import IconFA from '@/components/ui/IconFA';
import { cn } from '@/lib/utils';

// Tipos de notificación
type NotificationType = 'student_alert' | 'teacher_alert' | 'payment_alert' | 'system_info' | 'system_warning' | 'system_error' | 'academic_alert' | 'attendance_alert' | 'grade_alert';
type UserRole = 'student' | 'teacher' | 'admin' | 'parent';
type FilterType = 'all' | 'unread' | 'student' | 'teacher' | 'payment' | 'system';

interface NotificationData {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
    userRole?: UserRole;
    userName?: string;
    actionRequired?: boolean;
    metadata?: {
        location?: string;
        amount?: string;
        subject?: string;
        grade?: string;
    };
}

export default function NotificationsPage() {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

    // Datos de prueba realistas con más variedad
    const notifications: NotificationData[] = [
        // Hoy - Notificaciones de estudiantes
        {
            id: '1',
            type: 'attendance_alert',
            title: 'Ausencia Reportada',
            message: 'ha faltado a 3 clases consecutivas en Matemáticas Avanzadas',
            timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
            isRead: false,
            priority: 'high',
            userRole: 'student',
            userName: 'Ana María González Pérez',
            metadata: { subject: 'Matemáticas Avanzadas' }
        },
        {
            id: '2',
            type: 'grade_alert',
            title: 'Calificación Baja',
            message: 'ha obtenido 6.2 en el examen de Química Orgánica',
            timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
            isRead: false,
            priority: 'medium',
            userRole: 'student',
            userName: 'Carlos Eduardo Martínez López',
            metadata: { subject: 'Química Orgánica', grade: '6.2' }
        },
        {
            id: '3',
            type: 'academic_alert',
            title: 'Tarea No Entregada',
            message: 'no ha entregado la tarea de Historia Universal',
            timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 min ago
            isRead: true,
            priority: 'medium',
            userRole: 'student',
            userName: 'Diana Patricia Morales Cruz',
            metadata: { subject: 'Historia Universal' }
        },

        // Notificaciones de maestros
        {
            id: '4',
            type: 'teacher_alert',
            title: 'Solicitud de Permiso',
            message: 'ha solicitado permiso médico para el próximo viernes',
            timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
            isRead: false,
            priority: 'medium',
            userRole: 'teacher',
            userName: 'Prof. María Elena Rodríguez Sánchez',
            actionRequired: true
        },
        {
            id: '5',
            type: 'teacher_alert',
            title: 'Calificaciones Pendientes',
            message: 'tiene 15 calificaciones pendientes por subir al sistema',
            timestamp: new Date(Date.now() - 55 * 60 * 1000), // 55 min ago
            isRead: true,
            priority: 'medium',
            userRole: 'teacher',
            userName: 'Prof. Roberto Silva Mendoza'
        },

        // Notificaciones de pagos
        {
            id: '6',
            type: 'payment_alert',
            title: 'Pago Vencido',
            message: 'tiene una colegiatura vencida desde hace 15 días',
            timestamp: new Date(Date.now() - 65 * 60 * 1000), // 1hr 5min ago
            isRead: false,
            priority: 'high',
            userRole: 'student',
            userName: 'Luis Fernando Castro Herrera',
            metadata: { amount: '$3,500.00' },
            actionRequired: true
        },
        {
            id: '7',
            type: 'payment_alert',
            title: 'Recordatorio de Pago',
            message: 'su próximo pago de inscripción vence en 3 días',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hrs ago
            isRead: true,
            priority: 'low',
            userRole: 'student',
            userName: 'Sandra Patricia Morales González',
            metadata: { amount: '$2,800.00' }
        },

        // Notificaciones del sistema
        {
            id: '8',
            type: 'system_info',
            title: 'Actualización del Sistema',
            message: 'El sistema se actualizará el próximo domingo de 2:00 AM a 6:00 AM. Guarda tus cambios antes de esta hora.',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hrs ago
            isRead: false,
            priority: 'medium'
        },
        {
            id: '9',
            type: 'system_warning',
            title: 'Mantenimiento Programado',
            message: 'Habrá mantenimiento del servidor de 12:00 AM a 4:00 AM. El módulo de reportes puede no estar disponible.',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hrs ago
            isRead: true,
            priority: 'medium'
        },

        // Ayer
        {
            id: '10',
            type: 'student_alert',
            title: 'Incidente Disciplinario',
            message: 'ha sido reportado por comportamiento inadecuado en el laboratorio',
            timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), // Yesterday
            isRead: false,
            priority: 'high',
            userRole: 'student',
            userName: 'Miguel Ángel Hernández Torres'
        },
        {
            id: '11',
            type: 'payment_alert',
            title: 'Pago Recibido',
            message: 'ha realizado el pago de colegiatura por $3,200.00',
            timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000), // Yesterday
            isRead: true,
            priority: 'low',
            userRole: 'student',
            userName: 'Jessica Alejandra Ramírez Vega',
            metadata: { amount: '$3,200.00' }
        },
        {
            id: '12',
            type: 'system_error',
            title: 'Error en Módulo de Reportes',
            message: 'Se ha detectado un error en la generación de reportes académicos. El equipo técnico está trabajando en la solución.',
            timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000), // Yesterday
            isRead: false,
            priority: 'high'
        },

        // Hace 2 días
        {
            id: '13',
            type: 'teacher_alert',
            title: 'Nuevo Reporte Subido',
            message: 'ha subido el reporte mensual de progreso académico',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
            isRead: true,
            priority: 'low',
            userRole: 'teacher',
            userName: 'Prof. Carmen Beatriz López Moreno'
        },
        {
            id: '14',
            type: 'academic_alert',
            title: 'Examen Programado',
            message: 'se ha programado un examen extraordinario de Física para el próximo martes',
            timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000), // 2 days ago
            isRead: true,
            priority: 'medium',
            userRole: 'teacher',
            userName: 'Prof. Andrés Ricardo Jiménez Vázquez',
            metadata: { subject: 'Física' }
        }
    ];

    // Funciones de utilidad
    const getNotificationIcon = (type: NotificationType): string => {
        const icons = {
            student_alert: 'user-graduate',
            teacher_alert: 'chalkboard-teacher',
            payment_alert: 'credit-card',
            system_info: 'info-circle',
            system_warning: 'exclamation-triangle',
            system_error: 'times-circle',
            academic_alert: 'book-open',
            attendance_alert: 'calendar-xmark',
            grade_alert: 'chart-line'
        };
        return icons[type];
    };

    const getNotificationIconColor = (type: NotificationType, priority: string): string => {
        if (priority === 'high') return 'text-error-500';
        if (priority === 'medium' && type.includes('alert')) return 'text-warning-500';
        if (type === 'system_info') return 'text-info-500';
        if (type === 'system_warning') return 'text-warning-500';
        if (type === 'system_error') return 'text-error-500';
        if (type === 'payment_alert' && priority === 'low') return 'text-success-500';
        return 'text-gray-500';
    };

    const getNotificationBgColor = (type: NotificationType, priority: string): string => {
        if (priority === 'high') return 'bg-error-100 dark:bg-error-900/20';
        if (priority === 'medium' && type.includes('alert')) return 'bg-warning-100 dark:bg-warning-900/20';
        if (type === 'system_info') return 'bg-info-100 dark:bg-info-900/20';
        if (type === 'system_warning') return 'bg-warning-100 dark:bg-warning-900/20';
        if (type === 'system_error') return 'bg-error-100 dark:bg-error-900/20';
        if (type === 'payment_alert' && priority === 'low') return 'bg-success-100 dark:bg-success-900/20';
        return 'bg-gray-100 dark:bg-gray-800';
    };

    const getRelativeTime = (date: Date): string => {
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutos`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
        } else if (diffInDays === 1) {
            return 'Ayer';
        } else if (diffInDays < 7) {
            return `${diffInDays} días`;
        } else {
            return date.toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
    };

    // Filtrar notificaciones
    const filteredNotifications = useMemo(() => {
        let filtered = notifications;

        switch (activeFilter) {
            case 'unread':
                filtered = notifications.filter(n => !n.isRead);
                break;
            case 'student':
                filtered = notifications.filter(n => n.type.includes('student') || n.type.includes('academic') || n.type.includes('attendance') || n.type.includes('grade'));
                break;
            case 'teacher':
                filtered = notifications.filter(n => n.type.includes('teacher'));
                break;
            case 'payment':
                filtered = notifications.filter(n => n.type.includes('payment'));
                break;
            case 'system':
                filtered = notifications.filter(n => n.type.includes('system'));
                break;
            default:
                filtered = notifications;
        }

        return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [activeFilter]);

    // Agrupar por fechas
    const groupedNotifications = useMemo(() => {
        const groups: { [key: string]: NotificationData[] } = {};
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        filteredNotifications.forEach(notification => {
            const notifDate = notification.timestamp;
            let groupKey: string;

            if (notifDate.toDateString() === today.toDateString()) {
                groupKey = 'Hoy';
            } else if (notifDate.toDateString() === yesterday.toDateString()) {
                groupKey = 'Ayer';
            } else {
                const diffInDays = Math.floor((today.getTime() - notifDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffInDays < 7) {
                    groupKey = `Hace ${diffInDays} días`;
                } else {
                    groupKey = notifDate.toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long',
                        year: notifDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
                    });
                }
            }

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(notification);
        });

        return groups;
    }, [filteredNotifications]);

    // Estadísticas
    const stats = useMemo(() => {
        const total = notifications.length;
        const unread = notifications.filter(n => !n.isRead).length;
        const high = notifications.filter(n => n.priority === 'high').length;
        const actionRequired = notifications.filter(n => n.actionRequired).length;

        return { total, unread, high, actionRequired };
    }, []);

    const filters = [
        { key: 'all' as FilterType, label: 'Todas', count: stats.total },
        { key: 'unread' as FilterType, label: 'No leídas', count: stats.unread },
        { key: 'student' as FilterType, label: 'Estudiantes', count: notifications.filter(n => n.type.includes('student') || n.type.includes('academic') || n.type.includes('attendance') || n.type.includes('grade')).length },
        { key: 'teacher' as FilterType, label: 'Profesores', count: notifications.filter(n => n.type.includes('teacher')).length },
        { key: 'payment' as FilterType, label: 'Pagos', count: notifications.filter(n => n.type.includes('payment')).length },
        { key: 'system' as FilterType, label: 'Sistema', count: notifications.filter(n => n.type.includes('system')).length }
    ];

    const toggleNotificationSelection = (id: string) => {
        setSelectedNotifications(prev => 
            prev.includes(id) 
                ? prev.filter(nId => nId !== id)
                : [...prev, id]
        );
    };

    const markAsRead = (ids: string[]) => {
        // Aquí implementarías la lógica para marcar como leídas
        console.log('Marking as read:', ids);
    };

    const markAllAsRead = () => {
        const unreadIds = filteredNotifications.filter(n => !n.isRead).map(n => n.id);
        markAsRead(unreadIds);
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Centro de Notificaciones" />

            {/* Header con estadísticas */}
            <div className="mb-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <IconFA icon="bell" className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <IconFA icon="envelope" className="h-6 w-6 text-info-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No leídas</p>
                                <p className="text-2xl font-semibold text-info-600 dark:text-info-400">{stats.unread}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <IconFA icon="exclamation-triangle" className="h-6 w-6 text-error-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Urgentes</p>
                                <p className="text-2xl font-semibold text-error-600 dark:text-error-400">{stats.high}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <IconFA icon="tasks" className="h-6 w-6 text-warning-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Acción requerida</p>
                                <p className="text-2xl font-semibold text-warning-600 dark:text-warning-400">{stats.actionRequired}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros y acciones */}
            <ComponentCard className="mb-6">
                <div className="flex flex-col space-y-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    {/* Filtros */}
                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                className={cn(
                                    "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                                    activeFilter === filter.key
                                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                )}
                            >
                                {filter.label}
                                <span className={cn(
                                    "ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold",
                                    activeFilter === filter.key
                                        ? "bg-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200"
                                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                )}>
                                    {filter.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2">
                        <button
                            onClick={markAllAsRead}
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <IconFA icon="check-double" className="mr-2 h-4 w-4" />
                            Marcar todas como leídas
                        </button>
                        
                        {selectedNotifications.length > 0 && (
                            <button
                                onClick={() => markAsRead(selectedNotifications)}
                                className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                            >
                                <IconFA icon="check" className="mr-2 h-4 w-4" />
                                Marcar seleccionadas ({selectedNotifications.length})
                            </button>
                        )}
                    </div>
                </div>
            </ComponentCard>

            {/* Lista de notificaciones */}
            <ComponentCard>
                <div className="p-6">
                    {Object.keys(groupedNotifications).length === 0 ? (
                        <div className="py-12 text-center">
                            <IconFA icon="bell-slash" className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay notificaciones</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                No se encontraron notificaciones con los filtros aplicados.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groupedNotifications).map(([dateGroup, notifications]) => (
                                <div key={dateGroup}>
                                    {/* Separador de fecha */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-white px-3 text-sm font-medium text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                                                {dateGroup}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Lista de notificaciones del día */}
                                    <div className="mt-4 space-y-3">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    "flex items-start space-x-4 rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50",
                                                    !notification.isRead 
                                                        ? "border-indigo-200 bg-indigo-50/50 dark:border-indigo-800/50 dark:bg-indigo-900/10" 
                                                        : "border-gray-200 dark:border-gray-700"
                                                )}
                                            >
                                                {/* Checkbox */}
                                                <div className="flex-shrink-0 pt-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedNotifications.includes(notification.id)}
                                                        onChange={() => toggleNotificationSelection(notification.id)}
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                </div>

                                                {/* Avatar o Icono */}
                                                <div className="flex-shrink-0">
                                                    {notification.userRole && notification.userName ? (
                                                        <ProfileAvatar 
                                                            size="sm" 
                                                            name={notification.userName}
                                                            showStatus={true}
                                                            status="online"
                                                        />
                                                    ) : (
                                                        <div className={cn(
                                                            "flex h-10 w-10 items-center justify-center rounded-full",
                                                            getNotificationBgColor(notification.type, notification.priority)
                                                        )}>
                                                            <IconFA 
                                                                icon={getNotificationIcon(notification.type)} 
                                                                style="duotone" 
                                                                className={getNotificationIconColor(notification.type, notification.priority)}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Contenido */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {notification.userName ? (
                                                                    <>
                                                                        <span className="font-semibold">{notification.userName}</span>
                                                                        {' '}{notification.message}
                                                                    </>
                                                                ) : (
                                                                    notification.title
                                                                )}
                                                            </p>
                                                            
                                                            {!notification.userName && (
                                                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                                    {notification.message}
                                                                </p>
                                                            )}

                                                            {/* Metadata */}
                                                            {notification.metadata && (
                                                                <div className="mt-2 flex flex-wrap gap-2">
                                                                    {notification.metadata.subject && (
                                                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                                            <IconFA icon="book" className="mr-1 h-3 w-3" />
                                                                            {notification.metadata.subject}
                                                                        </span>
                                                                    )}
                                                                    {notification.metadata.amount && (
                                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                                            <IconFA icon="dollar-sign" className="mr-1 h-3 w-3" />
                                                                            {notification.metadata.amount}
                                                                        </span>
                                                                    )}
                                                                    {notification.metadata.grade && (
                                                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                                                                            <IconFA icon="star" className="mr-1 h-3 w-3" />
                                                                            {notification.metadata.grade}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Footer */}
                                                            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                                <span className="capitalize">
                                                                    {notification.userRole === 'student' ? 'Estudiante' : 
                                                                     notification.userRole === 'teacher' ? 'Profesor' : 
                                                                     notification.userRole === 'admin' ? 'Administrador' : 'Sistema'}
                                                                </span>
                                                                <span>•</span>
                                                                <span>{getRelativeTime(notification.timestamp)}</span>
                                                                {!notification.isRead && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="font-medium text-indigo-600 dark:text-indigo-400">Nueva</span>
                                                                    </>
                                                                )}
                                                                {notification.actionRequired && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="font-medium text-warning-600 dark:text-warning-400">Acción requerida</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Indicadores laterales */}
                                                        <div className="flex flex-col items-end space-y-1">
                                                            {/* Prioridad */}
                                                            <div className={cn(
                                                                "h-2 w-2 rounded-full",
                                                                notification.priority === 'high' ? 'bg-error-500' :
                                                                notification.priority === 'medium' ? 'bg-warning-500' : 'bg-success-500'
                                                            )} />
                                                            
                                                            {/* Estado de lectura */}
                                                            {!notification.isRead && (
                                                                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ComponentCard>
        </div>
    );
} 