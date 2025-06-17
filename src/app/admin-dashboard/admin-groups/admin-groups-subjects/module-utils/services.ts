import { SupabaseGroupTeachersRepository, IGroupTeachersRepository } from './repository';

// Instancia compartida del repositorio
const repository: IGroupTeachersRepository = new SupabaseGroupTeachersRepository();

/**
 * Obtiene las asignaciones de profesores y materias para un grupo
 * @param groupId - ID del grupo
 * @param schoolId - ID de la escuela
 * @returns Array de asignaciones con datos relacionados
 */
export async function fetchGroupTeacherAssignments(groupId: number, schoolId: number) {
    return await repository.getGroupTeacherAssignments(groupId, schoolId);
}

/**
 * Obtiene las materias eliminadas de un grupo con sus relaciones
 * @param groupId - ID del grupo
 * @returns Array de materias eliminadas con sus datos relacionados
 */
export async function fetchDeletedGroupSubjects(groupId: number) {
    return await repository.getDeletedGroupSubjects(groupId);
}

/**
 * Función optimizada para obtener tanto las materias activas como eliminadas
 * @param groupId - ID del grupo
 * @param schoolId - ID de la escuela
 * @returns Objeto con materias activas y eliminadas
 */
export async function fetchAllGroupSubjects(groupId: number, schoolId: number) {
    const [active, deleted] = await Promise.all([
        repository.getGroupTeacherAssignments(groupId, schoolId),
        repository.getDeletedGroupSubjects(groupId),
    ]);

    return {
        active,
        deleted,
    };
}

/**
 * Obtiene todos los profesores activos de una escuela
 * @param schoolId - ID de la escuela
 * @returns Array de profesores
 */
export async function fetchAllTeachers(schoolId: number) {
    return await repository.getAllTeachers(schoolId);
}

/**
 * Obtiene materias disponibles para un grupo
 * @param schoolId - ID de la escuela
 * @returns Array de materias disponibles
 */
export async function fetchAvailableSubjects(schoolId: number) {
    return await repository.getAvailableSubjectsForGroup(schoolId);
}

/**
 * Asigna un profesor a una materia de un grupo
 * @param groupSubjectId - ID de la relación grupo-materia
 * @param teacherId - ID del profesor
 * @returns Objeto indicando el éxito o error de la operación
 */
export async function assignTeacherToSubject(groupSubjectId: number, teacherId: number) {
    return await repository.assignTeacherToSubject(groupSubjectId, teacherId);
}

/**
 * Quita un profesor de una materia
 * @param groupSubjectId - ID de la relación grupo-materia
 * @returns Objeto indicando el éxito o error de la operación
 */
export async function removeTeacherFromSubject(groupSubjectId: number) {
    return await repository.removeTeacherFromSubject(groupSubjectId);
}

/**
 * Crea una asignación de materia a grupo
 * @param groupId - ID del grupo
 * @param subjectId - ID de la materia
 * @param teacherId - ID del profesor (opcional)
 * @returns Objeto indicando el éxito o error de la operación
 */
export async function createSubjectAssignment(
    groupId: number,
    subjectId: number,
    teacherId: number | null = null,
) {
    return await repository.createSubjectAssignment(groupId, subjectId, teacherId);
}

/**
 * Elimina una materia de un grupo
 * @param groupSubjectId - ID de la relación grupo-materia
 * @param userId - ID del usuario que realiza la acción (opcional)
 * @returns Objeto indicando el éxito o error de la operación
 */
export async function deleteSubjectFromGroup(groupSubjectId: number, userId?: number) {
    return await repository.deleteSubjectFromGroup(groupSubjectId, userId);
}

/**
 * Restaura una materia eliminada de un grupo
 * @param groupSubjectId - ID de la relación grupo-materia
 * @returns Objeto indicando el éxito o error de la operación
 */
export async function restoreSubjectToGroup(groupSubjectId: number) {
    return await repository.restoreSubjectToGroup(groupSubjectId);
}
