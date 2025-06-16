// Repositorio
import { groupStudentsRepository } from './repository';

// Tipos
import { Student } from '@/app/admin-dashboard/admin-students/module-utils/types';

/**
 * Obtiene todos los estudiantes que no han sido eliminados del grupo.
 */
export function fetchActiveStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]> {
    return groupStudentsRepository.getActiveStudentsByGroup(groupId, schoolId);
}

/**
 * Obtiene estudiantes inactivos (no activos pero no eliminados) del grupo
 */
export function fetchInactiveStudentsByGroup(
    groupId: number,
    schoolId: number,
): Promise<Student[]> {
    return groupStudentsRepository.getInactiveStudentsByGroup(groupId, schoolId);
}

/**
 * Obtiene estudiantes eliminados (delete_flag = true) del grupo
 */
export function fetchDeletedStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]> {
    return groupStudentsRepository.getDeletedStudentsByGroup(groupId, schoolId);
}

/**
 * Asigna estudiantes a un grupo
 */
export function assignStudentsToGroup(
    groupId: number,
    studentIds: number[],
): Promise<{ success: boolean; error?: any }> {
    return groupStudentsRepository.assignStudentsToGroup(groupId, studentIds);
}

/**
 * Elimina un estudiante de un grupo
 */
export function removeStudentFromGroup(
    studentGroupId: number,
): Promise<{ success: boolean; error?: any }> {
    return groupStudentsRepository.removeStudentFromGroup(studentGroupId);
}

/**
 * Restaura un estudiante eliminado del grupo
 */
export function restoreStudentToGroup(
    studentGroupId: number,
): Promise<{ success: boolean; error?: any }> {
    return groupStudentsRepository.restoreStudentToGroup(studentGroupId);
}

/**
 * Actualiza el estado de un estudiante en un grupo
 */
export function updateStudentGroupStatus(
    studentGroupId: number,
    statusId: number,
): Promise<{ success: boolean; error?: any }> {
    return groupStudentsRepository.updateStudentGroupStatus(studentGroupId, statusId);
}

/**
 * Obtiene los estudiantes disponibles para asignar a un nuevo grupo
 */
export function getAvailableStudentsForNewGroupAssignment(schoolId: number): Promise<Student[]> {
    return groupStudentsRepository.getAvailableStudentsForNewGroupAssignment(schoolId);
}
