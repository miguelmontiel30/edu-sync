# Componente DataTable

El componente `DataTable` es una tabla genérica y reutilizable que integra funcionalidades de búsqueda, ordenamiento y paginación para su uso en toda la aplicación.

## Características

- **Búsqueda**: Filtra los datos basados en términos de búsqueda.
- **Ordenamiento**: Permite ordenar por columnas específicas.
- **Paginación**: Muestra los datos en páginas para una mejor organización.
- **Personalización**: Permite personalizar el renderizado de celdas y cabeceras.
- **Estados de carga**: Muestra indicadores de carga y estados vacíos.
- **Tamaño ajustable**: Control sobre el tamaño de la tabla y sus columnas.

## Uso Básico

```tsx
import DataTable, { Column } from '@/components/core/table/DataTable';

// Definir interface para los datos
interface User {
    id: number;
    name: string;
    email: string;
}

// Ejemplo de datos
const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@ejemplo.com' },
    { id: 2, name: 'María García', email: 'maria@ejemplo.com' },
];

// Definir columnas
const columns: Column<User>[] = [
    {
        key: 'id',
        header: 'ID',
        sortable: true,
    },
    {
        key: 'name',
        header: 'Nombre',
        sortable: true,
    },
    {
        key: 'email',
        header: 'Correo Electrónico',
        sortable: true,
    },
];

// Usar el componente
function MyComponent() {
    return <DataTable data={users} columns={columns} keyExtractor={user => user.id} />;
}
```

## API

### Props

| Prop                     | Tipo                                                | Default                             | Descripción                                                   |
| ------------------------ | --------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------- |
| `data`                   | `T[]`                                               | -                                   | Array de datos a mostrar en la tabla                          |
| `columns`                | `Column<T>[]`                                       | -                                   | Definición de las columnas                                    |
| `keyExtractor`           | `(item: T) => string \| number`                     | -                                   | Función para extraer una clave única de cada elemento         |
| `searchable`             | `boolean`                                           | `true`                              | Si se muestra o no el campo de búsqueda                       |
| `searchFields`           | `(keyof T)[]`                                       | `[]`                                | Campos por los que se puede buscar (si vacío, busca en todos) |
| `searchPlaceholder`      | `string`                                            | `'Buscar...'`                       | Placeholder para el campo de búsqueda                         |
| `defaultSortField`       | `string`                                            | `undefined`                         | Campo por el que ordenar inicialmente                         |
| `defaultSortDirection`   | `'asc' \| 'desc'`                                   | `'asc'`                             | Dirección inicial de ordenamiento                             |
| `isLoading`              | `boolean`                                           | `false`                             | Si la tabla está en estado de carga                           |
| `noDataMessage`          | `string`                                            | `'No hay datos disponibles'`        | Mensaje cuando no hay datos                                   |
| `searchNoResultsMessage` | `string`                                            | `'No se encontraron resultados...'` | Mensaje cuando la búsqueda no da resultados                   |
| `className`              | `string`                                            | `''`                                | Clases adicionales para el contenedor de la tabla             |
| `itemsPerPage`           | `number`                                            | `10`                                | Número de elementos por página                                |
| `maxHeight`              | `string`                                            | `'500px'`                           | Altura máxima de la tabla                                     |
| `emptyStateComponent`    | `ReactNode`                                         | `undefined`                         | Componente personalizado para estado vacío                    |
| `loadingComponent`       | `ReactNode`                                         | `undefined`                         | Componente personalizado para estado de carga                 |
| `onSearch`               | `(searchTerm: string) => void`                      | `undefined`                         | Handler para manejar la búsqueda externamente                 |
| `onSort`                 | `(field: string, direction: SortDirection) => void` | `undefined`                         | Handler para manejar el ordenamiento externamente             |

### Interfaces

```tsx
export type SortDirection = 'asc' | 'desc';

export interface Column<T> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
    width?: string;
    className?: string;
}
```

## Ejemplos Avanzados

### Renderizado personalizado de celdas

```tsx
const columns: Column<User>[] = [
    // ...otras columnas
    {
        key: 'status',
        header: 'Estado',
        render: user => (
            <Badge color={user.status === 'active' ? 'success' : 'warning'} variant="light">
                {user.status === 'active' ? 'Activo' : 'Inactivo'}
            </Badge>
        ),
    },
    {
        key: 'actions',
        header: 'Acciones',
        render: user => (
            <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => console.log('Editar', user.id)}>
                    <IconFA icon="pen" style="solid" className="text-blue-500" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('Eliminar', user.id)}
                >
                    <IconFA icon="trash" style="solid" className="text-red-500" />
                </Button>
            </div>
        ),
    },
];
```

### Manejo externo de búsqueda y ordenamiento

```tsx
function MyComponent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filteredData, setFilteredData] = useState(users);

    // Función para manejar la búsqueda externamente
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        // Implementar lógica de búsqueda personalizada
    };

    // Función para manejar el ordenamiento externamente
    const handleSort = (field: string, direction: 'asc' | 'desc') => {
        setSortField(field);
        setSortDirection(direction);
        // Implementar lógica de ordenamiento personalizada
    };

    return (
        <DataTable
            data={filteredData}
            columns={columns}
            keyExtractor={user => user.id}
            onSearch={handleSearch}
            onSort={handleSort}
            defaultSortField={sortField}
            defaultSortDirection={sortDirection}
        />
    );
}
```

### Estados de carga y personalización de estilos

```tsx
function MyComponent() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simular carga de datos
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <DataTable
            data={users}
            columns={columns}
            keyExtractor={user => user.id}
            isLoading={isLoading}
            className="rounded-lg bg-white shadow-sm"
            maxHeight="400px"
            itemsPerPage={5}
            loadingComponent={
                <div className="flex h-[200px] flex-col items-center justify-center">
                    <IconFA icon="spinner" spin className="mb-2 text-xl text-brand-500" />
                    <p className="text-gray-500">Cargando usuarios...</p>
                </div>
            }
        />
    );
}
```

## Buenas prácticas

1. **Rendimiento**: Para tablas con muchos datos, considere implementar la paginación en el servidor.
2. **Accesibilidad**: Use el componente `TableCell` con `isHeader` para elementos de encabezado.
3. **Responsive**: La tabla es responsive por defecto, pero asegúrese de definir anchos de columnas adecuados.
4. **Ordenamiento**: Habilite el ordenamiento solo para columnas relevantes.
