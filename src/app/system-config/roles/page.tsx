'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import RolesPermissions from '../components/RolesPermissions';

export default function RolesConfigPage() {
    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <PageBreadcrumb pageTitle="Roles y Permisos" />

            <div className="grid grid-cols-1 gap-6">
                <ComponentCard>
                    <RolesPermissions />
                </ComponentCard>
            </div>
        </div>
    );
} 