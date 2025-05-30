import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';
import { FinancialFilters } from '../module-utils/types';

interface FiltersBarProps {
    filters: FinancialFilters;
    onFilterChange: (name: keyof FinancialFilters, value: string) => void;
    isLoading: boolean;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ filters, onFilterChange, isLoading }) => {
    // Opciones para selectores
    const dateRangeOptions = [
        {
            label: 'Períodos',
            options: [
                { value: 'today', label: 'Hoy' },
                { value: 'week', label: 'Últimos 7 días' },
                { value: 'month', label: 'Mes en curso' },
                { value: 'custom', label: 'Personalizado' }
            ]
        }
    ];

    const schoolYearOptions = [
        {
            label: 'Ciclos Escolares',
            options: [
                { value: 'all', label: 'Todos los ciclos' },
                { value: '2023-2024', label: 'Ciclo 2023-2024' },
                { value: '2022-2023', label: 'Ciclo 2022-2023' },
                { value: '2021-2022', label: 'Ciclo 2021-2022' }
            ]
        }
    ];

    const transactionTypeOptions = [
        {
            label: 'Tipos de Transacción',
            options: [
                { value: 'all', label: 'Todas las transacciones' },
                { value: 'tuition', label: 'Colegiaturas' },
                { value: 'registration', label: 'Reinscripciones' },
                { value: 'payroll', label: 'Nómina' },
                { value: 'supplies', label: 'Material escolar' },
                { value: 'services', label: 'Servicios' },
                { value: 'other', label: 'Otros' }
            ]
        }
    ];

    return (
        <ComponentCard title="Filtros" className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rango de Fecha
                    </label>
                    <SelectWithCategories
                        options={dateRangeOptions}
                        placeholder="Seleccione un rango"
                        onChange={(value) => onFilterChange('dateRange', value)}
                        defaultValue={filters.dateRange}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ciclo Escolar
                    </label>
                    <SelectWithCategories
                        options={schoolYearOptions}
                        placeholder="Seleccione un ciclo"
                        onChange={(value) => onFilterChange('schoolYear', value)}
                        defaultValue={filters.schoolYear}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tipo de Transacción
                    </label>
                    <SelectWithCategories
                        options={transactionTypeOptions}
                        placeholder="Seleccione un tipo"
                        onChange={(value) => onFilterChange('transactionType', value)}
                        defaultValue={filters.transactionType}
                    />
                </div>
            </div>
        </ComponentCard>
    );
};

export default FiltersBar; 