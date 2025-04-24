// Services
import {supabaseClient} from '@/services/config/supabaseClient';
import statusService from '@/services/status/statusService';

// Types
import {CycleData, DatabaseGroup, DatabaseSchoolYear, SchoolCycle} from './types';

// Función auxiliar para extraer ids de grupos y estudiantes
function extractGroupAndStudentData(groups: DatabaseGroup[]) {
    const groupIds: number[] = [];
    const studentIds = new Set<number>();

    groups.forEach(group => {
        groupIds.push(group.group_id);

        const studentGroups = group.student_groups || [];

        studentGroups.forEach(sg => {
            studentIds.add(sg.student_id);
        });
    });

    return {groupIds, studentIds};
}

// Función auxiliar para calcular la calificación promedio
async function calculateAverageGrade(groupIds: number[]): Promise<number> {
    if (groupIds.length === 0) return 0;

    const {data: gradesData, error: gradesError} = await supabaseClient
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

    if (gradesError || !gradesData) return 0;

    let totalGrades = 0;
    let gradesCount = 0;

    for (const groupSubject of gradesData) {
        const evaluationPeriods = groupSubject.evaluation_periods || [];

        for (const period of evaluationPeriods) {
            const grades = period.grades || [];

            for (const g of grades) {
                if (g.grade) {
                    totalGrades += Number(g.grade);
                    gradesCount++;
                }
            }
        }
    }

    return gradesCount > 0 ? Number((totalGrades / gradesCount).toFixed(2)) : 0;
}

// Función para formatear los datos del ciclo escolar
async function formatCycleData(cycle: DatabaseSchoolYear): Promise<SchoolCycle> {
    const groups = cycle.groups || [];
    const {studentIds, groupIds} = extractGroupAndStudentData(groups);
    const averageGrade = await calculateAverageGrade(groupIds);

    return {
        id: cycle.school_year_id,
        name: cycle.name,
        startDate: cycle.start_date,
        endDate: cycle.end_date,
        status: cycle.status_id.toString(),
        statusName: cycle.status ? cycle.status.name : 'Desconocido',
        groupsCount: groups.length,
        studentsCount: studentIds.size,
        averageGrade,
    };
}

export async function loadSchoolYearsBySchoolId(schoolId: number): Promise<SchoolCycle[]> {
    try {
        const {data, error} = await supabaseClient
            .from('school_years')
            .select(
                `
                *,
                status: status_id (name, code),
                groups (
                    group_id,
                    student_groups (
                        student_id
                    )
                )
            `,
            )
            .eq('delete_flag', false)
            .eq('school_id', schoolId)
            .order('created_at', {ascending: false});

        if (error) throw error;
        if (!data) return [];

        const formattedCycles = await Promise.all(data.map(formatCycleData));

        return formattedCycles;
    } catch (error) {
        console.error('Error al cargar los ciclos escolares:', error);
        throw error;
    }
}

export async function loadDeletedCycles(schoolId: number): Promise<SchoolCycle[]> {
    try {
        // Usar nuestro servicio de caché para obtener los estados
        await statusService.getSchoolYearStatuses();

        const {data, error} = await supabaseClient
            .from('school_years')
            .select(
                `
                *,
                status: status_id (name, code),
                groups (
                    group_id,
                    student_groups (
                        student_id
                    )
                )
            `,
            )
            .eq('delete_flag', true)
            .eq('school_id', schoolId)
            .order('deleted_at', {ascending: false});

        if (error) throw error;
        if (!data) return [];

        const formattedCycles = await Promise.all(data.map(formatCycleData));
        return formattedCycles;
    } catch (error) {
        console.error('Error al cargar los ciclos eliminados:', error);
        throw error;
    }
}

export async function saveCycle(cycle: CycleData, cycleId?: number): Promise<void> {
    try {
        // Obtener el usuario de la sesión actual
        const {data: sessionData} = await supabaseClient.auth.getSession();

        // Validar que existe una sesión con un usuario válido
        if (!sessionData?.session?.user) {
            throw new Error('No hay una sesión activa o usuario válido');
        }

        // Obtener el ID de la escuela del usuario
        const {data: userData, error: userError} = await supabaseClient
            .from('users')
            .select('school_id')
            .eq('user_id', sessionData.session.user.id)
            .single();

        if (userError || !userData?.school_id) {
            throw new Error('No se pudo obtener el ID de la escuela del usuario');
        }

        const schoolId = userData.school_id;

        if (cycleId) {
            // Actualizar ciclo existente
            const {error} = await supabaseClient
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
            const {error} = await supabaseClient
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

export async function deleteCycle(id: number): Promise<void> {
    try {
        const {error} = await supabaseClient
            .from('school_years')
            .update({
                delete_flag: true,
                status_id: 2, // ID para estado inactivo
                deleted_at: new Date().toISOString(),
            })
            .eq('school_year_id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error al eliminar el ciclo escolar:', error);
        throw error;
    }
}

export async function restoreCycle(id: number): Promise<void> {
    try {
        const {error} = await supabaseClient
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
