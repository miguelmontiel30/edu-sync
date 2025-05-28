import React, { useState } from 'react';
import { Document, DocumentStatus, DocumentType } from '../module-utils/types';
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
        otro: 'Otro Documento'
    };
    return labels[type] || 'Documento';
};

const getStatusColor = (status: DocumentStatus): string => {
    const colors: Record<DocumentStatus, string> = {
        pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
        aprobado: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
        rechazado: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status];
};

const getStatusLabel = (status: DocumentStatus): string => {
    const labels: Record<DocumentStatus, string> = {
        pendiente: 'Pendiente',
        aprobado: 'Aprobado',
        rechazado: 'Rechazado'
    };
    return labels[status];
};

const StatusBadge: React.FC<{ status: DocumentStatus }> = ({ status }) => {
    return (
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(status)}`}>
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
        <div className="border rounded-lg p-4 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">{getDocumentLabel(type)}</h3>
                {document && <StatusBadge status={document.status} />}
            </div>

            {document?.fileUrl ? (
                <div className="relative group">
                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                        {document.fileUrl.endsWith('.pdf') ? (
                            <div className="flex flex-col items-center">
                                <IconFA icon="file-pdf" size="2xl" className="text-red-500 mb-2" />
                                <span className="text-sm">{document.name}</span>
                            </div>
                        ) : (
                            <img
                                src={document.fileUrl}
                                alt={getDocumentLabel(type)}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 
                        transition-opacity rounded-lg flex items-center justify-center gap-3">
                        <a
                            href={document.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-gray-800 p-2 rounded-full"
                        >
                            <IconFA icon="eye" />
                        </a>
                        <label
                            htmlFor={`file-upload-${type}`}
                            className="bg-white text-gray-800 p-2 rounded-full cursor-pointer"
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
                    className={`border-2 border-dashed ${isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'} 
                    p-4 rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer 
                    hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                >
                    <label
                        htmlFor={`file-upload-${type}`}
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                    >
                        {isUploading ? (
                            <IconFA icon="circle-notch" spin size="lg" className="text-primary-500 mb-2" />
                        ) : (
                            <IconFA icon="upload" className="text-gray-400 mb-2" size="lg" />
                        )}
                        <p className="text-sm text-gray-500">
                            {isDragging ? 'Suelta el archivo aquí' : 'Arrastra o haz clic para subir'}
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
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/70 p-2 rounded">
                    <strong>Comentarios:</strong> {document.comments}
                </div>
            )}
        </div>
    );
};

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents, onUpload, onReview }) => {
    // Crear un Map para acceder fácilmente a los documentos por tipo
    const documentsMap = new Map<DocumentType, Document>();
    documents.forEach(doc => {
        documentsMap.set(doc.type, doc);
    });

    // Documentos requeridos para mostrar
    const requiredDocumentTypes: DocumentType[] = ['acta', 'curp', 'domicilio', 'vacunacion'];

    return (
        <ComponentCard title="Documentos Requeridos" desc="Gestión de documentos oficiales y requisitos administrativos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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