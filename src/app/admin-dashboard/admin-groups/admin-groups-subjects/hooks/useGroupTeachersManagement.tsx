// React
import { useEffect, useState, useCallback } from 'react';

// Types
import { Group } from '@/app/admin-dashboard/admin-groups/module-utils/types';
import {
    Category,
    LoadingStates,
    ErrorStates,
    GroupSubjectAssignment,
    TeacherWithSubjects,
    DeletedGroupSubject,
    TeacherInfo,
} from '../module-utils/types';

// Services
import { loadAllGroupsData } from '@/app/admin-dashboard/admin-groups/module-utils/services';
import {
    fetchAllGroupSubjects,
    fetchAllTeachers,
    fetchAvailableSubjects,
    assignTeacherToSubject,
    removeTeacherFromSubject,
    createSubjectAssignment,
    deleteSubjectFromGroup,
    restoreSubjectToGroup,
} from '../module-utils/services';

// Hooks
import { useSession } from '@/hooks/useSession';

// Utils
import {
    filterActiveGroups,
    groupAndSortGroupsBySchoolYear,
    createGroupCategories,
    extractAssignedTeachers,
    formatTeacherData,
} from '../module-utils/utils';

export const useGroupTeachersManagement = () => {
    // Estados
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isDeletedItemsModalOpen, setIsDeletedItemsModalOpen] = useState(false);
    const [assignedTeachers, setAssignedTeachers] = useState<TeacherWithSubjects[]>([]);
    const [availableTeachers, setAvailableTeachers] = useState<TeacherInfo[]>([]);
    const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);
    const [groupAssignments, setGroupAssignments] = useState<GroupSubjectAssignment[]>([]);
    const [deletedSubjects, setDeletedSubjects] = useState<DeletedGroupSubject[]>([]);
    const [groupCategories, setGroupCategories] = useState<Category[]>([]);
    const [editingAssignment, setEditingAssignment] = useState<GroupSubjectAssignment | null>(null);

    const [loadingState, setLoadingState] = useState<LoadingStates>({
        groups: true,
        groupSubjects: false,
        availableTeachers: false,
        availableSubjects: false,
        deletedSubjects: false,
        saving: false,
    });

    const [errorState, setErrorState] = useState<ErrorStates>({
        groups: null,
        teachers: null,
        subjects: null,
        saving: null,
    });

    // Obtener datos de sesión
    const { session } = useSession();

    // Cargar grupos
    const loadGroups = useCallback(async () => {
        if (!session?.school_id) return;

        setLoadingState(prev => ({ ...prev, groups: true }));
        setErrorState(prev => ({ ...prev, groups: null }));

        try {
            const { active } = await loadAllGroupsData(session.school_id);
            const activeGroups = filterActiveGroups(active);
            setGroups(activeGroups);

            const grouped = groupAndSortGroupsBySchoolYear(activeGroups);
            const categories = createGroupCategories(grouped);
            setGroupCategories(categories);
        } catch (error) {
            console.error('Error al cargar grupos:', error);
            setErrorState(prev => ({
                ...prev,
                groups: 'No se pudieron cargar los grupos.',
            }));
        } finally {
            setLoadingState(prev => ({ ...prev, groups: false }));
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

    // Lógica de modales
    const handleTeacherModalOpen = () => setIsTeacherModalOpen(true);
    const handleTeacherModalClose = () => {
        setIsTeacherModalOpen(false);
        setEditingAssignment(null);
    };

    const handleSubjectModalOpen = () => setIsSubjectModalOpen(true);
    const handleSubjectModalClose = () => setIsSubjectModalOpen(false);

    const handleDeletedItemsModalOpen = () => setIsDeletedItemsModalOpen(true);
    const handleDeletedItemsModalClose = () => setIsDeletedItemsModalOpen(false);

    const handleEditAssignment = (assignment: GroupSubjectAssignment) => {
        setEditingAssignment(assignment);
        handleTeacherModalOpen();
    };

    // Cargar todas las asignaciones del grupo (activas y eliminadas)
    const loadGroupData = useCallback(async () => {
        if (!selectedGroup || !session?.school_id) return;

        setLoadingState(prev => ({
            ...prev,
            groupSubjects: true,
            deletedSubjects: true,
        }));
        setErrorState(prev => ({ ...prev, subjects: null }));

        try {
            // Cargar asignaciones optimizadas (activas y eliminadas en una sola llamada)
            const { active, deleted } = await fetchAllGroupSubjects(
                selectedGroup.id,
                session.school_id as number,
            );

            // Asegurarnos de que cada asignación tenga datos de profesor formateados correctamente
            const formattedActive = active.map(assignment => ({
                ...assignment,
                teacherData: assignment.teacherData
                    ? formatTeacherData(assignment.teacherData)
                    : null,
            }));

            // Asegurarnos de que cada materia eliminada tenga datos de profesor formateados correctamente
            const formattedDeleted = deleted.map(deletedSubject => ({
                ...deletedSubject,
                teacher: deletedSubject.teacher
                    ? formatTeacherData(deletedSubject.teacher)
                    : undefined,
            })) as DeletedGroupSubject[];

            setGroupAssignments(formattedActive);
            setDeletedSubjects(formattedDeleted);

            // Extraer profesores asignados usando la función de utilidad
            const assignedTeachersData = extractAssignedTeachers(formattedActive);
            setAssignedTeachers(assignedTeachersData);
        } catch (error) {
            console.error('Error al cargar datos del grupo:', error);
            setErrorState(prev => ({
                ...prev,
                subjects: 'No se pudieron cargar las materias del grupo.',
            }));
            setGroupAssignments([]);
            setAssignedTeachers([]);
            setDeletedSubjects([]);
        } finally {
            setLoadingState(prev => ({
                ...prev,
                groupSubjects: false,
                deletedSubjects: false,
            }));
        }
    }, [selectedGroup, session?.school_id]);

    // Cargar profesores y materias en una sola función
    const loadTeachersAndSubjects = useCallback(async () => {
        if (!session?.school_id) return;

        setLoadingState(prev => ({
            ...prev,
            availableTeachers: true,
            availableSubjects: true,
        }));

        try {
            // Ejecutar ambas consultas en paralelo
            const [allTeachers, subjects] = await Promise.all([
                fetchAllTeachers(session.school_id as number),
                fetchAvailableSubjects(session.school_id as number),
            ]);

            // Formatear datos de profesores para asegurar consistencia
            const formattedTeachers = allTeachers
                .map(formatTeacherData)
                .filter((teacher): teacher is TeacherInfo => teacher !== null);

            setAvailableTeachers(formattedTeachers);
            setAvailableSubjects(subjects);
        } catch (error) {
            console.error('Error al cargar profesores y materias:', error);
            setErrorState(prev => ({
                ...prev,
                teachers: 'No se pudieron cargar los profesores disponibles.',
                subjects: 'No se pudieron cargar las materias disponibles.',
            }));
            setAvailableTeachers([]);
            setAvailableSubjects([]);
        } finally {
            setLoadingState(prev => ({
                ...prev,
                availableTeachers: false,
                availableSubjects: false,
            }));
        }
    }, [session?.school_id]);

    // Funciones de gestión
    const handleAssignTeacher = async (groupSubjectId: number, teacherId: number | null) => {
        if (!selectedGroup) return;

        setLoadingState(prev => ({ ...prev, saving: true }));
        setErrorState(prev => ({ ...prev, saving: null }));

        try {
            // Si teacherId es null, eliminamos la asignación
            if (teacherId === null) {
                const { success } = await removeTeacherFromSubject(groupSubjectId);
                if (!success) {
                    throw new Error('Error al quitar profesor de la materia');
                }
            } else {
                // Si no, asignamos el nuevo profesor
                const { success } = await assignTeacherToSubject(groupSubjectId, teacherId);
                if (!success) {
                    throw new Error('Error al asignar profesor');
                }
            }

            await loadGroupData();
            handleTeacherModalClose();
        } catch (error) {
            console.error('Error al asignar profesor:', error);
            setErrorState(prev => ({
                ...prev,
                saving: 'No se pudo asignar el profesor a la materia.',
            }));
        } finally {
            setLoadingState(prev => ({ ...prev, saving: false }));
        }
    };

    const handleAddSubject = async (subjectId: number, teacherId: number | null = null) => {
        if (!selectedGroup) return;

        setLoadingState(prev => ({ ...prev, saving: true }));
        setErrorState(prev => ({ ...prev, saving: null }));

        try {
            const { success } = await createSubjectAssignment(
                selectedGroup.id,
                subjectId,
                teacherId,
            );
            if (!success) {
                throw new Error('Error al crear asignación');
            }

            await loadGroupData();
            handleSubjectModalClose();
        } catch (error) {
            console.error('Error al agregar materia:', error);
            setErrorState(prev => ({
                ...prev,
                saving: 'No se pudo agregar la materia al grupo.',
            }));
        } finally {
            setLoadingState(prev => ({ ...prev, saving: false }));
        }
    };

    const handleDeleteSubject = async (groupSubjectId: number) => {
        if (!selectedGroup) return;

        setLoadingState(prev => ({ ...prev, saving: true }));
        setErrorState(prev => ({ ...prev, saving: null }));

        try {
            const { success } = await deleteSubjectFromGroup(groupSubjectId);
            if (!success) {
                throw new Error('Error al eliminar materia');
            }

            // Actualizar datos del grupo
            await loadGroupData();
        } catch (error) {
            console.error('Error al eliminar materia:', error);
            setErrorState(prev => ({
                ...prev,
                saving: 'No se pudo eliminar la materia del grupo.',
            }));
        } finally {
            setLoadingState(prev => ({ ...prev, saving: false }));
        }
    };

    // Restaurar una materia eliminada
    const handleRestoreSubject = async (groupSubjectId: number) => {
        if (!selectedGroup) return;

        setLoadingState(prev => ({ ...prev, saving: true }));
        setErrorState(prev => ({ ...prev, saving: null }));

        try {
            const { success } = await restoreSubjectToGroup(groupSubjectId);
            if (!success) {
                throw new Error('Error al restaurar materia');
            }

            // Recargar datos del grupo
            await loadGroupData();
        } catch (error) {
            console.error('Error al restaurar materia:', error);
            setErrorState(prev => ({
                ...prev,
                saving: 'No se pudo restaurar la materia al grupo.',
            }));
        } finally {
            setLoadingState(prev => ({ ...prev, saving: false }));
        }
    };

    // Efectos
    useEffect(() => {
        loadGroups();
    }, [loadGroups]);

    // Cargar datos cuando cambia el grupo seleccionado
    useEffect(() => {
        if (selectedGroup) {
            // Cargar datos en paralelo
            loadGroupData();
            loadTeachersAndSubjects();
        }
    }, [selectedGroup, loadGroupData, loadTeachersAndSubjects]);

    return {
        selectedGroup,
        groupCategories,
        loadingState,
        errorState,
        isTeacherModalOpen,
        isSubjectModalOpen,
        isDeletedItemsModalOpen,
        assignedTeachers,
        availableTeachers,
        availableSubjects,
        groupAssignments,
        deletedSubjects,
        editingAssignment,
        handleGroupChange,
        handleTeacherModalOpen,
        handleTeacherModalClose,
        handleSubjectModalOpen,
        handleSubjectModalClose,
        handleDeletedItemsModalOpen,
        handleDeletedItemsModalClose,
        handleAssignTeacher,
        handleAddSubject,
        handleDeleteSubject,
        handleEditAssignment,
        handleRestoreSubject,
    };
};
