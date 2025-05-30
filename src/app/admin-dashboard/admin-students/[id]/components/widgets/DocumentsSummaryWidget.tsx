import { Document } from '../module-utils/types';
import ComponentCard from '@/components/common/ComponentCard';
import { IconFA } from '@/components/ui';

interface DocumentsSummaryWidgetProps {
    documents: Document[];
    pendingCount?: number;
}

const DocumentsSummaryWidget: React.FC<DocumentsSummaryWidgetProps> = ({
    documents,
    pendingCount = 0
}) => {
    // Contar documentos por estado
    const countByStatus = {
        pendiente: documents.filter(doc => doc.status === 'pendiente').length,
        aprobado: documents.filter(doc => doc.status === 'aprobado').length,
        rechazado: documents.filter(doc => doc.status === 'rechazado').length,
        total: documents.length
    };

    // Calcular el porcentaje de documentos aprobados
    const approvedPercentage = documents.length > 0
        ? Math.round((countByStatus.aprobado / documents.length) * 100)
        : 0;

    // Configurar el color del indicador de progreso
    const getProgressColor = () => {
        if (approvedPercentage >= 80) return 'bg-green-500';
        if (approvedPercentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <ComponentCard title="Estado de Documentos" desc="Resumen de documentación presentada">
            <div className="space-y-6">
                {/* Indicador de progreso circular */}
                <div className="flex justify-center">
                    <div className="relative flex items-center justify-center">
                        {/* Círculo de progreso */}
                        <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{approvedPercentage}%</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Completado</div>
                            </div>
                        </div>

                        {/* Barra de progreso circular (simulada con borde) */}
                        <div
                            className={`absolute top-0 left-0 w-32 h-32 rounded-full border-4 border-transparent 
                            ${getProgressColor()} opacity-80`}
                            style={{
                                clipPath: `polygon(50% 0%, 50% 50%, 100% 50%, 100% ${approvedPercentage <= 25 ? approvedPercentage * 4 : 100}%)`,
                                transform: approvedPercentage > 25 ? `rotate(${Math.min((approvedPercentage - 25) * 3.6, 270)}deg)` : 'none',
                            }}
                        />
                    </div>
                </div>

                {/* Estadísticas por categoría */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="flex justify-center mb-1">
                            <IconFA icon="check-circle" className="text-green-500" />
                        </div>
                        <div className="text-xl font-semibold">{countByStatus.aprobado}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Aprobados</div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="flex justify-center mb-1">
                            <IconFA icon="clock" className="text-yellow-500" />
                        </div>
                        <div className="text-xl font-semibold">{countByStatus.pendiente}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Pendientes</div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="flex justify-center mb-1">
                            <IconFA icon="times-circle" className="text-red-500" />
                        </div>
                        <div className="text-xl font-semibold">{countByStatus.rechazado}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Rechazados</div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <div className="flex justify-center mb-1">
                            <IconFA icon="file-alt" className="text-gray-500" />
                        </div>
                        <div className="text-xl font-semibold">{countByStatus.total}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                    </div>
                </div>

                {/* Recordatorio o alerta */}
                {pendingCount > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 
                        rounded-lg p-3 flex items-start mt-4">
                        <IconFA icon="exclamation-triangle" className="text-yellow-500 mr-2 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                                Documentos pendientes
                            </p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                                Tienes {pendingCount} documento(s) pendiente(s) de aprobación.
                                Por favor, revisa la sección de documentos.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </ComponentCard>
    );
};

export default DocumentsSummaryWidget; 