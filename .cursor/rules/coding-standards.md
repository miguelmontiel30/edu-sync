# Estándares y Prácticas de Desarrollo

## Tecnologías Principales

- TypeScript
- Node.js
- Next.js App Router
- React
- Shadcn UI
- Radix UI
- Tailwind CSS

## Estilo y Estructura de Código

- Escribe código TypeScript conciso y técnico con ejemplos precisos.
- Utiliza patrones de programación funcional y declarativa; evita clases.
- Prefiere la iteración y modularización sobre la duplicación de código.
- Emplea nombres de variables descriptivos con verbos auxiliares (ej: isLoading, hasError).
- Estructura de archivos: componente exportado, subcomponentes, ayudantes, contenido estático, tipos.

## Convenciones de Nomenclatura

- Usa minúsculas con guiones para directorios (ej: components/auth-wizard).
- Favorece exportaciones nombradas para componentes.

## Uso de TypeScript

- Utiliza TypeScript para todo el código; prefiere interfaces sobre types.
- Evita enums; usa mapas en su lugar.
- Usa componentes funcionales con interfaces TypeScript.

## Sintaxis y Formato

- Usa la palabra clave "function" para funciones puras.
- Evita llaves innecesarias en condicionales; utiliza sintaxis concisa para sentencias simples.
- Usa JSX declarativo.

## UI y Estilos

- Utiliza Shadcn UI, Radix, y Tailwind para componentes y estilos.
- Implementa diseño responsivo con Tailwind CSS; usa enfoque mobile-first.

## Optimización de Rendimiento

- Minimiza 'use client', 'useEffect', y 'setState'; favorece React Server Components (RSC).
- Envuelve componentes cliente en Suspense con fallback.
- Usa carga dinámica para componentes no críticos.
- Optimiza imágenes: usa formato WebP, incluye datos de tamaño, implementa carga diferida.

## Convenciones Clave

- Usa 'nuqs' para gestión de estado de parámetros de búsqueda URL.
- Optimiza Web Vitals (LCP, CLS, FID).
- Limita 'use client':
    - Favorece componentes de servidor y SSR de Next.js.
    - Úsalo solo para acceso a Web API en componentes pequeños.
    - Evita usarlo para obtención de datos o gestión de estado.

## Estructura Modular de Carpetas

Para cada módulo, sigue esta estructura de carpetas:

```
módulo/
├── components/        # Componentes específicos del módulo
├── hooks/             # Hooks personalizados para lógica de UI
│   ├── useModuleManagement.ts  # Gestión principal del módulo
│   ├── useTableConfig.tsx      # Configuración de tablas y columnas
│   ├── useMetricsConfig.ts     # Configuración de métricas y gráficas
│   └── index.ts               # Exportaciones agregadas
├── module-utils/      # Utilidades específicas del módulo
│   ├── repository.ts  # Funciones para interactuar con la base de datos
│   ├── queries.ts     # Consultas SQL o funciones específicas de consulta
│   ├── services.ts    # Lógica de negocio y transformación de datos
│   ├── types.ts       # Definiciones de tipos e interfaces
│   └── utils.ts       # Funciones de utilidad general
└── page.tsx           # Componente principal de la página
```

## Iconos Font Awesome

- Los iconos que se usan en todo el proyecto son de font-awesome
- Utiliza siempre el componente IconFA para crear iconos:
    - Importa el componente: `import IconFA from '@/components/ui/IconFA';`
    - Uso básico: `<IconFA icon="nombre-del-icono" />`
    - Con estilo: `<IconFA icon="nombre-del-icono" style="duotone|solid|regular|light|brands" />`
    - Con tamaño: `<IconFA icon="nombre-del-icono" size="xs|sm|lg|xl|2xl" />`
    - Con clase personalizada: `<IconFA icon="nombre-del-icono" className="text-green-500" />`
    - No uses el prefijo "fa-" al especificar el nombre del icono
- Evita usar elementos `<i>` directamente con clases de Font Awesome
- Los nombres de iconos están en kebab-case (usando guiones): "user-graduate", "chart-line", "people-group"

## Componentes Core

- Utiliza componentes core para mantener la consistencia visual y funcional:

    - Importa los componentes desde sus respectivas rutas:
        ```typescript
        import Input from '@/components/form/input/InputField';
        import Label from '@/components/form/Label';
        import Select from '@/components/form/Select';
        import Button from '@/components/core/button/Button';
        import Badge from '@/components/core/badge/Badge';
        import {Table, TableHeader, TableBody, TableRow, TableCell} from '@/components/core/table';
        import {Modal} from '@/components/ui/modal';
        ```
    - Para cada componente form:
        - Usa `Label` siempre con atributo htmlFor para accesibilidad
        - Usa `Input` con startIcon cuando necesites iconos prepend
        - Para `Select` usa opciones con estructura `{value: string, label: string}`
        - Siempre maneja onChange en componentes controlados
    - Para tablas:
        - Usa estructura completa (Table, TableHeader, TableRow, TableCell)
        - Marca celdas de header con la prop `isHeader={true}`
        - Usa className para personalizar el estilo de las celdas
    - Para botones:
        - Especifica siempre la variante: `variant="primary|outline|danger"`
        - Usa `startIcon` para añadir iconos al botón
        - Desactiva botones durante operaciones asíncronas con `disabled={isLoading}`

