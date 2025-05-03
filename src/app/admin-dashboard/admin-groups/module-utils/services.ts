// Types
import {Group, GroupFormData} from './types';

// Repository
import {groupRepository} from './repository';

// Exportar funciones públicas que utilizan el repositorio
export async function loadAllGroupsData(
    schoolId: number,
): Promise<{active: Group[]; deleted: Group[]}> {
    return groupRepository.getAllGroupsBySchoolId(schoolId);
}

export async function loadDeletedGroups(schoolId: number): Promise<Group[]> {
    const {deleted} = await groupRepository.getAllGroupsBySchoolId(schoolId);
    return deleted;
}

export async function saveGroup(
    group: GroupFormData,
    schoolId: number,
    groupId: number,
): Promise<void> {
    return groupRepository.saveGroup(group, schoolId, groupId);
}

export async function deleteGroup(id: number): Promise<void> {
    return groupRepository.deleteGroup(id);
}

export async function restoreGroup(id: number): Promise<void> {
    return groupRepository.restoreGroup(id);
}
