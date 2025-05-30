// Supabase Client
import {supabaseClient} from '@/services/config/supabaseClient';

/**
 * Consulta base para obtener un estudiante por su ID
 */
export const getStudentById = (studentId: number) =>
    supabaseClient
        .from('students')
        .select(
            `
            student_id,
            first_name,
            father_last_name,
            mother_last_name,
            birth_date,
            gender_id,
            curp,
            phone,
            email,
            image_url,
            status_id,
            gender:genders (
                gender_id,
                code,
                name
            ),
            status:status (
                status_id,
                code,
                name,
                category
            )
        `,
        )
        .eq('student_id', studentId)
        .eq('delete_flag', false)
        .single();

/**
 * Consulta para obtener el usuario asociado a un estudiante
 */
export const getUserByStudentId = (studentId: number) =>
    supabaseClient
        .from('users')
        .select('user_id')
        .eq('linked_id', studentId)
        .eq('linked_type', 'student')
        .maybeSingle();

/**
 * Consulta para obtener las direcciones de un usuario
 */
export const getAddressesByUserId = (userId: number) =>
    supabaseClient
        .from('user_addresses')
        .select(
            `
            user_address_id,
            user_id,
            address_id,
            is_current,
            address_type,
            address:addresses (
                address_id,
                street,
                neighborhood,
                interior_number,
                exterior_number,
                postal_code,
                reference
            )
        `,
        )
        .eq('user_id', userId)
        .eq('delete_flag', false)
        .order('is_current', {ascending: false});

/**
 * Consulta para obtener los tutores de un estudiante
 */
export const getTutorsByStudentId = (studentId: number) =>
    supabaseClient
        .from('student_tutors')
        .select(
            `
            student_tutor_id,
            student_id,
            tutor_id,
            is_primary,
            can_pickup,
            tutor:tutors (
                tutor_id,
                first_name,
                father_last_name,
                mother_last_name,
                relationship,
                gender_id,
                phone,
                alternative_phone,
                email,
                image_url
            )
        `,
        )
        .eq('student_id', studentId)
        .eq('delete_flag', false)
        .order('is_primary', {ascending: false});

/**
 * Consulta para obtener las calificaciones de un estudiante
 */
export const getGradesByStudentId = (studentId: number) =>
    supabaseClient
        .from('grades')
        .select(
            `
            grade_id,
            student_id,
            evaluation_period_id,
            grade,
            comments,
            evaluation_period:evaluation_periods (
                evaluation_period_id,
                name,
                start_date,
                end_date,
                group_subject:group_subjects (
                    group_subject_id,
                    subject:subjects (
                        subject_id,
                        name
                    )
                )
            )
        `,
        )
        .eq('student_id', studentId)
        .eq('delete_flag', false);

/**
 * Consulta para obtener los grupos a los que ha pertenecido un estudiante
 */
export const getGroupsByStudentId = (studentId: number) =>
    supabaseClient
        .from('student_groups')
        .select(
            `
            student_group_id,
            student_id,
            group_id,
            enrollment_date,
            status_id,
            status:status (
                status_id,
                code,
                name,
                category
            ),
            group:groups (
                group_id,
                grade,
                group_name,
                school_year_id,
                school_year:school_years (
                    school_year_id,
                    name
                )
            )
        `,
        )
        .eq('student_id', studentId)
        .eq('delete_flag', false)
        .order('created_at', {ascending: false});

/**
 * Actualiza la información personal de un estudiante
 */
export const updateStudentInfo = (studentId: number, data: any) =>
    supabaseClient.from('students').update(data).eq('student_id', studentId);
