// Supabase client
import {supabaseClient} from '@/services/config/supabaseClient';

/**
 * Consulta base para seleccionar profesores
 */
export const baseTeacherQuery = () =>
    supabaseClient.from('teachers').select(`
        teacher_id,
        first_name,
        father_last_name,
        mother_last_name,
        gender_id,
        email,
        phone,
        image_url,
        curp,
        delete_flag
    `);

/**
 * Consulta optimizada para obtener materias de un grupo con relaciones
 * Incluye datos del grupo, materia y profesor en una sola consulta
 */
export const getGroupSubjectsWithRelations = (groupId: number) =>
    supabaseClient
        .from('group_subjects')
        .select(
            `
            group_subject_id,
            subject_id,
            teacher_id,
            delete_flag,
            groups!inner(
                group_id,
                grade,
                group_name,
                status_id,
                status:status_id(name, code)
            ),
            subjects!inner(
                subject_id,
                name,
                description,
                status_id,
                status:status_id(name, code)
            ),
            teachers(
                teacher_id,
                first_name,
                father_last_name,
                mother_last_name,
                gender_id,
                email,
                phone,
                image_url,
                curp
            )
        `,
        )
        .eq('group_id', groupId)
        .eq('delete_flag', false);

/**
 * Obtiene todos los profesores activos de una escuela
 */
export const getAllTeachers = (schoolId: number) =>
    supabaseClient
        .from('teachers')
        .select(
            `
            teacher_id,
            first_name,
            father_last_name,
            mother_last_name,
            gender_id,
            email,
            phone,
            image_url,
            curp,
            delete_flag
        `,
        )
        .eq('school_id', schoolId)
        .eq('delete_flag', false);

/**
 * Obtiene materias disponibles para una escuela
 */
export const getAvailableSubjects = (schoolId: number) =>
    supabaseClient
        .from('subjects')
        .select(
            `
            subject_id,
            name,
            description,
            status_id,
            status:status(status_id, name)
        `,
        )
        .eq('school_id', schoolId)
        .eq('delete_flag', false);

/**
 * Operaciones CRUD para asignaciones de grupo-materia-profesor
 */

// Asignar profesor a una materia en un grupo
export const assignTeacherToGroupSubject = (groupSubjectId: number, teacherId: number) =>
    supabaseClient
        .from('group_subjects')
        .update({teacher_id: teacherId, updated_at: new Date().toISOString()})
        .eq('group_subject_id', groupSubjectId);

// Remover profesor de una materia
export const removeTeacherFromGroupSubject = (groupSubjectId: number) =>
    supabaseClient
        .from('group_subjects')
        .update({teacher_id: null, updated_at: new Date().toISOString()})
        .eq('group_subject_id', groupSubjectId);

// Crear asignación de materia a grupo
export const createGroupSubjectAssignment = (
    groupId: number,
    subjectId: number,
    teacherId: number | null,
) =>
    supabaseClient.from('group_subjects').insert([
        {
            group_id: groupId,
            subject_id: subjectId,
            teacher_id: teacherId,
            delete_flag: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ]);

/**
 * Obtiene las materias eliminadas de un grupo con sus relaciones
 */
export async function getDeletedGroupSubjects(groupId: number) {
    return await supabaseClient
        .from('group_subjects')
        .select(
            `
            group_subject_id,
            subject_id,
            teacher_id,
            deleted_at,
            subjects:subject_id (
                subject_id,
                name,
                description,
                status_id
            ),
            teachers:teacher_id (
                teacher_id,
                first_name,
                father_last_name,
                mother_last_name,
                email
            )
        `,
        )
        .eq('group_id', groupId)
        .eq('delete_flag', true)
        .order('deleted_at', {ascending: false});
}

/**
 * Elimina (marca como eliminada) una materia de un grupo
 */
export async function deleteGroupSubject(groupSubjectId: number, userId?: number) {
    const updateData: any = {
        delete_flag: true,
        deleted_at: new Date().toISOString(),
    };

    // Añadir userId si está disponible
    if (userId) {
        updateData.deleted_by = userId;
    }

    return await supabaseClient
        .from('group_subjects')
        .update(updateData)
        .eq('group_subject_id', groupSubjectId);
}

/**
 * Restaura una materia eliminada de un grupo
 */
export async function restoreGroupSubject(groupSubjectId: number) {
    return await supabaseClient
        .from('group_subjects')
        .update({
            delete_flag: false,
            deleted_at: null,
        })
        .eq('group_subject_id', groupSubjectId);
}
