/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from '@/services/config/supabaseClient';
import { STUDENT_GROUP_STATUS } from './types';

/**
 * Consulta base para obtener estudiantes con sus relaciones
 * @returns QueryBuilder de Supabase
 */
export function baseStudentQuery() {
    return supabaseClient.from('students').select(`
        *,
        gender:gender_id (
            gender_id,
            code,
            name
        ),
        status:status_id (
            status_id,
            code,
            name,
            category
        )
    `);
}

/**
 * Obtiene las asignaciones de estudiantes a un grupo específico
 * @param groupId ID del grupo a consultar
 * @returns Promise con los datos y posible error
 */
export async function getStudentGroupAssignments(groupId: number) {
    return await supabaseClient
        .from('student_groups')
        .select('student_id, student_group_id, status_id')
        .eq('delete_flag', false)
        .eq('group_id', groupId);
}

/**
 * Obtiene las asignaciones de estudiantes eliminados de un grupo específico
 * @param groupId ID del grupo a consultar
 * @returns Promise con los datos y posible error
 */
export async function getDeletedStudentGroupAssignments(groupId: number) {
    return await supabaseClient
        .from('student_groups')
        .select('student_id, student_group_id, status_id')
        .eq('delete_flag', true)
        .eq('group_id', groupId);
}

/**
 * Obtiene las asignaciones de estudiantes inactivos (no activos pero no eliminados) de un grupo específico
 * @param groupId ID del grupo a consultar
 * @returns Promise con los datos y posible error
 */
export async function getInactiveStudentGroupAssignments(groupId: number) {
    return await supabaseClient
        .from('student_groups')
        .select('student_id, student_group_id, status_id')
        .eq('delete_flag', false)
        .eq('group_id', groupId)
        .neq('status_id', STUDENT_GROUP_STATUS.STUDENT_GROUP_ACTIVE);
}

/**
 * Obtiene estudiantes por IDs y escuela
 * @param studentIds Array de IDs de estudiantes
 * @param schoolId ID de la escuela
 * @returns Promise con los datos y posible error
 */
export async function getStudentsByIdsAndSchool(studentIds: number[], schoolId: number) {
    return await baseStudentQuery()
        .eq('delete_flag', false)
        .eq('school_id', schoolId)
        .in('student_id', studentIds)
        .order('first_name', { ascending: true });
}

/**
 * Obtiene las asignaciones activas de estudiantes a grupos
 * @param statusId ID del estado activo
 * @returns Promise con los datos y posible error
 */
export async function getActiveStudentGroupAssignments(statusId: number) {
    return await supabaseClient
        .from('student_groups')
        .select('student_id')
        .eq('delete_flag', false)
        .eq('status_id', statusId);
}

/**
 * Obtiene el conteo de estudiantes en un grupo con un estado específico
 * @param groupId ID del grupo
 * @param statusId ID del estado
 * @returns Promise con el conteo y posible error
 */
export async function getStudentCountInGroupByStatus(groupId: number, statusId: number) {
    return await supabaseClient
        .from('student_groups')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId)
        .eq('delete_flag', false)
        .eq('status_id', statusId);
}

/**
 * Inserta registros en la tabla student_groups
 * @param records Registros a insertar
 * @returns Promise con el resultado y posible error
 */
export async function insertStudentGroupRecords(records: any[]) {
    return await supabaseClient.from('student_groups').insert(records);
}

/**
 * Actualiza el estado de un estudiante en un grupo
 * @param studentGroupId ID de la relación estudiante-grupo
 * @param statusId Nuevo ID de estado
 * @param updatedAt Fecha de actualización
 * @returns Promise con el resultado y posible error
 */
export async function updateStudentGroupStatus(
    studentGroupId: number,
    statusId: number,
    updatedAt: string,
) {
    return await supabaseClient
        .from('student_groups')
        .update({
            status_id: statusId,
            updated_at: updatedAt,
        })
        .eq('student_group_id', studentGroupId);
}

/**
 * Realiza un borrado lógico de un estudiante de un grupo
 * @param studentGroupId ID de la relación estudiante-grupo
 * @param timestamp Fecha de la operación
 * @returns Promise con el resultado y posible error
 */
export async function removeStudentFromGroup(studentGroupId: number, timestamp: string) {
    return await supabaseClient
        .from('student_groups')
        .update({
            delete_flag: true,
            updated_at: timestamp,
            deleted_at: timestamp,
        })
        .eq('student_group_id', studentGroupId);
}

/**
 * Restaura un estudiante eliminado y actualiza su estado
 * @param studentGroupId ID de la relación estudiante-grupo
 * @param statusId Nuevo ID de estado
 * @param timestamp Fecha de la operación
 * @returns Promise con el resultado y posible error
 */
export async function restoreStudentFromGroup(
    studentGroupId: number,
    statusId: number,
    timestamp: string,
) {
    return await supabaseClient
        .from('student_groups')
        .update({
            delete_flag: false,
            status_id: statusId,
            updated_at: timestamp,
            deleted_at: null,
        })
        .eq('student_group_id', studentGroupId);
}
