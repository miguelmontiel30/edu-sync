'use client';
// Context
import {useSidebar} from '@/context/SidebarContext';

// Components
import AdminSidebar from '@/components/navigation/AdminSidebar';
import AdminNavbar from '@/components/navigation/AdminNavbar';

export default function AdminLayout({children}: {children: React.ReactNode}) {
    // Sidebar state
    const {isExpanded, isHovered, isMobileOpen} = useSidebar();

    // Dynamic class for main content margin based on sidebar state
    const mainContentMargin = isMobileOpen
        ? 'ml-0'
        : isExpanded || isHovered
          ? 'lg:ml-[290px]'
          : 'lg:ml-[90px]';

    return (
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
    );
}
