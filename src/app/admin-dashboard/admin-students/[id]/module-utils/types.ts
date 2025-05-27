// Interfaces centralizadas para el módulo de perfil de estudiante

/**
 * Información básica del estudiante
 */
export interface Student {
    id: string;
    full_name: string;
    curp: string;
    birth_date: string;
    gender?: {
        id: string;
        name: string;
    };
    email?: string;
    phone?: string;
    avatar_url?: string;
}

/**
 * Dirección del estudiante
 */
export interface Address {
    id: string;
    street: string;
    exterior_number: string;
    interior_number?: string;
    neighborhood: string;
    postal_code: string;
    address_type: 'home' | 'other';
    is_current: boolean;
    reference?: string;
}

/**
 * Información del tutor
 */
export interface Tutor {
    id: string;
    full_name: string;
    relationship: string;
    phone?: string;
    email?: string;
    avatar_url?: string;
}

/**
 * Tutor asociado a un estudiante específico
 */
export interface StudentTutor extends Tutor {
    student_id: string;
}

/**
 * Información de pago
 */
export interface Payment {
    id: string;
    month: string;
    amount: number;
    payment_date?: string;
    status: 'paid' | 'pending' | 'overdue';
}

/**
 * Calificación académica
 */
export interface Grade {
    id: number;
    subject: string;
    score: number;
    period: string;
}

/**
 * Registro de asistencia
 */
export interface Attendance {
    id: number;
    student_id: string;
    status: 'present' | 'late' | 'absent';
    date: string;
    delete_flag?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

/**
 * Medalla o reconocimiento
 */
export interface Badge {
    id: number;
    icon: string;
    name: string;
    obtained: boolean;
    color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

/**
 * Medalla asignada a un estudiante específico
 */
export interface StudentBadge {
    id: number;
    student_id: string;
    badge_id: number;
    badge: Badge;
}

/**
 * Grupo académico
 */
export interface Group {
    id: string;
    name: string;
    grade: string;
    level: string;
}

/**
 * Asignación de estudiante a grupo
 */
export interface StudentGroup {
    id: string;
    student_id: string;
    group_id: string;
    group: Group;
}

/**
 * Estado de carga para cada sección del perfil
 */
export interface LoadingState {
    student: boolean;
    addresses: boolean;
    tutors: boolean;
    payments: boolean;
    grades: boolean;
    attendance: boolean;
    badges: boolean;
    groups: boolean;
    saving?: boolean; // Añadido para compatibilidad con componentes existentes
}

/**
 * Estado de error para cada sección del perfil
 */
export interface ErrorState {
    student?: string | null;
    addresses?: string | null;
    tutors?: string | null;
    payments?: string | null;
    grades?: string | null;
    attendance?: string | null;
    badges?: string | null;
    groups?: string | null;
    saving?: string | null; // Añadido para compatibilidad con componentes existentes
}

/**
 * Estado completo del perfil de estudiante
 */
export interface StudentProfile {
    student: Student | null;
    addresses: Address[];
    tutors: StudentTutor[];
    payments: Payment[];
    grades: Grade[];
    attendance: Attendance[];
    badges: StudentBadge[];
    groups: StudentGroup[];
}
