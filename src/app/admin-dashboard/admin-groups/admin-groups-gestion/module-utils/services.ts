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
