# Componente ItemsList Genérico

Este componente permite mostrar y gestionar listas de datos en formato de tabla, con funcionalidades de búsqueda, ordenamiento, paginación y acciones personalizables. Está diseñado para ser altamente reutilizable en diferentes módulos como ciclos escolares, profesores, alumnos, etc.

## Características

- Adaptable a cualquier tipo de datos con una estructura básica
- Búsqueda y filtrado incorporados
- Ordenamiento por columnas configurable
- Paginación automática
- Soporte para acciones personalizables (editar, eliminar, etc.)
- Estilos consistentes y responsive
- Estados de carga y mensajes personalizables

## Uso Básico

```tsx
import ItemsList, {BaseItem, ActionButton} from '@/app/admin-dashboard/core/Tables/ItemsList';
import {Column} from '@/components/core/table/DataTable';

// Tipo de datos
interface Teacher extends BaseItem {
    id: number;
    name: string;
    email: string;
    department: string;
    active: boolean;
}

// Componente que usa ItemsList
function TeacherListPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar datos
    useEffect(() => {
        // Lógica para cargar datos
    }, []);

    // Definir columnas
    const columns: Column<Teacher>[] = [
        {
            key: 'name',
            header: 'Nombre',
            sortable: true,
        },
        {
            key: 'email',
            header: 'Correo',
            sortable: true,
        },
        {
            key: 'department',
            header: 'Departamento',
            sortable: true,
        },
        {
            key: 'active',
            header: 'Estado',
            sortable: true,
            render: teacher => (
                <Badge size="sm" color={teacher.active ? 'success' : 'error'}>
                    {teacher.active ? 'Activo' : 'Inactivo'}
                </Badge>
            ),
        },
    ];

    // Definir acciones
    const actionButtons: ActionButton[] = [
        {
            label: 'Editar',
            icon: 'user-pen',
            variant: 'outline',
            onClick: id => handleEdit(id),
        },
        {
            label: 'Eliminar',
            icon: 'user-xmark',
            variant: 'outline',
            onClick: id => handleDelete(id),
        },
    ];

    // Configuración
    const config = {
        title: 'Lista de Profesores',
        description:
            'Gestiona los profesores de tu institución, edita sus datos o elimínalos según sea necesario.',
        addButtonLabel: 'Nuevo Profesor',
        addButtonIcon: 'user-plus',
        noDataMessage: 'No hay profesores registrados.',
        searchPlaceholder: 'Buscar profesores...',
        defaultSortField: 'name',
        searchableFields: ['name', 'email', 'department'], // Campos en los que se buscará
    };

    return (
        <ItemsList
            items={teachers}
            columns={columns}
            actionButtons={actionButtons}
            isLoading={isLoading}
            onAddNew={handleAddNew}
            config={config}
        />
    );
}
```

## API

### BaseItem

Interface básica que deben implementar todos los elementos:

```tsx
export interface BaseItem {
    id: number | string;
    [key: string]: any;
}
```

### ActionButton

Define los botones de acción para cada elemento:

```tsx
export interface ActionButton {
    label: string; // Texto del botón
    icon: string; // Nombre del icono (Font Awesome)
    iconStyle?: 'duotone' | 'solid' | 'regular' | 'light' | 'brands';
    variant?: 'primary' | 'outline';
    onClick: (id: number | string) => void; // Función de click
}
```

### ItemsListConfig

Configuración general de la lista:

```tsx
export interface ItemsListConfig<T extends BaseItem> {
    title: string; // Título de la tabla
    description?: string; // Descripción o subtítulo
    addButtonLabel?: string; // Texto del botón de añadir
    addButtonIcon?: string; // Icono del botón de añadir
    noDataMessage?: string; // Mensaje cuando no hay datos
    searchPlaceholder?: string; // Placeholder del campo de búsqueda
    searchNoResultsMessage?: string; // Mensaje cuando la búsqueda no encuentra resultados
    itemsPerPage?: number; // Elementos por página
    defaultSortField?: string; // Campo por defecto para ordenar
    defaultSortDirection?: 'asc' | 'desc'; // Dirección de ordenamiento por defecto
    idField?: keyof T; // Campo a usar como ID (por defecto: 'id')
    searchableFields?: (keyof T | string)[]; // Campos en los que se buscará
    statusColorMap?: Record<
        string,
        'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark'
    >; // Mapa de colores para estados
}
```

### ItemsListProps

Propiedades del componente ItemsList:

```tsx
export interface ItemsListProps<T extends BaseItem> {
    readonly items: T[]; // Lista de elementos a mostrar
    readonly columns: Column<T>[]; // Definición de columnas
    readonly actionButtons?: ActionButton[]; // Botones de acción
    readonly isLoading: boolean; // Estado de carga
    readonly onAddNew?: () => void; // Manejador del botón de añadir
    readonly config: ItemsListConfig<T>; // Configuración
}
```

## Ejemplos de Uso

### Para Ciclos Escolares

```tsx
// En la página de ciclos
<ItemsList
    items={cycles}
    columns={cycleColumns}
    actionButtons={[
        {
            label: 'Editar',
            icon: 'calendar-pen',
            onClick: id => handleEditCycle(id),
        },
        {
            label: 'Eliminar',
            icon: 'calendar-xmark',
            onClick: id => handleDeleteCycle(id),
        },
    ]}
    isLoading={isLoadingCycles}
    onAddNew={openCycleModal}
    config={{
        title: 'Lista de ciclos escolares',
        description: 'Aquí podrás ver todos los ciclos escolares registrados',
        addButtonLabel: 'Nuevo Ciclo Escolar',
        addButtonIcon: 'calendar-plus',
        searchPlaceholder: 'Buscar ciclos...',
    }}
/>
```

### Para Alumnos

```tsx
// En la página de alumnos
<ItemsList
    items={students}
    columns={studentColumns}
    actionButtons={studentActions}
    isLoading={isLoadingStudents}
    onAddNew={openStudentModal}
    config={{
        title: 'Lista de estudiantes',
        description: 'Administra los estudiantes de tu institución',
        addButtonLabel: 'Nuevo Estudiante',
        addButtonIcon: 'user-graduate',
        searchableFields: ['name', 'email', 'group', 'grade'],
    }}
/>
```
