// React
import { useState, useEffect } from 'react';

// Hooks
import { useSession } from '@/hooks/useSession';

// Services
import { loadSchoolYearsBySchoolId } from '../../admin-school-year/module-utils/services';
import {
    getCalendarData,
    createEvent,
    updateEventWithRecipients,
    removeEvent,
} from '../module-utils/services';

// Utils
import { processEvents, translateRolesToSpanish } from '../module-utils/utils';

// Types
import { CalendarEvent } from '@/components/core/calendar';
import { EventData, EventRecipient } from '../module-utils/types';
import { SchoolCycle } from '../../admin-school-year/module-utils/types';

// Interfaz para el ciclo escolar desde la base de datos
interface DatabaseSchoolYear {
    school_year_id: number;
    name: string;
    status_id: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export function useAdminCalendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [availableRoles, setAvailableRoles] = useState<{ role_id: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSchoolYear, setActiveSchoolYear] = useState<DatabaseSchoolYear | null>(null);

    // Hook de sesion
    const { session } = useSession();
    const schoolId = session?.school_id;

    useEffect(() => {
        if (!schoolId) {
            setIsLoading(false);
            return;
        }

        fetchActiveSchoolYear(schoolId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schoolId]);

    const fetchActiveSchoolYear = async (schoolId: number) => {
        try {
            const schoolYears = await loadSchoolYearsBySchoolId(schoolId);

            // Transformar los datos al formato esperado de DatabaseSchoolYear
            const formattedSchoolYears: DatabaseSchoolYear[] = schoolYears.map(
                (year: SchoolCycle) => ({
                    school_year_id: year.id,
                    name: year.name,
                    status_id: parseInt(year.status),
                    start_date: year.startDate,
                    end_date: year.endDate,
                }),
            );

            // Buscar el ciclo escolar activo (status_id = 1 significa activo)
            const activeYear = formattedSchoolYears.find(year => year.status_id === 1);

            if (activeYear) {
                setActiveSchoolYear(activeYear);

                // Cargar los eventos del ciclo escolar activo
                fetchCalendarData(schoolId, activeYear.school_year_id);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
        }
    };

    const fetchCalendarData = async (schoolId: number, schoolYearId: number) => {
        try {
            setIsLoading(true);

            // Obtener datos del calendario usando el servicio
            const calendarData = await getCalendarData(schoolId, schoolYearId);

            // Establecer eventos en el estado
            if (calendarData.events && calendarData.events.length > 0) {
                // Procesar eventos para corregir problemas de zona horaria
                const processedEvents = processEvents(calendarData.events);
                setEvents(processedEvents);
            } else {
                setEvents([]);
            }

            // Establecer roles disponibles desde la respuesta con nombres traducidos
            if (calendarData.roles && calendarData.roles.length > 0) {
                // Traducir los nombres de roles a español
                const translatedRoles = translateRolesToSpanish(calendarData.roles);
                setAvailableRoles(translatedRoles);
            } else {
                setAvailableRoles([]);
            }
        } catch (error) {
            console.error('Error al cargar los datos del calendario:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEventAdd = async (event: CalendarEvent) => {
        try {
            if (!activeSchoolYear || !schoolId) {
                console.error('No hay ciclo escolar activo o ID de escuela');
                return;
            }

            // Extraer la información del tipo de evento y descripción
            // Revisamos tanto en el nivel principal como en extendedProps
            const eventTypeId = event.event_type_id || event.extendedProps?.event_type_id || 1;
            const eventDescription = event.description || event.extendedProps?.description || '';

            // Preparar el evento para la base de datos
            const eventData: EventData = {
                school_id: schoolId,
                event_type_id: Number(eventTypeId) || 1, // Asegurar que sea número
                school_year_id: activeSchoolYear.school_year_id,
                title: event.title || 'Evento sin título',
                description: eventDescription,
                start_time: event.start?.toString() || new Date().toISOString(),
                end_time: event.end?.toString(),
                all_day: true,
                status_id: 21, // Estado "Programado"
                created_by: Number(session?.id) || 0,
                delete_flag: false,
            };

            // Preparar destinatarios (roles)
            const recipients: EventRecipient[] =
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                event.extendedProps?.roles?.map((role: any) => ({
                    role_id: Number(role.role_id),
                })) || [];

            // Crear evento en la base de datos
            const result = await createEvent(eventData, recipients);

            if (result.success && result.data) {
                // y que la descripción y tipo de evento se mantengan
                const eventToAdd = {
                    ...event,
                    allDay: true,
                    description: eventDescription,
                    event_type_id: eventTypeId.toString(),
                    extendedProps: {
                        ...event.extendedProps,
                        event_id: result.data.event_id,
                        description: eventDescription,
                        event_type_id: eventTypeId,
                    },
                };

                setEvents(prev => [...prev, eventToAdd]);
            } else {
                console.error('Error al crear el evento:', result.error);
            }
        } catch (error) {
            console.error('Error en la operación de añadir evento:', error);
        }
    };

    const handleEventUpdate = async (event: CalendarEvent) => {
        try {
            if (!activeSchoolYear || !schoolId) {
                console.error('No hay ciclo escolar activo o ID de escuela');
                return;
            }

            // Verificar si el evento tiene un ID de base de datos
            const eventId = event.extendedProps?.event_id;
            if (!eventId) {
                console.error('No se puede actualizar el evento: ID de evento no disponible');
                return;
            }

            // Extraer la información del tipo de evento y descripción
            // Revisamos tanto en el nivel principal como en extendedProps
            const eventTypeId = event.event_type_id || event.extendedProps?.event_type_id || 1;
            const eventDescription = event.description || event.extendedProps?.description || '';

            // Preparar el evento para la base de datos
            const eventData: Partial<EventData> = {
                school_id: schoolId,
                event_type_id: Number(eventTypeId) || 1, // Asegurar que sea número
                school_year_id: activeSchoolYear.school_year_id,
                title: event.title || 'Evento sin título',
                description: eventDescription,
                start_time: event.start?.toString() || new Date().toISOString(),
                end_time: event.end?.toString(),
                all_day: true,
                status_id: 21, // Estado "Programado"
            };

            // Preparar destinatarios (roles)
            const recipients: EventRecipient[] =
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                event.extendedProps?.roles?.map((role: any) => ({
                    role_id: Number(role.role_id),
                })) || [];

            // Actualizar evento en la base de datos
            const result = await updateEventWithRecipients(eventId, eventData, recipients);

            if (result.success) {
                // Asegurarnos de que el evento incluya allDay para evitar problemas de zona horaria
                // y que la descripción y tipo de evento se mantengan
                const eventToUpdate = {
                    ...event,
                    allDay: true,
                    description: eventDescription,
                    event_type_id: eventTypeId.toString(),
                    extendedProps: {
                        ...event.extendedProps,
                        description: eventDescription,
                        event_type_id: eventTypeId,
                    },
                };

                setEvents(prev => prev.map(e => (e.id === event.id ? eventToUpdate : e)));
            } else {
                console.error('Error al actualizar el evento:', result.error);
            }
        } catch (error) {
            console.error('Error en la operación de actualizar evento:', error);
        }
    };

    const handleEventDelete = async (eventId: string) => {
        try {
            // Buscar el evento para obtener su ID de base de datos
            const eventToDelete = events.find(e => e.id === eventId);

            if (!eventToDelete) {
                console.error('Evento no encontrado en la lista de eventos:', eventId);
                return;
            }

            // Intentar obtener el ID de diferentes formas
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let dbEventId: any = null;

            if (eventToDelete.extendedProps?.event_id) {
                dbEventId = eventToDelete.extendedProps.event_id;
            } else if (typeof eventToDelete === 'object' && eventToDelete !== null) {
                // Verificar si es un objeto de FullCalendar
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const fcEvent = eventToDelete as any;
                if (fcEvent._def?.extendedProps?.event_id) {
                    dbEventId = fcEvent._def.extendedProps.event_id;
                }
            }

            // Si tenemos un ID de base de datos, intentar eliminar en la BD
            if (dbEventId) {
                // Eliminar evento (borrado lógico) en la base de datos
                const result = await removeEvent(dbEventId);

                if (result.success) {
                    console.error('Error al eliminar el evento de la BD:', result.error);
                }
            } else {
                console.error('Evento sin ID de base de datos, solo se eliminará de la UI');
            }

            // Siempre actualizar la UI eliminando el evento, incluso si falló la eliminación en BD
            setEvents(prev => prev.filter(e => e.id !== eventId));
        } catch (error) {
            console.error('Error en la operación de eliminar evento:', error);
            // Intentar eliminar de la UI aunque falle la BD
            setEvents(prev => prev.filter(e => e.id !== eventId));
        }
    };

    return {
        events,
        availableRoles,
        isLoading,
        activeSchoolYear,
        handleEventAdd,
        handleEventUpdate,
        handleEventDelete,
    };
}
