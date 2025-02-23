'use client';
import {useAuthStore} from '@/store/useAuthStore';

export default function AdminMainContent({}: // children,
{
    children: React.ReactNode;
}) {
    const {user} = useAuthStore();

    console.log('user: ', user);

    return (
        <main className="grid grid-cols-3 gap-4 p-6">
            <div className="rounded-xl bg-white p-4 shadow-lg">
                <div>
                    <h3 className="text-lg font-semibold">Total de Alumnos</h3>
                    <p className="text-2xl font-bold">1,200</p>
                </div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-lg">
                <div>
                    <h3 className="text-lg font-semibold">Ingresos del Mes</h3>
                    <p className="text-2xl font-bold">$250,000</p>
                </div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-lg">
                <div>
                    <h3 className="text-lg font-semibold">Reportes Críticos</h3>
                    <p className="text-2xl font-bold">5 Pendientes</p>
                </div>
            </div>
        </main>
    );
}
