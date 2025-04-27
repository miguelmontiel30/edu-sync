'use client';

// React
import { useState, useEffect } from 'react';

// Components
import TeacherList from './components/TeacherList';
import TeacherFormModal from './components/TeacherFormModal';

// Core
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import MetricsGroup from '../core/Metrics/MetricsGroup';
import DeleteConfirmModal from '../core/Modals/DeleteConfirmModal';
import MetricsChartsWrapper from '@/components/core/metrics/MetricsChartsWrapper';
import BarChartsGroup, { ChartData } from '../core/BarCharts/BarChartsGroup';
import DeletedItemsList, { DeletedItemsListConfig } from '../core/Tables/DeletedItemsList';

// Types and Services
import { MetricConfig } from '../core/Metrics/types';
import { Teacher, TeacherForm } from './components/types';
import { loadTeachers, loadDeletedTeachers, saveTeacher, deleteTeacher, restoreTeacher } from './components/services';

// Hooks
import { useSession } from '@/hooks/useSession';


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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

    // Obtener datos de sesion en cache del usuario
    const { session } = useSession();

    // Cargar datos al montar el componente
    useEffect(() => {
        if (session?.school_id) {
            loadAllTeachers();
        }
    }, [session]);

    // Función para cargar todos los profesores
    async function loadAllTeachers() {
        await Promise.all([
            // Cargar profesores activos
            fetchTeachers(),

            // Cargar profesores eliminados
            fetchDeletedTeachers()
        ]);
    }

    // Cargar profesores activos
    async function fetchTeachers() {
        setIsLoadingTeachers(true);
        setIsLoadingMetrics(true);
        try {
            const data = await loadTeachers(session?.school_id ?? 0);
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
            const data = await loadDeletedTeachers(session?.school_id ?? 0);
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
    function handleDelete(id: number) {
        const teacher = teachers.find(teacher => teacher.teacher_id === id);
        if (teacher) {
            setTeacherToDelete(teacher);
            setIsDeleteModalOpen(true);
        }
    }

    // Confirmar eliminación del profesor
    async function confirmDelete() {
        if (!teacherToDelete) return;

        setIsSaving(true);

        try {
            // Eliminar el profesor
            await deleteTeacher(teacherToDelete.teacher_id);

            // Actualizar listas
            await loadAllTeachers();

            // Cerrar modal
            setIsDeleteModalOpen(false);
            setTeacherToDelete(null);
        } catch (error) {
            console.error('Error al eliminar el profesor:', error);
            // El modal de confirmación mostrará el error
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

    // Calcular métricas
    const totalTeachers = teachers.length;
    const activeTeachers = teachers.filter(teacher => teacher.groupsCount > 0).length;
    const multiSubjectTeachers = teachers.filter(teacher => teacher.subjectsCount > 1).length;
    const avgSubjectsPerTeacher = totalTeachers > 0
        ? teachers.reduce((acc, teacher) => acc + teacher.subjectsCount, 0) / totalTeachers
        : 0;
    const maleCount = teachers.filter(t => t.gender === 'Masculino').length;
    const femaleCount = teachers.filter(t => t.gender === 'Femenino').length;
    const femalePercentage = totalTeachers ? (femaleCount / totalTeachers) * 100 : 0;

    const metricsConfig: MetricConfig[] = [
        {
            id: "total-teachers",
            icon: "person-chalkboard",
            title: "Total de Profesores",
            value: totalTeachers,
            badgeColor: "info",
            badgeText: `${activeTeachers} activos`
        },
        {
            id: "subjects-per-teacher",
            icon: "books",
            title: "Materias por Profesor",
            value: avgSubjectsPerTeacher.toFixed(1),
            badgeColor: "success",
            badgeText: `${multiSubjectTeachers} multi-materia`
        },
        {
            id: "gender-distribution",
            icon: "venus-mars",
            title: "Distribución Género",
            value: `${maleCount}M / ${femaleCount}F`,
            badgeColor: "warning",
            badgeText: `${femalePercentage.toFixed(0)}% mujeres`
        }
    ];

    // Preparar datos para gráficos
    const chartData: ChartData[] = teachers.map((teacher, index) => ({
        id: teacher.teacher_id.toString(),
        name: teacher.name,
        label: teacher.name,
        value: index,
        gender_id: teacher.gender_id
    }));

    const chartConfigs = [
        {
            title: 'Profesores por género',
            dataKey: 'value',
            color: 'blue',
            yAxisTitle: 'Número de profesores',
        },
        {
            title: 'Profesores por materia',
            dataKey: 'value',
            color: 'blue',
            yAxisTitle: 'Número de profesores',
        },
    ];

    // Adaptar profesores para DeletedItemsList que requiere objetos BaseItem con id
    const teachersForDeletedList = deletedTeachers.map(teacher => ({
        ...teacher,
        id: teacher.teacher_id // Mapear teacher_id a id para cumplir con BaseItem
    }));

    const teacherListConfig: DeletedItemsListConfig<typeof teachersForDeletedList[0]> = {
        title: 'Profesores eliminados',
        description: 'Lista de profesores eliminados',
        noDataMessage: 'No hay profesores eliminados',
        searchPlaceholder: 'Buscar profesores eliminados...',
        searchNoResultsMessage: 'No se encontraron profesores que coincidan con la búsqueda',
        buttonLabel: 'Profesores eliminados',
        itemsPerPage: 10,
        maxHeight: '400px',
        columns: [
            {
                key: 'first_name',
                header: 'Nombre',
                sortable: true,
                render: (teacher) => (
                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                        {teacher.first_name}
                    </span>
                )
            },
            {
                key: 'father_last_name',
                header: 'Apellido Paterno',
                sortable: true,
                render: (teacher) => (
                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                        {teacher.father_last_name}
                    </span>
                )
            },
            {
                key: 'mother_last_name',
                header: 'Apellido Materno',
                sortable: true,
                render: (teacher) => (
                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                        {teacher.mother_last_name}
                    </span>
                )
            },
            {
                key: 'birth_date',
                header: 'Fecha de Nacimiento',
                sortable: true,
                render: (teacher) => (
                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                        {new Date(teacher.birth_date).toLocaleDateString()}
                    </span>
                )
            },
        ],
    };

    return (
        <div className="mx-auto max-w-screen-2xl md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Gestión de profesores" />

            {/* Metrics and Charts Wrapper */}
            <MetricsChartsWrapper title="Estadísticas y Gráficos de Profesores">
                <MetricsGroup metricsConfig={metricsConfig} isLoading={isLoadingMetrics} isEmpty={teachers.length === 0} emptyMessage="No hay profesores activos" />

                <BarChartsGroup data={chartData} isLoading={isLoadingTeachers} charts={chartConfigs} />
            </MetricsChartsWrapper>

            {/* Teacher List */}
            <TeacherList
                teachers={teachers}
                isLoading={isLoadingTeachers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddNew={openModal}
            />

            {/* Deleted Teachers */}
            <DeletedItemsList
                items={teachersForDeletedList}
                isLoading={isLoadingDeleted}
                onRestore={handleRestore}
                config={{
                    ...teacherListConfig,
                }}
                className="mt-6"
            />

            {/* Form Modal */}
            <TeacherFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveTeacher}
                selectedTeacher={selectedTeacher}
                isSaving={isSaving}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setTeacherToDelete(null);
                }}
                onConfirm={confirmDelete}
                itemName={teacherToDelete ? `${teacherToDelete.first_name} ${teacherToDelete.father_last_name}` : ''}
                itemType="profesor"
                isDeleting={isSaving}
            />
        </div>
    );
} 