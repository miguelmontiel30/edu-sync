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
import {
    mapDatabaseEventsToCalendarEvents,
    mapDatabaseEventTypes,
    transformRolesData,
    prepareEventRecipients,
    handleRepositoryError,
} from './utils';
import {CalendarData, DatabaseEvent, EventData, EventRecipient, RepositoryResponse} from './types';

// Interfaz del repositorio
export interface ICalendarRepository {
    getCalendarData(schoolId: number, schoolYearId?: number): Promise<CalendarData>;
    getActiveRoles(schoolId: number): Promise<RepositoryResponse>;
    saveEvent(eventData: EventData): Promise<RepositoryResponse>;
    updateEvent(eventId: number, eventData: Partial<EventData>): Promise<RepositoryResponse>;
    deleteEvent(eventId: number): Promise<RepositoryResponse>;
    saveEventRecipients(recipients: EventRecipient[]): Promise<RepositoryResponse>;
    deleteEventRecipients(eventId: number): Promise<RepositoryResponse>;
    createEventWithRecipients(
        eventData: EventData,
        recipients: EventRecipient[],
    ): Promise<RepositoryResponse>;
    updateEventWithRecipients(
        eventId: number,
        eventData: Partial<EventData>,
        recipients: EventRecipient[],
    ): Promise<RepositoryResponse>;
}

// Implementación del repositorio
class SupabaseCalendarRepository implements ICalendarRepository {
    /**
     * Obtiene todos los datos necesarios para el calendario
     */
    async getCalendarData(schoolId: number, schoolYearId?: number): Promise<CalendarData> {
        try {
            // Obtener eventos, tipos de eventos y roles en paralelo
            const [eventsResult, typesResult, rolesResult] = await Promise.all([
                getActiveEvents(schoolId, schoolYearId),
                getEventTypes(),
                getActiveRoles(),
            ]);

            // Manejar posibles errores
            if (eventsResult.error) throw eventsResult.error;
            if (typesResult.error) throw typesResult.error;
            if (rolesResult.error) throw rolesResult.error;

            // Transformar datos
            const mappedEvents = mapDatabaseEventsToCalendarEvents(
                eventsResult.data as DatabaseEvent[],
            );
            const mappedTypes = mapDatabaseEventTypes(typesResult.data || []);
            const roles = transformRolesData(rolesResult.data || []);

            return {
                events: mappedEvents,
                eventTypes: mappedTypes,
                roles: roles,
            };
        } catch (error) {
            console.error('Error en getCalendarData:', error);
            return {events: [], eventTypes: [], roles: []};
        }
    }

    /**
     * Obtiene los roles activos para una escuela
     */
    async getActiveRoles(_schoolId: number): Promise<RepositoryResponse> {
        try {
            const {data, error} = await getActiveRoles();

            if (error) return {success: false, error};

            const transformedRoles = transformRolesData(data || []);
            return {success: true, data: transformedRoles};
        } catch (error) {
            console.error('Error en getActiveRoles:', error);
            return handleRepositoryError(error);
        }
    }

    /**
     * Guarda un nuevo evento
     */
    async saveEvent(eventData: EventData): Promise<RepositoryResponse> {
        try {
            const {data, error} = await saveEvent(eventData);
            if (error) return {success: false, error};
            return {success: true, data};
        } catch (error) {
            console.error('Error en saveEvent:', error);
            return handleRepositoryError(error);
        }
    }

    /**
     * Actualiza un evento existente
     */
    async updateEvent(eventId: number, eventData: Partial<EventData>): Promise<RepositoryResponse> {
        try {
            const {data, error} = await updateEvent(eventId, eventData);
            if (error) return {success: false, error};
            return {success: true, data};
        } catch (error) {
            console.error('Error en updateEvent:', error);
            return handleRepositoryError(error);
        }
    }

    /**
     * Elimina un evento (soft delete)
     */
    async deleteEvent(eventId: number): Promise<RepositoryResponse> {
        try {
            const {error} = await deleteEvent(eventId);
            if (error) return {success: false, error};
            return {success: true};
        } catch (error) {
            console.error('Error en deleteEvent:', error);
            return handleRepositoryError(error);
        }
    }

    /**
     * Guarda destinatarios de eventos
     */
    async saveEventRecipients(recipients: EventRecipient[]): Promise<RepositoryResponse> {
        try {
            const {error} = await saveEventRecipients(recipients);
            if (error) return {success: false, error};
            return {success: true};
        } catch (error) {
            console.error('Error en saveEventRecipients:', error);
            return handleRepositoryError(error);
        }
    }

    /**
     * Elimina destinatarios de un evento
     */
    async deleteEventRecipients(eventId: number): Promise<RepositoryResponse> {
        try {
            const {error} = await deleteEventRecipients(eventId);
            if (error) return {success: false, error};
            return {success: true};
        } catch (error) {
            console.error('Error en deleteEventRecipients:', error);
            return handleRepositoryError(error);
        }
    }

    /**
     * Crea un evento con sus destinatarios en una sola operación
     */
    async createEventWithRecipients(
        eventData: EventData,
        recipients: EventRecipient[] = [],
    ): Promise<RepositoryResponse> {
        try {
            // Crear el evento
            const result = await this.saveEvent(eventData);
            if (!result.success) return result;

            // Si hay destinatarios, guardarlos
            if (recipients.length > 0) {
                const recipientsWithEventId = prepareEventRecipients(
                    result.data.event_id,
                    recipients,
                );

                const recipientsResult = await this.saveEventRecipients(recipientsWithEventId);
                if (!recipientsResult.success) return recipientsResult;
            }

            return {success: true, data: result.data};
        } catch (error) {
            console.error('Error en createEventWithRecipients:', error);
            return handleRepositoryError(error);
        }
    }

    /**
     * Actualiza un evento y sus destinatarios en una sola operación
     */
    async updateEventWithRecipients(
        eventId: number,
        eventData: Partial<EventData>,
        recipients: EventRecipient[] = [],
    ): Promise<RepositoryResponse> {
        try {
            // Actualizar el evento
            const result = await this.updateEvent(eventId, eventData);
            if (!result.success) return result;

            // Eliminar destinatarios existentes
            const deleteResult = await this.deleteEventRecipients(eventId);
            if (!deleteResult.success) return deleteResult;

            // Si hay nuevos destinatarios, guardarlos
            if (recipients.length > 0) {
                const recipientsWithEventId = prepareEventRecipients(eventId, recipients);

                const recipientsResult = await this.saveEventRecipients(recipientsWithEventId);
                if (!recipientsResult.success) return recipientsResult;
            }

            return {success: true, data: result.data};
        } catch (error) {
            console.error('Error en updateEventWithRecipients:', error);
            return handleRepositoryError(error);
        }
    }
}

// Exportar una instancia única del repositorio
export const calendarRepository = new SupabaseCalendarRepository();
