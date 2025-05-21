import {supabaseClient} from '@/services/config/supabaseClient';

/**
 * Consulta base para obtener eventos
 */
export function baseEventQuery() {
    return supabaseClient
        .from('events')
        .select(
            `
            *,
            event_type:event_type_id (
                event_type_id,
                name,
                color,
                icon
            ),
            recipients:event_recipients (
                event_recipient_id,
                event_id,
                role_id,
                recipient_id
            )
        `,
        )
        .eq('delete_flag', false);
}

/**
 * Obtiene todos los eventos activos para una escuela y ciclo escolar
 */
export function getActiveEvents(schoolId: number, schoolYearId?: number) {
    let query = baseEventQuery().eq('school_id', schoolId);

    if (schoolYearId) {
        query = query.eq('school_year_id', schoolYearId);
    }

    return query.order('start_time', {ascending: true});
}

/**
 * Obtiene todos los tipos de eventos para una escuela
 */
export function getEventTypes() {
    return supabaseClient
        .from('event_types')
        .select('*')
        .eq('delete_flag', false)
        .order('name', {ascending: true});
}

/**
 * Obtiene todos los roles activos para una escuela
 */
export async function getActiveRoles(): Promise<{
    data: Array<{id: number; name: string}> | null;
    error: any;
}> {
    const {data, error} = await supabaseClient
        .from('roles')
        .select('role_id, name')
        .eq('delete_flag', false)
        .order('name', {ascending: true});

    const transformedData = data
        ? data.map(role => ({
              id: parseInt(role.role_id),
              name: role.name,
          }))
        : null;

    return {data: transformedData, error};
}

/**
 * Obtener un evento específico por ID
 */
export function getEventById(eventId: number) {
    return baseEventQuery().eq('event_id', eventId).single();
}

/**
 * Guardar un nuevo evento
 */
export function saveEvent(eventData: any) {
    return supabaseClient.from('events').insert(eventData).select().single();
}

/**
 * Actualizar un evento existente
 */
export function updateEvent(eventId: number, eventData: any) {
    return supabaseClient
        .from('events')
        .update(eventData)
        .eq('event_id', eventId)
        .select()
        .single();
}

/**
 * Eliminar un evento (soft delete)
 */
export function deleteEvent(eventId: number) {
    return supabaseClient.from('events').update({delete_flag: true}).eq('event_id', eventId);
}

/**
 * Guardar destinatarios de eventos
 */
export function saveEventRecipients(recipients: any[]) {
    return supabaseClient.from('event_recipients').insert(recipients);
}

/**
 * Eliminar destinatarios de un evento
 */
export function deleteEventRecipients(eventId: number) {
    return supabaseClient.from('event_recipients').delete().eq('event_id', eventId);
}
