import { Group } from '@/app/admin-dashboard/admin-groups/module-utils/types';
import { Category, GroupSubjectAssignment, TeacherWithSubjects, TeacherInfo } from './types';

/**
 * Formatea los datos del profesor para usar en la UI
 */
export function formatTeacherData(teacher: any): TeacherInfo | null {
    if (!teacher) return null;

    // Asegurarnos de tener valores válidos para campos críticos
    const teacher_id = teacher.teacher_id || teacher.id || 0;
    const first_name = teacher.first_name || '';
    const father_last_name = teacher.father_last_name || '';

    // Si no hay nombre, no es un profesor válido
    if (!first_name && !father_last_name && !teacher.name) {
        return null;
    }

    return {
        teacher_id,
        id: teacher_id, // Aseguramos compatibilidad con ambos formatos de ID
        first_name,
        father_last_name,
        mother_last_name: teacher.mother_last_name || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        image_url: teacher.image_url || null,
        gender_id: teacher.gender_id || 1,
        curp: teacher.curp || '',
        name: teacher.name || `${first_name} ${father_last_name}`.trim(),
    };
}

/**
 * Extrae profesores asignados de las asignaciones de grupo
 */
export function extractAssignedTeachers(
    assignments: GroupSubjectAssignment[],
): TeacherWithSubjects[] {
    return assignments
        .filter(a => a.teacherData)
        .reduce((acc: TeacherWithSubjects[], assignment) => {
            if (!assignment.teacherData) return acc;

            // Asegurarnos de que el profesor tiene un ID válido
            const teacherId = assignment.teacherData.teacher_id || assignment.teacherData.id || 0;

            // Buscar si el profesor ya existe en el acumulador
            const existingTeacher = acc.find(t => t.id === teacherId);

            if (existingTeacher) {
                // Agregar materia a profesor existente
                existingTeacher.assignedSubjects.push({
                    id: assignment.group_subject_id,
                    name: assignment.subject.name,
                });
            } else {
                // Crear nuevo profesor
                acc.push({
                    id: teacherId,
                    name:
                        assignment.teacherData.name ||
                        `${assignment.teacherData.first_name || ''} ${assignment.teacherData.father_last_name || ''}`.trim() ||
                        'Profesor sin nombre',
                    email: assignment.teacherData.email,
                    phone: assignment.teacherData.phone,
                    imageUrl: assignment.teacherData.image_url,
                    assignedSubjects: [
                        {
                            id: assignment.group_subject_id,
                            name: assignment.subject.name,
                        },
                    ],
                });
            }

            return acc;
        }, []);
}

/**
 * Filtra grupos activos
 */
export function filterActiveGroups(groups: Group[]): Group[] {
    return groups.filter(group => !group.deleteFlag);
}

/**
 * Agrupa y ordena grupos por ciclo escolar
 */
export function groupAndSortGroupsBySchoolYear(groups: Group[]): Map<string, Group[]> {
    const groupsBySchoolYear = new Map<string, Group[]>();

    groups.forEach(group => {
        const schoolYearName = group.schoolYear?.name || 'Sin ciclo escolar';
        if (!groupsBySchoolYear.has(schoolYearName)) {
            groupsBySchoolYear.set(schoolYearName, []);
        }
        groupsBySchoolYear.get(schoolYearName)?.push(group);
    });

    // Ordenar los grupos dentro de cada ciclo escolar
    groupsBySchoolYear.forEach((groupsList, schoolYearName) => {
        groupsBySchoolYear.set(
            schoolYearName,
            groupsList.sort((a, b) => {
                if (a.grade !== b.grade) {
                    return a.grade - b.grade;
                }
                return a.group.localeCompare(b.group);
            }),
        );
    });

    return groupsBySchoolYear;
}

/**
 * Crea categorías de grupos para el componente SelectWithCategories
 */
export function createGroupCategories(groupedGroups: Map<string, Group[]>): Category[] {
    const categories: Category[] = [];

    // Convertir Map a array y ordenar por nombre del ciclo escolar
    const sortedEntries = Array.from(groupedGroups.entries()).sort((a, b) => {
        return a[0].localeCompare(b[0]);
    });

    // Crear categorías a partir de los ciclos escolares ordenados
    sortedEntries.forEach(([schoolYearName, groups]) => {
        categories.push({
            label: schoolYearName,
            options: groups.map(group => ({
                value: group.id.toString(),
                label: `${group.grade}° ${group.group}`,
            })),
            isActive: true,
        });
    });

    return categories;
}

/**
 * Filtra profesores disponibles excluyendo los ya asignados
 */
export function filterAvailableTeachers(allTeachers: any[], assignedTeachers: any[]): any[] {
    const assignedIds = new Set(assignedTeachers.map(teacher => teacher.id));
    return allTeachers.filter(teacher => !assignedIds.has(teacher.id));
}
