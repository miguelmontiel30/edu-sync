'use client';

// Context
import { useSidebar } from '@/context/SidebarContext';
import { useSessionContext } from '@/context/SessionContext';

// Components
import AdminSidebar from '@/components/navigation/AdminSidebar';
import AdminNavbar from '@/components/navigation/AdminNavbar';

// Routes
import ProtectedRoute from '@/app/(auth)/ProtectedRoute';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    // Sidebar state
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    const { session, hasRole, isLoading } = useSessionContext();
    const router = useRouter();

    // Verificación adicional de roles para evitar redirecciones innecesarias
    useEffect(() => {
        const verifyAdminAccess = async () => {
            // Solo ejecutar cuando no está cargando y hay datos de sesión
            if (!isLoading && session) {
                const isAdmin = hasRole('admin');

                // Si el usuario no es admin, redirigir a unauthorized
                if (!isAdmin) {
                    router.push('/unauthorized');
                }
            }
        };

        verifyAdminAccess();
    }, [session, hasRole, isLoading, router]);

    // Dynamic class for main content margin based on sidebar state
    let mainContentMargin = 'lg:ml-[90px]';

    if (isMobileOpen) {
        mainContentMargin = 'ml-0';
    } else if (isExpanded || isHovered) {
        mainContentMargin = 'lg:ml-[290px]';
    }

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen xl:flex">
                {/* Sidebar content */}
                <AdminSidebar />

                {/* Contenido principal */}
                <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
                    {/* Navbar */}
                    <AdminNavbar />

                    {/* Main content */}
                    <div className="mx-auto max-w-screen-2xl p-4 md:p-6">{children}</div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
