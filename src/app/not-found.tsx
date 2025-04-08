'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ComponentCard from '@/components/common/ComponentCard';
import IconFA from '@/components/ui/IconFA';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import Button from '@/components/core/button/Button';

const NotFoundPage = () => {
    const router = useRouter();

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
                        {/* Ícono de página no encontrada */}
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400">
                                <IconFA icon="map-signs" size="2xl" />
                            </div>
                        </div>

                        <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                            Página No Encontrada
                        </h1>
                        <p className="mb-8 text-gray-600 dark:text-gray-400">
                            Lo sentimos, la página que estás buscando no existe o ha sido movida.
                        </p>

                        {/* Mensaje adicional */}
                        <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4 text-left dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                                ¿Qué puedes hacer ahora?
                            </h3>
                            <ul className="list-inside list-disc text-sm text-gray-600 dark:text-gray-400">
                                <li>Verificar que la URL sea correcta</li>
                                <li>Regresar a la página anterior</li>
                                <li>Ir a la página de inicio</li>
                                <li>Contactar al soporte si crees que esto es un error</li>
                            </ul>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                variant="primary"
                                onClick={() => router.push('/')}
                                startIcon="home"
                            >
                                Ir a Inicio
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                startIcon="arrow-left"
                            >
                                Volver Atrás
                            </Button>
                        </div>
                    </div>
                </ComponentCard>
            </main>
        </div>
    );
};

export default NotFoundPage; 