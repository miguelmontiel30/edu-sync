import {Student, StudentFormData, StudentGroup} from './types';
import {studentRepository} from './repository';

/**
 * Carga todos los datos de estudiantes (activos y eliminados)
 */
export async function loadAllStudentsData(schoolId: number): Promise<{
    active: Student[];
    deleted: Student[];
}> {
    // Obtener estudiantes activos
    const active = await studentRepository.getActiveStudents(schoolId);

    // Obtener estudiantes eliminados
    const deleted = await studentRepository.getDeletedStudents();

    // Retornar los datos
    return {active, deleted};
}

/**
 * Obtiene todos los estudiantes activos
 */
export function fetchActiveStudents(schoolId: number): Promise<Student[]> {
    return studentRepository.getActiveStudents(schoolId);
}

/**
 * Obtiene todos los estudiantes eliminados
 */
export function fetchDeletedStudents(): Promise<Student[]> {
    return studentRepository.getDeletedStudents();
}

/**
 * Guarda un estudiante (crear o actualizar)
 */
export function saveStudent(studentData: StudentFormData): Promise<number> {
    return studentRepository.saveStudent(studentData);
}

/**
 * Elimina lógicamente un estudiante
 */
export function deleteStudent(studentId: number): Promise<void> {
    return studentRepository.deleteStudent(studentId);
}

/**
 * Restaura un estudiante eliminado
 */
export function restoreStudent(studentId: number): Promise<void> {
    return studentRepository.restoreStudent(studentId);
}

/**
 * Obtiene los grupos asignados a un estudiante
 */
export function fetchStudentGroups(studentId: number): Promise<StudentGroup[]> {
    return studentRepository.getStudentGroups(studentId);
}

/**
 * Obtiene todos los grupos de estudiantes activos
 */
export function fetchActiveStudentGroups(): Promise<StudentGroup[]> {
    return studentRepository.getAllActiveStudentGroups();
}
