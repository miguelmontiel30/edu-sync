'use client';

// React & Next.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Components
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';

// UI Components
import IconFA from '@/components/ui/IconFA';

export default function SystemConfig() {
    const router = useRouter();

    // Redirigir automáticamente a la sección de roles
    useEffect(() => {
        router.push('/system-config/roles');
    }, [router]);

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <PageBreadcrumb pageTitle="Configuración del Sistema" />

            <div className="grid grid-cols-1 gap-6">
                <ComponentCard>
                    <div className="flex h-64 items-center justify-center">
                        <div className="text-center">
                            <IconFA icon="spinner" spin size="2xl" className="mb-4 text-gray-400" />
                            <p className="text-gray-500">Redirigiendo...</p>
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </div>
    );
} 