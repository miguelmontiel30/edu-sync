// Tipo para el estado de asistencia
export type AttendanceStatus = 'present' | 'absent' | 'late' | undefined;

// Tipo para el historial de asistencia de un día
export interface AttendanceDay {
    date: string;
    status: AttendanceStatus;
}

// Tipo para un estudiante con su información de asistencia
export interface Student {
    id: string;
    name: string;
    code: string;
    avatar?: string;
    status: AttendanceStatus;
    history?: AttendanceDay[];
    absentDays?: number;
}

// Tipo para un grupo o clase
export interface Group {
    id: string;
    name: string;
    description?: string;
    studentCount?: number;
}

// Tipo para los datos de asistencia
export interface AttendanceData {
    date: string;
    group: string;
    students: Student[];
}

// Tipo para las estadísticas de asistencia
export interface AttendanceStats {
    present: number;
    absent: number;
    late: number;
    total: number;
    attendanceRate: number;
}
