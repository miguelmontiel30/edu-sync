'use client';

// React
import React, { useState, useEffect } from 'react';

// Next
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Servicios de autenticación
import { login } from '@/services/auth/authService';
import { useSessionContext } from '@/context/SessionContext';
import { checkSupabaseConnection } from '@/services/config/supabaseClient';

// Componentes Core
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import ComponentCard from '@/components/common/ComponentCard';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';

type UserType = 'student' | 'teacher' | 'admin' | null;

const LoginPage: React.FC = () => {
    // States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState<UserType>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;

    // Contexts
    const { refreshSession, isAuthenticated } = useSessionContext();

    // Router
    const router = useRouter();

    // Verificar si ya hay sesión activa
    useEffect(() => {
        const checkSessionAndRedirect = async () => {
            if (isAuthenticated && !isLoading) {
                try {
                    // Intentar refrescar la sesión para asegurar que tenemos la información correcta
                    const updatedSession = await refreshSession();

                    if (!updatedSession) {
                        return;
                    }

                    // Determinar a qué dashboard redireccionar según el rol
                    let targetPath = '/login';

                    if (updatedSession.role === 'admin') {
                        targetPath = '/admin-dashboard';
                    } else if (updatedSession.role === 'teacher') {
                        targetPath = '/teacher-dashboard/dashboard';
                    } else if (updatedSession.role === 'student') {
                        targetPath = '/student-dashboard/dashboard';
                    }

                    router.push(targetPath);
                } catch (error) {
                    console.error('Error verificando sesión en login:', error);
                }
            }
        };

        checkSessionAndRedirect();
    }, [isAuthenticated, isLoading, refreshSession, router]);

    // Cambiar automáticamente las diapositivas cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Función para cambiar manualmente a una diapositiva específica
    const goToSlide = (slideIndex: number) => {
        setCurrentSlide(slideIndex);
    };

    // Handler para seleccionar tipo de usuario
    const handleUserTypeSelect = (userType: UserType) => {
        setSelectedUserType(userType);
        setError('');
    };

    // Volver a la selección de tipo de usuario
    const handleBack = () => {
        setSelectedUserType(null);
        setUsername('');
        setPassword('');
        setError('');
    };

    // Handler to submit the form when the user clicks the login button
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validar campos
        if (!username.trim()) {
            setError('Por favor ingresa tu correo electrónico');
            return;
        }

        if (!password) {
            setError('Por favor ingresa tu contraseña');
            return;
        }

        // Resetear errores y estado de carga
        setError('');
        setIsLoading(true);

        try {
            // Usar nuestro servicio de autenticación con caché
            const session = await login(username, password);

            // Refrescar la sesión en el contexto
            await refreshSession();

            // Redirigimos al dashboard según el rol real del usuario en la base de datos
            if (session.role === 'admin') {
                router.push('/admin-dashboard');
            } else if (session.role === 'teacher') {
                router.push('/teacher-dashboard/dashboard');
            } else if (session.role === 'student') {
                router.push('/student-dashboard/dashboard');
            } else {
                // Por defecto usar selección del tipo de usuario
                if (selectedUserType === 'admin') {
                    router.push('/admin-dashboard');
                } else if (selectedUserType === 'teacher') {
                    router.push('/teacher-dashboard/dashboard');
                } else {
                    router.push('/student-dashboard/dashboard');
                }
            }
        } catch (error: any) {
            console.error('Login failed:', error);

            // Manejar mensajes de error específicos
            let errorMessage = 'Error de autenticación. Verifica tus credenciales.';

            if (error?.message) {
                if (error.message.includes('Contraseña incorrecta')) {
                    errorMessage = 'La contraseña ingresada es incorrecta';
                } else if (error.message.includes('no registrado')) {
                    errorMessage = 'El correo electrónico no está registrado en el sistema';
                } else if (error.message.includes('Error al obtener datos del usuario')) {
                    errorMessage = 'Tu usuario existe pero no se pudieron obtener tus datos. Contacta al administrador.';
                } else {
                    errorMessage = error.message;
                }
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Títulos según el tipo de usuario
    const getUserTypeTitle = () => {
        switch (selectedUserType) {
            case 'student':
                return 'Estudiantes y Tutores';
            case 'teacher':
                return 'Profesores';
            case 'admin':
                return 'Administradores';
            default:
                return '';
        }
    };

    // Verificar conexión a Supabase al cargar
    useEffect(() => {
        const verifyConnection = async () => {
            const isConnected = await checkSupabaseConnection();
            if (!isConnected) {
                console.error('No se pudo establecer conexión con Supabase');
                setError('Error de conexión al servidor. Por favor intenta más tarde.');
            }
        };

        verifyConnection();
    }, []);

    // Renderizar la selección de tipo de usuario
    const renderUserTypeSelection = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    ¿Quién usará el sistema?
                </h2>
                <p className="mt-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                    Selecciona tu rol para acceder al sistema
                </p>
            </div>

            <div className="space-y-3 pt-4">
                <button
                    onClick={() => handleUserTypeSelect('student')}
                    className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-900/30"
                >
                    <div className="flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                            <IconFA icon="user-graduate" className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="font-semibold text-gray-800 dark:text-white">Soy estudiante o tutor</h3>
                            <p className="text-sm font-normal text-gray-600 dark:text-gray-400">Ingreso al sistema para aprender o dar tutoría</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => handleUserTypeSelect('teacher')}
                    className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-900/30"
                >
                    <div className="flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                            <IconFA icon="chalkboard-teacher" className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="font-semibold text-gray-800 dark:text-white">Soy profesor</h3>
                            <p className="text-sm font-normal text-gray-600 dark:text-gray-400">Ingreso para gestionar mis clases y estudiantes</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => handleUserTypeSelect('admin')}
                    className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-900/30"
                >
                    <div className="flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                            <IconFA icon="user-shield" className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="ml-4">
                            <h3 className="font-semibold text-gray-800 dark:text-white">Soy administrador</h3>
                            <p className="text-sm font-normal text-gray-600 dark:text-gray-400">Ingreso para administrar la plataforma</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );

    // Renderizar el formulario de inicio de sesión
    const renderLoginForm = () => (
        <div className="space-y-6">
            <div className="text-center pb-2">
                <div className="flex items-center justify-center">
                    <h3 className="text-xl font-medium text-gray-800 dark:text-white">
                        ¡Bienvenido de vuelta!
                    </h3>
                    <span className="ml-2 text-2xl">👋</span>
                </div>
                <p className="mt-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                    Ingresa tus credenciales para acceder al sistema
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
                        Correo electrónico
                    </Label>
                    <Input
                        id="username"
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        startIcon={<IconFA icon="envelope" className="text-gray-400" />}
                        placeholder="correo@ejemplo.com"
                        className={`w-full ${isLoading ? 'opacity-70' : ''}`}
                    />
                </div>
                <div>
                    <Label htmlFor="password" className="mb-1">
                        Contraseña
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        startIcon={<IconFA icon="lock" className="text-gray-400" />}
                        placeholder="Tu contraseña"
                        className={`w-full ${isLoading ? 'opacity-70' : ''}`}
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        className={`w-full ${isLoading ? 'opacity-70' : ''}`}
                        disabled={isLoading}
                        startIcon={!isLoading ? <IconFA icon="right-to-bracket" /> : undefined}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <IconFA icon="spinner" spin className="mr-2" />
                                <span>Iniciando sesión...</span>
                            </div>
                        ) : (
                            <span>Iniciar sesión</span>
                        )}
                    </Button>
                </div>
            </form>

            <div className="text-center">
                <a
                    href="/forgot-password"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    ¿Olvidaste tu contraseña?
                </a>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
            {/* Barra de navegación */}
            <header className="flex w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="flex w-full flex-grow items-center justify-between px-6 py-3">
                    {/* Logo en el lado izquierdo */}
                    <div className="flex items-center">
                        <Link href="/">
                            <div className="inline-flex items-center">
                                <IconFA
                                    icon="graduation-cap"
                                    size="xl"
                                    className="mr-2 text-indigo-600 dark:text-indigo-400"
                                />
                                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">EduSync</h1>
                            </div>
                        </Link>
                    </div>

                    {/* Botón de tema en el lado derecho */}
                    <div className="flex items-center">
                        <ThemeToggleButton />
                    </div>
                </div>
            </header>

            <div className="flex flex-grow">
                {/* Sección izquierda - Formulario (centrado en tablets y móviles) */}
                <div className="flex w-full items-center justify-center lg:w-1/2">
                    <div className="w-full max-w-xl px-6 py-6 md:px-8">
                        {/* Card con el contenido */}
                        <ComponentCard
                            title={
                                <>
                                    {selectedUserType !== null && (
                                        <button
                                            onClick={() => setSelectedUserType(null)}
                                            className="mr-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            <IconFA icon="arrow-left" />
                                        </button>
                                    )}
                                    {selectedUserType === null ? "Acceso al sistema" : getUserTypeTitle()}
                                </>
                            }
                            className="shadow-md w-full px-6 py-4"
                        >
                            <div className="p-4">
                                {selectedUserType === null
                                    ? renderUserTypeSelection()
                                    : renderLoginForm()
                                }
                            </div>
                        </ComponentCard>
                    </div>
                </div>

                {/* Sección derecha - Carrusel (solo visible en desktop) */}
                <div className="hidden lg:block lg:w-1/2">
                    <div className="relative h-full w-full bg-gray-900">
                        <div className="absolute inset-0 bg-gray-900"></div>

                        {/* Carrusel */}
                        <div className="relative z-10 flex h-full flex-col justify-center p-8">
                            {/* Dashboard UI Elements */}
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-full max-w-3xl">
                                    {/* Contenedor con altura fija para evitar saltos */}
                                    <div className="h-[480px] flex items-center">
                                        <div className={`w-full transition-opacity duration-500 ${currentSlide === 0 ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <DashboardCard title="Asistencia Mensual" value="92%" growth="+3.5%" />
                                                <DashboardCard title="Rendimiento Académico" value="8.7" growth="+0.4 pts" showChart />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <DashboardCard title="Distribución por Materias" value="12" showPieChart />
                                                <DashboardCard title="Participación en Clases" value="87.3%" growth="+5.2%" />
                                            </div>

                                            <div className="mb-6">
                                                <DashboardCard title="Progreso del Plan de Estudios" value="78%" growth="+2.1%" fullWidth />
                                            </div>

                                            <div className="text-center space-y-3">
                                                <h2 className="text-2xl font-bold text-white">Analiza el Progreso Académico</h2>
                                                <p className="text-gray-400 text-sm max-w-lg mx-auto">
                                                    Toma decisiones informadas con las herramientas analíticas de EduSync. Visualiza el rendimiento académico
                                                    y mejora la experiencia educativa con datos precisos y actualizados.
                                                </p>

                                                {/* Indicadores de diapositivas */}
                                                <div className="flex justify-center space-x-2 pt-4">
                                                    {[...Array(totalSlides)].map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => goToSlide(index)}
                                                            className={`h-2 w-2 rounded-full transition-colors ${currentSlide === index
                                                                ? 'bg-white'
                                                                : 'bg-gray-600 hover:bg-gray-500'
                                                                }`}
                                                            aria-label={`Ir a la diapositiva ${index + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`w-full transition-opacity duration-500 ${currentSlide === 1 ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg">
                                                    <div className="flex flex-col items-center justify-center space-y-4">
                                                        <IconFA icon="book-open" size="2xl" className="text-blue-400" />
                                                        <span className="text-center text-sm font-medium text-white">Aprendizaje interactivo</span>
                                                        <div className="text-xs text-gray-400">Impulsa el compromiso estudiantil</div>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg">
                                                    <div className="flex flex-col items-center justify-center space-y-4">
                                                        <IconFA icon="users" size="2xl" className="text-purple-400" />
                                                        <span className="text-center text-sm font-medium text-white">Colaboración efectiva</span>
                                                        <div className="text-xs text-gray-400">Mejora el trabajo en equipo</div>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg">
                                                    <div className="flex flex-col items-center justify-center space-y-4">
                                                        <IconFA icon="chart-line" size="2xl" className="text-green-400" />
                                                        <span className="text-center text-sm font-medium text-white">Seguimiento de progreso</span>
                                                        <div className="text-xs text-gray-400">Análisis detallado del rendimiento</div>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg">
                                                    <div className="flex flex-col items-center justify-center space-y-4">
                                                        <IconFA icon="certificate" size="2xl" className="text-yellow-400" />
                                                        <span className="text-center text-sm font-medium text-white">Certificaciones</span>
                                                        <div className="text-xs text-gray-400">Reconocimiento de logros</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center space-y-3">
                                                <h2 className="text-2xl font-bold text-white">Potencia la Experiencia Educativa</h2>
                                                <p className="text-gray-400 text-sm max-w-lg mx-auto">
                                                    Transforma la manera en que gestionas la educación con EduSync. Nuestras herramientas
                                                    facilitan la comunicación, colaboración y seguimiento del desempeño académico.
                                                </p>

                                                {/* Indicadores de diapositivas */}
                                                <div className="flex justify-center space-x-2 pt-4">
                                                    {[...Array(totalSlides)].map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => goToSlide(index)}
                                                            className={`h-2 w-2 rounded-full transition-colors ${currentSlide === index
                                                                ? 'bg-white'
                                                                : 'bg-gray-600 hover:bg-gray-500'
                                                                }`}
                                                            aria-label={`Ir a la diapositiva ${index + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`w-full transition-opacity duration-500 ${currentSlide === 2 ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                            <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg mb-6">
                                                <div className="text-center mb-6">
                                                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/20 mb-4">
                                                        <IconFA icon="chart-pie" size="lg" className="text-blue-400" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-white mb-2">
                                                        Dashboard Analítico
                                                    </h3>
                                                    <p className="text-gray-400 text-sm max-w-md mx-auto">
                                                        Visualiza todas tus métricas importantes en un solo lugar
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3">
                                                    <StatCard value="92%" label="Tasa de retención" />
                                                    <StatCard value="3,415" label="Usuarios activos" />
                                                    <StatCard value="76%" label="Crecimiento" />
                                                </div>
                                            </div>

                                            <div className="text-center space-y-3">
                                                <h2 className="text-2xl font-bold text-white">Optimiza la Gestión Educativa</h2>
                                                <p className="text-gray-400 text-sm max-w-lg mx-auto">
                                                    Simplifica la administración escolar con EduSync. Gestiona grupos, calificaciones
                                                    y seguimiento académico con nuestro sistema integral diseñado para instituciones educativas.
                                                </p>

                                                {/* Indicadores de diapositivas */}
                                                <div className="flex justify-center space-x-2 pt-4">
                                                    {[...Array(totalSlides)].map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => goToSlide(index)}
                                                            className={`h-2 w-2 rounded-full transition-colors ${currentSlide === index
                                                                ? 'bg-white'
                                                                : 'bg-gray-600 hover:bg-gray-500'
                                                                }`}
                                                            aria-label={`Ir a la diapositiva ${index + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface DashboardCardProps {
    title: string;
    value: string;
    growth?: string;
    showChart?: boolean;
    showPieChart?: boolean;
    fullWidth?: boolean;
}

const DashboardCard = ({ title, value, growth, showChart, showPieChart, fullWidth }: DashboardCardProps) => {
    return (
        <div className={`bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg ${fullWidth ? "col-span-2" : ""}`}>
            <div className="text-xs text-gray-400 mb-1">{title}</div>
            <div className="flex justify-between items-center">
                <div>
                    <div className="text-lg font-bold text-white">{value}</div>
                    {growth && (
                        <div className="text-xs text-green-400">
                            {growth}
                        </div>
                    )}
                </div>

                {showChart && (
                    <div className="flex items-end space-x-1 h-12">
                        <div className="w-2 bg-gray-700 h-4 rounded-sm"></div>
                        <div className="w-2 bg-gray-700 h-6 rounded-sm"></div>
                        <div className="w-2 bg-gray-700 h-8 rounded-sm"></div>
                        <div className="w-2 bg-gray-700 h-5 rounded-sm"></div>
                        <div className="w-2 bg-gray-700 h-10 rounded-sm"></div>
                    </div>
                )}

                {showPieChart && (
                    <div className="relative h-12 w-12">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
                        <div
                            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-blue-400 border-b-blue-400"
                            style={{ transform: 'rotate(45deg)' }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface StatCardProps {
    value: string;
    label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
    return (
        <div className="bg-gray-700/40 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-400">{label}</div>
        </div>
    );
};

export default LoginPage;
