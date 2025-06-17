export const STUDENT_STATUS = {
    ACTIVE: 'STUDENT_ACTIVE',
    INACTIVE: 'STUDENT_INACTIVE',
    GRADUATED: 'STUDENT_GRADUATED',
    TRANSFERRED: 'STUDENT_TRANSFERRED',
};

export type StudentStatusType =
    | 'STUDENT_ACTIVE'
    | 'STUDENT_INACTIVE'
    | 'STUDENT_GRADUATED'
    | 'STUDENT_TRANSFERRED';

export interface Student {
    id: number;
    school_id: number;
    first_name: string;
    father_last_name: string;
    mother_last_name: string;
    birth_date: string;
    gender_id: number;
    gender?: {
        id: number;
        name: string;
        code: string;
    };
    curp: string;
    phone: string | null;
    email: string | null;
    image_url: string | null;
    // Status of the student
    status_id: number;
    status?: {
        status_id: number;
        name: string;
        code: string;
        category: string;
    };
    // Status of the student in the group
    student_group_id?: number;
    student_group_status_id?: number;
    student_group_status?: {
        status_id: number;
        name: string;
        code: string;
    };
    delete_flag: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    // Campos calculados
    full_name?: string;
    age?: number;
}

export interface StudentGroup {
    id: number;
    student_id: number;
    group_id: number;
    enrollment_date: string;
    status_id: number;
    status?: {
        status_id: number;
        name: string;
        code: string;
        category: string;
    };
    group?: {
        id: number;
        grade: number;
        group_name: string;
        school_year_id: number;
        school_year?: {
            id: number;
            name: string;
        };
    };
    delete_flag: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface StudentTutor {
    id: number;
    student_id: number;
    tutor_id: number;
    is_primary: boolean;
    can_pickup: boolean;
    tutor?: {
        id: number;
        first_name: string;
        father_last_name: string;
        mother_last_name: string;
        relationship: string;
        phone: string;
        email: string;
        full_name?: string;
    };
    delete_flag: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Gender {
    id: number;
    code: string;
    name: string;
}

export interface StudentFormData {
    id?: number;
    first_name: string;
    father_last_name: string;
    mother_last_name: string;
    birth_date: string;
    gender_id: string | number;
    curp: string;
    phone: string;
    email: string;
    status_id?: string | number;
    image_url?: string;
}

export interface StudentFilterOptions {
    searchTerm?: string;
    gender?: string;
    grade?: string;
    groupName?: string;
    schoolYearId?: number;
    status_id?: string;
}

export interface StudentMetrics {
    total: number;
    active: number;
    inactive: number;
    male: number;
    female: number;
    byGrade: { [key: string]: number };
    byGroup: { [key: string]: number };
}

export interface AlertState {
    show: boolean;
    variant: 'warning' | 'error' | 'success' | 'info';
    title: string;
    message: string;
}

export interface Document {
    id: number;
    student_id: number;
    type: DocumentType;
    status: DocumentStatus;
    fileUrl: string;
    name: string;
    comments: string;
    created_at: string;
    updated_at: string;
    delete_flag: boolean;
}

export type DocumentType = 'acta' | 'curp' | 'domicilio' | 'vacunacion' | 'otro';

export type DocumentStatus = 'pendiente' | 'aprobado' | 'rechazado';
