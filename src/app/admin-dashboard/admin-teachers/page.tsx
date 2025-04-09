'use client';

// React
import { useState, useEffect } from 'react';

// Components
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TeacherList from './components/TeacherList';
import DeletedTeacherList from './components/DeletedTeacherList';
import TeacherFormModal from './components/TeacherFormModal';
import MetricsAndChartsWrapper from './components/MetricsAndChartsWrapper';

// Types and Services
import { Teacher, TeacherForm } from './components/types';
import { loadTeachers, loadDeletedTeachers, saveTeacher, deleteTeacher, restoreTeacher } from './components/services';

export default function TeachersDashboard() {
    // Estados
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [deletedTeachers, setDeletedTeachers] = useState<Teacher[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
    const [isLoadingDeleted, setIsLoadingDeleted] = useState(true);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Cargar datos al montar el componente
    useEffect(() => {
        loadAllTeachers();
    }, []);

    // Función para cargar todos los profesores
    async function loadAllTeachers() {
        await Promise.all([
            fetchTeachers(),
            fetchDeletedTeachers()
        ]);
    }

    // Cargar profesores activos
    async function fetchTeachers() {
        setIsLoadingTeachers(true);
        setIsLoadingMetrics(true);
        try {
            const data = await loadTeachers();
            setTeachers(data);
        } catch (error) {
            console.error('Error al cargar los profesores:', error);
            alert('Error al cargar los profesores. Por favor recarga la página.');
        } finally {
            setIsLoadingTeachers(false);
            setIsLoadingMetrics(false);
        }
    }

    // Cargar profesores eliminados
    async function fetchDeletedTeachers() {
        setIsLoadingDeleted(true);
        try {
            const data = await loadDeletedTeachers();
            setDeletedTeachers(data);
        } catch (error) {
            console.error('Error al cargar los profesores eliminados:', error);
        } finally {
            setIsLoadingDeleted(false);
        }
    }

    // Manejar la edición de un profesor
    const handleEdit = (id: number) => {
        const teacherToEdit = teachers.find(teacher => teacher.teacher_id === id);
        if (teacherToEdit) {
            setSelectedTeacher(teacherToEdit);
            setIsModalOpen(true);
        }
    };

    // Manejar la eliminación de un profesor
    async function handleDelete(id: number) {
        if (!confirm('¿Estás seguro de que deseas eliminar este profesor?')) return;

        setIsSaving(true);

        try {
            // Eliminar el profesor
            await deleteTeacher(id);

            // Actualizar listas
            await loadAllTeachers();
        } catch (error) {
            console.error('Error al eliminar el profesor:', error);
            alert('Error al eliminar el profesor. Por favor intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    }

    // Abrir modal para crear nuevo profesor
    function openModal() {
        setSelectedTeacher(null);
        setIsModalOpen(true);
    }

    // Cerrar modal
    function closeModal() {
        setIsModalOpen(false);
        setSelectedTeacher(null);
    }

    // Guardar profesor (crear o actualizar)
    async function handleSaveTeacher(teacherData: TeacherForm) {
        setIsSaving(true);
        try {
            // Validar datos básicos
            if (!teacherData.first_name || !teacherData.father_last_name || !teacherData.birth_date || !teacherData.gender_id) {
                alert('Por favor completa todos los campos requeridos');
                setIsSaving(false);
                return;
            }

            await saveTeacher(teacherData, selectedTeacher?.teacher_id);

            // Actualizar estado local
            await fetchTeachers();
            closeModal();
        } catch (error) {
            console.error('Error al guardar el profesor:', error);
            alert('Error al guardar el profesor. Por favor intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    }

    // Restaurar profesor eliminado
    async function handleRestore(id: number) {
        try {
            // Restauramos el profesor
            await restoreTeacher(id);

            // Actualizamos los datos
            await loadAllTeachers();
        } catch (error) {
            console.error('Error al restaurar el profesor:', error);
            alert('Error al restaurar el profesor. Por favor intenta nuevamente.');
        }
    }

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Gestión de profesores" />

            {/* Metrics and Charts Wrapper */}
            <MetricsAndChartsWrapper
                teachers={teachers}
                isLoading={isLoadingMetrics}
            />

            {/* Teacher List */}
            <TeacherList
                teachers={teachers}
                isLoading={isLoadingTeachers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddNew={openModal}
            />

            {/* Deleted Teachers */}
            <DeletedTeacherList
                teachers={deletedTeachers}
                isLoading={isLoadingDeleted}
                onRestore={handleRestore}
            />

            {/* Form Modal */}
            <TeacherFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveTeacher}
                selectedTeacher={selectedTeacher}
                isSaving={isSaving}
            />
        </div>
    );
} 