'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import ThemeConfig from '../components/ThemeConfig';

export default function ThemeConfigPage() {
    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <PageBreadcrumb pageTitle="Tema y Colores" />

            <div className="grid grid-cols-1 gap-6">
                <ComponentCard>
                    <ThemeConfig />
                </ComponentCard>
            </div>
        </div>
    );
}
