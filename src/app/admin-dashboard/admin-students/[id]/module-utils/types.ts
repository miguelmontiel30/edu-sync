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
    id: string;
    subject: string;
    score: number;
    period: string;
    date: string;
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

// Definimos los tipos de asistencia
export type AttendanceType = 'presente' | 'retardo' | 'ausente' | 'sin-registro';

export interface AttendanceData {
    date: string; // YYYY-MM-DD
    type: AttendanceType;
}

export interface HeatmapProps {
    year: number;
    data: AttendanceData[];
}

// Nuevos tipos para documentos
export type DocumentType = 'acta' | 'curp' | 'domicilio' | 'vacunacion' | 'otro';
export type DocumentStatus = 'pendiente' | 'aprobado' | 'rechazado';

export interface Document {
    id: string;
    type: DocumentType;
    name: string;
    fileUrl: string;
    status: DocumentStatus;
    comments?: string;
    uploadedAt: string;
    updatedAt: string;
}

// Nuevos tipos para salud y emergencias
export interface EmergencyContact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    isMain: boolean;
}

export interface InsuranceInfo {
    provider: string;
    policyNumber: string;
}

export interface MedicalInfo {
    allergies: string[];
    medicalConditions?: string;
    bloodType?: string;
    insurance?: InsuranceInfo;
}

// Nuevos tipos para comunicaciones
export type MessageType = 'general' | 'tarea' | 'pago' | 'asistencia' | 'evento';
export type MessageStatus = 'leido' | 'no-leido';
export type SenderType = 'admin' | 'profesor' | 'tutor' | 'estudiante';

export interface Message {
    id: string;
    title: string;
    content: string;
    type: MessageType;
    status: MessageStatus;
    sender: {
        id: string;
        name: string;
        type: SenderType;
    };
    createdAt: string;
    attachments?: {
        id: string;
        name: string;
        fileUrl: string;
    }[];
}

// Nuevos tipos para académico
export type TaskPriority = 'alta' | 'media' | 'baja';
export type TaskStatus = 'pendiente' | 'completada' | 'vencida';

export interface Task {
    id: string;
    title: string;
    subject: string;
    description?: string;
    dueDate: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedBy: string;
    attachments?: {
        id: string;
        name: string;
        fileUrl: string;
    }[];
}

export interface AcademicGoal {
    id: string;
    title: string;
    target: number;
    current: number;
    period: string;
    subject?: string;
}

// Nuevos tipos para descargas
export type DocumentTemplateType = 'boleta' | 'constancia' | 'certificado' | 'recibo';

export interface DocumentTemplate {
    id: string;
    type: DocumentTemplateType;
    name: string;
    description?: string;
    availableParams: string[];
}
