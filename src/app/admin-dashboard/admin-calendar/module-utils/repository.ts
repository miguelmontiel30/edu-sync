import {
    getActiveEvents,
    getEventTypes,
    getActiveRoles,
    saveEvent,
    updateEvent,
    deleteEvent,
    saveEventRecipients,
    deleteEventRecipients,
} from './queries';
import {mapDatabaseEventsToCalendarEvents, mapDatabaseEventTypes} from './utils';
import {CalendarData, DatabaseEvent} from './types';

export interface ICalendarRepository {
    getCalendarData(schoolId: number, schoolYearId?: number): Promise<CalendarData>;
    saveEvent(eventData: any): Promise<{success: boolean; data?: any; error?: any}>;
    updateEvent(
        eventId: number,
        eventData: any,
    ): Promise<{success: boolean; data?: any; error?: any}>;
    deleteEvent(eventId: number): Promise<{success: boolean; error?: any}>;
    saveEventRecipients(recipients: any[]): Promise<{success: boolean; error?: any}>;
    deleteEventRecipients(eventId: number): Promise<{success: boolean; error?: any}>;
    getActiveRoles(schoolId: number): Promise<{success: boolean; data?: any; error?: any}>;
}

class SupabaseCalendarRepository implements ICalendarRepository {
    async getCalendarData(schoolId: number, schoolYearId?: number): Promise<CalendarData> {
        try {
            // Obtener eventos
            const {data: events, error: eventsError} = await getActiveEvents(
                schoolId,
                schoolYearId,
            );

            if (eventsError) {
                console.error('Error al obtener eventos:', eventsError);
                return {events: [], eventTypes: [], roles: []};
            }

            // Obtener tipos de eventos
            const {data: eventTypes, error: typesError} = await getEventTypes();

            if (typesError) {
                console.error('Error al obtener tipos de eventos:', typesError);
                return {
                    events: mapDatabaseEventsToCalendarEvents(events as DatabaseEvent[]),
                    eventTypes: [],
                    roles: [],
                };
            }

            // Obtener roles activos
            const {data: roles, error: rolesError} = await getActiveRoles();

            if (rolesError) {
                console.error('Error al obtener roles activos:', rolesError);
                return {
                    events: mapDatabaseEventsToCalendarEvents(events as DatabaseEvent[]),
                    eventTypes: mapDatabaseEventTypes(eventTypes),
                    roles: [],
                };
            }

            // Mapear datos a formato esperado por el componente Calendar
            const mappedEvents = mapDatabaseEventsToCalendarEvents(events as DatabaseEvent[]);
            const mappedTypes = mapDatabaseEventTypes(eventTypes);

            return {
                events: mappedEvents,
                eventTypes: mappedTypes,
                roles: roles || [],
            };
        } catch (error) {
            console.error('Error inesperado en repositorio:', error);
            return {events: [], eventTypes: [], roles: []};
        }
    }

    /**
     * Obtiene los roles activos para una escuela
     */
    async getActiveRoles(_schoolId: number): Promise<{success: boolean; data?: any; error?: any}> {
        try {
            const {data, error} = await getActiveRoles();

            if (error) {
                return {success: false, error};
            }

            return {success: true, data};
        } catch (error) {
            console.error('Error al obtener roles:', error);
            return {success: false, error};
        }
    }

    /**
     * Guarda un nuevo evento
     */
    async saveEvent(eventData: any): Promise<{success: boolean; data?: any; error?: any}> {
        try {
            const {data, error} = await saveEvent(eventData);

            if (error) {
                return {success: false, error};
            }

            return {success: true, data};
        } catch (error) {
            console.error('Error al guardar evento:', error);
            return {success: false, error};
        }
    }

    /**
     * Actualiza un evento existente
     */
    async updateEvent(
        eventId: number,
        eventData: any,
    ): Promise<{success: boolean; data?: any; error?: any}> {
        try {
            const {data, error} = await updateEvent(eventId, eventData);

            if (error) {
                return {success: false, error};
            }

            return {success: true, data};
        } catch (error) {
            console.error('Error al actualizar evento:', error);
            return {success: false, error};
        }
    }

    /**
     * Elimina un evento (soft delete)
     */
    async deleteEvent(eventId: number): Promise<{success: boolean; error?: any}> {
        try {
            const {error} = await deleteEvent(eventId);

            if (error) {
                return {success: false, error};
            }

            return {success: true};
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            return {success: false, error};
        }
    }

    /**
     * Guarda destinatarios de eventos
     */
    async saveEventRecipients(recipients: any[]): Promise<{success: boolean; error?: any}> {
        try {
            const {error} = await saveEventRecipients(recipients);

            if (error) {
                return {success: false, error};
            }

            return {success: true};
        } catch (error) {
            console.error('Error al guardar destinatarios:', error);
            return {success: false, error};
        }
    }

    /**
     * Elimina destinatarios de un evento
     */
    async deleteEventRecipients(eventId: number): Promise<{success: boolean; error?: any}> {
        try {
            const {error} = await deleteEventRecipients(eventId);

            if (error) {
                return {success: false, error};
            }

            return {success: true};
        } catch (error) {
            console.error('Error al eliminar destinatarios:', error);
            return {success: false, error};
        }
    }
}

export const calendarRepository = new SupabaseCalendarRepository();
