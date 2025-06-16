// Supabase Client
import { supabaseClient } from '@/services/config/supabaseClient';

// Types
import { CycleData, SchoolCycle, CYCLE_STATUS } from './types';

// Utils
import { formatCycleData } from './utils';

// Definición de la interfaz del repositorio
export interface ISchoolYearRepository {
    getAllCyclesBySchoolId(
        schoolId: number,
    ): Promise<{ active: SchoolCycle[]; deleted: SchoolCycle[] }>;
    getCurrentSchoolId(userId?: string): Promise<number>;
    saveCycle(cycle: CycleData, cycleId?: number, userId?: string): Promise<void>;
    deleteCycle(id: number): Promise<void>;
    restoreCycle(id: number): Promise<void>;
    getGroupGrades(groupIds: number[]): Promise<{
        totalGrade: number;
        gradesCount: number;
    }>;
}

// Implementación de Supabase
export class SupabaseSchoolYearRepository implements ISchoolYearRepository {
    /**
     * Base query para obtener los ciclos escolares
     * @returns QueryBuilder
     */
    private baseQuery() {
        return supabaseClient.from('school_years').select(`
                *,
                status: status_id (name, code),
                groups (
                    group_id,
                    student_groups (
                        student_id
                    )
                )
            `);
    }

    /**
     * Obtener todos los ciclos escolares de una escuela
     * @param schoolId - ID de la escuela
     * @returns Lista de ciclos escolares activos y eliminados
     */
    async getAllCyclesBySchoolId(
        schoolId: number,
    ): Promise<{ active: SchoolCycle[]; deleted: SchoolCycle[] }> {
        try {
            const { data, error } = await this.baseQuery()
                .eq('school_id', schoolId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (!data) return { active: [], deleted: [] };

            // Procesamos todos los ciclos en paralelo
            const formattedCycles = await Promise.all(data.map(formatCycleData));

            // Filtramos después de procesar para evitar múltiples consultas
            return {
                active: formattedCycles.filter(cycle => !cycle.deleteFlag),
                deleted: formattedCycles.filter(cycle => cycle.deleteFlag),
            };
        } catch (error) {
            console.error('Error al cargar los ciclos escolares:', error);
            throw error;
        }
    }

    /**
     * Obtener el ID de la escuela del usuario
     * @param userId - ID del usuario (opcional, se obtiene de la sesión si no se proporciona)
     * @returns ID de la escuela
     */
    async getCurrentSchoolId(userId?: string): Promise<number> {
        try {
            let userIdToUse = userId;

            // Si no se proporcionó un userId, intentamos obtenerlo de la sesión
            if (!userIdToUse) {
                const { data: sessionData } = await supabaseClient.auth.getSession();

                if (!sessionData?.session?.user) {
                    throw new Error('No hay una sesión activa o usuario válido');
                }

                userIdToUse = sessionData.session.user.id;
            }

            // Obtener el ID de la escuela del usuario
            const { data: userData, error: userError } = await supabaseClient
                .from('users')
                .select('school_id')
                .eq('user_id', userIdToUse)
                .single();

            if (userError || !userData?.school_id) {
                throw new Error('No se pudo obtener el ID de la escuela del usuario');
            }

            return userData.school_id;
        } catch (error) {
            console.error('Error al obtener el ID de la escuela:', error);
            throw error;
        }
    }

    /**
     * Guardar un ciclo escolar
     * @param cycle - Ciclo escolar a guardar
     * @param cycleId - ID del ciclo escolar (opcional)
     * @param userId - ID del usuario (opcional)
     */
    async saveCycle(cycle: CycleData, cycleId?: number, userId?: string): Promise<void> {
        try {
            const schoolId = await this.getCurrentSchoolId(userId);

            if (cycleId) {
                // Actualizar ciclo existente
                const { error } = await supabaseClient
                    .from('school_years')
                    .update({
                        name: cycle.name,
                        start_date: cycle.startDate,
                        end_date: cycle.endDate,
                        status_id: parseInt(cycle.status),
                        updated_at: new Date().toISOString(),
                    })
                    .eq('school_year_id', cycleId);

                if (error) throw error;
            } else {
                // Crear nuevo ciclo
                const { error } = await supabaseClient
                    .from('school_years')
                    .insert([
                        {
                            name: cycle.name,
                            start_date: cycle.startDate,
                            end_date: cycle.endDate,
                            status_id: parseInt(cycle.status),
                            school_id: schoolId,
                        },
                    ])
                    .select();

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error al guardar el ciclo escolar:', error);
            throw error;
        }
    }

    /**
     * Eliminar un ciclo escolar
     * @param id - ID del ciclo escolar
     */
    async deleteCycle(id: number): Promise<void> {
        try {
            const { error } = await supabaseClient
                .from('school_years')
                .update({
                    delete_flag: true,
                    status_id: parseInt(CYCLE_STATUS.INACTIVE),
                    deleted_at: new Date().toISOString(),
                })
                .eq('school_year_id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error al eliminar el ciclo escolar:', error);
            throw error;
        }
    }

    /**
     * Restaurar un ciclo escolar
     * @param id - ID del ciclo escolar
     */
    async restoreCycle(id: number): Promise<void> {
        try {
            const { error } = await supabaseClient
                .from('school_years')
                .update({
                    delete_flag: false,
                    deleted_at: null,
                })
                .eq('school_year_id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error al restaurar el ciclo escolar:', error);
            throw error;
        }
    }

    /**
     * Obtener las calificaciones de un conjunto de grupos
     * @param groupIds - Array de IDs de grupos
     * @returns Objeto con el total de calificaciones y cantidad
     */
    async getGroupGrades(groupIds: number[]): Promise<{ totalGrade: number; gradesCount: number }> {
        try {
            if (groupIds.length === 0) {
                return { totalGrade: 0, gradesCount: 0 };
            }

            const { data: gradesData, error: gradesError } = await supabaseClient
                .from('group_subjects')
                .select(
                    `
                    group_subject_id,
                    evaluation_periods (
                        evaluation_period_id,
                        grades (
                            grade
                        )
                    )
                `,
                )
                .in('group_id', groupIds);

            if (gradesError) {
                throw gradesError;
            }

            if (!gradesData) {
                return { totalGrade: 0, gradesCount: 0 };
            }

            // Procesar los datos para calcular el promedio
            let totalGrade = 0;
            let gradesCount = 0;

            gradesData.forEach(gs => {
                const evaluationPeriods = gs.evaluation_periods || [];

                evaluationPeriods.forEach(ep => {
                    const grades = ep.grades || [];

                    grades.forEach(g => {
                        if (g.grade && typeof g.grade === 'number') {
                            totalGrade += g.grade;
                            gradesCount++;
                        }
                    });
                });
            });

            return { totalGrade, gradesCount };
        } catch (error) {
            console.error('Error al obtener calificaciones de grupos:', error);
            throw error;
        }
    }
}

// Creamos una instancia del repositorio de Supabase
export const schoolYearRepository = new SupabaseSchoolYearRepository();
