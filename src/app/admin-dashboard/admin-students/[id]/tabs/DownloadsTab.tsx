import React from 'react';
import DocumentTemplatesList from '../components/downloads/DocumentTemplatesList';
import { DocumentTemplate } from '../module-utils/types';

interface DownloadsTabProps {
    templates: DocumentTemplate[];
    onGenerateDocument: (templateId: string, params: Record<string, string>) => Promise<string>;
}

const DownloadsTab: React.FC<DownloadsTabProps> = ({
    templates,
    onGenerateDocument
}) => {
    return (
        <DocumentTemplatesList
            templates={templates}
            onGenerateDocument={onGenerateDocument}
        />
    );
};

export default DownloadsTab; 