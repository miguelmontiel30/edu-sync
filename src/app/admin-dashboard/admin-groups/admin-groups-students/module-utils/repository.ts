// Types
import {STUDENT_GROUP_STATUS} from './types';
import {Student} from '@/app/admin-dashboard/admin-students/module-utils/types';
import statusService from '@/services/status/statusService';

// Utils
import {
    createStatusMap,
    mapToStudent,
    createStudentGroupMap,
    generateStudentGroupRecords,
    getCurrentDateFormatted,
} from './utils';

// Queries
import {
    getStudentGroupAssignments,
    getStudentsByIdsAndSchool,
    getActiveStudentGroupAssignments,
    getStudentCountInGroupByStatus,
    insertStudentGroupRecords,
    updateStudentGroupStatus as updateStudentGroupStatusQuery,
    removeStudentFromGroup as removeStudentFromGroupQuery,
    baseStudentQuery,
    getDeletedStudentGroupAssignments,
    getInactiveStudentGroupAssignments,
    restoreStudentFromGroup as restoreStudentFromGroupQuery,
} from './queries';

// Tipo para las asignaciones de estudiantes a grupos
interface StudentGroupEntry {
    student_id: number;
    student_group_id: number;
    status_id: number;
}

// Definición de la interfaz del repositorio
export interface IGroupStudentsRepository {
    getActiveStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]>;
    getInactiveStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]>;
    getDeletedStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]>;
    assignStudentsToGroup(
        groupId: number,
        studentIds: number[],
    ): Promise<{success: boolean; error?: any}>;
    removeStudentFromGroup(studentGroupId: number): Promise<{success: boolean; error?: any}>;
    restoreStudentToGroup(studentGroupId: number): Promise<{success: boolean; error?: any}>;
    updateStudentGroupStatus(
        studentGroupId: number,
        statusId: number,
    ): Promise<{success: boolean; error?: any}>;
    getStudentCountInGroup(groupId: number): Promise<number>;
    getAvailableStudentsForNewGroupAssignment(schoolId: number): Promise<Student[]>;
}

/**
 * Repositorio para gestionar asignaciones de estudiantes a grupos
 */
