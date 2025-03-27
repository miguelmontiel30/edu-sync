# EduSync

> EduSync es una aplicación para mantener sincronizados todos los aspectos de una escuela.
> EduSync es una plataforma integral para la administración escolar que incluya funcionalidades para alumnos, maestros, directivos y padres, optimizando la gestión académica, financiera y organizativa de una escuela.

## 🚀 Tecnologías Utilizadas

- **Frontend:**

    - Next.js 14
    - TypeScript
    - Tailwind CSS
    - Shadcn/ui
    - ApexCharts
    - React Hook Form
    - Zod

- **Backend:**
    - Supabase (PostgreSQL)
    - Row Level Security (RLS)
    - Supabase Auth

## 📋 Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Cuenta en Supabase
- Base de datos PostgreSQL

## 🛠️ Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/edu-sync.git
cd edu-sync
```

2. Instala las dependencias:

```bash
npm install
# o
yarn install
```

3. Configura las variables de entorno:
   Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

4. Inicializa la base de datos:

- Ejecuta el script SQL en `src/EduSync.sql` en tu base de datos Supabase
- Esto creará todas las tablas necesarias y configurará las políticas de seguridad

## 🚀 Ejecución

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Rutas y páginas de Next.js
├── components/            # Componentes reutilizables
├── context/              # Contextos de React
├── icons/                # Iconos SVG
├── lib/                  # Utilidades y configuraciones
├── services/             # Servicios y APIs
├── store/                # Estado global
└── utils/                # Funciones utilitarias
```

## 🔐 Roles y Permisos

El sistema incluye los siguientes roles predefinidos:

- **Admin:** Acceso total al sistema
- **Teacher:** Gestión de grupos y calificaciones
- **Student:** Acceso a su información académica
- **Tutor:** Seguimiento del estudiante

## 📊 Características Principales

- Gestión de estudiantes
- Administración de grupos
- Control de calificaciones
- Gestión de ciclos escolares
- Sistema de tutores
- Dashboard con métricas
- Seguridad basada en roles

## 🤝 Contribución

Para contribuir al proyecto, sigue estas reglas:

### Prefijos de Commits

- **[config]:** Cambios en configuración o dependencias
- **[fix]:** Corrección de errores
- **[feat]:** Nuevas características
- **[refactor]:** Cambios en la estructura del código

### Proceso de Contribución

1. Crea una rama para tu feature: `git checkout -b feat/nueva-caracteristica`
2. Realiza tus cambios
3. Commit tus cambios siguiendo las reglas de prefijos
4. Push a tu rama: `git push origin feat/nueva-caracteristica`
5. Crea un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- Miguel Montiel - [@miguelmontiel30](https://github.com/miguelmontiel30)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Estructura Básica de Componentes

> Editando para el futuro.

## Contribución [Prefijos y Reglas para Mensajes de Commit]

> Tenemos un estándar para hacer commits simples, que depende de la tarea que estés resolviendo.

![Git three](https://user-images.githubusercontent.com/31743982/167278056-1911dedc-d4b6-4110-b6c2-01dcb2c53133.png)

- **_[config]:_** Cuando agregas nuevas dependencias (como react-native-pdf) en el package.json o has agregado una configuración al proyecto, necesitamos especificar el **_prefijo config._**
- **_[fix]:_** Cuando hay un error o bug en la aplicación y el commit lo resuelve, necesitamos especificar el **_prefijo fix._**
- **_[feat]:_** Cuando hay un nuevo módulo o nueva característica en el proyecto, necesitamos especificar el **_prefijo feat._**
- **_[refactor]:_** Cuando hay un cambio en la forma en que el código se ejecuta o cambios en componentes (por ejemplo, cuando moviste partes de un componente a uno nuevo)

> Esto ayuda con la organización de todos los cambios dentro de la aplicación y ahorra mucho tiempo cuando necesitamos revertir la aplicación en algún punto del tiempo.

![Git Messages](https://user-images.githubusercontent.com/31743982/167278327-effad862-257a-4bc5-92fe-7e15e4848b5f.png)

Fuente: ![Commits Convencionales](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)
