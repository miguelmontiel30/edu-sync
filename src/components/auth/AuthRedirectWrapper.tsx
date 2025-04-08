'use client';

import { useEffect, ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSessionContext } from '@/context/SessionContext';

interface AuthRedirectWrapperProps {
    children: ReactNode;
}

export function AuthRedirectWrapper({ children }: AuthRedirectWrapperProps) {
    const { isAuthenticated, isLoading } = useSessionContext();
    const router = useRouter();
    const pathname = usePathname();
    const [redirectChecked, setRedirectChecked] = useState(false);
    const [redirectInProgress, setRedirectInProgress] = useState(false);

    useEffect(() => {
        // Páginas públicas que no requieren autenticación
        const publicPaths = ['/login', '/register', '/unauthorized', '/not-found'];
        const isPublicPath = publicPaths.some(pp => pathname.includes(pp));

        // Evitar procesar múltiples veces o durante una redirección
        if (redirectInProgress || redirectChecked) return;

        // Solo ejecutar cuando la carga termine
        if (!isLoading) {
            console.log('Auth check en', pathname, 'autenticado:', isAuthenticated);

            // Marcar como verificado para no repetir
            setRedirectChecked(true);

            // Solo redirigir al login si:
            // 1. No es una página pública
            // 2. No está autenticado
            // 3. No estamos ya en proceso de redirección
            if (!isPublicPath && !isAuthenticated && !redirectInProgress) {
                console.log('Redirigiendo a login desde', pathname);
                setRedirectInProgress(true);
                router.push('/login');
                return;
            }
        }
    }, [isAuthenticated, isLoading, redirectChecked, redirectInProgress, router, pathname]);

    // Resetear estado cuando la ruta cambia
    useEffect(() => {
        setRedirectChecked(false);
        setRedirectInProgress(false);
    }, [pathname]);

    // Mientras está cargando, mostrar indicador de carga
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando...</p>
                </div>
            </div>
        );
    }

    // Obtener la ruta actual
    const isPublicPath = ['/login', '/register', '/unauthorized', '/not-found'].some(pp =>
        pathname.includes(pp)
    );

    // Mostrar el contenido si el usuario está autenticado o es una página pública
    if (isAuthenticated || isPublicPath) {
        return <>{children}</>;
    }

    // Si no está autenticado y no es una página pública, mostrar indicador de carga durante redirección
    if (redirectInProgress) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Redirigiendo...</p>
                </div>
            </div>
        );
    }

    // Mostrar el contenido mientras se procesa (caso extraordinario)
    return <>{children}</>;
} 