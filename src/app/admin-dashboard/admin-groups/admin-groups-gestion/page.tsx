'use client';
// Components
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export default function GroupStudentsDashboard() {
    return (
        <div className="container mx-auto p-6">
            <PageBreadcrumb pageTitle="Gestión de estudiantes por grupo" />

            {/* Selector de Grupo */}
            <ComponentCard
                title="Seleccionar Grupo"
                desc="Selecciona un grupo para gestionar los estudiantes."
                className={`mb-6`}
            >
                <div className="mb-6 px-4">
                    <Label htmlFor="group-select" className="font-outfit">
                        Seleccionar Grupo
                    </Label>

                    <div className="relative">
                        <Select
                            options={[{value: '', label: 'Selecciona un grupo'}]}
                            placeholder="Selecciona un grupo"
                            onChange={() => {}}
                        />
                    </div>
                </div>
            </ComponentCard>
        </div>
    );
}
