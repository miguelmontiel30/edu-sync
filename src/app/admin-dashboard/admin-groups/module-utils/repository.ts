// Supabase Client
import {supabaseClient} from '@/services/config/supabaseClient';

// Types
import {Group, GROUP_STATUS, GroupFormData} from './types';

/**
 * Interfaz del repositorio de grupos
 * Define las operaciones disponibles para interactuar con los grupos
 */
export interface IGroupRepository {
    /** Obtiene todos los grupos activos y eliminados de una escuela */
    getAllGroupsBySchoolId(schoolId: number): Promise<{active: Group[]; deleted: Group[]}>;

    /** Guarda un grupo nuevo o actualiza uno existente */
    saveGroup(groupData: GroupFormData, schoolId?: number, groupId?: number): Promise<void>;

    /** Marca un grupo como eliminado */
    deleteGroup(id: number): Promise<void>;

    /** Restaura un grupo previamente eliminado */
    restoreGroup(id: number): Promise<void>;
}

/**
 * Implementación del repositorio de grupos utilizando Supabase
 */
export class SupabaseGroupRepository implements IGroupRepository {
    // Mapas de estados para conversión de IDs a nombres legibles
    private statusMap: {[key: string]: string} = {
        [GROUP_STATUS.ACTIVE]: 'Activo',
        [GROUP_STATUS.INACTIVE]: 'Inactivo',
        [GROUP_STATUS.COMPLETED]: 'Finalizado',
    };

    /**
     * Convierte el ID de status a un nombre legible para ciclos escolares
     */
    private getSchoolYearStatusName(statusId: string | number): string {
        if (statusId === '1' || statusId === 1) return 'active';
        if (statusId === '2' || statusId === 2) return 'inactive';
        if (statusId === '3' || statusId === 3) return 'completed';
        return '';
    }

    /**
     * Construye la consulta base para obtener grupos con sus relaciones
     * @returns Query builder de Supabase
     */
    private baseQuery() {
        return supabaseClient.from('groups').select(`
                *,
                school_years (
                    school_year_id,
                    name,
                    start_date,
                    end_date,
                    status_id
                ),
                teacher:teacher_id (
                    teacher_id,
                    first_name,
                    father_last_name,
                    mother_last_name,
                    image_url
                ),
                student_groups (
                    students (
                        student_id,
                        first_name,
                        father_last_name,
                        mother_last_name,
                        created_at
                    )
                )
            `);
    }

    /**
     * Obtiene todos los grupos de una escuela
     * @param schoolId - ID de la escuela
     * @returns Objetos con grupos activos y eliminados
     */
    async getAllGroupsBySchoolId(schoolId: number): Promise<{active: Group[]; deleted: Group[]}> {
        try {
            // Realizar una sola consulta para ambos tipos de grupos
            const {data, error} = await this.baseQuery()
                .eq('school_id', schoolId)
                .order('created_at', {ascending: false});

            if (error) throw error;
            if (!data) return {active: [], deleted: []};

            // Procesar y filtrar los datos en memoria
            // @ts-ignore - Ignoramos el error de tipos aquí ya que sabemos que la estructura es correcta
            const formattedGroups = this.mapDatabaseToGroups(data);

            return {
                active: formattedGroups.filter(group => !group.deleteFlag),
                deleted: formattedGroups.filter(group => group.deleteFlag),
            };
        } catch (error) {
            console.error('Error al cargar los grupos:', error);
            throw error;
        }
    }

    /**
     * Mapea los datos crudos de la base de datos al formato de la aplicación
     * @param data - Datos de la base de datos
     * @returns Grupos formateados
     */
    private mapDatabaseToGroups(data: any[]): Group[] {
        return data.map(group => {
            // Extraer y procesar estudiantes
            const students = this.extractStudentsFromGroup(group);
            const recentStudents = this.getRecentStudents(students);

            // Formatear información del profesor
            const teachers = this.formatTeacherInfo(group);

            // Determinar el valor de estado a usar (status_id tiene prioridad si existe)
            const statusValue = group.status_id || group.status || '1';

            // Obtener el estado del ciclo escolar basado en status_id
            const schoolYearStatusId = group.school_years?.status_id || '';
            const schoolYearStatus = this.getSchoolYearStatusName(schoolYearStatusId);

            // Construir objeto de grupo con datos formateados
            return {
                id: group.group_id,
                grade: group.grade,
                group: group.group_name,
                teachers,
                schoolYear: {
                    id: group.school_years?.school_year_id || 0,
                    name: group.school_years?.name || 'Sin ciclo',
                    startDate: group.school_years?.start_date || '',
                    endDate: group.school_years?.end_date || '',
                    status: schoolYearStatus,
                    statusId: schoolYearStatusId,
                },
                studentsNumber: students.length,
                subjectsNumber: group.subjects_number || 0,
                status_id: statusValue,
                statusName: this.statusMap[statusValue] || 'Desconocido',
                generalAverage: 0, // Valor predeterminado
                attendancePercentage: 0,
                recentStudents: recentStudents.length,
                createdAt: group.created_at,
                updatedAt: group.updated_at,
                deleteFlag: group.delete_flag,
                deletedAt: group.deleted_at,
            };
        });
    }

