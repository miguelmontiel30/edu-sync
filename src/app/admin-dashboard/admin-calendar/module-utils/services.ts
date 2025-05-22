// Repository
import {calendarRepository, ICalendarRepository} from './repository';

// Types
import {CalendarData, EventData, EventRecipient, RepositoryResponse} from './types';

// Instancia compartida del repositorio
const repository: ICalendarRepository = calendarRepository;

/**
 * Obtiene los datos del calendario para una escuela y año escolar específicos
 */
export function getCalendarData(schoolId: number, schoolYearId?: number): Promise<CalendarData> {
    return repository.getCalendarData(schoolId, schoolYearId);
}

/**
 * Obtiene los roles activos para una escuela
 */
export function getActiveRoles(schoolId: number): Promise<RepositoryResponse> {
    return repository.getActiveRoles(schoolId);
}

/**
 * Crea un nuevo evento en el calendario
 */
export function createEvent(
    eventData: EventData,
    recipients: EventRecipient[] = [],
): Promise<RepositoryResponse> {
    return repository.createEventWithRecipients(eventData, recipients);
}

/**
 * Actualiza un evento y sus destinatarios
 */
export function updateEventWithRecipients(
    eventId: number,
    eventData: Partial<EventData>,
    recipients: EventRecipient[] = [],
): Promise<RepositoryResponse> {
    return repository.updateEventWithRecipients(eventId, eventData, recipients);
}

/**
 * Elimina un evento del calendario
 */
export function removeEvent(eventId: number): Promise<RepositoryResponse> {
    return repository.deleteEvent(eventId);
}
