import {BaseItem} from '../../../../components/common/lists/DeletedItemsList';

export type SortDirection = 'asc' | 'desc';

/**
 * Ordena una lista de elementos genericamente por campo
 */
export function sortItems<T extends BaseItem>(
    items: T[],
    sortField: keyof T | string,
    sortDirection: SortDirection,
): T[] {
    return [...items].sort((a, b) => {
        const valueA = a[sortField as keyof T];
        const valueB = b[sortField as keyof T];

        // Si son fechas, ordenar por fechas
        if (
            typeof valueA === 'string' &&
            typeof valueB === 'string' &&
            !isNaN(Date.parse(valueA)) &&
            !isNaN(Date.parse(valueB))
        ) {
            const dateA = new Date(valueA).getTime();
            const dateB = new Date(valueB).getTime();
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }

        // Si son números, ordenar numéricamente
        if (
            (typeof valueA === 'number' && typeof valueB === 'number') ||
            (!isNaN(Number(valueA)) && !isNaN(Number(valueB)))
        ) {
            const numA = typeof valueA === 'number' ? valueA : Number(valueA);
            const numB = typeof valueB === 'number' ? valueB : Number(valueB);
            return sortDirection === 'asc' ? numA - numB : numB - numA;
        }

        // Convertir a string para comparar
        const strA = String(valueA).toLowerCase();
        const strB = String(valueB).toLowerCase();

        return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
}

/**
 * Filtra una lista de elementos genéricamente por término de búsqueda
 * Busca en todas las propiedades del elemento
 */
export function filterItems<T extends BaseItem>(
    items: T[],
    searchTerm: string,
    searchableFields?: (keyof T | string)[],
): T[] {
    if (!searchTerm.trim()) {
        return items;
    }

    const term = searchTerm.toLowerCase().trim();

    return items.filter(item => {
        // Si hay campos de búsqueda específicos, buscar solo en ellos
        if (searchableFields && searchableFields.length > 0) {
            return searchableFields.some(field => {
                const value = item[field as keyof T];
                return (
                    value !== undefined &&
                    value !== null &&
                    String(value).toLowerCase().includes(term)
                );
            });
        }

        // Si no hay campos específicos, buscar en todas las propiedades
        return Object.keys(item).some(key => {
            const value = item[key as keyof T];
            return (
                value !== undefined && value !== null && String(value).toLowerCase().includes(term)
            );
        });
    });
}

/**
 * Crea una función getStatusColor genérica basada en un mapeo personalizado
 */
export function createStatusColorMapper(
    statusMapping: Record<
        string,
        'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark'
    >,
) {
    return (
        status: string,
    ): 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark' => {
        return statusMapping[status] || 'info';
    };
}

/**
 * Función para paginar elementos
 */
export function paginateItems<T>(items: T[], currentPage: number, itemsPerPage: number): T[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
}
