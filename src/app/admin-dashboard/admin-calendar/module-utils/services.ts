import {calendarRepository} from './repository';
import {CalendarData} from './types';

/**
 * Obtiene los datos del calendario para una escuela y año escolar específicos
 */
export function getCalendarData(schoolId: number, schoolYearId?: number): Promise<CalendarData> {
    return calendarRepository.getCalendarData(schoolId, schoolYearId);
}

/**
 * Obtiene los roles activos para una escuela
 */
export function getActiveRoles(
    schoolId: number,
): Promise<{success: boolean; data?: any; error?: any}> {
    return calendarRepository.getActiveRoles(schoolId);
}

/**
 * Crea un nuevo evento en el calendario
 */
export async function createEvent(
    eventData: any,
    recipients: any[] = [],
): Promise<{success: boolean; data?: any; error?: any}> {
    try {
        // Guardar el evento
        const result = await calendarRepository.saveEvent(eventData);

        if (!result.success) throw result.error;

        const event = result.data;

        // Si hay destinatarios, guardarlos
        if (recipients.length > 0) {
            const recipientsWithEventId = recipients.map(recipient => ({
                ...recipient,
                event_id: event.id,
            }));

            const recipientsResult =
                await calendarRepository.saveEventRecipients(recipientsWithEventId);

            if (!recipientsResult.success) throw recipientsResult.error;
        }

        return {success: true, data: event};
    } catch (error) {
        console.error('Error al crear evento:', error);
        return {success: false, error};
    }
}

/**
 * Actualiza un evento y sus destinatarios
 */
export async function updateEventWithRecipients(
    eventId: number,
    eventData: any,
    recipients: any[] = [],
): Promise<{success: boolean; data?: any; error?: any}> {
    try {
        // Actualizar el evento
        const result = await calendarRepository.updateEvent(eventId, eventData);

        if (!result.success) throw result.error;

        // Eliminar destinatarios existentes
        const deleteResult = await calendarRepository.deleteEventRecipients(eventId);

        if (!deleteResult.success) throw deleteResult.error;

        // Si hay nuevos destinatarios, guardarlos
        if (recipients.length > 0) {
            const recipientsWithEventId = recipients.map(recipient => ({
                ...recipient,
                event_id: eventId,
            }));

            const recipientsResult =
                await calendarRepository.saveEventRecipients(recipientsWithEventId);

            if (!recipientsResult.success) throw recipientsResult.error;
        }

        return {success: true, data: result.data};
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        return {success: false, error};
    }
}

/**
 * Elimina un evento del calendario
 */
export async function removeEvent(eventId: number): Promise<{success: boolean; error?: any}> {
    try {
        const result = await calendarRepository.deleteEvent(eventId);

        if (!result.success) throw result.error;

        return {success: true};
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        return {success: false, error};
    }
}
