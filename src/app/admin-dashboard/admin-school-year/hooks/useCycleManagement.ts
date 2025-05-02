import {useState, useEffect, useMemo} from 'react';

// Types and Services
import {
    ErrorAlert,
    SchoolCycle,
    CYCLE_STATUS,
    CycleManagementHook,
    LoadingState,
} from '../module-utils/types';
import {
    loadAllSchoolYearData,
    saveCycle,
    deleteCycle,
    restoreCycle,
} from '../module-utils/services';
import {validateCycleData} from '../module-utils/utils';

// Hooks
import {useSession} from '@/hooks/useSession';

export function useCycleManagement(): CycleManagementHook {
    // Estados de datos
    const [cycles, setCycles] = useState<SchoolCycle[]>([]);
    const [deletedCycles, setDeletedCycles] = useState<SchoolCycle[]>([]);

    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<SchoolCycle | null>(null);
    const [cycleToDelete, setCycleToDelete] = useState<SchoolCycle | null>(null);
    const [errorAlert, setErrorAlert] = useState<ErrorAlert | null>(null);

    // Estado centralizado de carga
    const [loadingState, setLoadingState] = useState<LoadingState>({
        cycles: true,
        metrics: true,
        deleted: true,
        processing: false,
    });

    // Obtener datos de sesión
    const {session} = useSession();

    // Cargar datos al montar el componente
    useEffect(() => {
        if (session?.school_id) {
            loadAllCycles();
        }
    }, [session]);

    // Función para cargar todos los ciclos
    async function loadAllCycles() {
        // Establecer todos los estados de carga a true
        setLoadingState(prev => ({
            ...prev,
            cycles: true,
            metrics: true,
            deleted: true,
        }));

        try {
            if (!session?.school_id) {
                throw new Error('No se encontró el ID de la escuela en la sesión');
            }

            // Cargar todos los ciclos en una sola llamada
            const {active, deleted} = await loadAllSchoolYearData(session.school_id);

            // Actualizar los estados
            setCycles(active);
            setDeletedCycles(deleted);

            // Limpiar errores si la carga es exitosa
            setErrorAlert(null);
        } catch (error) {
            console.error('Error al cargar los ciclos escolares:', error);

            // Mostrar alerta de error
            setErrorAlert({
                title: 'Error al cargar los ciclos escolares',
                message: 'Por favor recarga la página.',
            });
        } finally {
            // Restaurar todos los estados de carga a false
            setLoadingState(prev => ({
                ...prev,
                cycles: false,
                metrics: false,
                deleted: false,
            }));
        }
    }

    // Manejar la edición de un ciclo
    const handleEdit = (id: number) => {
        const cycleToEdit = cycles.find(cycle => cycle.id === id);

        if (cycleToEdit) {
            setSelectedCycle(cycleToEdit);
            setIsModalOpen(true);
        }
    };

    // Manejar la eliminación de un ciclo
    function handleDelete(id: number) {
        const cycle = cycles.find(cycle => cycle.id === id);
        if (cycle) {
            setCycleToDelete(cycle);
            setIsDeleteModalOpen(true);
        }
    }

    // Confirmar eliminación del ciclo
    async function confirmDelete() {
        if (!cycleToDelete) return;

        setLoadingState(prev => ({...prev, processing: true}));

        try {
            // Eliminar el ciclo
            await deleteCycle(cycleToDelete.id);

            // Actualizar listas
            await loadAllCycles();

            // Cerrar modal
            setIsDeleteModalOpen(false);
            setCycleToDelete(null);
        } catch (error) {
            console.error('Error al eliminar el ciclo:', error);

            // Mostrar mensaje de error
            setErrorAlert({
                title: 'Error al eliminar el ciclo',
                message: 'No se pudo eliminar el ciclo. Por favor intenta nuevamente.',
            });
        } finally {
            setLoadingState(prev => ({...prev, processing: false}));
        }
    }

    // Abrir modal para crear nuevo ciclo
    function openModal() {
        setSelectedCycle(null);
        setIsModalOpen(true);
    }

    // Cerrar modal
    function closeModal() {
        setIsModalOpen(false);
        setSelectedCycle(null);
    }

    // Guardar ciclo (crear o actualizar)
    async function handleSaveCycle(cycleData: {
        name: string;
        startDate: string;
        endDate: string;
        status: string;
    }): Promise<{success: boolean; errorMessage?: string}> {
        setLoadingState(prev => ({...prev, processing: true}));

        try {
            // Validar datos
            const validation = validateCycleData(cycleData, cycles, selectedCycle?.id);

            if (!validation.isValid) {
                setLoadingState(prev => ({...prev, processing: false}));
                // Retornamos el error para que se muestre en el formulario
                return {
                    success: false,
                    errorMessage:
                        validation.errorMessage || 'Por favor verifica los datos ingresados.',
                };
            }

            // Guardar ciclo
            await saveCycle(cycleData, selectedCycle?.id, session?.id);

            // Actualizar estado local
            await loadAllCycles();

            // Cerrar modal
            closeModal();

            return {success: true};
        } catch (error) {
            console.error('Error al guardar el ciclo:', error);

            // Retornamos el error para que se muestre en el formulario
            return {
                success: false,
                errorMessage: 'No se pudo guardar el ciclo. Por favor intenta nuevamente.',
            };
        } finally {
            setLoadingState(prev => ({...prev, processing: false}));
        }
    }

    // Restaurar ciclo eliminado
    async function handleRestore(id: number) {
        setLoadingState(prev => ({...prev, processing: true}));

        try {
            // Restauramos el ciclo
            await restoreCycle(id);

            // Actualizamos los datos
            await loadAllCycles();
        } catch (error) {
            console.error('Error al restaurar el ciclo:', error);
            setErrorAlert({
                title: 'Error al restaurar el ciclo',
                message: 'No se pudo restaurar el ciclo. Por favor intenta nuevamente.',
            });
        } finally {
            setLoadingState(prev => ({...prev, processing: false}));
        }
    }

    // Calcular métricas de manera segura con useMemo y valores atómicos
    const totalCycles = useMemo(() => cycles.length, [cycles]);

    const activeCycles = useMemo(
        () => cycles.filter(cycle => cycle.status === CYCLE_STATUS.ACTIVE).length,
        [cycles],
    );

    const totalStudents = useMemo(
        () => cycles.reduce((acc, cycle) => acc + cycle.studentsCount, 0),
        [cycles],
    );

    const averageGrade = useMemo(
        () =>
            cycles.length > 0
                ? cycles.reduce((acc, cycle) => acc + cycle.averageGrade, 0) / cycles.length
                : 0,
        [cycles],
    );

    // Agrupar las métricas en un solo objeto memoizado
    const metricsData = useMemo(
        () => ({
            totalCycles,
            activeCycles,
            totalStudents,
            averageGrade,
        }),
        [totalCycles, activeCycles, totalStudents, averageGrade],
    );

    return {
        // Data
        cycles,
        deletedCycles,

        // UI States
        isModalOpen,
        isDeleteModalOpen,
        selectedCycle,
        cycleToDelete,
        errorAlert,
        loadingState,

        // Metrics
        metricsData,

        // Actions
        handleEdit,
        handleDelete,
        confirmDelete,
        openModal,
        closeModal,
        setIsDeleteModalOpen,
        handleSaveCycle,
        handleRestore,
        loadAllCycles,
    };
}
