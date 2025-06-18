'use client';
import { ContactsSidebar, ChatArea } from './components';
import { useChat } from './hooks';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export default function ChatPage() {
    const {
        messages,
        groups,
        activeChat,
        chatDetails,
        userRole,
        handleChatSelect,
        handleSendMessage,
    } = useChat();

    return (
        <>
            {/* Page Header */}
            <div className="mb-6 px-6 pt-4">
                <PageBreadcrumb pageTitle="Mensajes" />
            </div>

            {/* Chat Content */}
            <div className="mx-6 mb-6 h-[calc(100vh-170px)] overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-900">
                <div className="flex h-full">
                    {/* Sidebar with contacts */}
                    <div className="w-1/4 border-r border-gray-200 dark:border-gray-800">
                        <ContactsSidebar
                            groups={groups}
                            activeChat={activeChat}
                            onChatSelect={handleChatSelect}
                        />
                    </div>

                    {/* Chat area */}
                    <div className="flex-1">
                        <ChatArea
                            chatDetails={chatDetails}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            userRole={userRole}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
