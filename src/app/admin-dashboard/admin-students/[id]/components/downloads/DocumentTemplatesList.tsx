import { useState } from 'react';
import {
    DocumentTemplate,
    DocumentTemplateType,
} from '@/app/admin-dashboard/admin-students/[id]/module-utils/types';
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
        recibo: 'Recibo de pago',
    };
    return labels[type];
};

// Función para obtener el icono según el tipo
const getTemplateIcon = (type: DocumentTemplateType): string => {
    const icons: Record<DocumentTemplateType, string> = {
        boleta: 'file-lines',
        constancia: 'file-certificate',
        certificado: 'certificate',
        recibo: 'receipt',
    };
    return icons[type];
};

const DocumentTemplatesList: React.FC<DocumentTemplatesListProps> = ({
    templates,
    onGenerateDocument,
}) => {
    // Estado para controlar el modal de parámetros
    const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [params, setParams] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);

    // Agrupar plantillas por tipo
    const templatesByType = templates.reduce(
        (acc, template) => {
            if (!acc[template.type]) {
                acc[template.type] = [];
            }
            acc[template.type].push(template);
            return acc;
        },
        {} as Record<DocumentTemplateType, DocumentTemplate[]>,
    );

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
            globalThis.open(documentUrl, '_blank');

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
            <ComponentCard
                title="Documentos Disponibles"
                desc="Genera y descarga documentos oficiales"
            >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {Object.entries(templatesByType).map(([type, typeTemplates]) => (
                        <div
                            key={type}
                            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="mb-3 flex items-center">
                                <IconFA
                                    icon={getTemplateIcon(type as DocumentTemplateType)}
                                    className="text-primary-500 mr-3"
                                    size="lg"
                                />
                                <h3 className="font-medium">
                                    {getTemplateTypeLabel(type as DocumentTemplateType)}
                                </h3>
                            </div>

                            <div className="mt-4 space-y-3">
                                {typeTemplates.map(template => (
                                    <div
                                        key={template.id}
                                        className="flex cursor-pointer items-center justify-between rounded-md p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        onClick={() => handleSelectTemplate(template)}
                                    >
                                        <div>
                                            <p className="font-medium">{template.name}</p>
                                            {template.description && (
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    {template.description}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800/30 rounded-full p-2 transition-colors"
                                        >
                                            <IconFA icon="download" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Instrucciones */}
                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    <div className="flex">
                        <IconFA icon="circle-info" className="mr-3 mt-0.5 text-blue-500" />
                        <div>
                            <p className="mb-1 font-medium">¿Cómo descargar un documento?</p>
                            <ol className="list-decimal space-y-1 pl-5">
                                <li>Selecciona el tipo de documento que necesitas</li>
                                <li>Completa los parámetros requeridos (fecha, período, etc.)</li>
                                <li>
                                    Haz clic en &quot;Generar&quot; y el documento se abrirá en una
                                    nueva pestaña
                                </li>
                                <li>Descarga o imprime el documento desde tu navegador</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </ComponentCard>

            {/* Modal para parámetros */}
            {isModalOpen && selectedTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-medium">
                                Generar: {selectedTemplate.name}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <IconFA icon="times" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {selectedTemplate.availableParams.map(param => (
                                <div key={param}>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {param.charAt(0).toUpperCase() +
                                            param.slice(1).replace(/([A-Z])/g, ' $1')}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border-gray-300 py-2 text-sm dark:border-gray-700 dark:bg-gray-700"
                                        value={params[param] || ''}
                                        onChange={e => handleParamChange(param, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleGenerateDocument}
                                className="bg-primary-500 hover:bg-primary-600 flex items-center rounded-md px-4 py-2 text-white"
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
