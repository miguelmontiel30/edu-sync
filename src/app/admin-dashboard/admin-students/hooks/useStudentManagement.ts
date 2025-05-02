// React
import {useState, useEffect, useCallback} from 'react';

// Types and utils
import {Student, StudentFormData, StudentGroup, AlertState} from '../module-utils/types';
import {studentRepository} from '../module-utils/repository';

// Hooks
import {useSession} from '@/hooks/useSession';

interface LoadingState {
    students: boolean;
    deleted: boolean;
    metrics: boolean;
    processing: boolean;
    studentGroups: boolean;
}

/**
 * Hook principal para la gestión de estudiantes
 */
export function useStudentManagement() {
    // Estados básicos
    const [students, setStudents] = useState<Student[]>([]);
    const [deletedStudents, setDeletedStudents] = useState<Student[]>([]);
    const [studentGroups, setStudentGroups] = useState<StudentGroup[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
    const [errorAlert, setErrorAlert] = useState<AlertState | null>(null);

    // Efecto para limpiar el mensaje de error después de 5 segundos
    useEffect(() => {
        if (errorAlert?.show) {
            const timer = setTimeout(() => {
                setErrorAlert(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [errorAlert]);

    // Estados de carga
    const [loadingState, setLoadingState] = useState<LoadingState>({
        students: true,
        deleted: true,
        metrics: true,
        processing: false,
        studentGroups: true,
    });

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOptions, setFilterOptions] = useState({
        gender: '',
        status_id: '',
        grade: '',
        group: '',
    });

    // Ordenamiento
    const [sortField, setSortField] = useState<keyof Student>('full_name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Obtener datos de sesión
    const {session} = useSession();

    /**
     * Carga inicial de datos
     */
    useEffect(() => {
        if (session?.school_id) {
            loadStudents();
            loadDeletedStudents();
            loadStudentGroups();
        }
    }, [session]);

    /**
     * Efecto para filtrar y ordenar estudiantes cuando cambian los filtros
     */
    useEffect(() => {
        if (students.length) {
            applyFiltersAndSort();
        }
    }, [students, searchTerm, filterOptions, sortField, sortDirection]);

    /**
     * Carga la lista de estudiantes activos
     */
    const loadStudents = async () => {
        setLoadingState(prev => ({...prev, students: true}));

        try {
            if (!session?.school_id) {
                throw new Error('No se encontró el ID de la escuela en la sesión');
            }

            const data = await studentRepository.getActiveStudents(session.school_id);
            setStudents(data);
            setFilteredStudents(data);
        } catch (error) {
            setErrorAlert({
                show: true,
                variant: 'error',
                title: 'Error',
                message: 'No se pudo cargar la lista de estudiantes',
            });
            console.error('Error al cargar estudiantes:', error);
        } finally {
            setLoadingState(prev => ({...prev, students: false}));
        }
    };

    /**
     * Carga la lista de estudiantes eliminados
     */
    const loadDeletedStudents = async () => {
        setLoadingState(prev => ({...prev, deleted: true}));

        try {
            const data = await studentRepository.getDeletedStudents();
            setDeletedStudents(data);
        } catch (error) {
            console.error('Error al cargar estudiantes eliminados:', error);
        } finally {
            setLoadingState(prev => ({...prev, deleted: false}));
        }
    };

    /**
     * Carga los grupos de estudiantes
     */
    const loadStudentGroups = async () => {
        setLoadingState(prev => ({...prev, studentGroups: true}));

        try {
            const data = await studentRepository.getAllActiveStudentGroups();
            setStudentGroups(data);
        } catch (error) {
            console.error('Error al cargar grupos de estudiantes:', error);
        } finally {
            setLoadingState(prev => ({...prev, studentGroups: false, metrics: false}));
        }
    };

    /**
     * Aplica filtros y ordenamiento a la lista de estudiantes
     */
    const applyFiltersAndSort = useCallback(() => {
        // Aplicar filtros
        let filtered = studentRepository.filterStudentsList(students, {
            searchTerm,
            ...filterOptions,
        });

        // Aplicar ordenamiento
        filtered = studentRepository.sortStudentsList(filtered, sortField, sortDirection);

        setFilteredStudents(filtered);
    }, [students, searchTerm, filterOptions, sortField, sortDirection]);

    /**
     * Gestiona la edición de un estudiante
     */
    const handleEdit = useCallback((student: Student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    }, []);

    /**
     * Gestiona la eliminación de un estudiante
     */
    const handleDelete = useCallback((student: Student) => {
        setStudentToDelete(student);
        setIsDeleteModalOpen(true);
    }, []);

    /**
     * Confirma la eliminación de un estudiante
     */
    const confirmDelete = async () => {
        if (!studentToDelete) return;

        setLoadingState(prev => ({...prev, processing: true}));

        try {
            await studentRepository.deleteStudent(studentToDelete.id);

            // Actualizar listas
            await loadStudents();
            await loadDeletedStudents();

            setIsDeleteModalOpen(false);
            setStudentToDelete(null);
        } catch (error) {
            setErrorAlert({
                show: true,
                variant: 'error',
                title: 'Error',
                message: 'No se pudo eliminar el estudiante',
            });
            console.error('Error al eliminar estudiante:', error);
        } finally {
            setLoadingState(prev => ({...prev, processing: false}));
        }
    };

    /**
     * Gestiona la restauración de un estudiante eliminado
     */
    const handleRestore = async (studentId: number) => {
        setLoadingState(prev => ({...prev, processing: true}));

        try {
            await studentRepository.restoreStudent(studentId);

            // Actualizar listas
            await loadStudents();
            await loadDeletedStudents();
        } catch (error) {
            setErrorAlert({
                show: true,
                variant: 'error',
                title: 'Error',
                message: 'No se pudo restaurar el estudiante',
            });
            console.error('Error al restaurar estudiante:', error);
        } finally {
            setLoadingState(prev => ({...prev, processing: false}));
        }
    };

    /**
     * Abre el modal para crear un nuevo estudiante
     */
    const openModal = useCallback(() => {
        setSelectedStudent(null);
        setIsModalOpen(true);
    }, []);

    /**
     * Cierra el modal
     */
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    }, []);

    /**
     * Guarda un estudiante (nuevo o editado)
     */
    const handleSaveStudent = async (studentData: StudentFormData) => {
        setLoadingState(prev => ({...prev, processing: true}));

        try {
            await studentRepository.saveStudent(studentData);

            // Recargar la lista de estudiantes
            await loadStudents();

            // Cerrar el modal
            setIsModalOpen(false);
            setSelectedStudent(null);
        } catch (error: any) {
            setErrorAlert({
                show: true,
                variant: 'error',
                title: 'Error',
                message: error.message || 'No se pudo guardar el estudiante',
            });
            console.error('Error al guardar estudiante:', error);
        } finally {
            setLoadingState(prev => ({...prev, processing: false}));
        }
    };

    return {
        // Datos
        students,
        deletedStudents,
        filteredStudents,
        studentGroups,

        // UI
        isModalOpen,
        isDeleteModalOpen,
        selectedStudent,
        studentToDelete,
        errorAlert,
        loadingState,

        // Filtros y ordenamiento
        searchTerm,
        setSearchTerm,
        filterOptions,
        setFilterOptions,
        sortField,
        setSortField,
        sortDirection,
        setSortDirection,

        // Acciones
        handleEdit,
        handleDelete,
        confirmDelete,
        openModal,
        closeModal,
        setIsDeleteModalOpen,
        handleSaveStudent,
        handleRestore,
    };
}
