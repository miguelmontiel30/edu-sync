import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
    readonly children: ReactNode;
    readonly requiredPermissions?: string[];
    readonly adminOnly?: boolean;
}

export default function ProtectedRoute({
    children,
    requiredPermissions = [],
    adminOnly = false
}: ProtectedRouteProps) {
    // Obtener el usuario autenticado y sus datos
    const { user, profile, isLoading, isAdmin, hasPermission } = useAuth();

    // Obtener la ruta actual
    const router = useRouter();

    // Si está cargando, mostrar un estado de carga
    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Cargando...</div>;
    }

    // Si no hay usuario autenticado, redirigir al login
    if (!user || !profile) {
        router.push('/login');
        return null;
    }

    // Verificar si se requiere ser administrador
    if (adminOnly && !isAdmin) {
        router.push('/unauthorized');
        return null;
    }

    // Verificar permisos requeridos
    const hasAllPermissions = requiredPermissions.every(permission =>
        hasPermission(permission)
    );

    // Si no hay permisos requeridos, redirigir al usuario a la página de no autorizado
    if (requiredPermissions.length > 0 && !hasAllPermissions) {
        router.push('/unauthorized');
        return null;
    }

    // Si pasa todas las verificaciones, renderizar los componentes hijos
    return <>{children}</>;
}