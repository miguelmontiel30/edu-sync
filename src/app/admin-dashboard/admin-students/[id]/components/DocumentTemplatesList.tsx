import React, { useState } from 'react';
import { DocumentTemplate, DocumentTemplateType } from '../module-utils/types';
import ComponentCard from '@/components/common/ComponentCard';
import { IconFA } from '@/components/ui';

interface DocumentTemplatesListProps {
    templates: DocumentTemplate[];
    onGenerateDocument: (templateId: string, params: Record<string, string>) => Promise<string>;
}

// Función para obtener el nombre de la plantilla según el tipo
const getTemplateTypeLabel = (type: DocumentTemplateType): string => {
    const labels: Record<DocumentTemplateType, string> = {
        boleta: 'Boleta de calificaciones',
        constancia: 'Constancia de estudios',
        certificado: 'Certificado escolar',
        recibo: 'Recibo de pago'
    };
    return labels[type];
};

// Función para obtener el icono según el tipo
const getTemplateIcon = (type: DocumentTemplateType): string => {
    const icons: Record<DocumentTemplateType, string> = {
        boleta: 'file-lines',
        constancia: 'file-certificate',
        certificado: 'certificate',
        recibo: 'receipt'
    };
    return icons[type];
};

const DocumentTemplatesList: React.FC<DocumentTemplatesListProps> = ({
    templates,
    onGenerateDocument
}) => {
    // Estado para controlar el modal de parámetros
    const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [params, setParams] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);

    // Agrupar plantillas por tipo
    const templatesByType = templates.reduce((acc, template) => {
        if (!acc[template.type]) {
            acc[template.type] = [];
        }
        acc[template.type].push(template);
        return acc;
    }, {} as Record<DocumentTemplateType, DocumentTemplate[]>);

    // Abrir modal con la plantilla seleccionada
    const handleSelectTemplate = (template: DocumentTemplate) => {
        setSelectedTemplate(template);

        // Inicializar los parámetros
        const initialParams: Record<string, string> = {};
        template.availableParams.forEach(param => {
            initialParams[param] = '';
        });

        setParams(initialParams);
        setIsModalOpen(true);
    };

    // Actualizar parámetros
    const handleParamChange = (param: string, value: string) => {
        setParams(prev => ({ ...prev, [param]: value }));
    };

    // Generar documento
    const handleGenerateDocument = async () => {
        if (!selectedTemplate) return;

        try {
            setIsGenerating(true);
            const documentUrl = await onGenerateDocument(selectedTemplate.id, params);

            // Abrir el documento en una nueva pestaña
            window.open(documentUrl, '_blank');

            // Cerrar modal
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error al generar el documento:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <ComponentCard title="Documentos Disponibles" desc="Genera y descarga documentos oficiales">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(templatesByType).map(([type, typeTemplates]) => (
                        <div key={type} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center mb-3">
                                <IconFA
                                    icon={getTemplateIcon(type as DocumentTemplateType)}
                                    className="text-primary-500 mr-3"
                                    size="lg"
                                />
                                <h3 className="font-medium">{getTemplateTypeLabel(type as DocumentTemplateType)}</h3>
                            </div>

                            <div className="space-y-3 mt-4">
                                {typeTemplates.map(template => (
                                    <div
                                        key={template.id}
                                        className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors cursor-pointer"
                                        onClick={() => handleSelectTemplate(template)}
                                    >
                                        <div>
                                            <p className="font-medium">{template.name}</p>
                                            {template.description && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {template.description}
                                                </p>
                                            )}
                                        </div>
                                        <button className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 p-2 rounded-full hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors">
                                            <IconFA icon="download" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Instrucciones */}
                <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-300">
                    <div className="flex">
                        <IconFA icon="circle-info" className="text-blue-500 mr-3 mt-0.5" />
                        <div>
                            <p className="font-medium mb-1">¿Cómo descargar un documento?</p>
                            <ol className="list-decimal pl-5 space-y-1">
                                <li>Selecciona el tipo de documento que necesitas</li>
                                <li>Completa los parámetros requeridos (fecha, período, etc.)</li>
                                <li>Haz clic en "Generar" y el documento se abrirá en una nueva pestaña</li>
                                <li>Descarga o imprime el documento desde tu navegador</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </ComponentCard>

            {/* Modal para parámetros */}
            {isModalOpen && selectedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-lg">Generar: {selectedTemplate.name}</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <IconFA icon="times" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {selectedTemplate.availableParams.map(param => (
                                <div key={param}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {param.charAt(0).toUpperCase() + param.slice(1).replace(/([A-Z])/g, ' $1')}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-sm py-2"
                                        value={params[param] || ''}
                                        onChange={(e) => handleParamChange(param, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleGenerateDocument}
                                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center"
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <IconFA icon="spinner" spin className="mr-2" />
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <IconFA icon="file-export" className="mr-2" />
                                        Generar PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DocumentTemplatesList; 