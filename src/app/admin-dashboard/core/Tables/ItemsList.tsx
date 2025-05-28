// React
import { useState, useEffect } from 'react';

// Componentes UI
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import DataTable from '@/components/core/table/DataTable';
import ComponentCard from '@/components/common/ComponentCard';

// Types
import { Column, SortDirection } from '@/components/core/table/module-utils/types';

// Utils
import { filterItems, sortItems } from './utils';

export interface BaseItem {
    id: number | string;
    [key: string]: any;
}

export interface ActionButton {
    label: string;
    icon: string;
    iconStyle?: 'duotone' | 'solid' | 'regular' | 'light' | 'brands';
    variant?: 'primary' | 'outline';
    onClick: (id: number | string) => void;
}

export interface ItemsListConfig<T extends BaseItem> {
    title: string;
    description?: string;
    addButtonLabel?: string;
    addButtonIcon?: string;
    noDataMessage?: string;
    searchPlaceholder?: string;
    searchNoResultsMessage?: string;
    itemsPerPage?: number;
    defaultSortField?: string;
    defaultSortDirection?: SortDirection;
    idField?: keyof T;
    searchableFields?: (keyof T | string)[];
    statusColorMap?: Record<string, 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark'>;
}

export interface ItemsListProps<T extends BaseItem> {
    readonly items: T[];
    readonly columns: Column<T>[];
    readonly actionButtons?: ActionButton[];
    readonly isLoading: boolean;
    readonly onAddNew?: () => void;
    readonly onRowClick?: (item: T) => void;
    readonly config: ItemsListConfig<T>;
}

export default function ItemsList<T extends BaseItem>({
    items,
    columns,
    actionButtons = [],
    isLoading,
    onAddNew,
    onRowClick,
    config
}: ItemsListProps<T>) {
    const {
        title,
        description = '',
        addButtonLabel = 'Añadir Nuevo',
        addButtonIcon = 'plus',
        noDataMessage = 'No hay datos disponibles',
        searchPlaceholder = 'Buscar...',
        searchNoResultsMessage = 'No se encontraron resultados para la búsqueda',
        itemsPerPage = 10,
        defaultSortField = 'id',
        defaultSortDirection = 'asc',
        idField = 'id' as keyof T,
        searchableFields
    } = config;

    // States
    const [filteredItems, setFilteredItems] = useState<T[]>(items);
    const [searchTerm, setSearchTerm] = useState('');

    // Efecto para filtrar los elementos cuando cambia el término de búsqueda
    useEffect(() => {
        if (!searchTerm) {
            setFilteredItems(items);
        } else {
            const filtered = filterItems<T>(items, searchTerm, searchableFields);
            setFilteredItems(filtered);
        }
    }, [items, searchTerm, searchableFields]);

    // Manejar la búsqueda desde el DataTable
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Manejar el ordenamiento desde el DataTable
    const handleSort = (field: string, direction: SortDirection) => {
        const sorted = sortItems<T>(filteredItems, field, direction, columns);
        setFilteredItems(sorted);
    };

    // Construir columnas con acciones si se proporcionaron botones de acción
    const tableColumns = [...columns];

    if (actionButtons && actionButtons.length > 0) {
        tableColumns.push({
            key: 'actions',
            header: 'Acciones',
            sortable: false,
            render: (item: T) => (
                <div
                    className="flex flex-col sm:flex-row gap-2 justify-center"
                    onClick={(e) => e.stopPropagation()} // Detiene la propagación en el contenedor
                >
                    {actionButtons.map((button) => (
                        <Button
                            key={`${item[idField]}-${button.label}`}
                            variant={button.variant || 'outline'}
                            size="sm"
                            startIcon={<IconFA icon={button.icon} style={button.iconStyle || 'duotone'} />}
                            onClick={() => button.onClick(item[idField])}
                        >
                            <span className="font-outfit">{button.label}</span>
                        </Button>
                    ))}
                </div>
            )
        });
    }

    return (
        <ComponentCard title={title} desc={description} className="w-100 p-2">
            {onAddNew && (
                <div className="mb-4 flex justify-end">
                    <Button
                        variant="primary"
                        startIcon={<IconFA icon={addButtonIcon} style="solid" />}
                        onClick={onAddNew}
                    >
                        <span className="font-outfit">{addButtonLabel}</span>
                    </Button>
                </div>
            )}

            <DataTable
                data={filteredItems}
                columns={tableColumns}
                keyExtractor={(item) => String(item[idField])}
                searchable
                searchPlaceholder={searchPlaceholder}
                defaultSortField={defaultSortField}
                defaultSortDirection={defaultSortDirection}
                isLoading={isLoading}
                noDataMessage={noDataMessage}
                searchNoResultsMessage={searchNoResultsMessage}
                itemsPerPage={itemsPerPage}
                onSearch={handleSearch}
                onSort={handleSort}
                onRowClick={onRowClick}
            />
        </ComponentCard>
    );
} 