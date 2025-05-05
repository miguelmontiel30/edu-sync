// React
import {ReactNode} from 'react';

// Types
export type SortDirection = 'asc' | 'desc';

export interface Column<T> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    width?: string;
    className?: string;
    searchable?: boolean; // Indica si esta columna se usará para búsqueda
}

export interface DataTableProps<T> {
    readonly data: T[];
    readonly columns: Column<T>[];
    readonly keyExtractor: (item: T) => string | number;
    readonly searchable?: boolean;
    readonly searchPlaceholder?: string;
    readonly defaultSortField?: string;
    readonly defaultSortDirection?: SortDirection;
    readonly isLoading?: boolean;
    readonly noDataMessage?: string;
    readonly searchNoResultsMessage?: string;
    readonly className?: string;
    readonly itemsPerPage?: number;
    readonly maxHeight?: string;
    readonly emptyStateComponent?: ReactNode;
    readonly loadingComponent?: ReactNode;
    readonly onSearch?: (searchTerm: string) => void;
    readonly onSort?: (field: string, direction: SortDirection) => void;
}
