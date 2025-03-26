'use client';
// Context
import { useSidebar } from '@/context/SidebarContext';

// Components
import AdminSidebar from '@/components/navigation/AdminSidebar';
import AdminNavbar from '@/components/navigation/AdminNavbar';

// Routes
import ProtectedRoute from '@/app/(auth)/ProtectedRoute';

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    // Sidebar state
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    // Dynamic class for main content margin based on sidebar state
    let mainContentMargin = 'lg:ml-[90px]';

    if (isMobileOpen) {
        mainContentMargin = 'ml-0';
    } else if (isExpanded || isHovered) {
        mainContentMargin = 'lg:ml-[290px]';
    }

    return (
        <ProtectedRoute adminOnly={true}>
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
