import { useState } from 'react';
import { Document, DocumentStatus, DocumentType } from '../../../module-utils/types';
import ComponentCard from '@/components/common/ComponentCard';
import { IconFA } from '@/components/ui';

interface DocumentsSectionProps {
    documents: Document[];
    onUpload: (type: DocumentType, file: File) => Promise<void>;
    onReview: (id: string, status: DocumentStatus, comments: string) => Promise<void>;
}

const getDocumentLabel = (type: DocumentType): string => {
    const labels: Record<DocumentType, string> = {
        acta: 'Acta de Nacimiento',
        curp: 'CURP',
        domicilio: 'Comprobante de Domicilio',
        vacunacion: 'Cartilla de Vacunación',
        otro: 'Otro Documento',
    };
    return labels[type] || 'Documento';
};

const getStatusColor = (status: DocumentStatus): string => {
    const colors: Record<DocumentStatus, string> = {
        pendiente:
            'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
        aprobado:
            'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
        rechazado: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status];
};

const getStatusLabel = (status: DocumentStatus): string => {
    const labels: Record<DocumentStatus, string> = {
        pendiente: 'Pendiente',
        aprobado: 'Aprobado',
        rechazado: 'Rechazado',
    };
    return labels[status];
};

const StatusBadge: React.FC<{ status: DocumentStatus }> = ({ status }) => {
    return (
        <span className={`rounded-full border px-2 py-1 text-xs ${getStatusColor(status)}`}>
            {getStatusLabel(status)}
        </span>
    );
};

const DocumentUploadCard: React.FC<{
    type: DocumentType;
    document?: Document;
    onUpload: (type: DocumentType, file: File) => Promise<void>;
}> = ({ type, document, onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!file) return;

        try {
            setIsUploading(true);
            await onUpload(type, file);
        } catch (error) {
            console.error('Error al subir el archivo:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="rounded-lg border p-4 dark:border-gray-700">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium">{getDocumentLabel(type)}</h3>
                {document && <StatusBadge status={document.status} />}
            </div>

            {document?.fileUrl ? (
                <div className="group relative">
                    <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                        {document.fileUrl.endsWith('.pdf') ? (
                            <div className="flex flex-col items-center">
                                <IconFA icon="file-pdf" size="2xl" className="mb-2 text-red-500" />
                                <span className="text-sm">{document.name}</span>
                            </div>
                        ) : (
                            <img
                                src={document.fileUrl}
                                alt={getDocumentLabel(type)}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black bg-opacity-40 opacity-0 transition-opacity group-hover:opacity-100">
                        <a
                            href={document.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-white p-2 text-gray-800"
                        >
                            <IconFA icon="eye" />
                        </a>
                        <label
                            htmlFor={`file-upload-${type}`}
                            className="cursor-pointer rounded-full bg-white p-2 text-gray-800"
                        >
                            <IconFA icon="arrow-up-from-bracket" />
                            <input
                                id={`file-upload-${type}`}
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                </div>
            ) : (
                <div
                    className={`border-2 border-dashed ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'} flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg p-4 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/50`}
                    onDragOver={e => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                >
                    <label
                        htmlFor={`file-upload-${type}`}
                        className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
                    >
                        {isUploading ? (
                            <IconFA
                                icon="circle-notch"
                                spin
                                size="lg"
                                className="text-primary-500 mb-2"
                            />
                        ) : (
                            <IconFA icon="upload" className="mb-2 text-gray-400" size="lg" />
                        )}
                        <p className="text-sm text-gray-500">
                            {isDragging
                                ? 'Suelta el archivo aquí'
                                : 'Arrastra o haz clic para subir'}
                        </p>
                        <input
                            id={`file-upload-${type}`}
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
            )}

            {document?.comments && (
                <div className="mt-3 rounded bg-gray-100 p-2 text-sm text-gray-600 dark:bg-gray-800/70 dark:text-gray-400">
                    <strong>Comentarios:</strong> {document.comments}
                </div>
            )}
        </div>
    );
};

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents, onUpload }) => {
    // Crear un Map para acceder fácilmente a los documentos por tipo
    const documentsMap = new Map<DocumentType, Document>();
    documents.forEach(doc => {
        documentsMap.set(doc.type, doc);
    });

    // Documentos requeridos para mostrar
    const requiredDocumentTypes: DocumentType[] = ['acta', 'curp', 'domicilio', 'vacunacion'];

    return (
        <ComponentCard
            title="Documentos Requeridos"
            desc="Gestión de documentos oficiales y requisitos administrativos"
        >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {requiredDocumentTypes.map(docType => (
                    <DocumentUploadCard
                        key={docType}
                        type={docType}
                        document={documentsMap.get(docType)}
                        onUpload={onUpload}
                    />
                ))}
            </div>
        </ComponentCard>
    );
};

export default DocumentsSection;
