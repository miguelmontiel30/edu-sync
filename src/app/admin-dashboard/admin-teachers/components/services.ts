/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from '@/services/config/supabaseClient';
import { Teacher, TeacherForm } from './types';

export async function loadTeachers(schoolId: number): Promise<Teacher[]> {
    try {
        // Consultar profesores activos
        const { data, error } = await supabaseClient
            .from('teachers')
            .select(
                `
                *,
                gender:genders (name)
            `,
            )
            .eq('delete_flag', false)
            .eq('school_id', schoolId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
            // Procesar los datos y obtener información adicional
            const teachersWithMetrics = await Promise.all(
                data.map(async teacher => {
                    // Consultar cuántos grupos tiene asignados este profesor
                    const { data: groupsData, error: groupsError } = await supabaseClient
                        .from('group_subjects')
                        .select('group_id')
                        .eq('teacher_id', teacher.teacher_id)
                        .eq('delete_flag', false);

                    if (groupsError) throw groupsError;

                    // Consultar cuántas materias imparte
                    const { data: subjectsData, error: subjectsError } = await supabaseClient
                        .from('group_subjects')
                        .select('subject_id')
                        .eq('teacher_id', teacher.teacher_id)
                        .eq('delete_flag', false);

                    if (subjectsError) throw subjectsError;

                    // Crear un conjunto para contar materias únicas
                    const uniqueSubjects = new Set(subjectsData?.map(s => s.subject_id) || []);
                    // Crear un conjunto para contar grupos únicos
                    const uniqueGroups = new Set(groupsData?.map(g => g.group_id) || []);

                    // Construir el nombre completo
                    const name =
                        `${teacher.first_name} ${teacher.father_last_name} ${teacher.mother_last_name || ''}`.trim();

                    return {
                        ...teacher,
                        name,
                        gender: teacher.gender?.name || '',
                        groupsCount: uniqueGroups.size,
                        subjectsCount: uniqueSubjects.size,
                    };
                }),
            );

            return teachersWithMetrics;
        }

        return [];
    } catch (error) {
        console.error('Error al cargar los profesores:', error);
        throw error;
    }
}

export async function loadDeletedTeachers(schoolId: number): Promise<Teacher[]> {
    try {
        // Consultar profesores eliminados
        const { data, error } = await supabaseClient
            .from('teachers')
            .select(
                `
                *,
                gender:genders (name)
            `,
            )
            .eq('delete_flag', true)
            .eq('school_id', schoolId)
            .order('deleted_at', { ascending: false });

        if (error) throw error;

        if (data) {
            return data.map(teacher => {
                // Construir el nombre completo
                const name =
                    `${teacher.first_name} ${teacher.father_last_name} ${teacher.mother_last_name || ''}`.trim();

                return {
                    ...teacher,
                    name,
                    gender: teacher.gender?.name || '',
                    groupsCount: 0, // No calculamos estas métricas para profesores eliminados
                    subjectsCount: 0,
                };
            });
        }

        return [];
    } catch (error) {
        console.error('Error al cargar los profesores eliminados:', error);
        throw error;
    }
}

export async function loadActiveGroups() {
    try {
        const { data, error } = await supabaseClient
            .from('groups')
            .select(
                `
                group_id,
                grade,
                group_name,
                school_year_id,
                school_years!inner (
                    name
                )
            `,
            )
            .eq('delete_flag', false)
            .eq('status_id', (status: { code: string }) => status.code === 'ACTIVE')
            .order('grade', { ascending: true })
            .order('group_name', { ascending: true });

        if (error) throw error;

        if (data) {
            return data.map((group: any) => ({
                group_id: group.group_id,
                grade: group.grade,
                group_name: group.group_name,
                school_year_id: group.school_year_id,
                school_year_name: group.school_years.name,
            }));
        }
        return [];
    } catch (error) {
        console.error('Error al cargar los grupos activos:', error);
        throw error;
    }
}

export async function loadTeachersByGroup(schoolYearName: string) {
    try {
        const { data, error } = await supabaseClient
            .from('group_subjects')
            .select(
                `
                groups!inner (
                    grade,
                    group_name,
                    school_years!inner (
                        name
                    )
                )
            `,
            )
            .eq('delete_flag', false)
            .eq('groups.school_years.name', schoolYearName);

        if (error) throw error;

        if (data) {
            const groupCounts: { [key: string]: number } = {};
            data.forEach((item: any) => {
                const groupKey = `${item.groups.grade}${item.groups.group_name}`;
                groupCounts[groupKey] = (groupCounts[groupKey] || 0) + 1;
            });
            return groupCounts;
        }
        return {};
    } catch (error) {
        console.error('Error al cargar profesores por grupo:', error);
        throw error;
    }
}

export async function loadGenders() {
    try {
        const { data, error } = await supabaseClient
            .from('genders')
            .select('*')
            .eq('delete_flag', false);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error al cargar géneros:', error);
        throw error;
    }
}

export async function saveTeacher(teacherData: TeacherForm, teacherId?: number): Promise<void> {
    try {
        if (teacherId) {
            // Actualizar profesor existente
            const { error } = await supabaseClient
                .from('teachers')
                .update(teacherData)
                .eq('teacher_id', teacherId);

            if (error) throw error;
        } else {
            // Crear nuevo profesor
            const { error } = await supabaseClient
                .from('teachers')
                .insert([{ ...teacherData, school_id: 1 }]);

            if (error) throw error;
        }
    } catch (error) {
        console.error('Error al guardar el profesor:', error);
        throw error;
    }
}

export async function deleteTeacher(id: number): Promise<void> {
    try {
        const { error } = await supabaseClient
            .from('teachers')
            .update({
                delete_flag: true,
                deleted_at: new Date().toISOString(),
            })
            .eq('teacher_id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error al eliminar el profesor:', error);
        throw error;
    }
}

export async function restoreTeacher(id: number): Promise<void> {
    try {
        const { error } = await supabaseClient
            .from('teachers')
            .update({
                delete_flag: false,
                deleted_at: null,
            })
            .eq('teacher_id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error al restaurar el profesor:', error);
        throw error;
    }
}
