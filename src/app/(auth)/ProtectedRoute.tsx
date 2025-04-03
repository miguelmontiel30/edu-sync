import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import IconFA from '@/components/ui/IconFA';

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
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    // Obtener la ruta actual
    const router = useRouter();

    // Usar useEffect para manejar la redirección
    useEffect(() => {
        // Solo verificar cuando isLoading es false
        if (!isLoading) {
            // Verificar si hay usuario autenticado
            if (!user || !profile) {
                router.push('/login');
                return;
            }

            // Verificar si se requiere ser administrador
            if (adminOnly && !isAdmin) {
                router.push('/unauthorized');
                return;
            }

            // Verificar permisos requeridos
            const hasAllPermissions = requiredPermissions.every(permission =>
                hasPermission(permission)
            );

            // Si no tiene los permisos requeridos
            if (requiredPermissions.length > 0 && !hasAllPermissions) {
                router.push('/unauthorized');
                return;
            }

            // Si pasa todas las verificaciones
            setIsAuthorized(true);
        }
    }, [user, profile, isLoading, isAdmin, adminOnly, requiredPermissions, hasPermission, router]);

    // Mientras carga o verifica autorización, mostrar estado de carga
    if (isLoading || isAuthorized === null) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="mb-4 text-indigo-600 dark:text-indigo-400">
                    <IconFA icon="spinner" spin size="2xl" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verificando acceso...</p>
            </div>
        );
    }

    // Si está autorizado, renderizar los hijos
    return <>{children}</>;
}