// Types
import { Group, GroupFormData } from './types';

// Repository
import { groupRepository } from './repository';

// Exportar funciones públicas que utilizan el repositorio
export async function loadAllGroupsData(
    schoolId: number,
): Promise<{ active: Group[]; deleted: Group[] }> {
    return await groupRepository.getAllGroupsBySchoolId(schoolId);
}

export async function loadDeletedGroups(schoolId: number): Promise<Group[]> {
    const { deleted } = await groupRepository.getAllGroupsBySchoolId(schoolId);
    return deleted;
}

export async function saveGroup(
    group: GroupFormData,
    schoolId: number,
    groupId: number,
): Promise<void> {
    return await groupRepository.saveGroup(group, schoolId, groupId);
}

export function deleteGroup(id: number): Promise<void> {
    return groupRepository.deleteGroup(id);
}

export function restoreGroup(id: number): Promise<void> {
    return groupRepository.restoreGroup(id);
}
