export interface SchoolYear {
    id: number;
    name: string; // Ej. 'Ciclo 2023-2024'
    startDate: string; // '2023-09-01'
    endDate: string; // '2024-06-30'
    status: 'active' | 'inactive'; // Si el ciclo está activo
}
