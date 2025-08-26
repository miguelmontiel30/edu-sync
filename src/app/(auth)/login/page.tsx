'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { login } from '@/services/auth/authService';
import { useSessionContext } from '@/context/SessionContext';
import { checkSupabaseConnection } from '@/services/config/supabaseClient';

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import ComponentCard from '@/components/common/ComponentCard';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';

// Constantes de UI
const LOGIN_LABELS = {
    WELCOME_TITLE: '¡Bienvenido de vuelta!',
    LOGIN_SUBTITLE: 'Ingresa tus credenciales para acceder al sistema',
    EMAIL_LABEL: 'Correo electrónico',
    EMAIL_PLACEHOLDER: 'correo@ejemplo.com',
    PASSWORD_LABEL: 'Contraseña',
    PASSWORD_PLACEHOLDER: 'Tu contraseña',
    LOGIN_BUTTON: 'Iniciar sesión',
    LOGIN_LOADING: 'Iniciando sesión...',
    FORGOT_PASSWORD: '¿Olvidaste tu contraseña?',
    ERROR_EMAIL_REQUIRED: 'Por favor ingresa tu correo electrónico',
    ERROR_PASSWORD_REQUIRED: 'Por favor ingresa tu contraseña',
    ERROR_AUTH_GENERIC: 'Error de autenticación. Verifica tus credenciales.',
    ERROR_WRONG_PASSWORD: 'La contraseña ingresada es incorrecta',
    ERROR_EMAIL_NOT_REGISTERED: 'El correo electrónico no está registrado en el sistema',
    ERROR_USER_DATA:
        'Tu usuario existe pero no se pudieron obtener tus datos. Contacta al administrador.',
    ERROR_CONNECTION: 'Error de conexión al servidor. Por favor intenta más tarde.',
    APP_NAME: 'EduSync',
};

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { refreshSession, isAuthenticated } = useSessionContext();
    const router = useRouter();

    // Verificar sesión activa y redirigir
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            const checkSessionAndRedirect = async () => {
                try {
                    const updatedSession = await refreshSession();
                    if (!updatedSession) return;

                    const targetPath =
                        updatedSession.role === 'admin'
                            ? '/admin-dashboard'
                            : updatedSession.role === 'teacher'
                              ? '/teacher-dashboard'
                              : '/student-dashboard/dashboard';

                    router.push(targetPath);
                } catch (error) {
                    console.error('Error verificando sesión en login:', error);
                }
            };

            checkSessionAndRedirect();
        }
    }, [isAuthenticated, isLoading, refreshSession, router]);

    // Verificar conexión a Supabase
    useEffect(() => {
        const verifyConnection = async () => {
            const isConnected = await checkSupabaseConnection();
            if (!isConnected) {
                console.error('No se pudo establecer conexión con Supabase');
                setError(LOGIN_LABELS.ERROR_CONNECTION);
            }
        };

        verifyConnection();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username.trim()) {
            setError(LOGIN_LABELS.ERROR_EMAIL_REQUIRED);
            return;
        }

        if (!password) {
            setError(LOGIN_LABELS.ERROR_PASSWORD_REQUIRED);
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const session = await login(username, password);
            await refreshSession();

            const targetPath =
                session.role === 'admin'
                    ? '/admin-dashboard'
                    : session.role === 'teacher'
                      ? '/teacher-dashboard'
                      : '/student-dashboard/dashboard';

            router.push(targetPath);
        } catch (error: unknown) {
            console.error('Login failed:', error);

            let errorMessage = LOGIN_LABELS.ERROR_AUTH_GENERIC;

            if (typeof error === 'object' && error !== null && 'message' in error) {
                const errorMsg = (error as { message: string }).message;

                if (errorMsg.includes('Contraseña incorrecta')) {
                    errorMessage = LOGIN_LABELS.ERROR_WRONG_PASSWORD;
                } else if (errorMsg.includes('no registrado')) {
                    errorMessage = LOGIN_LABELS.ERROR_EMAIL_NOT_REGISTERED;
                } else if (errorMsg.includes('Error al obtener datos del usuario')) {
                    errorMessage = LOGIN_LABELS.ERROR_USER_DATA;
                } else {
                    errorMessage = errorMsg;
                }
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
            <header className="flex w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="flex w-full flex-grow items-center justify-between px-6 py-3">
                    <div className="flex items-center">
                        <Link href="/">
                            <div className="inline-flex items-center">
                                <IconFA
                                    icon="graduation-cap"
                                    size="xl"
                                    className="mr-2 text-indigo-600 dark:text-indigo-400"
                                />
                                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {LOGIN_LABELS.APP_NAME}
                                </h1>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center">
                        <ThemeToggleButton />
                    </div>
                </div>
            </header>

            <div className="flex flex-grow items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <ComponentCard className="w-full px-6 py-6 shadow-lg">
                        <div className="p-4">
                            <div className="space-y-6">
                                <div className="flex justify-center">
                                    <IconFA
                                        icon="graduation-cap"
                                        size="2xl"
                                        className="mr-2 text-indigo-600 dark:text-indigo-400"
                                    />
                                </div>

                                <div className="pb-2 text-center">
                                    <div className="flex items-center justify-center">
                                        <h3 className="text-xl font-medium text-gray-800 dark:text-white">
                                            {LOGIN_LABELS.WELCOME_TITLE}
                                        </h3>
                                        <span className="ml-2 text-2xl">👋</span>
                                    </div>
                                    <p className="mt-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                                        {LOGIN_LABELS.LOGIN_SUBTITLE}
                                    </p>
                                </div>

                                {error && (
                                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-200">
                                        <div className="flex items-center">
                                            <IconFA icon="circle-exclamation" className="mr-2" />
                                            <span>{error}</span>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="username" className="mb-1">
                                            {LOGIN_LABELS.EMAIL_LABEL}
                                        </Label>
                                        <Input
                                            id="username"
                                            type="email"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            startIcon={
                                                <IconFA icon="envelope" className="text-gray-400" />
                                            }
                                            placeholder={LOGIN_LABELS.EMAIL_PLACEHOLDER}
                                            className={`w-full ${isLoading ? 'opacity-70' : ''}`}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="password" className="mb-1">
                                            {LOGIN_LABELS.PASSWORD_LABEL}
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            startIcon={
                                                <IconFA icon="lock" className="text-gray-400" />
                                            }
                                            placeholder={LOGIN_LABELS.PASSWORD_PLACEHOLDER}
                                            className={`w-full ${isLoading ? 'opacity-70' : ''}`}
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className={`w-full ${isLoading ? 'opacity-70' : ''}`}
                                            disabled={isLoading}
                                            startIcon={
                                                !isLoading ? (
                                                    <IconFA icon="right-to-bracket" />
                                                ) : undefined
                                            }
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center">
                                                    <IconFA icon="spinner" spin className="mr-2" />
                                                    <span>{LOGIN_LABELS.LOGIN_LOADING}</span>
                                                </div>
                                            ) : (
                                                <span>{LOGIN_LABELS.LOGIN_BUTTON}</span>
                                            )}
                                        </Button>
                                    </div>
                                </form>

                                <div className="text-center">
                                    <a
                                        href="/forgot-password"
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                                    >
                                        {LOGIN_LABELS.FORGOT_PASSWORD}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
