// Tipos base desde la base de datos

// Estado para relaciones grupo-profesor
export const TEACHER_GROUP_STATUS = {
    TEACHER_GROUP_ACTIVE: 21,
    TEACHER_GROUP_INACTIVE: 22,
};

// Tipos para UI
export interface Category {
    label: string;
    options: Array<{ value: string; label: string }>;
    isActive?: boolean;
}

// Estados de componentes
export interface LoadingStates {
    groups: boolean;
    groupSubjects: boolean;
    availableTeachers: boolean;
    availableSubjects: boolean;
    deletedSubjects: boolean;
    saving: boolean;
}

export interface ErrorStates {
    groups: string | null;
    teachers: string | null;
    subjects: string | null;
    saving: string | null;
}

// Tipos comunes
export interface Status {
    id: number;
    name: string;
    code: string;
}

// Información de entidades principales
export interface GroupInfo {
    id: number;
    grade: number;
    group: string;
    status: Status;
}

export interface SubjectInfo {
    subject_id: number;
    name: string;
    description: string;
    status?: Status;
}

export interface TeacherInfo {
    teacher_id: number;
    id?: number; // Alias para teacher_id para compatibilidad con componentes UI
    first_name: string;
    father_last_name: string;
    mother_last_name?: string;
    gender_id?: number;
    email?: string;
    phone?: string;
    image_url?: string;
    curp?: string;
    name?: string; // Nombre completo formateado para UI
}

// Interfaz principal para asignaciones
export interface GroupSubjectAssignment {
    id: number;
    group_subject_id: number;
    subject_id: number;
    teacher_id?: number | null;
    delete_flag: boolean;
    student_count: number;
    group: GroupInfo;
    subject: SubjectInfo;
    teacherData: TeacherInfo | null;
}

// Tipo para la UI de profesores con sus materias
export interface TeacherWithSubjects {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    imageUrl?: string;
    assignedSubjects: {
        id: number;
        name: string;
    }[];
}

// Tipos para las operaciones de repository
export interface RepositoryResponse {
    success: boolean;
    error?: any;
    id?: number;
}

// Tipo para materias eliminadas
export interface DeletedGroupSubject {
    id: number;
    group_subject_id: number;
    subject_id: number;
    teacher_id?: number | null;
    subject: SubjectInfo;
    teacher?: TeacherInfo;
    student_count: number;
    deleted_at: string;
    deleted_by?: {
        id: number;
        name: string;
        email: string;
    };
}
