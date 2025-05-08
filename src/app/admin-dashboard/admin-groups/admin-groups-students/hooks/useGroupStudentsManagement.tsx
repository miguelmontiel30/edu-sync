// React
import { useEffect, useState, useCallback } from 'react';

// Types
import { Student } from '@/app/admin-dashboard/admin-students/module-utils/types';
import { Group } from '@/app/admin-dashboard/admin-groups/module-utils/types';
import { Category, LoadingStates, ErrorStates, STUDENT_GROUP_STATUS } from '@/app/admin-dashboard/admin-groups/admin-groups-students/module-utils/types';

// Services
import { loadAllGroupsData } from '@/app/admin-dashboard/admin-groups/module-utils/services';
import {
    fetchActiveStudentsByGroup,
    fetchInactiveStudentsByGroup,
    fetchDeletedStudentsByGroup,
    assignStudentsToGroup,
    getAvailableStudentsForNewGroupAssignment,
    removeStudentFromGroup,
    restoreStudentToGroup,
    updateStudentGroupStatus
} from '@/app/admin-dashboard/admin-groups/admin-groups-students/module-utils/services';

// Hooks
import { useSession } from '@/hooks/useSession';

// Utils
import {
    formatStudentData,
    filterActiveGroups,
    groupAndSortGroupsBySchoolYear,
    createGroupCategories,
    filterAvailableStudents
} from '@/app/admin-dashboard/admin-groups/admin-groups-students/module-utils/utils';

