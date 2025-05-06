// React
import { useEffect, useState, useCallback } from 'react';

// Types
import { Group, GROUP_STATUS } from '@/app/admin-dashboard/admin-groups/module-utils/types';

// Services
import { loadAllGroupsData } from '@/app/admin-dashboard/admin-groups/module-utils/services';
import { fetchActiveStudents } from '@/app/admin-dashboard/admin-students/module-utils/services';
import { fetchActiveStudentsByGroup, assignStudentsToGroup } from '@/app/admin-dashboard/admin-groups/admin-groups-gestion/module-utils/services';

// Hooks
import { useSession } from '@/hooks/useSession';
import { Student } from '@/app/admin-dashboard/admin-students/module-utils/types';

// Interfaz para categorías de SelectWithCategories
interface Category {
    label: string;
    options: Array<{ value: string; label: string }>;
    isActive?: boolean;
}

// Función utilitaria para calcular la edad basada en la fecha de nacimiento
const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};

export const useGroupStudentsManagement = () => {
    // Estados
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupStudents, setGroupStudents] = useState<Student[]>([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [errorStudents, setErrorStudents] = useState<string | null>(null);
    const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
    const [isLoadingAvailableStudents, setIsLoadingAvailableStudents] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Opciones para el SelectWithCategories
    const [groupCategories, setGroupCategories] = useState<Category[]>([]);

    // Obtener datos de sesión
    const { session } = useSession();

    /********************************** Logica de grupos **********************************/
    const loadGroups = useCallback(async () => {
        if (!session?.school_id) return;

        setIsLoading(true);
        setError(null);

        try {
            // Cargar los grupos activos
            const { active } = await loadAllGroupsData(session.school_id);

            // Filtrar solo grupos activos
            const activeGroups = active.filter(group => group.status_id.toString() === GROUP_STATUS.ACTIVE);

            // Guardar solo los grupos activos
            setGroups(activeGroups);

            // Agrupar los grupos por ciclo escolar
            const groupedBySchoolYear: Record<string, Group[]> = {};

            activeGroups.forEach(group => {
                // Obtener el ID del ciclo escolar
                const yearId = group.schoolYear.id.toString();

                // Verificar si el ciclo escolar ya está en el objeto
                if (!groupedBySchoolYear[yearId]) {
                    groupedBySchoolYear[yearId] = [];
                }

                // Agregar el grupo al ciclo escolar correspondiente
                groupedBySchoolYear[yearId].push(group);

                // Ordenar los grupos en cada ciclo escolar
                Object.keys(groupedBySchoolYear).forEach(yearId => {
                    // Recorrer cada grupo del ciclo escolar
                    groupedBySchoolYear[yearId].sort((a, b) => {
                        // Primero ordenar por grado
                        if (a.grade !== b.grade) {
                            return a.grade - b.grade;
                        }

                        // Si el grado es igual, ordenar alfabéticamente por grupo
                        return a.group.localeCompare(b.group);
                    });
                });
            });

            const categories: Category[] = Object.entries(groupedBySchoolYear)
                .map(([_yearId, yearGroups]) => {
                    // Obtener el primer grupo para información del ciclo escolar
                    const firstGroup = yearGroups[0];
                    return {
                        label: firstGroup.schoolYear.name,
                        isActive: firstGroup.schoolYear.status === 'active',
                        options: yearGroups.map(group => ({
                            value: group.id.toString(),
                            label: `${group.grade}° ${group.group}`
                        }))
                    };
                });

            // Ordenar categorías por nombre de ciclo escolar (más reciente primero)
            categories.sort((a: Category, b: Category) => {
                // Primero ordenar por estado activo
                if (a.isActive && !b.isActive) return -1;
                if (!a.isActive && b.isActive) return 1;

                // Como criterio secundario, ordenar por nombre (más reciente primero)
                return b.label.localeCompare(a.label);
            });

            setGroupCategories(categories);

        } catch (error) {
            console.error('Error al cargar grupos:', error);
            setError('No se pudieron cargar los grupos. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    }, [session?.school_id]);

    // Manejar cambio de grupo seleccionado
    const handleGroupChange = (value: string) => {
        if (!value) {
            setSelectedGroup(null);
            return;
        }

        const group = groups.find(g => g.id.toString() === value);
        setSelectedGroup(group || null);
    };

    // Cargar datos al iniciar
    useEffect(() => {
        // Cargar grupos
        loadGroups();
    }, [loadGroups]);
    /********************************** Logica de grupos **********************************/


    /********************************** Logica de modal **********************************/
    const handleModalOpen = () => setIsModalOpen(true);

    const handleModalClose = () => setIsModalOpen(false);

    const handleDeleteStudent = (student_id: number) => console.log('Eliminar estudiante:', student_id);
    /********************************** Logica de modal **********************************/


    /********************************** Logica de estudiantes **********************************/
    /**
     * Carga los estudiantes del grupo seleccionado y los formatea para la tabla de estudiantes
     * asignados al grupo
     * @returns {Promise<void>}
     * @throws {Error} Si no hay un grupo seleccionado o no hay una escuela en la sesión
     */
    const loadGroupStudents = useCallback(async () => {
        if (!selectedGroup || !session?.school_id) return;

        setIsLoadingStudents(true);
        setErrorStudents(null);

        try {
            const students = await fetchActiveStudentsByGroup(selectedGroup.id, session.school_id as number);

            // Formatear los datos de estudiantes para la tabla
            const formattedStudents = students.map(student => {
                // Crear el nombre completo
                const fullName = `${student.first_name} ${student.father_last_name} ${student.mother_last_name}`.trim();

                // Calcular la edad
                const age = calculateAge(student.birth_date);

                // Devolver el estudiante con los campos calculados
                return {
                    ...student,
                    full_name: fullName,
                    age: age
                };
            });

            // Actualizar el estado con los estudiantes formateados
            setGroupStudents(formattedStudents);

        } catch (error) {
            console.error('Error al cargar estudiantes del grupo:', error);
            setErrorStudents('No se pudieron cargar los estudiantes del grupo. Intenta nuevamente.');
            setGroupStudents([]); // Limpiar el estado en caso de error
        } finally {
            setIsLoadingStudents(false);
        }
    }, [selectedGroup, session?.school_id]);

    /**
     * Carga los estudiantes activos que pueden ser asignados al grupo seleccionado
     * (estudiantes que no están ya asignados al grupo)
     */
    const loadAvailableStudents = useCallback(async () => {
        if (!selectedGroup || !session?.school_id) return [];

        setIsLoadingAvailableStudents(true);

        try {
            // Obtener todos los estudiantes activos de la escuela
            const allStudents = await fetchActiveStudents(session.school_id as number);

            // Formatear todos los estudiantes para incluir nombre completo y edad
            const formattedAllStudents = allStudents.map(student => {
                const fullName = `${student.first_name} ${student.father_last_name} ${student.mother_last_name}`.trim();
                const age = calculateAge(student.birth_date);

                return {
                    ...student,
                    full_name: fullName,
                    age: age
                };
            });

            // Si no hay estudiantes en el grupo, todos están disponibles
            if (groupStudents.length === 0) {
                setAvailableStudents(formattedAllStudents);
                return formattedAllStudents;
            }

            // Obtener los IDs de los estudiantes ya asignados al grupo
            const assignedStudentIds = groupStudents.map(student => student.id);

            // Filtrar para obtener solo los estudiantes que no están en el grupo
            const studentsAvailable = formattedAllStudents.filter(
                student => !assignedStudentIds.includes(student.id)
            );

            setAvailableStudents(studentsAvailable);
            return studentsAvailable;

        } catch (error) {
            console.error('Error al cargar estudiantes disponibles:', error);
            return [];
        } finally {
            setIsLoadingAvailableStudents(false);
        }
    }, [selectedGroup, session?.school_id, groupStudents]);

    /**
     * Asigna estudiantes al grupo seleccionado y recarga los datos
     * @param studentIds - Array de IDs de estudiantes a asignar
     */
    const handleAddStudents = async (studentIds: number[]) => {
        if (!selectedGroup || !session?.school_id || studentIds.length === 0) return;

        setIsSaving(true);
        setErrorStudents(null);

        try {
            // Realizar la asignación
            const { success } = await assignStudentsToGroup(selectedGroup.id, studentIds);

            if (!success) {
                throw new Error('Error al asignar estudiantes');
            }

            // Recargar los datos después de la asignación exitosa
            await loadGroupStudents();

            // Cerrar el modal antes de cargar estudiantes disponibles
            handleModalClose();

            // Luego actualizamos los estudiantes disponibles
            loadAvailableStudents();
        } catch (error) {
            console.error('Error al asignar estudiantes:', error);
            setErrorStudents('No se pudieron asignar los estudiantes al grupo. Intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    };

    /********************************** Logica de estudiantes **********************************/

    // Cargar estudiantes cuando cambia el grupo seleccionado
    useEffect(() => {
        if (!selectedGroup) {
            setGroupStudents([]);
            setAvailableStudents([]);
            return;
        }

        // Cargar estudiantes del grupo primero
        loadGroupStudents();
    }, [selectedGroup, loadGroupStudents]);

    // Cargar estudiantes disponibles solo después de que se carguen los del grupo
    // y solo cuando el grupo esté seleccionado o cuando cambie la lista de estudiantes del grupo
    useEffect(() => {
        if (selectedGroup) {
            loadAvailableStudents();
        }
    }, [selectedGroup, groupStudents.length]);

    return {
        groups,
        selectedGroup,
        isLoading,
        error,
        groupCategories,
        groupStudents,
        isLoadingStudents,
        errorStudents,
        availableStudents,
        isLoadingAvailableStudents,
        isSaving,
        isModalOpen,
        handleGroupChange,
        handleModalOpen,
        handleModalClose,
        loadGroups,
        handleDeleteStudent,
        loadAvailableStudents,
        handleAddStudents
    };
};