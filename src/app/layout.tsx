'use client';

import { useEffect, useState } from 'react';
// Next
import { Outfit } from 'next/font/google';

// Global styles
import './UI/globals.css';
import '../../public/icons/all.css';
import '../../public/icons/sharp-solid.css';
import '../../public/icons/sharp-regular.css';
import '../../public/icons/sharp-light.css';
import '../../public/icons/duotone.css';
import '../../public/icons/brands.css';

// Contexts
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { StatusProvider } from '@/context/StatusContext';
import { SessionProvider } from '@/context/SessionContext';
import { AuthProvider } from '@/context/AuthContext';
import { AuthRedirectWrapper } from '@/components/auth/AuthRedirectWrapper';

const outfit = Outfit({
    variable: '--font-outfit-sans',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Estado para detectar si estamos en el cliente
    const [isClient, setIsClient] = useState(false);

    // Efecto que sólo se ejecuta en el cliente
    useEffect(() => {
        setIsClient(true);

        try {
            // Inicializar tema predeterminado
            const defaultPrimaryColor = '#465FFF';
            document.documentElement.style.setProperty('--primary-color', defaultPrimaryColor);

            // Verificar preferencia de tema oscuro/claro
            const prefersDarkMode = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
            const savedTheme = localStorage.getItem('eduSync.darkMode');
            const isDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDarkMode);

            // Aplicar clase dark si es necesario
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } catch (error) {
            console.error('Error durante la inicialización del tema:', error);
            // En caso de error, al menos asegurarnos de que se muestre la interfaz
            setIsClient(true);
        }
    }, []);

    return (
        <html lang="es" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/images/EduSync-logo.png" type="image/png" />
                <link rel="shortcut icon" href="/images/EduSync-logo.png" type="image/png" />
                <title>EduSync</title>
                <meta
                    name="description"
                    content="Plataforma educativa para gestión de aprendizaje"
                />
                <meta name="theme-color" content="#465FFF" />
            </head>
            <body className={`${outfit.variable} dark:bg-gray-900`} suppressHydrationWarning>
                {isClient ? (
                    <SessionProvider>
                        <AuthProvider>
                            <ThemeProvider>
                                <SidebarProvider>
                                    <StatusProvider>
                                        <AuthRedirectWrapper>{children}</AuthRedirectWrapper>
                                    </StatusProvider>
                                </SidebarProvider>
                            </ThemeProvider>
                        </AuthProvider>
                    </SessionProvider>
                ) : (
                    <div className="flex h-screen w-full items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent align-[-0.125em]" />
                    </div>
                )}
            </body>
        </html>
    );
}
