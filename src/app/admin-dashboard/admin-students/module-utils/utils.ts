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
        if (filterOptions.status && student.status?.code !== filterOptions.status) {
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
export function mapStatusCodeToId(statusCode: string): string {
    const statusMap: Record<string, string> = {
        STUDENT_ACTIVE: '1',
        STUDENT_INACTIVE: '2',
        STUDENT_GRADUATED: '3',
        STUDENT_TRANSFERRED: '4',
    };

    return statusMap[statusCode] || '1';
}

/**
 * Convierte ID de estado a código
 */
export function mapStatusIdToCode(statusId: string): string {
    const statusMap: Record<string, string> = {
        '1': 'STUDENT_ACTIVE',
        '2': 'STUDENT_INACTIVE',
        '3': 'STUDENT_GRADUATED',
        '4': 'STUDENT_TRANSFERRED',
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
        if (student.status?.code === 'STUDENT_ACTIVE') {
            metrics.active++;
        } else {
            metrics.inactive++;
        }

        // Contar por género
        if (student.gender?.code === 'MALE') {
            metrics.male++;
        } else if (student.gender?.code === 'FEMALE') {
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
