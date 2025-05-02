import {Student, StudentGroup, StudentFilterOptions, StudentMetrics} from './types';

/**
 * Calcula la edad a partir de la fecha de nacimiento
 */
export function calculateAge(birthDate: string): number {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }

    return age;
}

/**
 * Genera el nombre completo de un estudiante
 */
export function formatFullName(
    firstName: string,
    fatherLastName: string,
    motherLastName?: string,
): string {
    return `${firstName} ${fatherLastName}${motherLastName ? ` ${motherLastName}` : ''}`;
}

/**
 * Formatea una fecha en formato DD/MM/YYYY
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

/**
 * Prepara los datos del estudiante para mostrar
 */
export function prepareStudentData(student: Student): Student {
    return {
        ...student,
        full_name: formatFullName(
            student.first_name,
            student.father_last_name,
            student.mother_last_name,
        ),
        age: calculateAge(student.birth_date),
    };
}

/**
 * Filtra la lista de estudiantes según las opciones de filtro
 */
export function filterStudents(
    students: Student[],
    filterOptions: StudentFilterOptions,
): Student[] {
    return students.filter(student => {
        // Filtro por término de búsqueda
        if (filterOptions.searchTerm) {
            const searchTerm = filterOptions.searchTerm.toLowerCase();
            const fullName = formatFullName(
                student.first_name,
                student.father_last_name,
                student.mother_last_name,
            ).toLowerCase();

            if (
                !fullName.includes(searchTerm) &&
                !student.curp.toLowerCase().includes(searchTerm) &&
                !(student.email && student.email.toLowerCase().includes(searchTerm))
            ) {
                return false;
            }
        }

        // Filtro por género
        if (filterOptions.gender && student.gender?.code !== filterOptions.gender) {
            return false;
        }

        // Filtro por estado
        if (filterOptions.status_id && student.status_id?.toString() !== filterOptions.status_id) {
            return false;
        }

        return true;
    });
}

/**
 * Ordena la lista de estudiantes según el campo y dirección
 */
export function sortStudents(
    students: Student[],
    sortField: keyof Student,
    sortDirection: 'asc' | 'desc',
): Student[] {
    return [...students].sort((a, b) => {
        let fieldA: any = a[sortField];
        let fieldB: any = b[sortField];

        // Manejo especial para campos calculados
        if (sortField === 'full_name') {
            fieldA = formatFullName(a.first_name, a.father_last_name, a.mother_last_name);
            fieldB = formatFullName(b.first_name, b.father_last_name, b.mother_last_name);
        } else if (sortField === 'age') {
            fieldA = calculateAge(a.birth_date);
            fieldB = calculateAge(b.birth_date);
        }

        if (fieldA === null || fieldA === undefined) return sortDirection === 'asc' ? -1 : 1;
        if (fieldB === null || fieldB === undefined) return sortDirection === 'asc' ? 1 : -1;

        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
            return sortDirection === 'asc'
                ? fieldA.localeCompare(fieldB, 'es')
                : fieldB.localeCompare(fieldA, 'es');
        }

        return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });
}

/**
 * Convierte código de estado a ID
 */
export function mapStatusCodeToId(statusCode: string): number {
    const statusMap: Record<string, number> = {
        STUDENT_ACTIVE: 7,
        STUDENT_INACTIVE: 8,
        STUDENT_GRADUATED: 9,
        STUDENT_TRANSFERRED: 10,
    };

    return statusMap[statusCode] || 7;
}

/**
 * Convierte ID de estado a código
 */
export function mapStatusIdToCode(statusId: number): string {
    const statusMap: Record<number, string> = {
        7: 'STUDENT_ACTIVE',
        8: 'STUDENT_INACTIVE',
        9: 'STUDENT_GRADUATED',
        10: 'STUDENT_TRANSFERRED',
    };

    return statusMap[statusId] || 'STUDENT_ACTIVE';
}

/**
 * Calcula métricas de estudiantes para los tableros
 */
export function calculateStudentMetrics(
    students: Student[],
    studentGroups?: StudentGroup[],
): StudentMetrics {
    // Inicializar métricas
    const metrics: StudentMetrics = {
        total: students.length,
        active: 0,
        inactive: 0,
        male: 0,
        female: 0,
        byGrade: {},
        byGroup: {},
    };

    // Calcular métricas básicas
    students.forEach(student => {
        // Contar por estado
        if (student.status?.code === 'STUDENT_ACTIVE' || student.status_id === 7) {
            metrics.active++;
        } else {
            metrics.inactive++;
        }

        // Contar por género
        if (student.gender?.code === 'M') {
            metrics.male++;
        } else if (student.gender?.code === 'F') {
            metrics.female++;
        }
    });

    // Calcular distribución por grado y grupo si hay datos de grupos
    if (studentGroups && studentGroups.length > 0) {
        studentGroups.forEach(sg => {
            if (sg.group) {
                // Por grado
                const grade = sg.group.grade.toString();
                metrics.byGrade[grade] = (metrics.byGrade[grade] || 0) + 1;

                // Por grupo
                const groupKey = `${sg.group.grade}${sg.group.group_name}`;
                metrics.byGroup[groupKey] = (metrics.byGroup[groupKey] || 0) + 1;
            }
        });
    }

    return metrics;
}
