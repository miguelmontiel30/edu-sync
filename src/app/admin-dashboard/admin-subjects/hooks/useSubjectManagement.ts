// React
import {useState, useEffect} from 'react';

// Types and Services
import {
    ErrorAlert,
    Subject,
    SubjectManagementHook,
    LoadingState,
    SubjectData,
} from '../module-utils/types';
import {
    loadAllSubjectsData,
    saveSubject,
    deleteSubject,
    restoreSubject,
} from '../module-utils/services';

// Hooks
import {useSession} from '@/hooks/useSession';

export function useSubjectManagement(): SubjectManagementHook {
    // Estados de datos
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [deletedSubjects, setDeletedSubjects] = useState<Subject[]>([]);

    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
    const [errorAlert, setErrorAlert] = useState<ErrorAlert | null>(null);

    // Estado centralizado de carga
    const [loadingState, setLoadingState] = useState<LoadingState>({
        subjects: true,
        metrics: true,
        deleted: true,
        processing: false,
    });

    // Obtener datos de sesión
    const {session} = useSession();

    // Cargar datos al montar el componente
    useEffect(() => {
        if (session?.school_id) {
            loadAllSubjects();
        }
    }, [session]);

    // Función para cargar todas las materias
    async function loadAllSubjects() {
        // Establecer todos los estados de carga a true
        setLoadingState(prev => ({
            ...prev,
            subjects: true,
            metrics: true,
            deleted: true,
        }));

        try {
            if (!session?.school_id) {
                throw new Error('No se encontró el ID de la escuela en la sesión');
            }

            // Cargar todas las materias en una sola llamada
            const {active, deleted} = await loadAllSubjectsData(session.school_id);

            // Actualizar los estados
            setSubjects(active);
            setDeletedSubjects(deleted);

            // Limpiar errores si la carga es exitosa
            setErrorAlert(null);
        } catch (error) {
            console.error('Error al cargar las materias:', error);

            // Mostrar alerta de error
            setErrorAlert({
                title: 'Error al cargar las materias',
                message: 'Por favor recarga la página.',
            });
        } finally {
            // Restaurar todos los estados de carga a false
            setLoadingState(prev => ({
                ...prev,
                subjects: false,
                metrics: false,
                deleted: false,
            }));
        }
    }

    // Manejar la edición de una materia
    function handleEdit(id: number) {
        const subjectToEdit = subjects.find(subject => subject.id === id);

        if (subjectToEdit) {
            setSelectedSubject(subjectToEdit);
            setIsModalOpen(true);
        }
    }

    // Manejar la eliminación de una materia
    function handleDelete(id: number) {
        const subject = subjects.find(subject => subject.id === id);
        if (subject) {
            setSubjectToDelete(subject);
            setIsDeleteModalOpen(true);
        }
    }

    // Confirmar eliminación de la materia
    async function confirmDelete() {
        if (!subjectToDelete) return;

        setLoadingState(prev => ({...prev, processing: true}));

        try {
            // Eliminar la materia
            await deleteSubject(subjectToDelete.id);

            // Actualizar listas
            await loadAllSubjects();

            // Cerrar modal
            setIsDeleteModalOpen(false);
            setSubjectToDelete(null);
        } catch (error) {
            console.error('Error al eliminar la materia:', error);

            // Mostrar mensaje de error
            setErrorAlert({
                title: 'Error al eliminar la materia',
                message: 'No se pudo eliminar la materia. Por favor intenta nuevamente.',
            });
        } finally {
            setLoadingState(prev => ({...prev, processing: false}));
        }
    }

    // Abrir modal para crear nueva materia
    function openModal() {
        setSelectedSubject(null);
        setIsModalOpen(true);
    }

    // Cerrar modal
    function closeModal() {
        setIsModalOpen(false);
        setSelectedSubject(null);
    }

    // Validar datos de materia
    function validateSubjectData(subjectData: SubjectData): {
        isValid: boolean;
        errorMessage?: string;
    } {
        // Validar nombre (requerido)
        if (!subjectData.name || subjectData.name.trim() === '') {
            return {isValid: false, errorMessage: 'El nombre de la materia es obligatorio'};
        }

        // Si llegamos aquí, la validación es exitosa
        return {isValid: true};
    }

    // Guardar materia (crear o actualizar)
    async function handleSaveSubject(
        subjectData: SubjectData,
    ): Promise<{success: boolean; errorMessage?: string}> {
        setLoadingState(prev => ({...prev, processing: true}));

        try {
            // Validar datos
            const validation = validateSubjectData(subjectData);

            if (!validation.isValid) {
                setLoadingState(prev => ({...prev, processing: false}));
                // Retornamos el error para que se muestre en el formulario
                return {
                    success: false,
                    errorMessage:
                        validation.errorMessage || 'Por favor verifica los datos ingresados.',
                };
            }

            // Guardar materia
            await saveSubject(subjectData, selectedSubject?.id, session?.id);

            // Actualizar estado local
            await loadAllSubjects();

            // Cerrar modal
            closeModal();

            return {success: true};
        } catch (error) {
            console.error('Error al guardar la materia:', error);

            // Retornamos el error para que se muestre en el formulario
            return {
                success: false,
                errorMessage: 'No se pudo guardar la materia. Por favor intenta nuevamente.',
            };
        } finally {
            setLoadingState(prev => ({...prev, processing: false}));
        }
    }

    // Restaurar materia eliminada
    async function handleRestore(id: number) {
        setLoadingState(prev => ({...prev, deleted: true}));

        try {
            // Restaurar materia
            await restoreSubject(id);

            // Actualizar listas
            await loadAllSubjects();
        } catch (error) {
            console.error('Error al restaurar la materia:', error);

            // Mostrar mensaje de error
            setErrorAlert({
                title: 'Error al restaurar la materia',
                message: 'No se pudo restaurar la materia. Por favor intenta nuevamente.',
            });
        } finally {
            setLoadingState(prev => ({...prev, deleted: false}));
        }
    }

    return {
        // Data
        subjects,
        deletedSubjects,

        // UI States
        isModalOpen,
        isDeleteModalOpen,
        selectedSubject,
        subjectToDelete,
        errorAlert,
        loadingState,

        // Actions
        handleEdit,
        handleDelete,
        confirmDelete,
        openModal,
        closeModal,
        setIsDeleteModalOpen,
        handleSaveSubject,
        handleRestore,
        loadAllSubjects,
    };
}