export const useGroupStudentsManagement = () => {
    // Estados
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeStudents, setActiveStudents] = useState<Student[]>([]);
    const [inactiveStudents, setInactiveStudents] = useState<Student[]>([]);
    const [deletedStudents, setDeletedStudents] = useState<Student[]>([]);
    const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
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

    const handleEditModalOpen = (student: Student) => {
        setEditingStudent(student);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setEditingStudent(null);
        setIsEditModalOpen(false);
    };
    /********************************** Logica de modal **********************************/


    /********************************** Logica de carga de estudiantes **********************************/
    const loadAllStudents = useCallback(async () => {
        if (!selectedGroup || !session?.school_id) return;

        setLoadingState((prev: LoadingStates) => ({ ...prev, groupStudents: true }));
        setErrorState((prev: ErrorStates) => ({ ...prev, students: null }));

        try {
            // Cargar estudiantes activos
            const activeStudentsData = await fetchActiveStudentsByGroup(selectedGroup.id, session.school_id as number);
            const formattedActiveStudents = activeStudentsData.map(formatStudentData);
            setActiveStudents(formattedActiveStudents);

            // Cargar estudiantes inactivos (no activos pero no eliminados)
            const inactiveStudentsData = await fetchInactiveStudentsByGroup(selectedGroup.id, session.school_id as number);
            const formattedInactiveStudents = inactiveStudentsData.map(formatStudentData);
            setInactiveStudents(formattedInactiveStudents);

            // Cargar estudiantes eliminados (delete_flag = true)
            const deletedStudentsData = await fetchDeletedStudentsByGroup(selectedGroup.id, session.school_id as number);
            const formattedDeletedStudents = deletedStudentsData.map(formatStudentData);
            setDeletedStudents(formattedDeletedStudents);

        } catch (error) {
            console.error('Error al cargar estudiantes del grupo:', error);
            setErrorState((prev: ErrorStates) => ({ ...prev, students: 'No se pudieron cargar los estudiantes del grupo.' }));
            setActiveStudents([]);
            setInactiveStudents([]);
            setDeletedStudents([]);
        } finally {
            setLoadingState((prev: LoadingStates) => ({ ...prev, groupStudents: false }));
        }
    }, [selectedGroup, session?.school_id]);

    const loadAvailableStudents = useCallback(async () => {
        if (!selectedGroup || !session?.school_id) return;

        // Actualizar estado de carga de estudiantes disponibles
        setLoadingState((prev: LoadingStates) => ({ ...prev, availableStudents: true }));

        try {
            // Get all students available for new group assignment
            const allStudentsRaw = await getAvailableStudentsForNewGroupAssignment(session.school_id as number);

            // Format student data
            const allStudentsFormatted = allStudentsRaw.map(formatStudentData);

            // Filter available students - ahora considerando tanto activos como inactivos
            const allCurrentStudents = [...activeStudents, ...inactiveStudents];
            const studentsAvailable = filterAvailableStudents(allStudentsFormatted, allCurrentStudents);

            // Set available students
            setAvailableStudents(studentsAvailable);

        } catch (error) {
            console.error('Error al cargar estudiantes disponibles:', error);

            // Set error state
            setErrorState((prev: ErrorStates) => ({ ...prev, students: 'No se pudieron cargar los estudiantes disponibles.' }));

            // Clear available students
            setAvailableStudents([]);
        } finally {
            setLoadingState((prev: LoadingStates) => ({ ...prev, availableStudents: false }));
        }
    }, [selectedGroup, session?.school_id, activeStudents, inactiveStudents]);
    /********************************** Logica de carga de estudiantes **********************************/


    /********************************** Acciones de estudiantes **********************************/
    const handleAddStudents = async (studentIds: number[]) => {
        if (!selectedGroup || !session?.school_id || studentIds.length === 0) return;

        setLoadingState((prev: LoadingStates) => ({ ...prev, saving: true }));
        setErrorState((prev: ErrorStates) => ({ ...prev, saving: null, students: null }));

        try {
            const { success } = await assignStudentsToGroup(selectedGroup.id, studentIds);
            if (!success) {
                throw new Error('Error en la respuesta del servidor al asignar estudiantes');
            }

            await loadAllStudents();
            handleModalClose();
            loadAvailableStudents();

        } catch (error) {
            console.error('Error al asignar estudiantes:', error);
            setErrorState((prev: ErrorStates) => ({ ...prev, saving: 'No se pudieron asignar los estudiantes.' }));
        } finally {
            setLoadingState((prev: LoadingStates) => ({ ...prev, saving: false }));
        }
    };

    const handleDeleteStudent = async (studentGroupId: number) => {
        if (!studentGroupId) return;

        setLoadingState((prev: LoadingStates) => ({ ...prev, saving: true }));
        setErrorState((prev: ErrorStates) => ({ ...prev, saving: null }));

        try {
            const { success } = await removeStudentFromGroup(studentGroupId);
            if (!success) {
                throw new Error('Error en la respuesta del servidor al eliminar estudiante');
            }

            await loadAllStudents();
        } catch (error) {
            console.error('Error al eliminar estudiante:', error);
            setErrorState((prev: ErrorStates) => ({ ...prev, saving: 'No se pudo eliminar el estudiante.' }));
        } finally {
            setLoadingState((prev: LoadingStates) => ({ ...prev, saving: false }));
        }
    };

    const handleRestoreStudent = async (studentGroupId: number) => {
        if (!studentGroupId) return;

        setLoadingState((prev: LoadingStates) => ({ ...prev, saving: true }));
        setErrorState((prev: ErrorStates) => ({ ...prev, saving: null }));

        try {
            const { success } = await restoreStudentToGroup(studentGroupId);
            if (!success) {
                throw new Error('Error en la respuesta del servidor al restaurar estudiante');
            }

            await loadAllStudents();
        } catch (error) {
            console.error('Error al restaurar estudiante:', error);
            setErrorState((prev: ErrorStates) => ({ ...prev, saving: 'No se pudo restaurar el estudiante.' }));
        } finally {
            setLoadingState((prev: LoadingStates) => ({ ...prev, saving: false }));
        }
    };

    const handleUpdateStudentStatus = async (studentGroupId: number, newStatusId: number) => {
        if (!studentGroupId) return;

        setLoadingState((prev: LoadingStates) => ({ ...prev, saving: true }));
        setErrorState((prev: ErrorStates) => ({ ...prev, saving: null }));

        try {
            const { success } = await updateStudentGroupStatus(studentGroupId, newStatusId);
            if (!success) {
                throw new Error('Error en la respuesta del servidor al actualizar el estado del estudiante');
            }

            await loadAllStudents();
            handleEditModalClose();
        } catch (error) {
            console.error('Error al actualizar el estado del estudiante:', error);
            setErrorState((prev: ErrorStates) => ({ ...prev, saving: 'No se pudo actualizar el estado del estudiante.' }));
        } finally {
            setLoadingState((prev: LoadingStates) => ({ ...prev, saving: false }));
        }
    };
    /********************************** Acciones de estudiantes **********************************/

    // Efecto para cargar estudiantes del grupo cuando cambia el grupo seleccionado
    useEffect(() => {
        if (selectedGroup) {
            loadAllStudents();
        } else {
            setActiveStudents([]);
            setInactiveStudents([]);
            setDeletedStudents([]);
            setAvailableStudents([]);
            setErrorState((prev: ErrorStates) => ({ ...prev, students: null }));
        }
    }, [selectedGroup, loadAllStudents]);

    // Efecto para cargar estudiantes disponibles cuando cambian los estudiantes del grupo
    useEffect(() => {
        if (selectedGroup) {
            loadAvailableStudents();
        }
    }, [selectedGroup, activeStudents, inactiveStudents, loadAvailableStudents]);

    return {
        groups,
        selectedGroup,
        loadingState,
        errorState,
        groupCategories,
        activeStudents,
        inactiveStudents,
        deletedStudents,
        availableStudents,
        editingStudent,
        isModalOpen,
        isEditModalOpen,
        handleGroupChange,
        handleModalOpen,
        handleModalClose,
        handleEditModalOpen,
        handleEditModalClose,
        loadGroups,
        loadAllStudents,
        handleDeleteStudent,
        handleRestoreStudent,
        handleAddStudents,
        handleUpdateStudentStatus,
        STUDENT_GROUP_STATUS
    };
};