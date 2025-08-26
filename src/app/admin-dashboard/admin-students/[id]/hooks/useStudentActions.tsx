import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Services
import {
    updateStudentBasicInfo,
} from '../module-utils/services';

/**
 * Hook para manejar las acciones del perfil de estudiante
 */
const useStudentActions = (studentId: string, refreshData: any) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Volver a la página de estudiantes
    const handleBackToStudents = () => {
        router.push('/admin-dashboard/admin-students');
    };

    // Editar información personal del estudiante
    const handleEditPersonalInfo = async (data: any) => {
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
        } catch (err: any) {
            console.error('Error al actualizar información del estudiante:', err);
            setError('No se pudo actualizar la información. Intenta nuevamente.');
            return { success: false, error: err.message };
        } finally {
            setIsSaving(false);
        }
    };

    // Editar direcciones del estudiante
    const handleEditAddresses = (_addressData: any) => {
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
        } catch (err: any) {
            console.error('Error al actualizar dirección:', err);
            setError('No se pudo actualizar la dirección. Intenta nuevamente.');
            return { success: false, error: err.message };
        } finally {
            setIsSaving(false);
        }
    };

    // Agregar tutor al estudiante
    const handleAddTutor = (_tutorData: any) => {
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
        } catch (err: any) {
            console.error('Error al agregar tutor:', err);
            setError('No se pudo agregar el tutor. Intenta nuevamente.');
            return { success: false, error: err.message };
        } finally {
            setIsSaving(false);
        }
    };

    // Ver detalles del tutor
    const handleViewTutorDetails = (tutorId: number) => {
        // Esta función podría redirigir a una página de detalles del tutor o abrir un modal
        console.log(`Ver detalles del tutor con ID: ${tutorId}`);
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