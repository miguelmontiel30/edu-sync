// Types
import { CycleData, SchoolCycle } from './types';

// Repository
import { schoolYearRepository } from './repository';

/**
 * Cargar todos los datos de ciclos escolares (activos y eliminados)
 * @param schoolId - ID de la escuela
 * @returns Lista de ciclos escolares activos y eliminados
 */
export function loadAllSchoolYearData(
    schoolId: number,
): Promise<{ active: SchoolCycle[]; deleted: SchoolCycle[] }> {
    return schoolYearRepository.getAllCyclesBySchoolId(schoolId);
}

export async function loadSchoolYearsBySchoolId(schoolId: number): Promise<SchoolCycle[]> {
    const { active } = await schoolYearRepository.getAllCyclesBySchoolId(schoolId);
    return active;
}

export async function loadDeletedCycles(schoolId: number): Promise<SchoolCycle[]> {
    const { deleted } = await schoolYearRepository.getAllCyclesBySchoolId(schoolId);
    return deleted;
}

/**
 * Guardar ciclo escolar (crear o actualizar)
 * @param cycle - Datos del ciclo a guardar
 * @param cycleId - ID del ciclo (opcional)
 * @param userId - ID del usuario (opcional)
 */
export function saveCycle(cycle: CycleData, cycleId?: number, userId?: string): Promise<void> {
    return schoolYearRepository.saveCycle(cycle, cycleId, userId);
}

/**
 * Eliminar ciclo escolar
 * @param id - ID del ciclo a eliminar
 */
export function deleteCycle(id: number): Promise<void> {
    return schoolYearRepository.deleteCycle(id);
}

/**
 * Restaurar ciclo escolar eliminado
 * @param id - ID del ciclo a restaurar
 */
export function restoreCycle(id: number): Promise<void> {
    return schoolYearRepository.restoreCycle(id);
}

// Cache para almacenar las calificaciones calculadas
const gradeCache = new Map<string, number>();

/**
 * Calcular la calificación promedio para un conjunto de grupos
 * @param groupIds - Array de IDs de grupos
 * @returns Promedio de calificaciones
 */
export async function calculateAverageGrade(groupIds: number[]): Promise<number> {
    if (groupIds.length === 0) return 0;

    // Clave única para este conjunto de grupos
    const cacheKey = groupIds.sort().join('-');

    // Verificar cache primero
    if (gradeCache.has(cacheKey)) {
        return gradeCache.get(cacheKey) || 0;
    }

    try {
        // Obtener datos de calificaciones desde el repositorio
        const { totalGrade, gradesCount } = await schoolYearRepository.getGroupGrades(groupIds);

        // Calcular promedio
        const average = gradesCount > 0 ? totalGrade / gradesCount : 0;

        // Guardar en cache
        gradeCache.set(cacheKey, average);

        return average;
    } catch (error) {
        console.error('Error al calcular el promedio de calificaciones:', error);
        return 0;
    }
}
