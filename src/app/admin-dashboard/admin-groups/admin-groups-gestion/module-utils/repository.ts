// Supabase Client
import {supabaseClient} from '@/services/config/supabaseClient';

// Types
import {STUDENT_GROUP_STATUS} from './types';
import {Student} from '@/app/admin-dashboard/admin-students/module-utils/types';

// Definición de la interfaz del repositorio
export interface IGroupStudentsRepository {
    getActiveStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]>;
    assignStudentsToGroup(
        groupId: number,
        studentIds: number[],
    ): Promise<{success: boolean; error?: any}>;
    removeStudentFromGroup(studentGroupId: number): Promise<{success: boolean; error?: any}>;
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
     * Base query para obtener estudiantes con sus relaciones
     * @returns QueryBuilder
     */
    private baseStudentQuery() {
        return supabaseClient.from('students').select(`
            *,
            gender:gender_id (
                gender_id,
                code,
                name
            ),
            status:status_id (
                status_id,
                code,
                name,
                category
            )
        `);
    }

    /**
     * Obtiene los estudiantes activos que están asignados a un grupo específico,
     * incluyendo el ID y estado de su asignación a ese grupo.
     * @param groupId - El ID del grupo para el cual se desea obtener los estudiantes
     * @param schoolId - El ID de la escuela para la cual se desea obtener los estudiantes
     * @returns Un array de estudiantes activos asignados al grupo seleccionado con detalles de la asignación.
     */
    async getActiveStudentsByGroup(groupId: number, schoolId: number): Promise<Student[]> {
        try {
            // Primero, verifiquemos si podemos obtener información de estados directamente
            console.log('Verificando si podemos acceder a la tabla de estados...');
            const {data: statusesData, error: statusesError} = await supabaseClient
                .from('status')
                .select('*')
                .limit(5);

            if (statusesError) {
                console.error('Error al verificar estados:', statusesError);
            } else {
                console.log('Datos de estados disponibles:', statusesData);
            }

            // Obtenemos los detalles de asignación de estudiantes al grupo seleccionado
            // Modificamos la consulta para obtener el status directamente de la tabla status
            const {data: assignedStudentGroupDetails, error: assignedError} = await supabaseClient
                .from('student_groups')
                .select(
                    `
                    student_id, 
                    student_group_id, 
                    status_id
                `,
                )
                .eq('delete_flag', false)
                .eq('group_id', groupId);

            if (assignedError) throw assignedError;
            if (!assignedStudentGroupDetails || assignedStudentGroupDetails.length === 0) return [];

            console.log('Asignaciones encontradas:', assignedStudentGroupDetails.length);

            // Obtenemos todos los status_id únicos para hacer una sola consulta a la tabla status
            const uniqueStatusIds = [
                ...new Set(assignedStudentGroupDetails.map(sg => sg.status_id)),
            ];
            console.log('Status IDs únicos:', uniqueStatusIds);

            // Obtenemos la información de estados en una consulta separada
            const {data: statusesInfo, error: statusesInfoError} = await supabaseClient
                .from('status')
                .select('*')
                .in('status_id', uniqueStatusIds);

            if (statusesInfoError) {
                console.error('Error al obtener información de estados:', statusesInfoError);
            }

            console.log('Información de estados obtenida:', statusesInfo);

            // Creamos un mapa para acceso rápido a la información de estados
            const statusMap = new Map();
            if (statusesInfo && statusesInfo.length > 0) {
                statusesInfo.forEach(status => {
                    statusMap.set(status.status_id, {
                        status_id: status.status_id,
                        code: status.code,
                        name: status.name,
                        category: status.category,
                    });
                });
            }

            // Creamos un mapa para fácil acceso a los detalles de asignación por student_id
            const studentAssignmentDetailsMap = new Map(
                assignedStudentGroupDetails.map(detail => {
                    // Obtenemos información del estado desde nuestro mapa
                    const statusInfo = statusMap.get(detail.status_id);

                    console.log(`Datos para student_id ${detail.student_id}:`, {
                        student_group_id: detail.student_group_id,
                        status_id: detail.status_id,
                        statusInfo,
                    });

                    return [
                        detail.student_id,
                        {
                            student_group_id: detail.student_group_id,
                            student_group_status_id: detail.status_id,
                            student_group_status: statusInfo || null,
                        },
                    ];
                }),
            );

            const studentIds = assignedStudentGroupDetails.map(sg => sg.student_id);

            // Consultamos los detalles completos de estos estudiantes
            const {data, error} = await this.baseStudentQuery()
                .eq('delete_flag', false)
                .eq('school_id', schoolId)
                .in('student_id', studentIds)
                .order('first_name', {ascending: true});

            if (error) throw error;
            if (!data || data.length === 0) return [];

            // Transformamos los datos para el formato esperado Student, añadiendo detalles de asignación
            const result = data.map(student => {
                const assignmentInfo = studentAssignmentDetailsMap.get(student.student_id);
                const mappedStudent = {
                    id: student.student_id,
                    school_id: student.school_id,
                    first_name: student.first_name,
                    father_last_name: student.father_last_name,
                    mother_last_name: student.mother_last_name,
                    birth_date: student.birth_date,
                    gender_id: student.gender_id,
                    gender: student.gender
                        ? {
                              id: student.gender.gender_id,
                              code: student.gender.code,
                              name: student.gender.name,
                          }
                        : undefined,
                    curp: student.curp,
                    phone: student.phone,
                    email: student.email,
                    image_url: student.image_url,
                    status_id: student.status_id,
                    status: student.status
                        ? {
                              status_id: student.status.status_id,
                              code: student.status.code,
                              name: student.status.name,
                              category: student.status.category,
                          }
                        : undefined,
                    delete_flag: student.delete_flag,
                    created_at: student.created_at,
                    updated_at: student.updated_at,
                    deleted_at: student.deleted_at,
                    student_group_id: assignmentInfo?.student_group_id, // ID de la tabla student_groups
                    student_group_status_id: assignmentInfo?.student_group_status_id, // status_id de student_groups
                    student_group_status: assignmentInfo?.student_group_status, // Información completa del status
                };

                console.log(`Estudiante mapeado ${student.student_id}:`, {
                    student_group_status_id: mappedStudent.student_group_status_id,
                    student_group_status: mappedStudent.student_group_status,
                });

                return mappedStudent;
            });

            console.log('Total de estudiantes procesados:', result.length);
            return result;
        } catch (error) {
            console.error('Error al obtener estudiantes activos por grupo:', error);
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
            // Verificamos que haya estudiantes para asignar
            if (!studentIds || studentIds.length === 0) {
                return {success: false, error: 'No se proporcionaron estudiantes para asignar'};
            }

            // Preparamos los registros a insertar
            const currentDate = new Date().toISOString();

            const studentGroupRecords = studentIds.map(studentId => ({
                student_id: studentId,
                group_id: groupId,
                enrollment_date: currentDate.split('T')[0], // Formato YYYY-MM-DD
                status_id: STUDENT_GROUP_STATUS.STUDENT_GROUP_ACTIVE,
                delete_flag: false,
                created_at: currentDate,
                updated_at: currentDate,
            }));

            // Insertamos los registros en la tabla student_groups
            const {error} = await supabaseClient.from('student_groups').insert(studentGroupRecords);

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
            const currentDate = new Date().toISOString();

            const {error} = await supabaseClient
                .from('student_groups')
                .update({
                    delete_flag: true,
                    updated_at: currentDate,
                    deleted_at: currentDate,
                })
                .eq('student_group_id', studentGroupId);

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
            const {error} = await supabaseClient
                .from('student_groups')
                .update({
                    status_id: statusId,
                    updated_at: new Date().toISOString(),
                })
                .eq('student_group_id', studentGroupId);

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
            const {count, error} = await supabaseClient
                .from('student_groups')
                .select('*', {count: 'exact', head: true})
                .eq('group_id', groupId)
                .eq('delete_flag', false)
                .eq('status_id', STUDENT_GROUP_STATUS.STUDENT_GROUP_ACTIVE); // Usar constante

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
            const {data: activeStudentGroupEntries, error: activeStudentGroupError} =
                await supabaseClient
                    .from('student_groups')
                    .select('student_id')
                    .eq('delete_flag', false)
                    .eq('status_id', STUDENT_GROUP_STATUS.STUDENT_GROUP_ACTIVE);

            if (activeStudentGroupError) {
                console.error(
                    'Error al obtener IDs de estudiantes en grupos activos:',
                    activeStudentGroupError,
                );
                throw activeStudentGroupError;
            }

            const activelyAssignedStudentIds = activeStudentGroupEntries
                ? activeStudentGroupEntries.map(sg => sg.student_id)
                : [];

            // 2. Construir la consulta para estudiantes disponibles
            let query = this.baseStudentQuery()
                .eq('delete_flag', false)
                .eq('school_id', schoolId)
                .order('first_name', {ascending: true});

            // Si hay estudiantes activamente asignados, excluirlos
            if (activelyAssignedStudentIds.length > 0) {
                query = query.not('student_id', 'in', `(${activelyAssignedStudentIds.join(',')})`);
            }

            const {data, error} = await query;

            if (error) {
                console.error('Error al obtener estudiantes disponibles para asignación:', error);
                throw error;
            }

            if (!data || data.length === 0) return [];

            // 3. Transformar los datos al formato Student
            return data.map(student => ({
                id: student.student_id,
                school_id: student.school_id,
                first_name: student.first_name,
                father_last_name: student.father_last_name,
                mother_last_name: student.mother_last_name,
                birth_date: student.birth_date,
                gender_id: student.gender_id,
                gender: student.gender
                    ? {
                          id: student.gender.gender_id,
                          code: student.gender.code,
                          name: student.gender.name,
                      }
                    : undefined,
                curp: student.curp,
                phone: student.phone,
                email: student.email,
                image_url: student.image_url,
                status_id: student.status_id,
                status: student.status
                    ? {
                          status_id: student.status.status_id,
                          code: student.status.code,
                          name: student.status.name,
                          category: student.status.category,
                      }
                    : undefined,
                delete_flag: student.delete_flag,
                created_at: student.created_at,
                updated_at: student.updated_at,
                deleted_at: student.deleted_at,
            }));
        } catch (error) {
            console.error('Error general en getAvailableStudentsForNewGroupAssignment:', error);
            throw error;
        }
    }
}

// Creamos una instancia única del repositorio
export const groupStudentsRepository = new GroupStudentsRepository();
