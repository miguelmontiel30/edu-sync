'use client';
// Components
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

// Hooks
import { useGroupStudentsManagement } from './hooks/useGroupStudentsManagement';
import { Group } from '../module-utils/types';

export default function GroupStudentsDashboard() {

    const { groups, selectedGroup, isLoading, error, handleGroupChange } = useGroupStudentsManagement();

    return (
        <div className="container mx-auto p-6">
            <PageBreadcrumb pageTitle="Gestión de estudiantes por grupo" />

            {/* Selector de Grupo */}
            <ComponentCard title="Seleccionar Grupo" desc="Selecciona un grupo para gestionar los estudiantes." className={`mb-6`}>
                <div className="mb-6 px-4">
                    <Label htmlFor="group-select" className="font-outfit">
                        Seleccionar Grupo
                    </Label>

                    <div className="relative">
                        <Select
                            options={groups.map((group: Group) => ({
                                value: group.id.toString(),
                                label: `${group.grade} ${group.group}`
                            }))}
                            placeholder="Selecciona un grupo"
                            onChange={handleGroupChange}
                        />
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
}