'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import ProfileAvatar from '../ui/ProfileAvatar';
import IconFA from '../ui/IconFA';

// Tipos de notificación
type NotificationType =
    | 'student_alert'
    | 'teacher_alert'
    | 'payment_alert'
    | 'system_info'
    | 'system_warning'
    | 'system_error'
    | 'confirmation';
type UserRole = 'student' | 'teacher' | 'admin';

interface NotificationData {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
    userRole?: UserRole;
    userName?: string;
    actionRequired?: boolean;
}

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [_notifying, setNotifying] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Mover la función handleResize fuera del useEffect
    const handleResize = () => {
        setIsMobile(globalThis.innerWidth < 768);
    };

    useEffect(() => {
        // Verificar al montar
        handleResize();

        // Agregar el event listener
        globalThis.addEventListener('resize', handleResize);

        // Limpiar el event listener al desmontar
        return () => {
            globalThis.removeEventListener('resize', handleResize);
        };
    }, []); // Dependencias vacías para que solo se ejecute al montar/desmontar

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    const handleClick = () => {
        toggleDropdown();
        setNotifying(false);
    };

    // Datos de prueba para diferentes tipos de notificación
    const notifications: NotificationData[] = [
        // Notificaciones de estudiantes
        {
            id: '1',
            type: 'student_alert',
            title: 'Ausencia Reportada',
            message: 'ha faltado a 3 clases consecutivas en Matemáticas',
            timestamp: '5 min ago',
            isRead: false,
            priority: 'high',
            userRole: 'student',
            userName: 'Ana María González Pérez',
        },
        {
            id: '2',
            type: 'student_alert',
            title: 'Bajo Rendimiento',
            message: 'ha obtenido calificaciones por debajo del promedio',
            timestamp: '15 min ago',
            isRead: false,
            priority: 'medium',
            userRole: 'student',
            userName: 'Carlos Eduardo Martínez',
        },

        // Notificaciones de maestros
        {
            id: '3',
            type: 'teacher_alert',
            title: 'Solicitud de Permiso',
            message: 'ha solicitado permiso para ausentarse el próximo viernes',
            timestamp: '30 min ago',
            isRead: false,
            priority: 'medium',
            userRole: 'teacher',
            userName: 'Prof. María Elena Rodríguez',
        },
        {
            id: '4',
            type: 'teacher_alert',
            title: 'Calificaciones Pendientes',
            message: 'tiene calificaciones pendientes por subir al sistema',
            timestamp: '45 min ago',
            isRead: true,
            priority: 'medium',
            userRole: 'teacher',
            userName: 'Prof. Roberto Silva Mendoza',
        },

        // Notificaciones de pagos
        {
            id: '5',
            type: 'payment_alert',
            title: 'Pago Atrasado',
            message: 'tiene una colegiatura vencida desde hace 15 días',
            timestamp: '1 hr ago',
            isRead: false,
            priority: 'high',
            userRole: 'student',
            userName: 'Luis Fernando Castro',
        },
        {
            id: '6',
            type: 'payment_alert',
            title: 'Recordatorio de Pago',
            message: 'su próximo pago vence en 3 días',
            timestamp: '2 hrs ago',
            isRead: true,
            priority: 'low',
            userRole: 'student',
            userName: 'Sandra Patricia Morales',
        },

        // Notificaciones del sistema
        {
            id: '7',
            type: 'system_info',
            title: 'Actualización del Sistema',
            message:
                'El sistema se actualizará el próximo domingo. Guarda tus cambios antes de las 2:00 AM.',
            timestamp: '3 hrs ago',
            isRead: false,
            priority: 'medium',
        },
        {
            id: '8',
            type: 'system_warning',
            title: 'Mantenimiento Programado',
            message:
                'Habrá mantenimiento de 12:00 AM a 4:00 AM. Algunas funciones pueden no estar disponibles.',
            timestamp: '4 hrs ago',
            isRead: true,
            priority: 'medium',
        },
        {
            id: '9',
            type: 'system_error',
            title: 'Incidente Técnico',
            message:
                'Se ha detectado un problema en el módulo de reportes. El equipo técnico está trabajando en solucionarlo.',
            timestamp: '6 hrs ago',
            isRead: false,
            priority: 'high',
        },
    ];

    // Función para obtener el icono según el tipo de notificación
    const getNotificationIcon = (type: NotificationType): string => {
        const icons = {
            student_alert: 'user-graduate',
            teacher_alert: 'chalkboard-teacher',
            payment_alert: 'credit-card',
            system_info: 'info-circle',
            system_warning: 'exclamation-triangle',
            system_error: 'times-circle',
            confirmation: 'question-circle',
        };
        return icons[type];
    };

    // Función para obtener el color del icono según el tipo
    const getNotificationIconColor = (type: NotificationType, priority: string): string => {
        if (priority === 'high') return 'text-error-500';
        if (priority === 'medium' && type.includes('alert')) return 'text-warning-500';
        if (type === 'system_info') return 'text-info-500';
        if (type === 'system_warning') return 'text-warning-500';
        if (type === 'system_error') return 'text-error-500';
        return 'text-gray-500';
    };

    // Función para obtener el color de fondo del icono
    const getNotificationBgColor = (type: NotificationType, priority: string): string => {
        if (priority === 'high') return 'bg-error-100 dark:bg-error-900/20';
        if (priority === 'medium' && type.includes('alert'))
            return 'bg-warning-100 dark:bg-warning-900/20';
        if (type === 'system_info') return 'bg-info-100 dark:bg-info-900/20';
        if (type === 'system_warning') return 'bg-warning-100 dark:bg-warning-900/20';
        if (type === 'system_error') return 'bg-error-100 dark:bg-error-900/20';
        return 'bg-gray-100 dark:bg-gray-800';
    };

    // Función para renderizar el contenido de la notificación
    const renderNotificationContent = (notification: NotificationData) => {
        if (notification.userRole && notification.userName) {
            return (
                <div className="min-w-0 flex-1">
                    <p className="mb-1 break-words text-sm font-medium text-gray-800 dark:text-white/90">
                        <span className="font-semibold">{notification.userName}</span>
                        {notification.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="capitalize">
                            {notification.userRole === 'student'
                                ? 'Estudiante'
                                : notification.userRole === 'teacher'
                                  ? 'Profesor'
                                  : 'Administrador'}
                        </span>
                        <span className="hidden h-1 w-1 rounded-full bg-gray-400 sm:block"></span>
                        <span>{notification.timestamp}</span>
                        {!notification.isRead && (
                            <>
                                <span className="hidden h-1 w-1 rounded-full bg-gray-400 sm:block"></span>
                                <span className="text-info-500 font-medium">Nuevo</span>
                            </>
                        )}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="min-w-0 flex-1">
                    <p className="mb-1 break-words text-sm font-medium text-gray-800 dark:text-white/90">
                        {notification.title}
                    </p>
                    <p className="mb-2 break-words text-sm text-gray-500 dark:text-gray-400">
                        {notification.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>Sistema</span>
                        <span className="hidden h-1 w-1 rounded-full bg-gray-400 sm:block"></span>
                        <span>{notification.timestamp}</span>
                        {!notification.isRead && (
                            <>
                                <span className="hidden h-1 w-1 rounded-full bg-gray-400 sm:block"></span>
                                <span className="text-info-500 font-medium">Nuevo</span>
                            </>
                        )}
                    </div>
                </div>
            );
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative">
            <button
                type="button"
                className="dropdown-toggle relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white sm:h-11 sm:w-11"
                onClick={handleClick}
                aria-label="Abrir notificaciones"
            >
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-xs font-bold text-white sm:h-5 sm:w-5">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
                <IconFA icon="bell" style="duotone" size={isMobile ? 'sm' : 'lg'} />
            </button>

            <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                mobileFullScreen
                className="notifications-dropdown"
            >
                {/* Header */}
                <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 p-4 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            Notificaciones
                        </h5>
                        {unreadCount > 0 && (
                            <span className="inline-flex items-center rounded-full bg-error-100 px-2 py-0.5 text-xs font-medium text-error-800 dark:bg-error-900/20 dark:text-error-400">
                                {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={closeDropdown}
                        className="p-1 text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Cerrar notificaciones"
                    >
                        <IconFA icon="times" style="duotone" size="sm" />
                    </button>
                </div>

                {/* Lista de notificaciones con scroll */}
                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                            <IconFA icon="bell-slash" className="mb-2 h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No hay notificaciones
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                            {notifications.map(notification => (
                                <li key={notification.id}>
                                    <DropdownItem
                                        onItemClick={closeDropdown}
                                        className={`flex gap-3 p-3 transition-colors hover:bg-gray-100 dark:hover:bg-white/5 sm:p-4 ${
                                            !notification.isRead
                                                ? 'bg-blue-50/50 dark:bg-blue-900/10'
                                                : ''
                                        }`}
                                    >
                                        {/* Avatar o Icono */}
                                        <div className="flex-shrink-0">
                                            {notification.userRole && notification.userName ? (
                                                <ProfileAvatar
                                                    size="sm"
                                                    name={notification.userName}
                                                    showStatus
                                                    status="online"
                                                />
                                            ) : (
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 ${getNotificationBgColor(notification.type, notification.priority)}`}
                                                >
                                                    <IconFA
                                                        icon={getNotificationIcon(
                                                            notification.type,
                                                        )}
                                                        style="duotone"
                                                        size="sm"
                                                        className={getNotificationIconColor(
                                                            notification.type,
                                                            notification.priority,
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Contenido de la notificación */}
                                        {renderNotificationContent(notification)}

                                        {/* Indicador de no leída */}
                                        {!notification.isRead && (
                                            <div className="flex-shrink-0 self-start pt-2">
                                                <div className="bg-info-500 h-2 w-2 rounded-full"></div>
                                            </div>
                                        )}
                                    </DropdownItem>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer con acciones */}
                <div className="flex-shrink-0 border-t border-gray-100 p-3 dark:border-gray-700 sm:p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                        <Link
                            href="/notifications"
                            onClick={closeDropdown}
                            className="block flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            Ver Todas
                        </Link>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            <IconFA icon="check-double" style="duotone" size="sm" />
                            <span className="hidden sm:inline">Marcar como leídas</span>
                            <span className="sm:hidden">Marcar leídas</span>
                        </button>
                    </div>
                </div>
            </Dropdown>
        </div>
    );
}
