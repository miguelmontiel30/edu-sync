'use client';

// React
import { useState, useEffect } from 'react';


// Components
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CycleList from './components/CycleList';
import CycleFormModal from './components/CycleFormModal';

// Core
import Badge from '@/components/core/badge/Badge';
import MetricsGroup from '../core/Metrics/MetricsGroup';
import BarChartsGroup from '../core/BarCharts/BarChartsGroup';
import DeleteConfirmModal from '../core/Modals/DeleteConfirmModal';
import MetricsChartsWrapper from '@/components/core/metrics/MetricsChartsWrapper';
import DeletedItemsList, { DeletedItemsListConfig } from '../core/Tables/DeletedItemsList';

// Types and Services
import { MetricConfig } from '../core/Metrics/types';
import { SchoolCycle } from './components/types';
import { loadSchoolYearsBySchoolId, loadDeletedCycles, saveCycle, deleteCycle, restoreCycle, } from './components/services';

// Utils
import { getStatusColor } from './components/utils';

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
    const [isProcessing, setIsProcessing] = useState(false);
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

        setIsProcessing(true);

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
            setIsProcessing(false);
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
        setIsProcessing(true);
        try {
            // Validar datos básicos
            if (!cycleData.name || !cycleData.startDate || !cycleData.endDate) {
                alert('Por favor completa todos los campos requeridos');
                setIsProcessing(false);
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
            setIsProcessing(false);
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

    const chartConfigs = [
        {
            title: 'Promedio General',
            dataKey: 'averageGrade',
            color: '#10B981',
            yAxisTitle: 'Promedio General',
        },
        {
            title: 'Total de Alumnos',
            dataKey: 'studentsCount',
            color: '#465FFF',
            yAxisTitle: 'Total de Alumnos',
        },

    ];

    // Configuración de la lista
    const cycleListConfig: DeletedItemsListConfig<SchoolCycle> = {
        title: 'Ciclos Escolares Eliminados',
        description: 'Historial de ciclos escolares que han sido eliminados del sistema.',
        defaultSortField: 'name',
        defaultSortDirection: 'asc',
        searchPlaceholder: 'Buscar ciclos eliminados...',
        noDataMessage: 'No hay ciclos escolares eliminados',
        searchNoResultsMessage: 'No se encontraron ciclos escolares que coincidan con la búsqueda',
        buttonLabel: 'Ciclos Eliminados',
        itemsPerPage: 5,
        maxHeight: '400px',
        columns: [
            {
                key: 'name',
                header: 'Nombre',
                sortable: true,
                render: (cycle) => (
                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                        {cycle.name}
                    </span>
                )
            },
            {
                key: 'startDate',
                header: 'Fecha de Inicio',
                sortable: true,
                render: (cycle) => (
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                        {new Date(cycle.startDate).toLocaleDateString()}
                    </span>
                )
            },
            {
                key: 'endDate',
                header: 'Fecha de Fin',
                sortable: true,
                render: (cycle) => (
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                        {new Date(cycle.endDate).toLocaleDateString()}
                    </span>
                )
            },
            {
                key: 'groupsCount',
                header: 'Grupos',
                render: (cycle) => (
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                        {cycle.groupsCount}
                    </span>
                )
            },
            {
                key: 'studentsCount',
                header: 'Alumnos',
                render: (cycle) => (
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                        {cycle.studentsCount}
                    </span>
                )
            },
            {
                key: 'averageGrade',
                header: 'Promedio',
                render: (cycle) => (
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                        {cycle.averageGrade.toFixed(2)}
                    </span>
                )
            },
            {
                key: 'status',
                header: 'Estado',
                sortable: true,
                render: (cycle) => (
                    <Badge
                        size="sm"
                        color={getStatusColor(cycle.status)}
                    >
                        <span className="font-outfit">
                            {cycle.statusName}
                        </span>
                    </Badge>
                )
            }
        ]
    };

    return (
        <div className="mx-auto max-w-screen-2xl md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Ciclos escolares" />

            {/* Metrics and Charts Wrapper */}
            <MetricsChartsWrapper title="Estadísticas y Gráficos de Ciclos Escolares">
                <MetricsGroup metricsConfig={metricsConfig} isLoading={isLoadingMetrics} isEmpty={cycles.length === 0} emptyMessage="No hay ciclos activos" />

                <BarChartsGroup data={cycles} isLoading={isLoadingCycles} charts={chartConfigs} />
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
            <DeletedItemsList
                items={deletedCycles}
                isLoading={isLoadingDeleted}
                onRestore={handleRestore}
                config={{
                    ...cycleListConfig,
                }}
                className="mt-6"
            />

            {/* Form Modal */}
            <CycleFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveCycle}
                selectedCycle={selectedCycle}
                isSaving={isProcessing}
                currentCycles={cycles}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={cycleToDelete?.name || ''}
                itemType="ciclo"
                isDeleting={isProcessing}
                isActiveItem={cycleToDelete?.status === '1'}
                customMessages={{
                    title: '¿Estás seguro?',
                    confirmation: '¿Estás seguro de que deseas eliminar el ciclo ',
                    recoveryInfo: 'Esta acción puede ser revertida más adelante desde la sección de ciclos eliminados.',
                    warningTitle: '¡Atención!',
                    warningMessage: 'Estás a punto de eliminar un ciclo escolar ACTIVO. Esta acción podría afectar negativamente al funcionamiento del sistema. Por favor, asegúrate de completar el ciclo escolar o activar otro ciclo antes de continuar.',
                    errorTitle: '¡Error!',
                    errorMessage: 'Ocurrió un error al intentar eliminar el ciclo escolar. Por favor, intenta nuevamente.',
                }}
            />
        </div>
    );
}
