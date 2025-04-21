'use client';

// React
import { useState, useEffect } from 'react';

// Components
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CycleList from './components/CycleList';
import DeletedCycleList from './components/DeletedCycleList';
import CycleFormModal from './components/CycleFormModal';
import Charts from './components/Charts';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import MetricsChartsWrapper from '@/components/core/metrics/MetricsChartsWrapper';
import MetricsGroup from '../core/Metrics/MetricsGroup';

// Types and Services
import { MetricConfig } from '../core/Metrics/types';
import { SchoolCycle } from './components/types';
import { loadSchoolYearsBySchoolId, loadDeletedCycles, saveCycle, deleteCycle, restoreCycle, } from './components/services';

// Hooks
import { useSession } from '@/hooks/useSession';

export default function SchoolYearDashboard() {
    // Estados
    const [cycles, setCycles] = useState<SchoolCycle[]>([]);
    const [deletedCycles, setDeletedCycles] = useState<SchoolCycle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<SchoolCycle | null>(null);
    const [isLoadingCycles, setIsLoadingCycles] = useState(true);
    const [isLoadingDeleted, setIsLoadingDeleted] = useState(true);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [cycleToDelete, setCycleToDelete] = useState<SchoolCycle | null>(null);

    // Obtener datos de sesion en cache del usuario
    const { session } = useSession();


    // Cargar datos al montar el componente
    useEffect(() => {
        if (session?.school_id) {
            loadAllCycles();
        }
    }, [session]);

    // Función para cargar todos los ciclos
    async function loadAllCycles() {
        await Promise.all([
            fetchSchoolYears(),
            fetchDeletedCycles()
        ]);
    }

    // Cargar ciclos activos
    async function fetchSchoolYears() {
        setIsLoadingCycles(true);
        setIsLoadingMetrics(true);
        try {
            if (!session?.school_id) {
                throw new Error('No se encontró el ID de la escuela en la sesión');
            }

            // Cargar los ciclos activos de la escuela
            const data = await loadSchoolYearsBySchoolId(session?.school_id ?? 0);

            // Actualizar el estado local con los datos cargados
            setCycles(data);
        } catch (error) {
            console.error('Error al cargar los ciclos escolares:', error);
            alert('Error al cargar los ciclos escolares. Por favor recarga la página.');
        } finally {
            setIsLoadingCycles(false);
            setIsLoadingMetrics(false);
        }
    }

    // Cargar ciclos eliminados
    async function fetchDeletedCycles() {
        setIsLoadingDeleted(true);
        try {
            if (!session?.school_id) {
                throw new Error('No se encontró el ID de la escuela en la sesión');
            }

            const data = await loadDeletedCycles(session?.school_id ?? 0);
            setDeletedCycles(data);
        } catch (error) {
            console.error('Error al cargar los ciclos eliminados:', error);
        } finally {
            setIsLoadingDeleted(false);
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

        setIsSaving(true);

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
            // El modal de confirmación mostrará el error
        } finally {
            setIsSaving(false);
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
    async function handleSaveCycle(cycleData: { name: string; startDate: string; endDate: string; status: string }) {
        setIsSaving(true);
        try {
            // Validar datos básicos
            if (!cycleData.name || !cycleData.startDate || !cycleData.endDate) {
                alert('Por favor completa todos los campos requeridos');
                setIsSaving(false);
                return;
            }

            await saveCycle(cycleData, selectedCycle?.id);

            // Actualizar estado local
            await fetchSchoolYears();
            closeModal();
        } catch (error) {
            console.error('Error al guardar el ciclo:', error);
            alert('Error al guardar el ciclo. Por favor intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    }

    // Restaurar ciclo eliminado
    async function handleRestore(id: number) {
        try {
            // Restauramos el ciclo
            await restoreCycle(id);

            // Actualizamos los datos
            await loadAllCycles();
        } catch (error) {
            console.error('Error al restaurar el ciclo:', error);
            alert('Error al restaurar el ciclo. Por favor intenta nuevamente.');
        }
    }

    const metricsConfig: MetricConfig[] = [
        {
            id: 'total-cycles',
            icon: 'calendar',
            title: 'Total de Ciclos',
            value: cycles.length,
            badgeColor: 'primary',
            badgeText: `${cycles.filter(cycle => cycle.status === '').length} ciclos activos`,
        },
        {
            id: 'total-students',
            icon: 'users',
            title: 'Total de Alumnos',
            value: cycles.reduce((acc, cycle) => acc + cycle.studentsCount, 0),
        },
        {
            id: 'average-grade',
            icon: 'graduation-cap',
            title: 'Promedio General',
            value: cycles.reduce((acc, cycle) => acc + cycle.averageGrade, 0) / cycles.length,
        },
    ];

    return (
        <div className="mx-auto max-w-screen-2xl md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Ciclos escolares" />

            {/* Metrics and Charts Wrapper */}
            <MetricsChartsWrapper title="Estadísticas y Gráficos de Ciclos Escolares">
                <MetricsGroup metricsConfig={metricsConfig} isLoading={isLoadingMetrics} isEmpty={cycles.length === 0} emptyMessage="No hay ciclos activos" />

                <Charts cycles={cycles} isLoading={isLoadingCycles} />
            </MetricsChartsWrapper>

            {/* Cycle List */}
            <CycleList
                cycles={cycles}
                isLoading={isLoadingCycles}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddNew={openModal}
            />

            {/* Deleted Cycles */}
            <DeletedCycleList
                cycles={deletedCycles}
                isLoading={isLoadingDeleted}
                onRestore={handleRestore}
            />

            {/* Form Modal */}
            <CycleFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveCycle}
                selectedCycle={selectedCycle}
                isSaving={isSaving}
                currentCycles={cycles}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setCycleToDelete(null);
                }}
                onConfirm={confirmDelete}
                itemName={cycleToDelete?.name || ''}
                isDeleting={isSaving}
                isActiveCycle={cycleToDelete?.status === '1'}
            />
        </div>
    );
}
