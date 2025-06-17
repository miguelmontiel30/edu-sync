'use client';

import SelectWithCategories from '@/components/core/select/SelectWithCategories';
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
// import { useState } from 'react'; // Removed unused import

interface FiltersBarProps {
    filters: {
        date: string;
        concept: string;
        paymentStatus: string;
    };
    onFilterChange: (field: string, value: string) => void;
    isLoading: boolean;
}

export default function FiltersBar({ filters, onFilterChange, isLoading }: FiltersBarProps) {
    const handleDateChange = (value: string) => {
        onFilterChange('date', value);
    };

    const handleConceptChange = (value: string) => {
        onFilterChange('concept', value);
    };

    const handleStatusChange = (value: string) => {
        onFilterChange('paymentStatus', value);
    };

    const dateOptions = [
        {
            label: 'Períodos',
            options: [
                { value: 'all', label: 'Todos los períodos' },
                { value: 'current', label: 'Período actual' },
                { value: 'lastMonth', label: 'Último mes' },
                { value: 'lastTrimester', label: 'Último trimestre' },
            ],
        },
    ];

    const conceptOptions = [
        {
            label: 'Conceptos de pago',
            options: [
                { value: 'all', label: 'Todos los conceptos' },
                { value: 'inscription', label: 'Inscripción' },
                { value: 'tuition', label: 'Colegiatura' },
                { value: 'materials', label: 'Materiales' },
                { value: 'transport', label: 'Transporte' },
                { value: 'events', label: 'Eventos' },
            ],
        },
    ];

    const statusOptions = [
        {
            label: 'Estados de pago',
            options: [
                { value: 'all', label: 'Todos los estados' },
                { value: 'paid', label: 'Pagado' },
                { value: 'pending', label: 'Pendiente' },
                { value: 'overdue', label: 'Vencido' },
            ],
        },
    ];

    return (
        <div className="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="w-full md:w-1/4">
                <SelectWithCategories
                    options={dateOptions}
                    onChange={handleDateChange}
                    defaultValue={filters.date}
                    placeholder="Período"
                />
            </div>

            <div className="w-full md:w-1/4">
                <SelectWithCategories
                    options={conceptOptions}
                    onChange={handleConceptChange}
                    defaultValue={filters.concept}
                    placeholder="Concepto"
                />
            </div>

            <div className="w-full md:w-1/4">
                <SelectWithCategories
                    options={statusOptions}
                    onChange={handleStatusChange}
                    defaultValue={filters.paymentStatus}
                    placeholder="Estado"
                />
            </div>

            <div className="flex justify-end md:ml-auto">
                <Button variant="outline" className="mr-2" disabled={isLoading}>
                    <IconFA icon="sync" className="mr-2" />
                    Restablecer
                </Button>
                <Button variant="primary" disabled={isLoading}>
                    <IconFA icon="search" className="mr-2" />
                    Aplicar filtros
                </Button>
            </div>
        </div>
    );
}
