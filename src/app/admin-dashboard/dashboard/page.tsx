export default function AdminMainContent({}: // children,
{
    children: React.ReactNode;
}) {
    return (
        <main className="p-6 grid grid-cols-3 gap-4">
            <div className="p-4 shadow-lg rounded-xl bg-white">
                <div>
                    <h3 className="text-lg font-semibold">Total de Alumnos</h3>
                    <p className="text-2xl font-bold">1,200</p>
                </div>
            </div>
            <div className="p-4 shadow-lg rounded-xl bg-white">
                <div>
                    <h3 className="text-lg font-semibold">Ingresos del Mes</h3>
                    <p className="text-2xl font-bold">$250,000</p>
                </div>
            </div>
            <div className="p-4 shadow-lg rounded-xl bg-white">
                <div>
                    <h3 className="text-lg font-semibold">Reportes Críticos</h3>
                    <p className="text-2xl font-bold">5 Pendientes</p>
                </div>
            </div>
        </main>
    );
}
