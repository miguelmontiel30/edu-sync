'use client';

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
    return (
        <html lang="es">
            <body className={`${outfit.variable} dark:bg-gray-900`}>
                <SessionProvider>
                    <AuthProvider>
                        <ThemeProvider>
                            <SidebarProvider>
                                <StatusProvider>
                                    <AuthRedirectWrapper>
                                        {children}
                                    </AuthRedirectWrapper>
                                </StatusProvider>
                            </SidebarProvider>
                        </ThemeProvider>
                    </AuthProvider>
                </SessionProvider>
            </body>
        </html>
    );
}

