import { useState, useEffect } from 'react';
import { mockFinancialData } from '../module-utils/mockData';
import { FinancialData, FinancialFilters } from '../module-utils/types';

export function useFinancialData() {
    // Estados
    const [financialData, setFinancialData] = useState<FinancialData>(mockFinancialData);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<FinancialFilters>({
        dateRange: 'month',
        schoolYear: 'all',
        transactionType: 'all'
    });

    // Cargar datos basados en filtros
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            
            // Simular carga de datos
            setTimeout(() => {
                // Aquí iría la lógica para filtrar datos reales según los filtros
                // Por ahora, simplemente devolvemos los datos de ejemplo
                setFinancialData(mockFinancialData);
                setIsLoading(false);
            }, 800);
        };

        loadData();
    }, [filters]);

    // Manejar cambios en los filtros
    const handleFilterChange = (name: keyof FinancialFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return {
        financialData,
        filters,
        isLoading,
        handleFilterChange
    };
} 