import React from 'react';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';

const QuickActions: React.FC = () => {
    return (
        <div className="flex flex-wrap gap-4">
            <Button variant="primary" className="flex items-center gap-2" onClick={() => {}}>
                <IconFA icon="file-invoice-dollar" style="duotone" />
                <span>Generar Nueva Factura</span>
            </Button>
            <Button variant="secondary" className="flex items-center gap-2" onClick={() => {}}>
                <IconFA icon="money-check-dollar-pen" style="duotone" />
                <span>Procesar Nómina</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => {}}>
                <IconFA icon="file-export" style="duotone" />
                <span>Exportar Reporte</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => {}}>
                <IconFA icon="gears" style="duotone" />
                <span>Configurar Parámetros</span>
            </Button>
        </div>
    );
};

export default QuickActions;
