'use client';

// React
import { useState, useEffect, useMemo } from 'react';

// Theme
import { textStyles } from './module-utils/theme';

// Components
import CycleFormModal from './components/CycleFormModal';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

// Core
import Alert from '@/components/core/alert/Alert';
import { Column } from '@/components/core/table/DataTable';
import Badge from '@/components/core/badge/Badge';
import MetricsGroup from '../core/Metrics/MetricsGroup';
import BarChartsGroup from '../core/BarCharts/BarChartsGroup';
import DeleteConfirmModal from '../core/Modals/DeleteConfirmModal';
import MetricsChartsWrapper from '@/components/core/metrics/MetricsChartsWrapper';
import DeletedItemsList, { DeletedItemsListConfig } from '../core/Tables/DeletedItemsList';
import ItemsList, { ActionButton, ItemsListConfig } from '../core/Tables/ItemsList';

// Types and Services
import { ErrorAlert, SchoolCycle, CYCLE_STATUS } from './module-utils/types';
import { MetricConfig } from '../core/Metrics/types';
import { loadAllSchoolYearData, saveCycle, deleteCycle, restoreCycle, } from './module-utils/services';

// Utils
import { getStatusColor, formatDate, validateCycleData } from './module-utils/utils';

// Hooks
import { useSession } from '@/hooks/useSession';

