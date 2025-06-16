// React
import { useState } from 'react';

// Componentes
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import { DataTable, Column } from '@/components/core/table';
import ComponentCard from '@/components/common/ComponentCard';

export interface BaseItem {
    id: number;
    [key: string]: any;
}

export interface StatusConfig {
    statusKey: string;
    statusNameKey: string;
    getStatusColor: (
        status: string,
    ) => 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark';
}

export interface DeletedItemsListConfig<T extends BaseItem> {
    title: string;
    description: string;
    columns: Column<T>[];
    noDataMessage?: string;
    searchPlaceholder?: string;
    searchNoResultsMessage?: string;
    buttonLabel?: string;
    defaultSortField?: string;
    defaultSortDirection?: 'asc' | 'desc';
    itemsPerPage?: number;
    maxHeight?: string;
}

interface DeletedItemsListProps<T extends BaseItem> {
    readonly items: T[];
    readonly isLoading: boolean;
    readonly onRestore: (id: number) => void;
    readonly config: DeletedItemsListConfig<T>;
    readonly className?: string;
}

export default function DeletedItemsList<T extends BaseItem>({
    items,
    isLoading,
    onRestore,
    config,
    className = '',
}: DeletedItemsListProps<T>) {
    const [showDeleted, setShowDeleted] = useState(false);

    // Configurar columnas incluyendo la columna de acciones automáticamente
    const columns = [
        ...config.columns,
        {
            key: 'actions',
            header: 'Acciones',
            render: (item: T) => (
                <Button
                    variant="outline"
                    size="sm"
                    startIcon={<IconFA icon="rotate-left" style="duotone" />}
                    onClick={() => onRestore(item.id)}
                >
                    <span className="font-outfit">Restaurar</span>
                </Button>
            ),
        },
    ];

    return (
        <ComponentCard title={config.title} desc={config.description} className={className}>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleted(!showDeleted)}
                    className="flex items-center gap-1"
                >
                    <IconFA
                        icon={showDeleted ? 'eye-slash' : 'eye'}
                        style="solid"
                        className="text-gray-500"
                    />
                    <span className="font-outfit">
                        {showDeleted ? 'Ocultar' : 'Mostrar'} {config.buttonLabel || 'Eliminados'}
                    </span>
                </Button>
            </div>

            {showDeleted && (
                <DataTable
                    data={items}
                    columns={columns}
                    keyExtractor={item => item.id}
                    searchable
                    searchPlaceholder={config.searchPlaceholder || 'Buscar elementos eliminados...'}
                    defaultSortField={config.defaultSortField || 'name'}
                    defaultSortDirection={config.defaultSortDirection || 'asc'}
                    isLoading={isLoading}
                    noDataMessage={config.noDataMessage || 'No hay elementos eliminados'}
                    searchNoResultsMessage={
                        config.searchNoResultsMessage ||
                        'No se encontraron elementos que coincidan con la búsqueda'
                    }
                    itemsPerPage={config.itemsPerPage || 5}
                    maxHeight={config.maxHeight || '400px'}
                />
            )}
        </ComponentCard>
    );
}
