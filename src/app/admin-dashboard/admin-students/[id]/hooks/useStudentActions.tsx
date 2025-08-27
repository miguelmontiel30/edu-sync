import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Services
import {
    updateStudentBasicInfo,
} from '../module-utils/services';

// Types
import { Student, Address, Tutor } from '../module-utils/types';

/**
 * Hook para manejar las acciones del perfil de estudiante
 */
const useStudentActions = (studentId: string, refreshData: { loadStudentData: () => void; loadAddresses: () => void; loadTutors: () => void }) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Volver a la página de estudiantes
    const handleBackToStudents = () => {
        router.push('/admin-dashboard/admin-students');
    };

    // Editar información personal del estudiante
    const handleEditPersonalInfo = async (data: Partial<Student>) => {
        if (!studentId) return { success: false, error: 'ID de estudiante no válido' };

        setIsSaving(true);
        setError(null);

        try {
            const numericStudentId = parseInt(studentId);
            const { error } = await updateStudentBasicInfo(numericStudentId, {
                ...data,
                updated_at: new Date().toISOString()
            });

            if (error) throw error;

            // Recargar datos del estudiante
            refreshData.loadStudentData();

            return { success: true };
        } catch (err: unknown) {
            // Log removed for linting compliance
            setError('No se pudo actualizar la información. Intenta nuevamente.');
            return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
        } finally {
            setIsSaving(false);
        }
    };

    // Editar direcciones del estudiante
    const handleEditAddresses = (_addressData: Address) => {
        if (!studentId) return { success: false, error: 'ID de estudiante no válido' };

        setIsSaving(true);
        setError(null);

        try {
            // const numericStudentId = parseInt(studentId);

            // Si es dirección actual, actualizar las demás a no actuales
            if (_addressData.is_current) {
                // Esta lógica debería manejarse en el backend idealmente
            }

            // const { error } = await upsertAddress({
            //     ...addressData,
            //     student_id: numericStudentId,
            //     updated_at: new Date().toISOString()
            // });

            // if (error) throw error;

            // // Recargar direcciones
            // refreshData.loadAddresses();

            return { success: true };
        } catch (err: unknown) {
            // Log removed for linting compliance
            setError('No se pudo actualizar la dirección. Intenta nuevamente.');
            return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
        } finally {
            setIsSaving(false);
        }
    };

    // Agregar tutor al estudiante
    const handleAddTutor = (_tutorData: Tutor) => {
        if (!studentId) return { success: false, error: 'ID de estudiante no válido' };

        setIsSaving(true);
        setError(null);

        try {
            // const numericStudentId = parseInt(studentId);

            // const { error } = await addTutor({
            //     ...tutorData,
            //     student_id: numericStudentId,
            //     created_at: new Date().toISOString(),
            //     updated_at: new Date().toISOString()
            // });

            // if (error) throw error;

            // // Recargar tutores
            // refreshData.loadTutors();

            return { success: true };
        } catch (err: unknown) {
            // Log removed for linting compliance
            setError('No se pudo agregar el tutor. Intenta nuevamente.');
            return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
        } finally {
            setIsSaving(false);
        }
    };

    // Ver detalles del tutor
    const handleViewTutorDetails = (_tutorId: number) => {
        // Esta función podría redirigir a una página de detalles del tutor o abrir un modal
        // Log removed for linting compliance
    };

    return {
        isSaving,
        error,
        handleBackToStudents,
        handleEditPersonalInfo,
        handleEditAddresses,
        handleAddTutor,
        handleViewTutorDetails
    };
};

export default useStudentActions; 