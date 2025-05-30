import React from 'react';
import DocumentsSection from '../components/documents/DocumentsSection';
import DocumentsSummaryWidget from '../components/widgets/DocumentsSummaryWidget';
import { Document, DocumentType } from '../module-utils/types';

interface DocumentsTabProps {
    documents: Document[];
    onUpload: (type: DocumentType, file: File) => Promise<void>;
    onReview: (id: string, status: string, comments?: string) => Promise<void>;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents, onUpload, onReview }) => {
    const pendingCount = documents.filter(d => d.status === 'pendiente').length;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Columna izquierda */}
            <div className="xl:col-span-1 space-y-6">
                <DocumentsSummaryWidget
                    documents={documents}
                    pendingCount={pendingCount}
                />
            </div>

            {/* Columna derecha */}
            <div className="xl:col-span-3 space-y-6">
                <DocumentsSection
                    documents={documents}
                    onUpload={onUpload}
                    onReview={onReview}
                />
            </div>
        </div>
    );
};

export default DocumentsTab; 