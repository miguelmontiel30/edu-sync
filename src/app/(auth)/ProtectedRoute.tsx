'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/context/SessionContext';
import { checkSupabaseConnection } from '@/services/config/supabaseClient';
import IconFA from '@/components/ui/IconFA';

interface ProtectedRouteProps {
    children: ReactNode;
    adminOnly?: boolean;
    teacherOnly?: boolean;
    studentOnly?: boolean;
    requiredPermissions?: string[];
}

export default function ProtectedRoute({
    children,
    adminOnly = false,
    teacherOnly = false,
    studentOnly = false,
    requiredPermissions = []
}: ProtectedRouteProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [authVerified, setAuthVerified] = useState(false);
    const { session, isLoading, hasRole, refreshSession } = useSessionContext();

    // Primera verificación de conexión una sola vez
    useEffect(() => {
        // Evitar ejecutar más de una vez
        if (authVerified) return;

        const verifyAuthentication = async () => {
            try {
                // Verificar conexión a Supabase
                const isConnected = await checkSupabaseConnection();

                if (!isConnected) {
                    console.error('Error de conexión a Supabase en ruta protegida');
                    setConnectionError(true);
                    setAuthVerified(true);
                    return;
                }

                // Si estamos cargando, intentar refrescar la sesión
                if (isLoading) {
                    await refreshSession();
                }

                // Marcar que ya verificamos
                setAuthVerified(true);
            } catch (error) {
                console.error('Error verificando autenticación:', error);
                setConnectionError(true);
                setAuthVerified(true);
            }
        };

        verifyAuthentication();
    }, [authVerified, isLoading, refreshSession]);

    // Segunda verificación: solo después de la primera y cuando la carga termine
    useEffect(() => {
        // Si ya verificamos la conexión y no hay error de conexión, verificar roles
        if (authVerified && !connectionError && !isLoading) {
            // Verificar si hay usuario autenticado
            if (!session) {
                // Redirigir a la página de login
                router.push('/login');
                return;
            }

            let isRoleAuthorized = true;

            // Verificar restricciones de rol
            if (adminOnly && !hasRole('admin')) {
                isRoleAuthorized = false;
            }

            if (teacherOnly && !hasRole('teacher')) {
                isRoleAuthorized = false;
            }

            if (studentOnly && !hasRole('student')) {
                isRoleAuthorized = false;
            }

            // Si no tiene el rol adecuado, redirigir a página no autorizada
            if (!isRoleAuthorized) {
                router.push('/unauthorized');
                return;
            }

            // Si llegamos aquí, el usuario está autorizado
            setIsAuthorized(true);
        }
    }, [
        authVerified,
        connectionError,
        isLoading,
        session,
        adminOnly,
        teacherOnly,
        studentOnly,
        hasRole,
        router
    ]);

    // Si hay error de conexión
    if (connectionError) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="text-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto mb-4">
                        <IconFA icon="triangle-exclamation" className="text-red-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">Error de conexión</p>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        No se pudo establecer conexión con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <IconFA icon="arrow-rotate-right" className="mr-2" />
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // Mientras está cargando o no está autorizado, mostrar indicador de carga
    if (isLoading || (!isAuthorized && authVerified)) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Verificando acceso...</p>
                </div>
            </div>
        );
    }

    // Si está autorizado, mostrar el contenido
    return <>{children}</>;
}