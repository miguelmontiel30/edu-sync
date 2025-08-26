import {
    Attendance,
    Payment,
    Grade,
    StudentBadge,
    Student,
    Address,
    StudentTutor,
    StudentGroup,
} from './types';

/**
 * Calcula el porcentaje de asistencia en base a los registros de asistencia
 * @param attendance Array de registros de asistencia
 * @returns Porcentaje de asistencia (0-100)
 */
export const calculateAttendanceRate = (attendance: Attendance[]): number => {
    if (!attendance || attendance.length === 0) return 0;

    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const lateDays = attendance.filter(a => a.status === 'late').length;

    // Considerar asistencias tardías como 0.5 de asistencia completa
    const attendanceScore = presentDays + lateDays * 0.5;

    return (attendanceScore / totalDays) * 100;
};

/**
 * Obtiene un color en base a un porcentaje (para gráficos o indicadores)
 * @param percentage Porcentaje (0-100)
 * @returns Código de color en hexadecimal
 */
export const getColorByPercentage = (percentage: number): string => {
    if (percentage >= 90) return '#22c55e'; // Verde (success)
    if (percentage >= 75) return '#3b82f6'; // Azul (primary)
    if (percentage >= 60) return '#f59e0b'; // Amarillo (warning)
    return '#ef4444'; // Rojo (error)
};

// ========== Funciones de mapeo de datos ==========

/**
 * Transforma los datos del estudiante al formato requerido
 */
export const mapStudentData = (data: any): Student => {
    return {
        id: data.student_id.toString(),
        full_name:
            `${data.first_name} ${data.father_last_name} ${data.mother_last_name || ''}`.trim(),
        curp: data.curp,
        birth_date: data.birth_date,
        gender: {
            id: (data.gender?.gender_id || '0').toString(),
            name: data.gender?.name || 'No especificado',
        },
        email: data.email || undefined,
        phone: data.phone || undefined,
        avatar_url: data.image_url || undefined,
    };
};

/**
 * Transforma los datos de direcciones al formato requerido
 */
export const mapAddressData = (data: any[]): Address[] => {
    return (data as any[]).map((item: any) => ({
        id: item.user_address_id.toString(),
        street: item.address.street,
        exterior_number: item.address.exterior_number || '',
        interior_number: item.address.interior_number || undefined,
        neighborhood: item.address.neighborhood,
        postal_code: item.address.postal_code,
        address_type: item.address_type === 'home' ? 'home' : 'other',
        is_current: item.is_current,
        reference: item.address.reference || undefined,
    }));
};

/**
 * Transforma los datos de tutores al formato requerido
 */
export const mapTutorData = (data: any[], studentId: string): StudentTutor[] => {
    return (data as any[]).map((item: any) => ({
        id: item.student_tutor_id.toString(),
        student_id: studentId,
        full_name:
            `${item.tutor.first_name} ${item.tutor.father_last_name} ${item.tutor.mother_last_name || ''}`.trim(),
        relationship: item.tutor.relationship,
        phone: item.tutor.phone || undefined,
        email: item.tutor.email || undefined,
        avatar_url: item.tutor.image_url || undefined,
    }));
};

/**
 * Transforma los datos de calificaciones al formato requerido
 */
export const mapGradeData = (data: any[]): Grade[] => {
    return (data as any[]).map((item: any) => ({
        id: item.grade_id,
        subject: item.evaluation_period.group_subject.subject.name,
        score: item.grade,
        period: item.evaluation_period.name,
    }));
};

/**
 * Transforma los datos de grupos al formato requerido
 */
export const mapGroupData = (data: any[], studentId: string): StudentGroup[] => {
    return (data as any[]).map((item: any) => ({
        id: item.student_group_id.toString(),
        student_id: studentId,
        group_id: item.group_id.toString(),
        group: {
            id: item.group_id.toString(),
            name: `${item.group.grade}°${item.group.group_name}`,
            grade: item.group.grade.toString(),
            level: 'Primaria', // Este dato no está en la DB, lo generamos
        },
    }));
};

// ========== Funciones de generación de datos de prueba ==========

/**
 * Genera datos de prueba para pagos
 */
export const generateMockPayments = (): Payment[] => {
    return [
        {
            id: '1',
            month: 'Enero 2024',
            amount: 3500,
            payment_date: '2024-01-05',
            status: 'paid',
        },
        {
            id: '2',
            month: 'Febrero 2024',
            amount: 3500,
            payment_date: '2024-02-07',
            status: 'paid',
        },
        {
            id: '3',
            month: 'Marzo 2024',
            amount: 3500,
            payment_date: undefined,
            status: 'pending',
        },
    ];
};

/**
 * Genera datos de prueba para calificaciones
 */
export const generateMockGrades = (): Grade[] => {
    const subjects = [
        'Matemáticas',
        'Español',
        'Historia',
        'Ciencias',
        'Inglés',
        'Artes',
        'Educación Física',
        'Civismo',
        'Geografía',
        'Computación',
    ];

    return subjects.map((subject, index) => ({
        id: index + 1,
        subject,
        score: Math.floor(Math.random() * 3) + 7 + Math.random(), // Genera calificaciones entre 7.0 y 10.0
        period: '2024-1',
    }));
};

/**
 * Genera datos de prueba para asistencia
 */
export const generateMockAttendance = (studentId: string, days: number): Attendance[] => {
    const attendance: Attendance[] = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Generar estado aleatorio con más probabilidad de "presente"
        const randomVal = Math.random();
        let status: 'present' | 'late' | 'absent';

        if (randomVal < 0.8) {
            status = 'present';
        } else if (randomVal < 0.9) {
            status = 'late';
        } else {
            status = 'absent';
        }

        attendance.push({
            id: i + 1,
            student_id: studentId,
            date: date.toISOString().split('T')[0],
            status,
        });
    }

    return attendance;
};

/**
 * Genera datos de prueba para insignias
 */
export const generateMockBadges = (studentId: string): StudentBadge[] => {
    return [
        {
            id: 1,
            student_id: studentId,
            badge_id: 1,
            badge: {
                id: 1,
                icon: 'trophy',
                name: 'Excelencia Académica',
                obtained: true,
                color: 'primary',
            },
        },
        {
            id: 2,
            student_id: studentId,
            badge_id: 2,
            badge: {
                id: 2,
                icon: 'medal',
                name: 'Asistencia Perfecta',
                obtained: true,
                color: 'success',
            },
        },
        {
            id: 3,
            student_id: studentId,
            badge_id: 3,
            badge: {
                id: 3,
                icon: 'star',
                name: 'Mejor Compañero',
                obtained: true,
                color: 'warning',
            },
        },
    ];
};
