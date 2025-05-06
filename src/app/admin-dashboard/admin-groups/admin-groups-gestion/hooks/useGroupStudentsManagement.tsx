// React
import { useEffect, useState, useCallback } from 'react';

// Types
import { Student } from '@/app/admin-dashboard/admin-students/module-utils/types';
import { Group } from '@/app/admin-dashboard/admin-groups/module-utils/types';
import { Category, LoadingStates, ErrorStates } from '@/app/admin-dashboard/admin-groups/admin-groups-gestion/module-utils/types';

// Services
import { loadAllGroupsData } from '@/app/admin-dashboard/admin-groups/module-utils/services';
import { fetchActiveStudents } from '@/app/admin-dashboard/admin-students/module-utils/services';
import { fetchActiveStudentsByGroup, assignStudentsToGroup } from '@/app/admin-dashboard/admin-groups/admin-groups-gestion/module-utils/services';

// Hooks
import { useSession } from '@/hooks/useSession';

// Utils
import {
    calculateAge,
    formatStudentData,
    filterActiveGroups,
    groupAndSortGroupsBySchoolYear,
    createGroupCategories,
    filterAvailableStudents
} from '@/app/admin-dashboard/admin-groups/admin-groups-gestion/module-utils/utils';


export const useGroupStudentsManagement = () => {
    // Estados
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupStudents, setGroupStudents] = useState<Student[]>([]);
    const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
    const [groupCategories, setGroupCategories] = useState<Category[]>([]);
    const [loadingState, setLoadingState] = useState<LoadingStates>({
        groups: true,
        groupStudents: false,
        availableStudents: false,
        saving: false,
    });
    const [errorState, setErrorState] = useState<ErrorStates>({
        groups: null,
        students: null,
        saving: null,
    });

    // Obtener datos de sesión
    const { session } = useSession();

    /********************************** Logica de grupos **********************************/
    const loadGroups = useCallback(async () => {
        if (!session?.school_id) return;

        setLoadingState((prev: LoadingStates) => ({ ...prev, groups: true }));
        setErrorState((prev: ErrorStates) => ({ ...prev, groups: null }));

        try {
            const { active } = await loadAllGroupsData(session.school_id);
            const activeGroups = filterActiveGroups(active);
            setGroups(activeGroups);

            const grouped = groupAndSortGroupsBySchoolYear(activeGroups);
            const categories = createGroupCategories(grouped);
            setGroupCategories(categories);

        } catch (error) {
            console.error('Error al cargar grupos:', error);
            setErrorState((prev: ErrorStates) => ({ ...prev, groups: 'No se pudieron cargar los grupos. Intenta nuevamente.' }));
        } finally {
            setLoadingState((prev: LoadingStates) => ({ ...prev, groups: false }));
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

    // Cargar grupos al iniciar
    useEffect(() => {
        loadGroups();
    }, [loadGroups]);
    /********************************** Logica de grupos **********************************/


    /********************************** Logica de modal **********************************/
    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);
    const handleDeleteStudent = (student_id: number) => console.log('Eliminar estudiante:', student_id);
    /********************************** Logica de modal **********************************/


    /********************************** Logica de estudiantes **********************************/
    const loadGroupStudents = useCallback(async () => {
        if (!selectedGroup || !session?.school_id) return;

        setLoadingState((prev: LoadingStates) => ({ ...prev, groupStudents: true }));
        setErrorState((prev: ErrorStates) => ({ ...prev, students: null }));

        try {
            const students = await fetchActiveStudentsByGroup(selectedGroup.id, session.school_id as number);
            const formattedStudents = students.map(formatStudentData);
            setGroupStudents(formattedStudents);

        } catch (error) {
            console.error('Error al cargar estudiantes del grupo:', error);
            setErrorState((prev: ErrorStates) => ({ ...prev, students: 'No se pudieron cargar los estudiantes del grupo.' }));
            setGroupStudents([]);
        } finally {
            setLoadingState((prev: LoadingStates) => ({ ...prev, groupStudents: false }));
        }
    }, [selectedGroup, session?.school_id]);

    const loadAvailableStudents = useCallback(async () => {
        if (!selectedGroup || !session?.school_id) return;

        // Actualizar estado de carga de estudiantes disponibles
        setLoadingState((prev: LoadingStates) => ({ ...prev, availableStudents: true }));

        try {
            const allStudentsRaw = await fetchActiveStudents(session.school_id as number);
            const allStudentsFormatted = allStudentsRaw.map(formatStudentData);
            const studentsAvailable = filterAvailableStudents(allStudentsFormatted, groupStudents);
            setAvailableStudents(studentsAvailable);

        } catch (error) {
            console.error('Error al cargar estudiantes disponibles:', error);
            setErrorState((prev: ErrorStates) => ({ ...prev, students: 'No se pudieron cargar los estudiantes disponibles.' }));
            setAvailableStudents([]); // Limpiar en caso de error
        } finally {
            setLoadingState((prev: LoadingStates) => ({ ...prev, availableStudents: false }));
        }
    }, [selectedGroup, session?.school_id, groupStudents]);

    const handleAddStudents = async (studentIds: number[]) => {
        if (!selectedGroup || !session?.school_id || studentIds.length === 0) return;

        setLoadingState((prev: LoadingStates) => ({ ...prev, saving: true }));
        setErrorState((prev: ErrorStates) => ({ ...prev, saving: null, students: null })); // Limpiar errores relevantes

        try {
            const { success } = await assignStudentsToGroup(selectedGroup.id, studentIds);
            if (!success) {
                throw new Error('Error en la respuesta del servidor al asignar estudiantes');
            }

            await loadGroupStudents(); // Recargar estudiantes del grupo
            handleModalClose();        // Cerrar modal
            loadAvailableStudents();   // Iniciar carga de disponibles (sin await)

        } catch (error) {
            console.error('Error al asignar estudiantes:', error);
            setErrorState((prev: ErrorStates) => ({ ...prev, saving: 'No se pudieron asignar los estudiantes.' }));
        } finally {
            setLoadingState((prev: LoadingStates) => ({ ...prev, saving: false }));
        }
    };
    /********************************** Logica de estudiantes **********************************/

    // Efecto para cargar estudiantes del grupo cuando cambia el grupo seleccionado
    useEffect(() => {
        if (selectedGroup) {
            loadGroupStudents();
        } else {
            setGroupStudents([]);
            setAvailableStudents([]);
            setErrorState((prev: ErrorStates) => ({ ...prev, students: null })); // Limpiar error de estudiantes
        }
    }, [selectedGroup, loadGroupStudents]);

    // Efecto para cargar estudiantes disponibles cuando cambian los estudiantes del grupo (o se selecciona un grupo)
    useEffect(() => {
        if (selectedGroup) {
            loadAvailableStudents();
        }
        // No incluir loadAvailableStudents aquí para evitar bucles si esa función cambia
    }, [selectedGroup, groupStudents]); // Cargar disponibles cuando cambie el grupo o los estudiantes asignados

    return {
        groups,
        selectedGroup,
        loadingState,
        errorState, // Objeto de error centralizado
        groupCategories,
        groupStudents,
        availableStudents,
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