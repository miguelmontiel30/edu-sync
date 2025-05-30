import { useState } from 'react';
import { Message, MessageType } from '../module-utils/types';
import ComponentCard from '@/components/common/ComponentCard';
import { IconFA, NotificationBadge } from '@/components/ui';

interface CommunicationsSectionProps {
    messages: Message[];
    onSendMessage: (message: { title: string; content: string; type: MessageType }) => Promise<void>;
    onMarkAsRead: (messageId: string) => Promise<void>;
}

const CommunicationsSection: React.FC<CommunicationsSectionProps> = ({
    messages,
    onSendMessage,
    onMarkAsRead
}) => {
    // Estados para la composición de mensajes
    const [isComposing, setIsComposing] = useState(false);
    const [newMessage, setNewMessage] = useState({ title: '', content: '', type: 'general' as MessageType });
    const [isSending, setIsSending] = useState(false);

    // Estado para visualización de mensajes
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [activeTab, setActiveTab] = useState<'recibidos' | 'enviados'>('recibidos');

    // Filtrado de mensajes por pestaña
    const receivedMessages = messages.filter(m => m.sender.type !== 'estudiante');
    const sentMessages = messages.filter(m => m.sender.type === 'estudiante');

    // Conteo de mensajes no leídos
    const unreadCount = messages.filter(m => m.status === 'no-leido' && m.sender.type !== 'estudiante').length;

    // Clasificación de mensajes por tipo para filtrado
    const messageTypes: { key: MessageType, label: string, icon: string }[] = [
        { key: 'general', label: 'General', icon: 'envelope' },
        { key: 'tarea', label: 'Tareas', icon: 'book' },
        { key: 'pago', label: 'Pagos', icon: 'money-bill' },
        { key: 'asistencia', label: 'Asistencia', icon: 'calendar-check' },
        { key: 'evento', label: 'Eventos', icon: 'calendar-days' }
    ];

    // Obtener icono según tipo de mensaje
    const getMessageTypeIcon = (type: MessageType): string => {
        return messageTypes.find(t => t.key === type)?.icon || 'envelope';
    };

    // Obtener color según tipo de mensaje
    const getMessageTypeColor = (type: MessageType): string => {
        const colors: Record<MessageType, string> = {
            general: 'text-blue-500',
            tarea: 'text-green-500',
            pago: 'text-yellow-500',
            asistencia: 'text-purple-500',
            evento: 'text-red-500'
        };
        return colors[type];
    };

    // Formato de fecha
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Manejar selección de mensaje
    const handleSelectMessage = async (message: Message) => {
        setSelectedMessage(message);

        // Marcar como leído si no lo está
        if (message.status === 'no-leido') {
            await onMarkAsRead(message.id);
        }
    };

    // Enviar nuevo mensaje
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.title.trim() || !newMessage.content.trim()) return;

        try {
            setIsSending(true);
            await onSendMessage(newMessage);

            // Resetear formulario
            setNewMessage({ title: '', content: '', type: 'general' });
            setIsComposing(false);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Buzón de Mensajes" desc="Sistema de comunicación interna">
                <div className="flex flex-col h-[500px]">
                    {/* Cabecera con pestañas y botón de nuevo mensaje */}
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className={`pb-3 px-1 font-medium text-sm ${activeTab === 'recibidos'
                                    ? 'text-primary-500 border-b-2 border-primary-500 -mb-[13px]'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                                onClick={() => setActiveTab('recibidos')}
                            >
                                Recibidos
                                {unreadCount > 0 && (
                                    <NotificationBadge count={unreadCount} type="error" className="ml-2" />
                                )}
                            </button>
                            <button
                                type="button"
                                className={`pb-3 px-1 font-medium text-sm ${activeTab === 'enviados'
                                    ? 'text-primary-500 border-b-2 border-primary-500 -mb-[13px]'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                                onClick={() => setActiveTab('enviados')}
                            >
                                Enviados
                            </button>
                        </div>

                        <button
                            type="button"
                            className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
                            onClick={() => setIsComposing(true)}
                        >
                            <IconFA icon="pen-to-square" className="mr-1" /> Nuevo mensaje
                        </button>
                    </div>

                    {/* Contenedor principal */}
                    <div className="flex flex-grow overflow-hidden">
                        {/* Lista de mensajes */}
                        <div className={`w-1/3 overflow-y-auto border-r border-gray-200 dark:border-gray-700 pr-3 ${selectedMessage ? 'hidden md:block' : ''}`}>
                            {/* Filtros por tipo */}
                            <div className="flex mb-3 overflow-x-auto pb-2 -mr-3 pr-3">
                                {messageTypes.map(type => (
                                    <button
                                        type="button"
                                        key={type.key}
                                        className="flex items-center mr-2 px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        <IconFA icon={type.icon} className={`mr-1 ${getMessageTypeColor(type.key)}`} />
                                        {type.label}
                                    </button>
                                ))}
                            </div>

                            {/* Lista de mensajes */}
                            <div className="space-y-1">
                                {(activeTab === 'recibidos' ? receivedMessages : sentMessages).map(message => (
                                    <div
                                        key={message.id}
                                        className={`p-3 rounded-md cursor-pointer transition-colors ${selectedMessage?.id === message.id
                                            ? 'bg-primary-50 dark:bg-primary-900/20'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                            } ${message.status === 'no-leido' ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                                        onClick={() => handleSelectMessage(message)}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center">
                                                <IconFA
                                                    icon={getMessageTypeIcon(message.type)}
                                                    className={`mr-2 ${getMessageTypeColor(message.type)}`}
                                                />
                                                <h4 className="font-medium text-sm line-clamp-1">
                                                    {message.title}
                                                </h4>
                                            </div>
                                            {message.status === 'no-leido' && activeTab === 'recibidos' && (
                                                <div className="bg-primary-500 rounded-full h-2 w-2"></div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 ml-6">
                                            {message.content}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {activeTab === 'recibidos' ? message.sender.name : 'Tú'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(message.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Mensaje si no hay mensajes */}
                                {(activeTab === 'recibidos' ? receivedMessages : sentMessages).length === 0 && (
                                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        <IconFA icon="inbox" size="xl" className="mb-2" />
                                        <p>No hay mensajes en esta bandeja</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detalle del mensaje o composición */}
                        <div className={`${selectedMessage || isComposing ? 'w-full md:w-2/3' : 'hidden md:block md:w-2/3'} pl-3 overflow-y-auto`}>
                            {isComposing ? (
                                /* Formulario de nuevo mensaje */
                                <form onSubmit={handleSendMessage} className="h-full flex flex-col">
                                    <div className="mb-4">
                                        <button
                                            type="button"
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-3 flex items-center"
                                            onClick={() => setIsComposing(false)}
                                        >
                                            <IconFA icon="arrow-left" className="mr-1" /> Volver
                                        </button>
                                        <h3 className="text-lg font-medium mb-4">Nuevo mensaje</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Asunto
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newMessage.title}
                                                    onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
                                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm py-2"
                                                    placeholder="Ingresa el asunto del mensaje"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Tipo de mensaje
                                                </label>
                                                <select
                                                    value={newMessage.type}
                                                    onChange={(e) => setNewMessage(prev => ({
                                                        ...prev,
                                                        type: e.target.value as MessageType
                                                    }))}
                                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm py-2"
                                                >
                                                    {messageTypes.map(type => (
                                                        <option key={type.key} value={type.key}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Mensaje
                                                </label>
                                                <textarea
                                                    value={newMessage.content}
                                                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm py-2 min-h-[150px]"
                                                    placeholder="Escribe tu mensaje aquí..."
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center"
                                            disabled={isSending}
                                        >
                                            {isSending ? (
                                                <>
                                                    <IconFA icon="spinner" spin className="mr-2" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <IconFA icon="paper-plane" className="mr-2" />
                                                    Enviar mensaje
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : selectedMessage ? (
                                /* Vista de mensaje */
                                <div className="h-full flex flex-col">
                                    <div className="mb-4">
                                        <button
                                            type="button"
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-3 md:hidden flex items-center"
                                            onClick={() => setSelectedMessage(null)}
                                        >
                                            <IconFA icon="arrow-left" className="mr-1" /> Volver
                                        </button>

                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium">{selectedMessage.title}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getMessageTypeColor(selectedMessage.type)} bg-opacity-10`}>
                                                {messageTypes.find(t => t.key === selectedMessage.type)?.label}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center">
                                                <span className="font-medium mr-2">
                                                    {activeTab === 'recibidos' ? 'De:' : 'Para:'} {selectedMessage.sender.name}
                                                </span>
                                                <span className="text-xs">
                                                    ({selectedMessage.sender.type})
                                                </span>
                                            </div>
                                            <span>{formatDate(selectedMessage.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 flex-grow overflow-y-auto">
                                        <p className="whitespace-pre-line">{selectedMessage.content}</p>
                                    </div>

                                    {/* Archivos adjuntos */}
                                    {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="font-medium text-sm mb-2">Archivos adjuntos:</h4>
                                            <div className="space-y-2">
                                                {selectedMessage.attachments.map(attachment => (
                                                    <a
                                                        key={attachment.id}
                                                        href={attachment.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 text-sm"
                                                    >
                                                        <IconFA icon="paperclip" className="mr-2 text-gray-500" />
                                                        {attachment.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center"
                                            onClick={() => {
                                                setIsComposing(true);
                                                setNewMessage(prev => ({
                                                    ...prev,
                                                    title: `Re: ${selectedMessage.title}`,
                                                    type: selectedMessage.type
                                                }));
                                            }}
                                        >
                                            <IconFA icon="reply" className="mr-2" />
                                            Responder
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Mensaje de selección */
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                                    <IconFA icon="envelope-open-text" size="2xl" className="mb-4" />
                                    <p className="text-lg mb-2">Selecciona un mensaje</p>
                                    <p className="text-sm">O crea uno nuevo con el botón "Nuevo mensaje"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ComponentCard>

            <ComponentCard title="Notificaciones y Anuncios" desc="Últimos avisos del centro educativo">
                <div className="space-y-4">
                    {messages.filter(m => m.type === 'evento').slice(0, 3).map(notification => (
                        <div
                            key={notification.id}
                            className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                            <div className="flex items-start">
                                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
                                    <IconFA icon="bullhorn" className="text-primary-500" />
                                </div>
                                <div>
                                    <h4 className="font-medium">{notification.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                        {notification.content}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-500">
                                            {formatDate(notification.createdAt)}
                                        </span>
                                        <button
                                            type="button"
                                            className="text-primary-500 hover:text-primary-600 text-sm"
                                            onClick={() => handleSelectMessage(notification)}
                                        >
                                            Leer más
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Si no hay notificaciones */}
                    {messages.filter(m => m.type === 'evento').length === 0 && (
                        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                            <IconFA icon="bell-slash" size="xl" className="mb-2" />
                            <p>No hay notificaciones o anuncios recientes</p>
                        </div>
                    )}
                </div>
            </ComponentCard>
        </div>
    );
};

export default CommunicationsSection; 