import { DatabaseEvent, EventType, Role, EventRecipient, RepositoryResponse } from './types';
import { CalendarEvent } from '@/components/core/calendar/types';

/**
 * Convierte el color del evento a una clase de color para el calendario
 */
export function mapEventColor(color: string | number): string {
    // Si es un número (tipo de evento ID), asignar un color basado en el ID
    if (typeof color === 'number') {
        const colorIndex = color % 4;
        const colors = ['primary', 'success', 'danger', 'warning'];
        return colors[colorIndex];
    }

    // Mapeo de colores específicos si vienen de la base de datos
    const colorMap: Record<string, string> = {
        '#000000': 'primary',
        '#D32F2F': 'danger',
        '#2E7D32': 'success',
        '#FFA000': 'warning',
        '#42A5F5': 'primary',
    };

    // Si tenemos un mapeo específico para este color, úsalo
    if (colorMap[color]) {
        return colorMap[color];
    }

    // Si no hay un mapeo específico pero tenemos un color válido, asignemos una categoría basada en el tono
    if (color && color.startsWith('#')) {
        try {
            // Convertir hex a RGB para determinar el tono predominante
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);

            // Asignar categoría según el tono predominante
            if (r > g && r > b) return 'danger'; // Rojo predominante
            if (g > r && g > b) return 'success'; // Verde predominante
            if (b > r && b > g) return 'primary'; // Azul predominante
            if (r > 200 && g > 150 && b < 100) return 'warning'; // Tonos amarillos/naranjas
        } catch (e) {
            console.error('Error:', e);
            console.error('Error al procesar color:', color);
        }
    }

    // Default si nada más funciona
    return 'primary';
}

/**
 * Ajusta una fecha UTC para evitar el desplazamiento de día en eventos
 */
function correctUTCDate(dateStr: string): string {
    if (!dateStr) return dateStr;

    // Si ya es un formato de fecha simple YYYY-MM-DD, no necesita corrección
    if (dateStr.length === 10 && dateStr.includes('-')) {
        return `${dateStr}T00:00:00Z`;
    }

    // Extraer solo la parte de la fecha para eventos con hora
    if (dateStr.includes('T')) {
        const dateOnly = dateStr.split('T')[0];
        // Añadir T00:00:00Z para asegurar que se interprete como UTC a las 00:00
        return `${dateOnly}T00:00:00Z`;
    }

    return dateStr;
}

/**
 * Procesa los eventos para asegurar que todas las fechas sean interpretadas correctamente
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function processEvents(events: any[]): CalendarEvent[] {
    return events.map(event => {
        // Asegurarnos de que todas las fechas sean interpretadas correctamente
        const processedEvent: CalendarEvent = {
            id: event.id?.toString() || event.event_id?.toString(),
            title: event.title,
            description: event.description || '',
            created_by: (event.created_by || 0).toString(),
            school_id: (event.school_id || 0).toString(),
            school_year_id: (event.school_year_id || 0).toString(),
            event_type_id: (event.event_type_id || 0).toString(),
            allDay: true,
            extendedProps: {
                ...event.extendedProps,
                calendar: event.extendedProps?.calendar || 'primary',
            },
        };

        // Función para ajustar fechas en formato UTC para evitar el cambio de día
        const correctUTCDate = (dateStr: string) => {
            if (!dateStr) return dateStr;

            // Si ya es un formato de fecha simple YYYY-MM-DD, no necesita corrección
            if (dateStr.length === 10 && dateStr.includes('-')) {
                return dateStr;
            }

            // Extraer solo la parte de la fecha para eventos con hora
            if (dateStr.includes('T')) {
                const dateOnly = dateStr.split('T')[0];
                // Añadir T00:00:00Z para asegurar que se interprete como UTC a las 00:00
                return `${dateOnly}T00:00:00Z`;
            }

            return dateStr;
        };

        // Aplicar corrección a las fechas
        if (event.start) {
            processedEvent.start = correctUTCDate(event.start);
        }

        if (event.end) {
            processedEvent.end = correctUTCDate(event.end);
        }

        return processedEvent;
    });
}

/**
 * Convierte los eventos de la base de datos al formato requerido por el componente Calendar
 */
