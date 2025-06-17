'use client';

import React from 'react';

export default function TeacherDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Mis Clases
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">12</p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Estudiantes
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">248</p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Tareas Pendientes
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">15</p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Calificaciones
                    </h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">89%</p>
                </div>
            </div>

            {/* Recent Activities */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Actividades Recientes
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Nueva tarea creada - Matemáticas Avanzadas
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Hace 2 horas</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Calificación completada - Examen de Historia
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Hace 4 horas</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Mensaje de estudiante - Juan Pérez
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Hace 1 día</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Acciones Rápidas
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <button className="rounded-lg border border-gray-300 p-4 text-center transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Crear Nueva Tarea
                        </div>
                    </button>
                    <button className="rounded-lg border border-gray-300 p-4 text-center transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Ver Calificaciones
                        </div>
                    </button>
                    <button className="rounded-lg border border-gray-300 p-4 text-center transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Gestionar Clases
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
