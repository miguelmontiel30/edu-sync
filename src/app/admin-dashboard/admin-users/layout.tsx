'use client';

// Routes
import ProtectedRoute from '@/app/(auth)/ProtectedRoute';

export default function AdminUsersLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen">
                {/* Main content */}
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6">{children}</div>
            </div>
        </ProtectedRoute>
    );
}
