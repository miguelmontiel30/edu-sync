import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';

const AlertsPanel: React.FC = () => {
    return (
        <ComponentCard title="Alertas y Recordatorios" className="p-4">
            <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <div className="flex-shrink-0">
                        <IconFA icon="triangle-exclamation" size="xl" className="text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Alerta: Nómina pendiente</h3>
                        <p className="text-red-700 dark:text-red-300">El proceso de nómina quincenal vence en 2 días y aún no ha sido procesado.</p>
                    </div>
                    <div className="ml-auto">
                        <Button
                            variant="danger"
                            className="flex items-center gap-2"
                            onClick={() => {}}
                        >
                            <span>Procesar ahora</span>
                        </Button>
                    </div>
                </div>
                
                <div className="flex items-start gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                    <div className="flex-shrink-0">
                        <IconFA icon="bell" size="xl" className="text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400">Recordatorio: Facturas mensuales</h3>
                        <p className="text-amber-700 dark:text-amber-300">Las facturas de colegiatura del mes siguiente deben generarse en los próximos 5 días.</p>
                    </div>
                    <div className="ml-auto">
                        <Button
                            variant="warning"
                            className="flex items-center gap-2"
                            onClick={() => {}}
                        >
                            <span>Programar</span>
                        </Button>
                    </div>
                </div>
                
                <div className="flex items-start gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex-shrink-0">
                        <IconFA icon="info-circle" size="xl" className="text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400">Información: Conciliación bancaria</h3>
                        <p className="text-blue-700 dark:text-blue-300">Es recomendable realizar la conciliación bancaria del mes en curso.</p>
                    </div>
                    <div className="ml-auto">
                        <Button
                            variant="info"
                            className="flex items-center gap-2"
                            onClick={() => {}}
                        >
                            <span>Iniciar</span>
                        </Button>
                    </div>
                </div>
            </div>
        </ComponentCard>
    );
};

export default AlertsPanel; 