export function mapDatabaseEventsToCalendarEvents(dbEvents: DatabaseEvent[]): CalendarEvent[] {
    // Procesar cada evento de la base de datos
    return dbEvents.map(event => {
        // Extraer los IDs de roles de los destinatarios
        const roleIds = event.recipients?.map(r => r.role_id) || [];

        // Convertir los IDs de roles a objetos de rol con id y nombre
        const roles = roleIds.map(id => {
            let roleName: string;
            switch (id) {
                case 1:
                    roleName = 'admin';
                    break;
                case 2:
                    roleName = 'teacher';
                    break;
                case 3:
                    roleName = 'student';
                    break;
                case 4:
                    roleName = 'tutor';
                    break;
                default:
                    roleName = `role-${id}`;
            }
            return {
                role_id: id.toString(),
                name: roleName,
            };
        });

        // Asegurar que las fechas estén en formato correcto para FullCalendar
        try {
            // Formatear adecuadamente las fechas para FullCalendar
            let startDate = correctUTCDate(event.start_time);
            const endDate = event.end_time ? correctUTCDate(event.end_time) : undefined;

            // Verificar que sean fechas válidas
            if (startDate) {
                // Intentar crear una fecha para validar
                const testDate = new Date(startDate);
                // Si es inválida, registrar el error
                if (isNaN(testDate.getTime())) {
                    console.error(
                        `Fecha de inicio inválida para evento ${event.title}:`,
                        startDate,
                    );
                    // Usar la fecha actual como fallback
                    const today = new Date();
                    const yyyy = today.getFullYear();
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const dd = String(today.getDate()).padStart(2, '0');
                    startDate = `${yyyy}-${mm}-${dd}T00:00:00Z`;
                }
            }

            // Asignar color basado en el evento o tipo de evento
            let calendarColor;

            // Intentar usar el color del tipo de evento si existe
            if (event.event_type?.color) {
                calendarColor = mapEventColor(event.event_type.color);
            }
            // Si no hay color, intentar asignar uno basado en el ID del tipo de evento
            else if (event.event_type_id) {
                calendarColor = mapEventColor(event.event_type_id);
            }
            // Fallback final
            else {
                calendarColor = 'primary';
            }

            // Crear objeto de evento para el calendario
            const calendarEvent: CalendarEvent = {
                id: event.event_id.toString(),
                title: event.title,
                start: startDate, // Fecha de inicio corregida
                end: endDate, // Fecha de fin corregida
                description: event.description || '',
                created_by: (event.created_by || 0).toString(),
                school_id: (event.school_id || 0).toString(),
                school_year_id: (event.school_year_id || 0).toString(),
                event_type_id: (event.event_type_id || 0).toString(),
                allDay: true,
                extendedProps: {
                    calendar: calendarColor,
                    event_type_id: event.event_type_id,
                    description: event.description,
                    roles,
                    status_id: event.status_id,
                },
            };

            return calendarEvent;
        } catch (error) {
            console.error('Error al procesar evento:', error, event);
            // Retornar un evento con valores por defecto en caso de error
            return {
                id: event.event_id.toString(),
                title: event.title || 'Evento sin título',
                start: new Date().toISOString().split('T')[0] + 'T00:00:00Z', // Fecha actual como fallback, corregida
                description: '',
                created_by: '0',
                school_id: '0',
                school_year_id: '0',
                event_type_id: '0',
                allDay: true,
                extendedProps: {
                    calendar: 'primary',
                    roles: [],
                    status_id: 1,
                },
            };
        }
    });
}

/**
 * Convierte los tipos de eventos de la base de datos al formato requerido por el componente Calendar
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDatabaseEventTypes(dbEventTypes: any[]): EventType[] {
    return dbEventTypes.map(type => ({
        event_type_id: type.event_type_id,
        name: type.name,
        color: type.color || '#000000',
        icon: type.icon || 'calendar',
    }));
}

/**
 * Traduce los nombres de roles al español
 * @param roles Array de roles con id y nombre en inglés
 * @returns Array de roles con nombres traducidos al español
 */
export function translateRolesToSpanish(roles: Role[]): Array<{ role_id: string; name: string }> {
    const translations: { [key: string]: string } = {
        admin: 'Administrador',
        teacher: 'Profesor',
        student: 'Estudiante',
        tutor: 'Tutor',
    };

    return roles.map(role => ({
        role_id: role.id.toString(),
        name: translations[role.name] || role.name,
    }));
}

/**
 * Transforma los datos de roles de la base de datos al formato esperado
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformRolesData(roles: any[]): Role[] {
    return roles.map(role => ({
        id: parseInt(role.role_id),
        name: role.name,
    }));
}

/**
 * Prepara los destinatarios agregando el ID del evento
 */
export function prepareEventRecipients(
    eventId: number,
    recipients: EventRecipient[],
): EventRecipient[] {
    return recipients.map(recipient => ({
        ...recipient,
        event_id: eventId,
    }));
}

/**
 * Maneja errores en las respuestas del repositorio
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleRepositoryError(error: any): RepositoryResponse {
    return { success: false, error };
}

/**
 * Comprueba si una respuesta del repositorio tiene error y lo maneja
 */
export function checkRepositoryResponse(response: RepositoryResponse): RepositoryResponse {
    if (!response.success) {
        return { success: false, error: response.error };
    }
    return response;
}
