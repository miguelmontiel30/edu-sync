// React
import { useState, useEffect, useMemo } from 'react';

// Types
import {
    Group,
    GroupFormData,
    SortField,
    SortDirection,
    ErrorAlert,
    LoadingState,
    GroupManagementHook,
    GROUP_STATUS,
} from '../module-utils/types';

// Services
import { loadAllGroupsData, saveGroup, deleteGroup, restoreGroup } from '../module-utils/services';

// Importar el servicio de SchoolYear
import { loadSchoolYearsBySchoolId } from '@/app/admin-dashboard/admin-school-year/module-utils/services';

// Hooks
import { useSession } from '@/hooks/useSession';

export function useGroupManagement(): GroupManagementHook {
    // Estados para datos
    const [groups, setGroups] = useState<Group[]>([]);
    const [deletedGroups, setDeletedGroups] = useState<Group[]>([]);
    const [schoolYears, setSchoolYears] = useState<
        Array<{ id: number; name: string; status: string }>
    >([]);

    // Estados para UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnlyActiveCycles, setShowOnlyActiveCycles] = useState(true);
    const [sortField, setSortField] = useState<SortField>('grade');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [errorAlert, setErrorAlert] = useState<ErrorAlert | null>(null);

    // Estado de carga
    const [loadingState, setLoadingState] = useState<LoadingState>({
        groups: true,
        metrics: true,
        deleted: true,
        processing: false,
    });

    // Obtener datos de sesión
    const { session } = useSession();

    // Cargar datos iniciales
    useEffect(() => {
        if (session?.school_id) {
            loadGroups();
            loadSchoolYears();
        }
    }, [session]);

    // Función para cargar grupos
    async function loadGroups() {
        setLoadingState(prev => ({ ...prev, groups: true, metrics: true, deleted: true }));
        try {
            if (!session?.school_id) {
                throw new Error('No se encontró el ID de la escuela en la sesión');
            }

            // Cargar todos los grupos en una sola llamada
            const { active, deleted } = await loadAllGroupsData(session.school_id);

            // Actualizar los estados
            setGroups(active);
            setDeletedGroups(deleted);

            // Limpiar errores si la carga es exitosa
            setErrorAlert(null);
        } catch (error) {
            console.error('Error al cargar los grupos:', error);
            setErrorAlert({
                title: 'Error de carga',
                message: 'No se pudieron cargar los grupos. Por favor recarga la página.',
            });
        } finally {
            setLoadingState(prev => ({
                ...prev,
                groups: false,
                metrics: false,
                deleted: false,
            }));
        }
    }

    // Función para cargar ciclos escolares
    async function loadSchoolYears() {
        try {
            if (!session?.school_id) {
                throw new Error('No se encontró el ID de la escuela en la sesión');
            }

            // Utilizar el servicio de ciclos escolares para obtener los datos
            const schoolYearsData = await loadSchoolYearsBySchoolId(session.school_id);

            // Mapear los datos al formato requerido por el componente
            setSchoolYears(
                schoolYearsData.map(year => ({
                    id: year.id,
                    name: year.name,
                    status: year.status,
                })),
            );
        } catch (error) {
            console.error('Error al cargar los ciclos escolares:', error);
        }
    }

    // Abrir modal para crear grupo
    function openModal() {
        setSelectedGroup(null);
        setIsModalOpen(true);
    }

    // Cerrar modal
    function closeModal() {
        setIsModalOpen(false);
        setSelectedGroup(null);
    }

    // Manejar edición de grupo
    function handleEdit(id: number) {
        const groupToEdit = groups.find(group => group.id === id);

        // Si el grupo existe, abrir el modal para editar
        if (groupToEdit) {
            // Actualizar el grupo seleccionado
            setSelectedGroup(groupToEdit);

            // Abrir el modal
            setIsModalOpen(true);
        }
    }

    // Manejar eliminación (mostrar confirmación)
    function handleDelete(id: number) {
        const group = groups.find(g => g.id === id);
        if (group) {
            setGroupToDelete(group);
            setIsDeleteModalOpen(true);
        }
    }

    // Confirmar eliminación
    async function confirmDelete() {
        if (!groupToDelete) return;

        setLoadingState(prev => ({ ...prev, processing: true }));
        try {
            // Eliminar el grupo
            await deleteGroup(groupToDelete.id);

            // Recargar datos
            await loadGroups();

            // Cerrar modal y limpiar estado
            setIsDeleteModalOpen(false);
            setGroupToDelete(null);
        } catch (error) {
            console.error('Error al eliminar el grupo:', error);
            setErrorAlert({
                title: 'Error al eliminar',
                message: 'No se pudo eliminar el grupo. Por favor intenta nuevamente.',
            });
        } finally {
            setLoadingState(prev => ({ ...prev, processing: false }));
        }
    }

    // Guardar grupo (nuevo o editar)
    async function handleSaveGroup(groupData: GroupFormData) {
        setLoadingState(prev => ({ ...prev, processing: true }));
        try {
            // Validar que todos los campos estén completados
            if (!groupData.grade || !groupData.group || !groupData.schoolYearId) {
                setErrorAlert({
                    title: 'Datos incompletos',
                    message: 'Por favor completa todos los campos requeridos para crear el grupo.',
                });
                return;
            }

            // Guardar grupo, pasando el ID si es una edición
            await saveGroup(groupData, session?.school_id as number, selectedGroup?.id as number);

            // Recargar datos después de cualquier operación exitosa
            await loadGroups();
            closeModal();
            setErrorAlert(null);
        } catch (error) {
            console.error('Error al guardar el grupo:', error);
            setErrorAlert({
                title: 'Error al guardar',
                message: 'No se pudo guardar el grupo. Por favor intenta nuevamente.',
            });
        } finally {
            setLoadingState(prev => ({ ...prev, processing: false }));
        }
    }

    // Restaurar grupo eliminado
    async function handleRestore(id: number) {
        setLoadingState(prev => ({ ...prev, processing: true }));
        try {
            // Restaurar el grupo
            await restoreGroup(id);

            // Recargar datos
            await loadGroups();
        } catch (error) {
            console.error('Error al restaurar el grupo:', error);
            setErrorAlert({
                title: 'Error al restaurar',
                message: 'No se pudo restaurar el grupo. Por favor intenta nuevamente.',
            });
        } finally {
            setLoadingState(prev => ({ ...prev, processing: false }));
        }
    }

    // Función para manejar el ordenamiento
    function handleSort(field: SortField) {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    }

    // Calcular métricas con useMemo para evitar recálculos innecesarios
    const totalGroups = useMemo(() => groups.length, [groups]);

    const activeGroups = useMemo(
        () => groups.filter(group => group.status_id === GROUP_STATUS.ACTIVE).length,
        [groups],
    );

    const totalStudents = useMemo(
        () => groups.reduce((acc, group) => acc + group.studentsNumber, 0),
        [groups],
    );

    const averageGrade = useMemo(
        () =>
            groups.length > 0
                ? groups.reduce((acc, group) => acc + group.generalAverage, 0) / groups.length
                : 0,
        [groups],
    );

    // Agrupar las métricas en un solo objeto memoizado
    const metricsData = useMemo(
        () => ({
            totalGroups,
            activeGroups,
            totalStudents,
            averageGrade,
        }),
        [totalGroups, activeGroups, totalStudents, averageGrade],
    );

    return {
        // Datos
        groups,
        deletedGroups,
        schoolYears,

        // Estados de UI
        isModalOpen,
        isDeleteModalOpen,
        selectedGroup,
        groupToDelete,
        searchTerm,
        showOnlyActiveCycles,
        sortField,
        sortDirection,
        errorAlert,
        loadingState,

        // Métricas
        metricsData,

        // Acciones
        handleEdit,
        handleDelete,
        confirmDelete,
        openModal,
        closeModal,
        setIsDeleteModalOpen,
        handleSaveGroup,
        handleRestore,
        setSearchTerm,
        setShowOnlyActiveCycles,
        handleSort,
        loadGroups,
        loadSchoolYears,
    };
}
