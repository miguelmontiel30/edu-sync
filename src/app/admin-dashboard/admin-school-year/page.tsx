'use client';

// React
import { useState, useEffect } from 'react';

// Components
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CycleList from './components/CycleList';
import DeletedCycleList from './components/DeletedCycleList';
import CycleFormModal from './components/CycleFormModal';
import MetricsAndChartsWrapper from './components/MetricsAndChartsWrapper';

// Types and Services
import { SchoolCycle } from './components/types';
import { loadSchoolYearsBySchoolId, loadDeletedCycles, saveCycle, deleteCycle, restoreCycle, } from './components/services';
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
    async function handleDelete(id: number) {
        if (!confirm('¿Estás seguro de que deseas eliminar este ciclo?')) return;

        setIsSaving(true);

        try {
            // Eliminar el ciclo
            await deleteCycle(id);

            // Actualizar listas
            await loadAllCycles();
        } catch (error) {
            console.error('Error al eliminar el ciclo:', error);
            alert('Error al eliminar el ciclo. Por favor intenta nuevamente.');
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

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Ciclos escolares" />

            {/* Metrics and Charts Wrapper */}
            <MetricsAndChartsWrapper
                cycles={cycles}
                isLoading={isLoadingMetrics}
            />

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
        </div>
    );
}
