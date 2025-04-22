# Componente DeletedItemsList

Un componente reutilizable para mostrar elementos eliminados en formato de tabla. Este componente es genérico y puede utilizarse para cualquier tipo de entidad como ciclos escolares, profesores, alumnos, etc.

## Características

- 🔄 **Altamente configurable**: Personaliza título, descripción, columnas, mensajes, etc.
- 🔍 **Búsqueda incorporada**: Filtrado automático de elementos
- 🔢 **Paginación**: Control de elementos por página
- 📊 **Ordenamiento**: Ordena las columnas automáticamente
- 💫 **Estados de carga**: Muestra indicadores mientras se cargan los datos
- 🚫 **Estados vacíos**: Mensajes personalizados para listas vacías y búsquedas sin resultados
- 👁️ **Mostrar/Ocultar**: Botón para alternar la visibilidad de la lista

## Uso básico

```tsx
import DeletedItemsList, {DeletedItemsListConfig} from '@/components/common/lists/DeletedItemsList';
import {createStatusColorMapper} from '@/components/common/lists/utils';

// Define tu tipo de datos (debe extender BaseItem que requiere propiedad 'id')
interface MiEntidad {
    id: number;
    nombre: string;
    fechaCreacion: string;
    status: string;
    statusName: string;
    // ... otras propiedades
}

// Configuración de la lista
const config: DeletedItemsListConfig<MiEntidad> = {
    title: 'Elementos Eliminados',
    description: 'Historial de elementos que han sido eliminados.',
    columns: [
        {
            key: 'nombre',
            header: 'Nombre',
            sortable: true,
            render: item => <span>{item.nombre}</span>,
        },
        // ... más columnas
    ],
    // Opciones adicionales
    defaultSortField: 'nombre',
    defaultSortDirection: 'asc',
    searchPlaceholder: 'Buscar elementos...',
    noDataMessage: 'No hay elementos eliminados',
    searchNoResultsMessage: 'No se encontraron elementos',
    buttonLabel: 'Elementos Eliminados',
    itemsPerPage: 5,
};

// En tu componente
function MiComponente() {
    const [items, setItems] = useState<MiEntidad[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleRestore = (id: number) => {
        // Lógica para restaurar un elemento
    };

    return (
        <DeletedItemsList
            items={items}
            isLoading={isLoading}
            onRestore={handleRestore}
            config={config}
            className="mt-6"
        />
    );
}
```

## Propiedades

### DeletedItemsList

| Propiedad | Tipo                        | Descripción                        |
| --------- | --------------------------- | ---------------------------------- |
| items     | `T[]`                       | Array de elementos eliminados      |
| isLoading | `boolean`                   | Estado de carga                    |
| onRestore | `(id: number) => void`      | Función para restaurar un elemento |
| config    | `DeletedItemsListConfig<T>` | Configuración de la lista          |
| className | `string?`                   | Clases CSS adicionales             |

### DeletedItemsListConfig

| Propiedad              | Tipo            | Descripción                                 |
| ---------------------- | --------------- | ------------------------------------------- |
| title                  | `string`        | Título de la lista                          |
| description            | `string`        | Descripción de la lista                     |
| columns                | `Column<T>[]`   | Definición de columnas                      |
| defaultSortField       | `string?`       | Campo por defecto para ordenar              |
| defaultSortDirection   | `'asc'/'desc'?` | Dirección de ordenamiento por defecto       |
| searchPlaceholder      | `string?`       | Placeholder para el campo de búsqueda       |
| noDataMessage          | `string?`       | Mensaje cuando no hay datos                 |
| searchNoResultsMessage | `string?`       | Mensaje cuando la búsqueda no da resultados |
| buttonLabel            | `string?`       | Etiqueta para el botón mostrar/ocultar      |
| itemsPerPage           | `number?`       | Número de elementos por página              |
| maxHeight              | `string?`       | Altura máxima de la tabla                   |

## Utilidades

El módulo proporciona utilidades adicionales en `@/components/common/lists/utils`:

- `sortItems`: Ordena elementos genéricamente por campo
- `filterItems`: Filtra elementos por término de búsqueda
- `createStatusColorMapper`: Crea una función para mapear estados a colores
- `paginateItems`: Pagina una lista de elementos

## Ejemplo para estados

```tsx
// Crear un mapeador de colores para estados
const getStatusColor = createStatusColorMapper({
    '1': 'success', // Activo
    '2': 'warning', // Inactivo
    '3': 'error',   // Bloqueado
});

// Usar en una columna
{
    key: 'status',
    header: 'Estado',
    render: (item) => (
        <Badge color={getStatusColor(item.status)}>
            {item.statusName}
        </Badge>
    )
}
```
