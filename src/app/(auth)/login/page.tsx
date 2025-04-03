'use client';

// React
import React, { useState } from 'react';

// Next
import { useRouter } from 'next/navigation';

// Store
import { useAuthStore } from '@/store/useAuthStore';

// Auth Context
import { useAuth } from '@/context/AuthContext';

const LoginPage: React.FC = () => {
    // States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Contexts
    const { login: storeLogin } = useAuthStore();
    const { login: contextLogin } = useAuth();

    // Router
    const router = useRouter();

    // Handler to submit the form when the user clicks the login button
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Resetear errores y estado de carga
        setError('');
        setIsLoading(true);

        try {
            // Primero autenticamos con Supabase a través del Context
            await contextLogin(username, password);

            // Luego actualizamos el estado global de Zustand
            await storeLogin(username, password);

            // Redirigimos al dashboard
            router.push('/admin-dashboard/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            setError('Error de autenticación. Verifica tus credenciales.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md space-y-6 rounded bg-white p-8 shadow-md dark:bg-gray-800">
                <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white">
                    Iniciar sesión
                </h2>

                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200 disabled:bg-indigo-400"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <i className="fa-duotone fa-solid fa-spinner fa-spin mr-2"></i>
                                <span>Iniciando sesión...</span>
                            </>
                        ) : (
                            'Iniciar sesión'
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <a
                        href="/register"
                        className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                        ¿No tienes una cuenta? Regístrate aquí
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