export class GroupStudentsRepository implements IGroupStudentsRepository {
    /**
     * Obtiene los estudiantes activos que están asignados a un grupo específico,
     * incluyendo el ID y estado de su asignación a ese grupo.
     * @param groupId - El ID del grupo para el cual se desea obtener los estudiantes
     * @param schoolId - El ID de la escuela para la cual se desea obtener los estudiantes
     * @returns Un array de estudiantes activos asignados al grupo seleccionado con detalles de la asignación.
     */
    async getActiveStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]> {
        try {
            // 1. Obtener estados relevantes del servicio de estados (caché)
            const studentGroupStatuses = await statusService.getStudentGroupStatuses();
            const statusMap = createStatusMap(studentGroupStatuses);

            // 2. Obtener asignaciones de estudiantes al grupo
            const {data: studentGroupEntries, error: studentGroupError} =
                await getStudentGroupAssignments(groupId);

            if (studentGroupError) throw studentGroupError;
            if (!studentGroupEntries || studentGroupEntries.length === 0) return [];

            // 3. Filtrar solo estudiantes activos
            const activeStudentGroupEntries = studentGroupEntries.filter(
                (sg: StudentGroupEntry) =>
                    sg.status_id === STUDENT_GROUP_STATUS.STUDENT_GROUP_ACTIVE,
            );

            if (activeStudentGroupEntries.length === 0) return [];

            // 4. Preparar IDs y mapa de asignaciones
            const studentIds = activeStudentGroupEntries.map(
                (sg: StudentGroupEntry) => sg.student_id,
            );
            const studentGroupMap = createStudentGroupMap(activeStudentGroupEntries, statusMap);

            // 5. Obtener detalles de los estudiantes
            const {data: studentsData, error: studentsError} = await getStudentsByIdsAndSchool(
                studentIds,
                schoolId,
            );

            if (studentsError) throw studentsError;
            if (!studentsData || studentsData.length === 0) return [];

            // 6. Mapear estudiantes con sus asignaciones
            return studentsData.map(student =>
                mapToStudent(student, studentGroupMap.get(student.student_id)),
            );
        } catch (error) {
            console.error('Error al obtener estudiantes activos por grupo:', error);
            throw error;
        }
    }

    /**
     * Obtiene los estudiantes inactivos (no activos, no eliminados) que están asignados a un grupo específico.
     * @param groupId - El ID del grupo para el cual se desea obtener los estudiantes
     * @param schoolId - El ID de la escuela para la cual se desea obtener los estudiantes
     * @returns Un array de estudiantes inactivos asignados al grupo seleccionado.
     */
    async getInactiveStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]> {
        try {
            // 1. Obtener estados relevantes del servicio de estados (caché)
            const studentGroupStatuses = await statusService.getStudentGroupStatuses();
            const statusMap = createStatusMap(studentGroupStatuses);

            // 2. Obtener asignaciones inactivas de estudiantes al grupo
            const {data: studentGroupEntries, error: studentGroupError} =
                await getInactiveStudentGroupAssignments(groupId);

            if (studentGroupError) throw studentGroupError;
            if (!studentGroupEntries || studentGroupEntries.length === 0) return [];

            // 3. Preparar IDs y mapa de asignaciones
            const studentIds = studentGroupEntries.map((sg: StudentGroupEntry) => sg.student_id);
            const studentGroupMap = createStudentGroupMap(studentGroupEntries, statusMap);

            // 4. Obtener detalles de los estudiantes
            const {data: studentsData, error: studentsError} = await getStudentsByIdsAndSchool(
                studentIds,
                schoolId,
            );

            if (studentsError) throw studentsError;
            if (!studentsData || studentsData.length === 0) return [];

            // 5. Mapear estudiantes con sus asignaciones
            return studentsData.map(student =>
                mapToStudent(student, studentGroupMap.get(student.student_id)),
            );
        } catch (error) {
            console.error('Error al obtener estudiantes inactivos por grupo:', error);
            throw error;
        }
    }

    /**
     * Obtiene los estudiantes eliminados (delete_flag = true) del grupo.
     * @param groupId - El ID del grupo para el cual se desea obtener los estudiantes eliminados
     * @param schoolId - El ID de la escuela para la cual se desea obtener los estudiantes
     * @returns Un array de estudiantes eliminados asignados al grupo seleccionado.
     */
    async getDeletedStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]> {
        try {
            // 1. Obtener estados relevantes del servicio de estados (caché)
            const studentGroupStatuses = await statusService.getStudentGroupStatuses();
            const statusMap = createStatusMap(studentGroupStatuses);

            // 2. Obtener asignaciones eliminadas de estudiantes al grupo
            const {data: studentGroupEntries, error: studentGroupError} =
                await getDeletedStudentGroupAssignments(groupId);

            if (studentGroupError) throw studentGroupError;
            if (!studentGroupEntries || studentGroupEntries.length === 0) return [];

            // 3. Preparar IDs y mapa de asignaciones
            const studentIds = studentGroupEntries.map((sg: StudentGroupEntry) => sg.student_id);
            const studentGroupMap = createStudentGroupMap(studentGroupEntries, statusMap);

            // 4. Obtener detalles de los estudiantes
            const {data: studentsData, error: studentsError} = await getStudentsByIdsAndSchool(
                studentIds,
                schoolId,
            );

            if (studentsError) throw studentsError;
            if (!studentsData || studentsData.length === 0) return [];

            // 5. Mapear estudiantes con sus asignaciones
            return studentsData.map(student =>
                mapToStudent(student, studentGroupMap.get(student.student_id)),
            );
        } catch (error) {
            console.error('Error al obtener estudiantes eliminados por grupo:', error);
            throw error;
        }
    }

    /**
     * Asigna múltiples estudiantes a un grupo
     * @param groupId ID del grupo
     * @param studentIds IDs de los estudiantes a asignar
     * @returns Resultado de la operación
     */
    async assignStudentsToGroup(
        groupId: number,
        studentIds: number[],
    ): Promise<{success: boolean; error?: any}> {
        try {
            if (!studentIds || studentIds.length === 0) {
                return {success: false, error: 'No se proporcionaron estudiantes para asignar'};
            }

            // Generar registros a insertar
            const studentGroupRecords = generateStudentGroupRecords(
                studentIds,
                groupId,
                STUDENT_GROUP_STATUS.STUDENT_GROUP_ACTIVE,
            );

            // Insertar registros
            const {error} = await insertStudentGroupRecords(studentGroupRecords);

            if (error) {
                console.error('Error al asignar estudiantes al grupo:', error);
                return {success: false, error};
            }

            return {success: true};
        } catch (error) {
            console.error('Error al asignar estudiantes al grupo:', error);
            return {success: false, error};
        }
    }

    /**
     * Elimina un estudiante de un grupo (borrado lógico)
     * @param studentGroupId ID de la relación estudiante-grupo
     * @returns Resultado de la operación
     */
    async removeStudentFromGroup(studentGroupId: number): Promise<{success: boolean; error?: any}> {
        try {
            const {isoDate} = getCurrentDateFormatted();
            const {error} = await removeStudentFromGroupQuery(studentGroupId, isoDate);

            if (error) {
                console.error('Error al eliminar estudiante del grupo:', error);
                return {success: false, error};
            }

            return {success: true};
        } catch (error) {
            console.error('Error al eliminar estudiante del grupo:', error);
            return {success: false, error};
        }
    }

    /**
     * Restaura un estudiante eliminado del grupo y lo marca como activo
     * @param studentGroupId ID de la relación estudiante-grupo
     * @returns Resultado de la operación
     */
    async restoreStudentToGroup(studentGroupId: number): Promise<{success: boolean; error?: any}> {
        try {
            const {isoDate} = getCurrentDateFormatted();
            const {error} = await restoreStudentFromGroupQuery(
                studentGroupId,
                STUDENT_GROUP_STATUS.STUDENT_GROUP_ACTIVE,
                isoDate,
            );

            if (error) {
                console.error('Error al restaurar estudiante al grupo:', error);
                return {success: false, error};
            }

            return {success: true};
        } catch (error) {
            console.error('Error al restaurar estudiante al grupo:', error);
            return {success: false, error};
        }
    }

    /**
     * Actualiza el estado de un estudiante en un grupo
     * @param studentGroupId ID de la relación estudiante-grupo
     * @param statusId Nuevo ID de estado
     * @returns Resultado de la operación
     */
    async updateStudentGroupStatus(
        studentGroupId: number,
        statusId: number,
    ): Promise<{success: boolean; error?: any}> {
        try {
            const {isoDate} = getCurrentDateFormatted();
            const {error} = await updateStudentGroupStatusQuery(studentGroupId, statusId, isoDate);

            if (error) {
                console.error('Error al actualizar estado del estudiante en el grupo:', error);
                return {success: false, error};
            }

            return {success: true};
        } catch (error) {
            console.error('Error al actualizar estado del estudiante en el grupo:', error);
            return {success: false, error};
        }
    }

    /**
     * Obtiene el conteo de estudiantes por grupo
     * @param groupId ID del grupo
     * @returns Número de estudiantes en el grupo
     */
    async getStudentCountInGroup(groupId: number): Promise<number> {
        try {
            const {count, error} = await getStudentCountInGroupByStatus(
                groupId,
                STUDENT_GROUP_STATUS.STUDENT_GROUP_ACTIVE,
            );

            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error('Error al obtener conteo de estudiantes:', error);
            return 0;
        }
    }

    /**
     * Obtiene los estudiantes activos de una escuela que no están asignados activamente a ningún grupo.
     * @param schoolId - El ID de la escuela.
     * @returns Un array de estudiantes disponibles para ser asignados a un nuevo grupo.
     */
    async getAvailableStudentsForNewGroupAssignment(schoolId: number): Promise<Student[]> {
        try {
            // 1. Obtener IDs de estudiantes que ya están en un grupo activo
            const {data: activeStudentGroups, error: activeStudentGroupError} =
                await getActiveStudentGroupAssignments(STUDENT_GROUP_STATUS.STUDENT_GROUP_ACTIVE);

            if (activeStudentGroupError) throw activeStudentGroupError;
            const assignedStudentIds = activeStudentGroups?.map(sg => sg.student_id) || [];

            // 2. Construir la consulta para estudiantes disponibles
            let query = baseStudentQuery()
                .eq('delete_flag', false)
                .eq('school_id', schoolId)
                .order('first_name', {ascending: true});

            // Si hay estudiantes activamente asignados, excluirlos
            if (assignedStudentIds.length > 0) {
                query = query.not('student_id', 'in', `(${assignedStudentIds.join(',')})`);
            }

            const {data, error} = await query;

            if (error) throw error;
            if (!data || data.length === 0) return [];

            // 3. Mapear a formato Student
            return data.map(student => mapToStudent(student));
        } catch (error) {
            console.error('Error en getAvailableStudentsForNewGroupAssignment:', error);
            throw error;
        }
    }
}

// Creamos una instancia única del repositorio
export const groupStudentsRepository = new GroupStudentsRepository();
