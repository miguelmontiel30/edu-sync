export interface Teacher {
    teacher_id: number;
    first_name: string;
    father_last_name: string;
    mother_last_name: string;
    name: string; // Nombre completo (calculado)
    birth_date: string;
    gender_id: number;
    gender: string; // Información de género
    curp: string | null;
    email: string | null;
    phone: string | null;
    image_url: string | null;
    groupsCount: number; // Número de grupos a los que está asignado
    subjectsCount: number; // Número de materias que imparte
    delete_flag: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Group {
    group_id: number;
    grade: number;
    group_name: string;
    school_year_id: number;
    school_year_name: string;
}

export interface TeacherForm {
    first_name: string;
    father_last_name: string;
    mother_last_name: string;
    birth_date: string;
    gender_id: number;
    curp: string;
    email: string;
    phone: string;
    image_url: string;
}

export type SortField = 'name' | 'email' | 'phone' | 'groupsCount' | 'subjectsCount';

export type SortDirection = 'asc' | 'desc';
