// Types
import {Subject, SubjectData} from './types';

// Repository
import {subjectRepository} from './repository';

/**
 * Cargar todos los datos de materias (activas y eliminadas)
 * @param schoolId - ID de la escuela
 * @returns Lista de materias activas y eliminadas
 */
export async function loadAllSubjectsData(
    schoolId: number,
): Promise<{active: Subject[]; deleted: Subject[]}> {
    return subjectRepository.getAllSubjectsBySchoolId(schoolId);
}

// Funciones individuales para compatibilidad
export async function loadSubjectsBySchoolId(schoolId: number): Promise<Subject[]> {
    const {active} = await subjectRepository.getAllSubjectsBySchoolId(schoolId);
    return active;
}

export async function loadDeletedSubjects(schoolId: number): Promise<Subject[]> {
    const {deleted} = await subjectRepository.getAllSubjectsBySchoolId(schoolId);
    return deleted;
}

/**
 * Guardar materia (crear o actualizar)
 * @param subject - Datos de la materia a guardar
 * @param subjectId - ID de la materia (opcional)
 * @param userId - ID del usuario (opcional)
 */
export async function saveSubject(
    subject: SubjectData,
    subjectId?: number,
    userId?: string,
): Promise<void> {
    return subjectRepository.saveSubject(subject, subjectId, userId);
}

/**
 * Eliminar materia
 * @param id - ID de la materia a eliminar
 */
export async function deleteSubject(id: number): Promise<void> {
    return subjectRepository.deleteSubject(id);
}

/**
 * Restaurar materia eliminada
 * @param id - ID de la materia a restaurar
 */
export async function restoreSubject(id: number): Promise<void> {
    return subjectRepository.restoreSubject(id);
}

// Cache para almacenar las calificaciones calculadas
const gradeCache = new Map<number, number>();

/**
 * Calcular la calificación promedio para una materia
 * @param subjectId - ID de la materia
 * @returns Promedio de calificaciones
 */
export async function getSubjectAverageGrade(subjectId: number): Promise<number> {
    // Verificar cache primero
    if (gradeCache.has(subjectId)) {
        return gradeCache.get(subjectId) || 0;
    }

    try {
        // Obtener datos de calificaciones desde el repositorio
        const {averageGrade} = await subjectRepository.getSubjectGrades(subjectId);

        // Guardar en cache
        gradeCache.set(subjectId, averageGrade);

        return averageGrade;
    } catch (error) {
        return 0;
    }
}
