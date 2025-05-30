import React from 'react';
import CommunicationsSection from '../components/communications/CommunicationsSection';
import { Message, MessageType } from '../module-utils/types';

interface CommunicationsTabProps {
    messages: Message[];
    onSendMessage: (message: { title: string; content: string; type: MessageType }) => Promise<void>;
    onMarkAsRead: (id: string) => Promise<void>;
}

const CommunicationsTab: React.FC<CommunicationsTabProps> = ({
    messages,
    onSendMessage,
    onMarkAsRead
}) => {
    return (
        <CommunicationsSection
            messages={messages}
            onSendMessage={onSendMessage}
            onMarkAsRead={onMarkAsRead}
        />
    );
};

export default CommunicationsTab; 