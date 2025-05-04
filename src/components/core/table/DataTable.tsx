// React
import React, { useState, useEffect, ReactNode } from 'react';

// Table components
import { Table, TableHeader, TableBody, TableRow, TableCell } from './index';

// Components
import IconFA from '@/components/ui/IconFA';
import Input from '@/components/form/input/InputField';

// Types
import { DataTableProps, SortDirection, } from './module-utils/types';

export default function DataTable<T>({
    data,
    columns,
    keyExtractor,
    searchable = true,
    searchPlaceholder = 'Buscar...',
    defaultSortField,
    defaultSortDirection = 'asc',
    isLoading = false,
    noDataMessage = 'No hay datos disponibles',
    searchNoResultsMessage = 'No se encontraron resultados para la búsqueda',
    className = '',
    itemsPerPage = 10,
    maxHeight = '500px',
    emptyStateComponent,
    loadingComponent,
    onSearch,
    onSort
}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<string | null>(defaultSortField || null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filteredData, setFilteredData] = useState<T[]>(data);
    const [displayData, setDisplayData] = useState<T[]>([]);

    // Actualizar filteredData cuando cambie data o searchTerm
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredData(data);
        } else {
            const searchTermLower = searchTerm.toLowerCase().trim();
            const searchableColumns = columns.filter(col => col.searchable !== false);

            const filtered = data.filter(item =>
                searchableColumns.some(column => {
                    const key = String(column.key);
                    const value = item[key as keyof T];

                    if (value === null || value === undefined) return false;

                    return String(value).toLowerCase().includes(searchTermLower);
                })
            );

            setFilteredData(filtered);
        }

        // Resetear página cuando cambie la búsqueda
        setCurrentPage(1);
    }, [data, searchTerm, columns]);

    // Procesar datos: ordenar y paginar
    useEffect(() => {
        let processedData = [...filteredData];

        // Ordenar datos si hay un campo de ordenamiento seleccionado y no hay un manejador externo
        if (sortField && !onSort) {
            processedData.sort((a, b) => {
                const valueA = String(a[sortField as keyof T] || '');
                const valueB = String(b[sortField as keyof T] || '');

                // Intentar ordenar como fechas si los valores parecen fechas
                if (!isNaN(Date.parse(valueA)) && !isNaN(Date.parse(valueB))) {
                    const dateA = new Date(valueA).getTime();
                    const dateB = new Date(valueB).getTime();
                    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
                }

                // Intentar ordenar como números si ambos valores son numéricos
                if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
                    return sortDirection === 'asc'
                        ? Number(valueA) - Number(valueB)
                        : Number(valueB) - Number(valueA);
                }

                // Ordenar como strings
                return sortDirection === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            });
        }

        // Paginar los datos
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = processedData.slice(startIndex, startIndex + itemsPerPage);

        setDisplayData(paginatedData);
    }, [filteredData, sortField, sortDirection, currentPage, itemsPerPage, onSort]);

    // Manejar la búsqueda
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        // Si hay un callback externo, también llamarlo
        if (onSearch) {
            onSearch(value);
        }
    };

    // Manejar el cambio de ordenamiento
    const handleSort = (field: string) => {
        if (onSort) {
            // Si hay un manejador externo, usarlo
            const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
            setSortField(field);
            setSortDirection(newDirection);
            onSort(field, newDirection);
            return;
        }

        // Manejar ordenamiento internamente
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Calcular el número total de páginas
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className={`w-full ${className}`}>
            {searchable && (
                <div className="mb-4 relative w-full sm:w-64">
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={handleSearch}
                        className="pl-10"
                        startIcon={<IconFA icon="search" style="solid" className="text-gray-400" />}
                    />
                </div>
            )}

            <div className="overflow-x-auto">
                {isLoading ? (
                    loadingComponent || (
                        <div className="flex items-center justify-center h-[200px]">
                            <IconFA icon="spinner" spin className="text-gray-400" />
                        </div>
                    )
                ) : (
                    <Table className="min-w-full" maxHeight={maxHeight}>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.key.toString()}
                                        isHeader
                                        className={[
                                            'px-5 py-3 text-center',
                                            column.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300' : '',
                                            column.className || '',
                                            column.width ? `w-[${column.width}]` : ''
                                        ].filter(Boolean).join(' ')}
                                        onClick={column.sortable ? () => handleSort(column.key.toString()) : undefined}
                                    >
                                        {column.sortable ? (
                                            <div className="flex items-center justify-center gap-1">
                                                {column.header}
                                                {sortField === column.key && (
                                                    <IconFA
                                                        icon={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                                                        style="solid"
                                                        className="text-gray-500"
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            column.header
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {displayData.length > 0 ? (
                                displayData.map((item) => (
                                    <TableRow key={keyExtractor(item)}>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={`${keyExtractor(item)}_${column.key.toString()}`}
                                                className="px-5 py-4 text-center sm:px-6"
                                            >
                                                {column.render
                                                    ? column.render(item)
                                                    : String(item[column.key as keyof T] || '')
                                                }
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="px-5 py-4 text-center sm:px-6">
                                        {emptyStateComponent || (
                                            <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                {data.length === 0 ? noDataMessage : searchNoResultsMessage}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            {!isLoading && (
                <div className="flex flex-col items-center md:flex-row md:justify-between md:items-center mt-4 px-2 gap-y-3 md:gap-y-0">
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-outfit text-center md:text-left">
                        Mostrando {Math.min(itemsPerPage, filteredData.length - (currentPage - 1) * itemsPerPage)} de {filteredData.length} registros
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white/[0.03] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Anterior
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white/[0.03] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 