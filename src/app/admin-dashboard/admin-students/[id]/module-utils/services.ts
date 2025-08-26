import {studentRepository} from './repository';
import {StudentProfile} from './types';

/**
 * Obtiene el perfil completo de un estudiante con todas sus relaciones
 * @param studentId ID del estudiante
 * @returns Perfil completo del estudiante
 */
export async function getStudentProfile(studentId: string): Promise<StudentProfile> {
    return await studentRepository.getStudentProfile(studentId);
}

/**
 * Actualiza la información básica de un estudiante
 * @param studentId ID del estudiante
 * @param data Datos a actualizar
 * @returns Objeto indicando éxito o error
 */
export async function updateStudentBasicInfo(
    studentId: number,
    data: any,
): Promise<{success: boolean; error?: any}> {
    return await studentRepository.updateStudentInfo(studentId, data);
}
