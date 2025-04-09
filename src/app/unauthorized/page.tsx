'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/context/SessionContext';
import ComponentCard from '@/components/common/ComponentCard';
import IconFA from '@/components/ui/IconFA';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import Button from '@/components/core/button/Button';

const UnauthorizedPage = () => {
    const { session, isAuthenticated, refreshSession } = useSessionContext();
    const router = useRouter();
    const [sessionInfo, setSessionInfo] = useState<any>(null);

    // Recopilar información de depuración
    useEffect(() => {
        const loadSessionInfo = async () => {
            try {
                // Refrescar la sesión una vez para asegurar que tenemos datos actualizados
                await refreshSession();

                if (session) {
                    setSessionInfo({
                        id: session.id,
                        email: session.email,
                        role: session.role || 'sin rol',
                        isAuthenticated: isAuthenticated
                    });
                } else {
                    setSessionInfo({
                        message: 'No hay sesión activa',
                        isAuthenticated: isAuthenticated
                    });
                }
            } catch (error) {
                console.error('Error al obtener información de sesión:', error);
                setSessionInfo({ error: 'Error al obtener información de sesión' });
            }
        };

        loadSessionInfo();
    }, [session, isAuthenticated, refreshSession]);

    // Determinar a qué dashboard redirigir según el rol
    const getDashboardPath = (role: string | undefined): string => {
        if (!role) return '/login';

        switch (role.toLowerCase()) {
            case 'admin':
                return '/admin-dashboard';
            case 'teacher':
                return '/teacher-dashboard/dashboard';
            case 'student':
                return '/student-dashboard/dashboard';
            default:
                return '/login';
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
            {/* Barra de navegación */}
            <header className="flex w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="flex w-full flex-grow items-center justify-between px-6 py-3">
                    {/* Logo en el lado izquierdo */}
                    <div className="flex items-center">
                        <Link href="/">
                            <div className="flex items-center">
                                <IconFA
                                    icon="graduation-cap"
                                    size="xl"
                                    className="text-indigo-600 dark:text-indigo-400"
                                />
                                <h1 className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">
                                    EduSync
                                </h1>
                            </div>
                        </Link>
                    </div>

                    {/* Controles en el lado derecho */}
                    <div className="flex items-center space-x-3">
                        <ThemeToggleButton />
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-8">
                <ComponentCard className="w-full max-w-3xl">
                    <div className="px-6 py-12 text-center">
                        {/* Ícono de acceso denegado */}
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                <IconFA icon="lock" size="2xl" />
                            </div>
                        </div>

                        <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                            Acceso Restringido
                        </h1>
                        <p className="mb-8 text-gray-600 dark:text-gray-400">
                            No tienes permisos para acceder a esta sección. Por favor, contacta al administrador
                            si necesitas acceso.
                        </p>

                        {/* Información de depuración */}
                        <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4 text-left dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                                Información de sesión:
                            </h3>
                            <pre className="text-xs text-gray-800 dark:text-gray-400">
                                {JSON.stringify(sessionInfo, null, 2)}
                            </pre>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {isAuthenticated && session?.role ? (
                                // Si está autenticado, mostrar botón para ir a su dashboard
                                <Button
                                    variant="primary"
                                    onClick={() => router.push(getDashboardPath(session.role))}
                                    startIcon="tachometer-alt"
                                >
                                    Ir a mi Dashboard
                                </Button>
                            ) : (
                                // Si no está autenticado, mostrar botón para iniciar sesión
                                <Button
                                    variant="primary"
                                    onClick={() => router.push('/login')}
                                    startIcon="sign-in-alt"
                                >
                                    Iniciar Sesión
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                onClick={() => router.push('/')}
                                startIcon="home"
                            >
                                Volver al Inicio
                            </Button>
                        </div>
                    </div>
                </ComponentCard>
            </main>
        </div>
    );
};

export default UnauthorizedPage; 