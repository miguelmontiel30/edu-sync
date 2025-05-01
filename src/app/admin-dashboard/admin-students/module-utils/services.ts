import {Student, StudentFormData, StudentGroup} from './types';
import {studentRepository} from './repository';

/**
 * Carga todos los datos de estudiantes (activos y eliminados)
 */
export async function loadAllStudentsData(): Promise<{
    active: Student[];
    deleted: Student[];
}> {
    // Obtener estudiantes activos
    const active = await studentRepository.getActiveStudents();

    // Obtener estudiantes eliminados
    const deleted = await studentRepository.getDeletedStudents();

    // Retornar los datos
    return {active, deleted};
}

/**
 * Obtiene todos los estudiantes activos
 */
export async function fetchActiveStudents(): Promise<Student[]> {
    return studentRepository.getActiveStudents();
}

/**
 * Obtiene todos los estudiantes eliminados
 */
export async function fetchDeletedStudents(): Promise<Student[]> {
    return studentRepository.getDeletedStudents();
}

/**
 * Guarda un estudiante (crear o actualizar)
 */
export async function saveStudent(studentData: StudentFormData): Promise<number> {
    return studentRepository.saveStudent(studentData);
}

/**
 * Elimina lógicamente un estudiante
 */
export async function deleteStudent(studentId: number): Promise<void> {
    return studentRepository.deleteStudent(studentId);
}

/**
 * Restaura un estudiante eliminado
 */
export async function restoreStudent(studentId: number): Promise<void> {
    return studentRepository.restoreStudent(studentId);
}

/**
 * Obtiene los grupos asignados a un estudiante
 */
export async function fetchStudentGroups(studentId: number): Promise<StudentGroup[]> {
    return studentRepository.getStudentGroups(studentId);
}

/**
 * Obtiene todos los grupos de estudiantes activos
 */
export async function fetchActiveStudentGroups(): Promise<StudentGroup[]> {
    return studentRepository.getAllActiveStudentGroups();
}
