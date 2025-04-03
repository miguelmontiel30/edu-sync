'use client';

// React
import { useState, useEffect } from 'react';

// Components
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Metrics from './components/Metrics';
import Charts from './components/Charts';
import CycleList from './components/CycleList';
import DeletedCycleList from './components/DeletedCycleList';
import CycleFormModal from './components/CycleFormModal';

// Types and Services
import { SchoolCycle } from './components/types';
import { loadSchoolYears, loadDeletedCycles, saveCycle, deleteCycle, restoreCycle } from './components/services';

export default function SchoolYearDashboard() {
    // States
    const [cycles, setCycles] = useState<SchoolCycle[]>([]);
    const [deletedCycles, setDeletedCycles] = useState<SchoolCycle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<SchoolCycle | null>(null);
    const [isLoadingCycles, setIsLoadingCycles] = useState(true);
    const [isLoadingDeleted, setIsLoadingDeleted] = useState(true);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Cargar datos al montar el componente
    useEffect(() => {
        loadAllCycles();
    }, []);

    // Función para cargar todos los ciclos
    async function loadAllCycles() {
        await Promise.all([
            fetchSchoolYears(),
            fetchDeletedCycles()
        ]);
    }

    // Cargar ciclos escolares activos
    async function fetchSchoolYears() {
        setIsLoadingCycles(true);
        setIsLoadingMetrics(true);
        try {
            const data = await loadSchoolYears();
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
            const data = await loadDeletedCycles();
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
        if (!confirm('¿Estás seguro de que deseas eliminar este ciclo escolar?')) return;
        setIsSaving(true);
        try {
            await deleteCycle(id);
            setCycles(prev => prev.filter(cycle => cycle.id !== id));
            await fetchDeletedCycles();
        } catch (error) {
            console.error('Error al eliminar el ciclo escolar:', error);
            alert('Error al eliminar el ciclo escolar. Por favor intenta nuevamente.');
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
    }

    // Guardar ciclo escolar (crear o actualizar)
    async function handleSaveCycle(cycleData: { name: string; startDate: string; endDate: string; status: string }) {
        setIsSaving(true);
        try {
            // Validar que todos los campos estén completados
            if (!cycleData.name || !cycleData.startDate || !cycleData.endDate || !cycleData.status) {
                alert('Por favor completa todos los campos');
                setIsSaving(false);
                return;
            }

            await saveCycle(cycleData, selectedCycle?.id);

            // Actualizar estado local
            await fetchSchoolYears();
            closeModal();
        } catch (error) {
            console.error('Error al guardar el ciclo escolar:', error);
            alert('Error al guardar el ciclo escolar. Por favor intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    }

    // Restaurar ciclo eliminado
    async function handleRestore(id: number) {
        try {
            await restoreCycle(id);
            // Actualizar estados
            await fetchSchoolYears();
            await fetchDeletedCycles();
        } catch (error) {
            console.error('Error al restaurar el ciclo:', error);
            alert('Error al restaurar el ciclo. Por favor intenta nuevamente.');
        }
    }

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Ciclos escolares" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                {/* Metrics */}
                <Metrics
                    cycles={cycles}
                    isLoading={isLoadingMetrics}
                />

                {/* Charts */}
                <Charts
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
            </div>

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
            />
        </div>
    );
}