export default function SchoolYearDashboard() {
    // Estados
    const [cycles, setCycles] = useState<SchoolCycle[]>([]);
    const [deletedCycles, setDeletedCycles] = useState<SchoolCycle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<SchoolCycle | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [cycleToDelete, setCycleToDelete] = useState<SchoolCycle | null>(null);
    const [errorAlert, setErrorAlert] = useState<ErrorAlert | null>(null);

    // Loading states
    const [loadingState, setLoadingState] = useState({
        cycles: true,
        metrics: true,
        deleted: true,
        processing: false
    });

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
        // Establecer todos los estados de carga a true
        setLoadingState(prev => ({
            ...prev,
            cycles: true,
            metrics: true,
            deleted: true
        }));

        try {
            if (!session?.school_id) {
                throw new Error('No se encontró el ID de la escuela en la sesión');
            }

            // Cargar todos los ciclos en una sola llamada
            const { active, deleted } = await loadAllSchoolYearData(session.school_id);

            // Actualizar los estados
            setCycles(active);
            setDeletedCycles(deleted);

            // Limpiar errores si la carga es exitosa
            setErrorAlert(null);
        } catch (error) {
            console.error('Error al cargar los ciclos escolares:', error);

            // Mostrar alerta de error
            setErrorAlert({
                title: 'Error al cargar los ciclos escolares',
                message: 'Por favor recarga la página.'
            });
        } finally {
            // Restaurar todos los estados de carga a false
            setLoadingState(prev => ({
                ...prev,
                cycles: false,
                metrics: false,
                deleted: false
            }));
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

        setLoadingState(prev => ({ ...prev, processing: true }));

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

            // Mostrar mensaje de error
            setErrorAlert({
                title: 'Error al eliminar el ciclo',
                message: 'No se pudo eliminar el ciclo. Por favor intenta nuevamente.'
            });
        } finally {
            setLoadingState(prev => ({ ...prev, processing: false }));
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
        setLoadingState(prev => ({ ...prev, processing: true }));

        try {
            // Validar datos
            const validation = validateCycleData(cycleData, cycles, selectedCycle?.id);
            if (!validation.isValid) {
                setErrorAlert({
                    title: 'Error de validación',
                    message: validation.errorMessage || 'Por favor verifica los datos ingresados.'
                });
                setLoadingState(prev => ({ ...prev, processing: false }));
                return;
            }

            await saveCycle(cycleData, selectedCycle?.id);

            // Actualizar estado local
            await loadAllCycles();
            closeModal();
        } catch (error) {
            console.error('Error al guardar el ciclo:', error);
            setErrorAlert({
                title: 'Error al guardar el ciclo',
                message: 'No se pudo guardar el ciclo. Por favor intenta nuevamente.'
            });
        } finally {
            setLoadingState(prev => ({ ...prev, processing: false }));
        }
    }

    // Restaurar ciclo eliminado
    async function handleRestore(id: number) {
        setLoadingState(prev => ({ ...prev, processing: true }));

        try {
            // Restauramos el ciclo
            await restoreCycle(id);

            // Actualizamos los datos
            await loadAllCycles();
        } catch (error) {
            console.error('Error al restaurar el ciclo:', error);
            setErrorAlert({
                title: 'Error al restaurar el ciclo',
                message: 'No se pudo restaurar el ciclo. Por favor intenta nuevamente.'
            });
        } finally {
            setLoadingState(prev => ({ ...prev, processing: false }));
        }
    }

    // Calcular métricas de manera segura con useMemo y valores atómicos
    const totalCycles = useMemo(() => cycles.length, [cycles]);
    const activeCycles = useMemo(() => cycles.filter(cycle => cycle.status === CYCLE_STATUS.ACTIVE).length, [cycles]);
    const totalStudents = useMemo(() => cycles.reduce((acc, cycle) => acc + cycle.studentsCount, 0), [cycles]);
    const averageGrade = useMemo(() =>
        cycles.length > 0
            ? cycles.reduce((acc, cycle) => acc + cycle.averageGrade, 0) / cycles.length
            : 0,
        [cycles]
    );

    // Configurar métricas con valores memorizados
    const metricsConfig: MetricConfig[] = useMemo(() => [
        {
            id: 'total-cycles',
            icon: 'calendar',
            title: 'Total de Ciclos',
            value: totalCycles,
            badgeColor: 'primary',
            badgeText: `${activeCycles} ciclos activos`,
        },
        {
            id: 'total-students',
            icon: 'users',
            title: 'Total de Alumnos',
            value: totalStudents,
        },
        {
            id: 'average-grade',
            icon: 'graduation-cap',
            title: 'Promedio General',
            value: averageGrade,
        },
    ], [totalCycles, activeCycles, totalStudents, averageGrade]);

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
    const deletedCycleListConfig: DeletedItemsListConfig<SchoolCycle> = {
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
                    <span className={textStyles.title}>
                        {cycle.name}
                    </span>
                )
            },
            {
                key: 'startDate',
                header: 'Fecha de Inicio',
                sortable: true,
                render: (cycle) => (
                    <span className={textStyles.normal}>
                        {formatDate(cycle.startDate)}
                    </span>
                )
            },
            {
                key: 'endDate',
                header: 'Fecha de Fin',
                sortable: true,
                render: (cycle) => (
                    <span className={textStyles.normal}>
                        {formatDate(cycle.endDate)}
                    </span>
                )
            },
            {
                key: 'groupsCount',
                header: 'Grupos',
                render: (cycle) => (
                    <span className={textStyles.normal}>
                        {cycle.groupsCount}
                    </span>
                )
            },
            {
                key: 'studentsCount',
                header: 'Alumnos',
                render: (cycle) => (
                    <span className={textStyles.normal}>
                        {cycle.studentsCount}
                    </span>
                )
            },
            {
                key: 'averageGrade',
                header: 'Promedio',
                render: (cycle) => (
                    <span className={textStyles.normal}>
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
                        <span className={textStyles.normal}>
                            {cycle.statusName}
                        </span>
                    </Badge>
                )
            }
        ]
    };

    const cycleColumns: Column<SchoolCycle>[] = [
        {
            key: 'name',
            header: 'Nombre',
            sortable: true,
            render: (cycle: SchoolCycle) => (
                <span className={textStyles.title}>
                    {cycle.name}
                </span>
            )
        },
        {
            key: 'startDate',
            header: 'Fecha de Inicio',
            sortable: true,
            render: (cycle: SchoolCycle) => (
                <span className={textStyles.normal}>
                    {formatDate(cycle.startDate)}
                </span>
            )
        },
        {
            key: 'endDate',
            header: 'Fecha de Fin',
            sortable: true,
            render: (cycle: SchoolCycle) => (
                <span className={textStyles.normal}>
                    {formatDate(cycle.endDate)}
                </span>
            )
        },
        {
            key: 'groupsCount',
            header: 'Grupos',
            sortable: true
        },
        {
            key: 'studentsCount',
            header: 'Alumnos',
            sortable: true
        },
        {
            key: 'averageGrade',
            header: 'Promedio',
            sortable: true,
            render: (cycle: SchoolCycle) => (
                <span className={textStyles.normal}>
                    {cycle.averageGrade.toFixed(2)}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Estado',
            sortable: true,
            render: (cycle: SchoolCycle) => (
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
    ];

    const cycleActionButtons: ActionButton[] = [
        {
            label: 'Editar',
            icon: 'calendar-pen',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: (id) => handleEdit(Number(id))
        },
        {
            label: 'Eliminar',
            icon: 'calendar-xmark',
            iconStyle: 'duotone',
            variant: 'outline',
            onClick: (id) => handleDelete(Number(id))
        }
    ];

    const cycleListConfig: ItemsListConfig<SchoolCycle> = {
        title: 'Lista de ciclos escolares',
        description: 'Aquí podrás ver todos los ciclos escolares registrados, su información y gestionarlos. Puedes crear nuevos ciclos, editar los existentes o eliminarlos según sea necesario.',
        addButtonLabel: 'Nuevo Ciclo Escolar',
        addButtonIcon: 'calendar-pen',
        noDataMessage: 'No se encontraron ciclos escolares.',
        searchPlaceholder: 'Buscar ciclos...',
        searchNoResultsMessage: 'No se encontraron ciclos que coincidan con la búsqueda.',
        defaultSortField: 'name',
        defaultSortDirection: 'asc',
        itemsPerPage: 10,
        searchableFields: ['name', 'status', 'statusName']
    };

    const deleteConfirmModalConfig = {
        title: '¿Estás seguro?',
        confirmation: '¿Estás seguro de que deseas eliminar el ciclo ',
        recoveryInfo: 'Esta acción puede ser revertida más adelante desde la sección de ciclos eliminados.',
        warningTitle: '¡Atención!',
        warningMessage: 'Estás a punto de eliminar un ciclo escolar ACTIVO. Esta acción podría afectar negativamente al funcionamiento del sistema. Por favor, asegúrate de completar el ciclo escolar o activar otro ciclo antes de continuar.',
        errorTitle: '¡Error!',
        errorMessage: 'Ocurrió un error al intentar eliminar el ciclo escolar. Por favor, intenta nuevamente.',
    };

    return (
        <div className="mx-auto max-w-screen-2xl md:p-6">
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Ciclos escolares" />

            {/* Error Alert */}
            {errorAlert && (
                <Alert
                    title={errorAlert.title}
                    message={errorAlert.message}
                    variant="error"
                />
            )}

            {/* Metrics and Charts Wrapper */}
            <MetricsChartsWrapper title="Estadísticas y Gráficos de Ciclos Escolares">
                <MetricsGroup
                    metricsConfig={metricsConfig}
                    isLoading={loadingState.metrics}
                    isEmpty={cycles.length === 0}
                    emptyMessage="No hay ciclos activos"
                />

                <BarChartsGroup
                    data={cycles}
                    isLoading={loadingState.cycles}
                    charts={chartConfigs}
                />
            </MetricsChartsWrapper>

            {/* Cycle List */}
            <ItemsList
                items={cycles}
                columns={cycleColumns}
                isLoading={loadingState.cycles}
                onAddNew={openModal}
                config={cycleListConfig}
                actionButtons={cycleActionButtons}
            />

            {/* Deleted Cycles */}
            <DeletedItemsList
                className="mt-6"
                items={deletedCycles}
                onRestore={handleRestore}
                isLoading={loadingState.deleted}
                config={deletedCycleListConfig}
            />

            {/* Form Modal */}
            <CycleFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveCycle}
                selectedCycle={selectedCycle}
                isSaving={loadingState.processing}
                currentCycles={cycles}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={cycleToDelete?.name || ''}
                itemType="ciclo"
                isDeleting={loadingState.processing}
                isActiveItem={cycleToDelete?.status === CYCLE_STATUS.ACTIVE}
                customMessages={deleteConfirmModalConfig}
            />
        </div>
    );
}
