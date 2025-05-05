'use client';

// Components
import Label from '@/components/form/Label';
import IconFA from '@/components/ui/IconFA';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';

// Hooks
import { useGroupStudentsManagement } from './hooks/useGroupStudentsManagement';
import ItemsList from '../../core/Tables/ItemsList';

export default function GroupStudentsDashboard() {
    // Usar el hook para gestionar grupos y estudiantes
    const {
        groupCategories,
        isLoading,
        error,
        handleGroupChange,
        selectedGroup
    } = useGroupStudentsManagement();

    console.log('selectedGroup: ', selectedGroup);

    return (
        <div className="container mx-auto p-6">
            <PageBreadcrumb pageTitle="Gestión de Estudiantes por Grupo" />

            {/* Selector de Grupo */}
            <ComponentCard title="Seleccionar Grupo" desc="Selecciona un grupo para gestionar los estudiantes." className={`mb-6`}>
                <div className="mb-6">
                    <Label htmlFor="group-select" className="font-outfit">
                        Seleccionar Grupo
                    </Label>

                    <div className="relative">
                        {isLoading ? (
                            <div className="flex items-center space-x-2 text-gray-500 mb-2">
                                <IconFA icon="spinner" spin />
                                <span>Cargando grupos...</span>
                            </div>
                        ) : error ? (
                            <div className="text-red-500 mb-2">
                                {error}
                            </div>
                        ) : (
                            <SelectWithCategories
                                options={groupCategories}
                                placeholder="Selecciona un grupo"
                                onChange={handleGroupChange}
                                defaultValue={selectedGroup?.id.toString() || ''}
                                maxMenuHeight="max-h-64"
                            />
                        )}
                    </div>

                </div>
            </ComponentCard>

            {selectedGroup && (
                <ItemsList
                    items={[{
                        id: 1,
                        first_name: 'Juan',
                        last_name: 'Perez',
                        curp: '1234567890',
                        status: 'active'
                    }]}
                    columns={[
                        {
                            key: 'full_name',
                            header: 'Nombre Completo',
                            render: (item) => `${item.first_name} ${item.last_name}`
                        },
                        {
                            key: 'curp',
                            header: 'CURP',
                        },
                        {
                            key: 'status',
                            header: 'Estado',
                            render: (item) => item.status === 'active' ? 'Activo' : 'Inactivo'
                        }
                    ]}
                    isLoading={false}
                    config={{
                        title: 'Estudiantes del grupo',
                        description: 'Lista de estudiantes del grupo seleccionado',
                        addButtonLabel: 'Añadir estudiante',
                        addButtonIcon: 'plus',
                        noDataMessage: 'No hay estudiantes en este grupo',
                    }}
                />
            )}
        </div>
    );
} 