    /**
     * Extrae la lista de estudiantes de un grupo
     * @param group - Datos del grupo
     * @returns Lista de estudiantes
     */
    private extractStudentsFromGroup(group: any): any[] {
        return group.student_groups?.map((sg: {students: any}) => sg.students).flat() || [];
    }

    /**
     * Filtra estudiantes recientes (últimos 30 días)
     * @param students - Lista de estudiantes
     * @returns Lista de estudiantes recientes
     */
    private getRecentStudents(students: any[]): any[] {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return students.filter((student: {created_at: string}) => {
            const studentDate = new Date(student.created_at);
            return studentDate >= thirtyDaysAgo;
        });
    }

    /**
     * Formatea la información del profesor titular
     * @param group - Datos del grupo
     * @returns Lista de profesores formateada
     */
    private formatTeacherInfo(
        group: any,
    ): Array<{id: number; name: string; role: string; image?: string}> {
        if (!group.teacher) return [];

        const teacherName = `${group.teacher.first_name} ${group.teacher.father_last_name} ${
            group.teacher.mother_last_name || ''
        }`.trim();

        return [
            {
                id: group.teacher.teacher_id,
                name: teacherName,
                role: 'Titular',
                image: group.teacher.image_url,
            },
        ];
    }

    /**
     * Guarda un grupo (nuevo o actualización)
     * @param groupData - Datos del grupo
     * @param schoolId - ID de la escuela
     * @param groupId - ID del grupo (opcional, para edición)
     */
    async saveGroup(groupData: GroupFormData, schoolId: number, groupId: number): Promise<void> {
        try {
            const parsedGrade = parseInt(groupData.grade);
            const parsedSchoolYearId = parseInt(groupData.schoolYearId);
            const statusId = groupData.statusId;

            // Preparar datos comunes para inserción/actualización
            const groupDataToSave = {
                grade: parsedGrade,
                group_name: groupData.group,
                school_year_id: parsedSchoolYearId,
                status_id: statusId,
                updated_at: new Date().toISOString(),
            };

            // Si tenemos groupId, es una actualización
            if (groupId) {
                // Actualizar grupo existente
                const {error} = await supabaseClient
                    .from('groups')
                    .update(groupDataToSave)
                    .eq('group_id', groupId)
                    .select();

                if (error) {
                    console.error('Error de Supabase:', error);
                    throw error;
                }
            } else {
                // Validar que schoolId existe
                if (!schoolId) {
                    throw new Error('Se requiere el ID de la escuela para crear un nuevo grupo');
                }

                // Crear nuevo grupo
                const {error} = await supabaseClient.from('groups').insert([
                    {
                        ...groupDataToSave,
                        school_id: schoolId,
                        created_at: new Date().toISOString(),
                    },
                ]);

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error al guardar el grupo:', error);
            throw error;
        }
    }

    /**
     * Marca un grupo como eliminado
     * @param id - ID del grupo
     */
    async deleteGroup(id: number): Promise<void> {
        try {
            const statusValue = GROUP_STATUS.INACTIVE;
            const {error} = await supabaseClient
                .from('groups')
                .update({
                    delete_flag: true,
                    status_id: statusValue,
                    deleted_at: new Date().toISOString(),
                })
                .eq('group_id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error al eliminar el grupo:', error);
            throw error;
        }
    }

    /**
     * Restaura un grupo previamente eliminado
     * @param id - ID del grupo
     */
    async restoreGroup(id: number): Promise<void> {
        try {
            const {error} = await supabaseClient
                .from('groups')
                .update({
                    delete_flag: false,
                    deleted_at: null,
                })
                .eq('group_id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error al restaurar el grupo:', error);
            throw error;
        }
    }
}

// Creamos una instancia única del repositorio
export const groupRepository = new SupabaseGroupRepository();
