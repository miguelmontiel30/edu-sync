// Types
import {CycleData, SchoolCycle} from './types';

// Repository
import {schoolYearRepository} from './repository';

// Exportar funciones públicas que utilizan el repositorio
export async function loadAllSchoolYearData(
    schoolId: number,
): Promise<{active: SchoolCycle[]; deleted: SchoolCycle[]}> {
    return schoolYearRepository.getAllCyclesBySchoolId(schoolId);
}

// Mantenemos estas funciones por compatibilidad, pero ahora utilizan el repositorio
export async function loadSchoolYearsBySchoolId(schoolId: number): Promise<SchoolCycle[]> {
    const {active} = await schoolYearRepository.getAllCyclesBySchoolId(schoolId);
    return active;
}

export async function loadDeletedCycles(schoolId: number): Promise<SchoolCycle[]> {
    const {deleted} = await schoolYearRepository.getAllCyclesBySchoolId(schoolId);
    return deleted;
}

export async function saveCycle(cycle: CycleData, cycleId?: number): Promise<void> {
    return schoolYearRepository.saveCycle(cycle, cycleId);
}

export async function deleteCycle(id: number): Promise<void> {
    return schoolYearRepository.deleteCycle(id);
}

export async function restoreCycle(id: number): Promise<void> {
    return schoolYearRepository.restoreCycle(id);
}