## Estados de Carga

- Implementa estados de carga para todas las operaciones asíncronas:

    - Define variables de estado para cada sección que requiera carga:

        ```typescript
        const [isLoadingData, setIsLoadingData] = useState(true);
        const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
        const [isSaving, setIsSaving] = useState(false);
        ```

    - Muestra indicadores de carga en cada sección cuando corresponda:

        ```typescript
        {isLoadingData ? (
            <div className="flex items-center justify-center h-[200px]">
                <IconFA icon="spinner" spin className="text-gray-400" />
            </div>
        ) : (
            // Contenido real
        )}
        ```

    - Para componentes de métricas:
        - Siempre muestra un mensaje "Sin datos" cuando el array de datos esté vacío
        - Usa consistentemente los mismos patrones de altura (h-[200px]) para contenedores de carga
    - Para gráficos:
        - Muestra skeletons o spinners mientras cargan los datos
        - Define opciones base para ApexCharts y personaliza solo lo necesario
        - Verifica siempre que haya datos antes de renderizar gráficos

## Gestión de Datos

- Usa funciones asíncronas claramente nombradas para cargar datos:

    ```typescript
    async function loadData() {
        setIsLoading(true);
        try {
            // Lógica de carga de datos
        } catch (error) {
            console.error('Error específico:', error);
            // Manejo de errores
        } finally {
            setIsLoading(false);
        }
    }
    ```

- Para ordenamiento y filtrado:

    - Define funciones reutilizables (sortData, filterData)
    - Separa la lógica de ordenamiento de la presentación
    - Usa useEffect para actualizar datos filtrados cuando cambien dependencias

- Para paginación:
    - Usa funciones helpers como `paginateItems` que reciban array y devuelvan porción
    - Implementa controles de paginación estandarizados
    - Muestra contador de registros visibles vs totales

## Supabase

- La conexión a Supabase está configurada en `src/services/config/supabaseClient.ts`
- Usa siempre el cliente exportado: `import { supabaseClient } from '@/services/config/supabaseClient'`
- Para verificar conexión: `import { checkSupabaseConnection } from '@/services/config/supabaseClient'`
- Estructura de consultas Supabase:

    ```typescript
    // Ejemplo de consulta básica
    const {data, error} = await supabaseClient
        .from('tabla')
        .select('campo1, campo2, relacion(campo_relacion)')
        .eq('campo_filtro', valor)
        .order('campo_orden', {ascending: true})
        .limit(10);

    if (error) {
        console.error('Error en consulta:', error);
        return null;
    }

    return data;
    ```

- Usa siempre manejo de errores explícito con try/catch para operaciones Supabase
- Para mutaciones (insert, update, delete):

    - Verifica siempre la existencia de errores y devuelve resultados estructurados
    - Usa transacciones cuando sea necesario modificar múltiples tablas
    - Implementa optimistic updates en la UI mientras se completan operaciones

- Para autenticación:
    - Usa los métodos de `supabaseClient.auth` para operaciones de autenticación
    - Gestiona sesiones con los hooks proporcionados por Supabase
    - Verifica siempre el rol del usuario antes de operaciones restringidas

## Estructura de Módulos

### Hooks Principales para Cada Módulo

1. **useModuleManagement.ts** - Maneja el estado principal del módulo y las operaciones CRUD:

    - Estados (items, loading, error, modales)
    - Funciones de manejo de eventos
    - Operaciones de carga de datos, guardado, eliminación, etc.

2. **useTableConfig.tsx** - Define la configuración de tablas:

    - Columnas y su renderizado
    - Botones de acción
    - Configuraciones específicas de tabla (títulos, descripciones)

3. **useMetricsConfig.ts** - Configura métricas y gráficos:
    - Definición de métricas
    - Configuración de gráficos
    - Transformación de datos para visualización

### Module-Utils

1. **repository.ts** - Interacción directa con la base de datos:

    - Funciones CRUD básicas
    - Consultas específicas al módulo

2. **queries.ts** - Consultas SQL o funciones específicas:

    - Consultas SQL complejas
    - Construcción de consultas dinámicas

3. **services.ts** - Lógica de negocio:

    - Validaciones
    - Transformaciones complejas
    - Reglas de negocio

4. **types.ts** - Definiciones de tipos:

    - Interfaces
    - Enums/Constantes
    - Tipos específicos del módulo

5. **utils.ts** - Funciones de utilidad:
    - Helpers para manipulación de datos
    - Funciones reutilizables
    - Transformadores
