'use client';

// React
import { useEffect, useState } from 'react';

// Next.js
import { useRouter } from 'next/navigation';

// Context
import { useSessionContext } from '@/context/SessionContext';

export default function Home() {
    const router = useRouter();
    const { session, isLoading, isAuthenticated, refreshSession, hasRole } = useSessionContext();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        // Solo intentar redireccionar si:
        // 1. No estamos ya en proceso de redirección
        // 2. No estamos cargando la sesión
        if (!isRedirecting && !isLoading) {
            const verifySessionAndRedirect = () => {
                try {
                    setIsRedirecting(true);

                    if (!isAuthenticated) {
                        router.push('/login');
                        return;
                    }

                    // Ya hay una sesión activa, verificar el rol
                    if (session?.role) {
                        let targetPath = '';

                        // Usar método hasRole para verificar para garantizar consistencia
                        if (hasRole('admin')) {
                            targetPath = '/admin-dashboard';
                        } else if (hasRole('teacher')) {
                            targetPath = '/teacher-dashboard/dashboard';
                        } else if (hasRole('student')) {
                            targetPath = '/student-dashboard/dashboard';
                        } else {
                            // Rol desconocido, ir al login
                            targetPath = '/login';
                        }

                        router.push(targetPath);
                    } else {
                        // No hay información de rol, por seguridad ir al login
                        router.push('/login');
                    }
                } catch (error) {
                    console.error('Error al verificar la sesión:', error);
                    router.push('/login');
                }
            };

            verifySessionAndRedirect();
        }
    }, [isLoading, isAuthenticated, session, router, refreshSession, hasRole, isRedirecting]);

    // Mientras verificamos la sesión o redirigimos, mostrar indicador de carga
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                    Iniciando EduSync...
                </p>
            </div>
        </div>
    );
}
