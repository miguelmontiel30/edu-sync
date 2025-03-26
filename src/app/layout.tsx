'use client';

// React
import { useEffect } from 'react';

// Next
import { useRouter } from 'next/navigation';
import { Outfit } from 'next/font/google';

// Store
import { useAuthStore } from '@/store/useAuthStore';

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
import { AuthProvider } from '@/context/AuthContext';

const outfit = Outfit({
    variable: '--font-outfit-sans',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated, fetchUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    return (
        <html lang="es">
            <body className={`${outfit.variable} dark:bg-gray-900`}>
                <AuthProvider>
                    <ThemeProvider>
                        <SidebarProvider>{children}</SidebarProvider>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
