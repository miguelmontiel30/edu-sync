import {useState} from 'react';
import {StudentFormData} from '../../module-utils/types';
import {Student as ProfileStudent} from '../module-utils/types';
import {Student as FormStudent} from '../../module-utils/types';

/**
 * Hook para gestionar los modales del perfil de estudiante
 * @param student Datos del estudiante
 * @param handleEditPersonalInfo Función para actualizar la información del estudiante
 * @returns Estado y funciones para gestionar los modales
 */
export default function useStudentModals(
    student: ProfileStudent | null,
    handleEditPersonalInfo: (data: any) => Promise<any>,
    isSaving: boolean,
) {
    // Estado para los modales
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddTutorModalOpen, setIsAddTutorModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    // Función para abrir el modal de edición
    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    // Función para cerrar el modal de edición
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    // Función para abrir el modal de añadir tutor
    const openAddTutorModal = () => {
        setIsAddTutorModalOpen(true);
    };

    // Función para cerrar el modal de añadir tutor
    const closeAddTutorModal = () => {
        setIsAddTutorModalOpen(false);
    };

    // Función para abrir el modal de dirección
    const openAddressModal = () => {
        setIsAddressModalOpen(true);
    };

    // Función para cerrar el modal de dirección
    const closeAddressModal = () => {
        setIsAddressModalOpen(false);
    };

    // Función para guardar los cambios del formulario de estudiante
    const handleSaveStudentInfo = async (formData: StudentFormData) => {
        try {
            await handleEditPersonalInfo(formData);
            closeEditModal();
        } catch (error) {
            console.error('Error al guardar la información del estudiante:', error);
        }
    };

    // Función adaptadora para convertir el estudiante del perfil al formato del formulario
    const adaptStudentToFormData = (profileStudent: ProfileStudent): FormStudent => {
        // Dividir el nombre completo en partes
        const nameParts = profileStudent.full_name.split(' ');

        return {
            id: parseInt(profileStudent.id),
            first_name: nameParts[0] || '',
            father_last_name: nameParts[1] || '',
            mother_last_name: nameParts.slice(2).join(' ') || '',
            birth_date: profileStudent.birth_date,
            gender_id: profileStudent.gender ? parseInt(profileStudent.gender.id) : 1,
            curp: profileStudent.curp,
            phone: profileStudent.phone || '',
            email: profileStudent.email || '',
            image_url: profileStudent.avatar_url || null,
            status_id: 1, // Valor por defecto
            // Campos requeridos por la interfaz
            school_id: 1,
            delete_flag: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
        };
    };

    // Adaptar el estudiante del perfil al formato requerido por el formulario si existe
    const adaptedStudent = student ? adaptStudentToFormData(student) : null;

    return {
        isEditModalOpen,
        isAddTutorModalOpen,
        isAddressModalOpen,
        openEditModal,
        closeEditModal,
        openAddTutorModal,
        closeAddTutorModal,
        openAddressModal,
        closeAddressModal,
        handleSaveStudentInfo,
        adaptedStudent,
        isSaving,
    };
}
