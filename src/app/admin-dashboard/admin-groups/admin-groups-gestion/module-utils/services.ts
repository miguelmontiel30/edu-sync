// Repositorio
import {groupStudentsRepository} from './repository';

// Tipos
import {Student} from '@/app/admin-dashboard/admin-students/module-utils/types';

/**
 * Obtiene todos los estudiantes que no han sido eliminados del grupo.
 */
export function fetchActiveStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]> {
    return groupStudentsRepository.getActiveStudentsByGroup(groupId, schoolId);
}

/**
 * Asigna estudiantes a un grupo
 */
export function assignStudentsToGroup(
    groupId: number,
    studentIds: number[],
): Promise<{success: boolean; error?: any}> {
    return groupStudentsRepository.assignStudentsToGroup(groupId, studentIds);
}
