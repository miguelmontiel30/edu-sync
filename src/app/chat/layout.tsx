'use client';

// Context
import { useSidebar } from '@/context/SidebarContext';
import { useSessionContext } from '@/context/SessionContext';

// Components
import AdminSidebar from '@/components/navigation/AdminSidebar';
import AdminNavbar from '@/components/navigation/AdminNavbar';

// Routes
import ProtectedRoute from '@/app/(auth)/ProtectedRoute';

export default function ChatLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
        <ProtectedRoute>
            <div className="min-h-screen xl:flex">
                {/* Sidebar content */}
                <AdminSidebar />

                {/* Contenido principal */}
                <div
                    className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
                >
                    {/* Navbar */}
                    <AdminNavbar />

                    {/* Main content */}
                    <div className="mx-auto max-w-screen-2xl">{children}</div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
