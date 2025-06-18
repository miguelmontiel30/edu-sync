import { useState, useEffect } from 'react';
import { Message, ChatDetails } from '../components/ChatArea';

export type ChatGroup = {
    id: number;
    name: string;
    type: 'class' | 'private' | 'announcement';
    unread: number;
    lastMessage?: string;
    lastMessageTime?: string;
    avatar?: string;
    isUrgent?: boolean;
};

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeChat, setActiveChat] = useState<number>(1); // Default to first group
    const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);

    // User role - in a real app, this would come from auth context
    const userRole: 'student' | 'teacher' | 'admin' = 'teacher';

    // Mock groups data
    const groups: ChatGroup[] = [
        // Grupos de Clase
        {
            id: 1,
            name: 'Grupo A',
            type: 'class',
            unread: 3,
            lastMessage: 'Prof. Laura: Recuerden la tarea para mañana',
            lastMessageTime: 'Hace 5m',
        },
        {
            id: 2,
            name: 'Grupo B',
            type: 'class',
            unread: 0,
            lastMessage: 'Juan: ¿Cuándo es el examen?',
            lastMessageTime: 'Ayer',
        },
        {
            id: 3,
            name: 'Grupo C',
            type: 'class',
            unread: 0,
            lastMessage: 'María: Gracias profesora',
            lastMessageTime: 'Lun',
        },
        {
            id: 4,
            name: 'Grupo D',
            type: 'class',
            unread: 0,
            lastMessage: 'Prof. Carlos: Preparen presentación',
            lastMessageTime: '23 Oct',
        },

        // Chats Privados
        {
            id: 5,
            name: 'Prof. Laura',
            type: 'private',
            unread: 1,
            lastMessage: 'Revisa la tarea de Juan, por favor',
            lastMessageTime: 'Hace 30m',
            avatar: '/images/user1.jpeg',
        },
        {
            id: 6,
            name: 'Tutor Marcos',
            type: 'private',
            unread: 0,
            lastMessage: 'El reporte mensual está listo',
            lastMessageTime: 'Ayer',
        },

        // Anuncios
        {
            id: 7,
            name: 'General',
            type: 'announcement',
            unread: 2,
            lastMessage: 'Suspensión de clases mañana',
            lastMessageTime: 'Hace 1h',
            isUrgent: true,
        },
        {
            id: 8,
            name: 'Solo Profesores',
            type: 'announcement',
            unread: 0,
            lastMessage: 'Reunión el viernes a las 15:00',
            lastMessageTime: 'Ayer',
        },
    ];

    // Get chat details when active chat changes
    useEffect(() => {
        const group = groups.find(g => g.id === activeChat);

        if (group) {
            let details: ChatDetails = {
                id: group.id,
                name: group.name,
                type: group.type,
            };

            // Add additional details based on chat type
            if (group.type === 'class') {
                details = {
                    ...details,
                    studentCount: 25,
                    teacherCount: 2,
                    description: 'Aula principal de matemáticas',
                };
            } else if (group.type === 'announcement') {
                details = {
                    ...details,
                    description:
                        group.name === 'General'
                            ? 'Anuncios para toda la comunidad educativa'
                            : 'Anuncios exclusivos para profesores',
                };
            }

            setChatDetails(details);
            loadMessages(group.id);
        }
    }, [activeChat]);

    // Load messages for the selected group
    const loadMessages = (groupId: number) => {
        // Example data structure for different message types
        const mockMessages: Record<number, Message[]> = {
            1: [
                // Grupo A
                {
                    id: 1,
                    text: '¿Qué tareas tenemos para mañana?',
                    sender: {
                        id: 101,
                        name: 'Juan Pérez',
                        role: 'student',
                    },
                    timestamp: new Date(Date.now() - 3600000 * 5),
                    read: true,
                },
                {
                    id: 2,
                    text: 'Deben completar los ejercicios de la página 30 del libro de texto y preparar la presentación sobre el tema que escogieron.',
                    sender: {
                        id: 201,
                        name: 'Prof. Laura',
                        role: 'teacher',
                        avatar: '/images/user1.jpeg',
                    },
                    timestamp: new Date(Date.now() - 3600000 * 4),
                    read: true,
                    isImportant: true,
                },
                {
                    id: 3,
                    text: '¿La presentación es individual o en grupo?',
                    sender: {
                        id: 102,
                        name: 'María González',
                        role: 'student',
                    },
                    timestamp: new Date(Date.now() - 3600000 * 3),
                    read: true,
                },
                {
                    id: 4,
                    text: 'Puede ser en grupos de 3 personas máximo. Recuerden que la duración debe ser de 5-10 minutos.',
                    sender: {
                        id: 201,
                        name: 'Prof. Laura',
                        role: 'teacher',
                        avatar: '/images/user1.jpeg',
                    },
                    timestamp: new Date(Date.now() - 3600000 * 2),
                    read: true,
                },
            ],
            5: [
                // Chat con Prof. Laura
                {
                    id: 1,
                    text: 'Hola Laura, quería consultar sobre el progreso de los estudiantes en el último examen.',
                    sender: {
                        id: 301,
                        name: 'Tú',
                        role: 'teacher',
                    },
                    timestamp: new Date(Date.now() - 86400000), // 1 día atrás
                    read: true,
                },
                {
                    id: 2,
                    text: 'Hola! El promedio fue de 78/100, pero hay tres estudiantes que necesitan apoyo adicional.',
                    sender: {
                        id: 201,
                        name: 'Prof. Laura',
                        role: 'teacher',
                        avatar: '/images/user1.jpeg',
                    },
                    timestamp: new Date(Date.now() - 82800000), // 23 horas atrás
                    read: true,
                },
                {
                    id: 3,
                    text: '¿Podrías revisar la tarea de Juan? Creo que necesita más atención en los temas de cálculo.',
                    sender: {
                        id: 201,
                        name: 'Prof. Laura',
                        role: 'teacher',
                        avatar: '/images/user1.jpeg',
                    },
                    timestamp: new Date(Date.now() - 1800000), // 30 min atrás
                    read: false,
                    isImportant: true,
                },
            ],
            7: [
                // Anuncios General
                {
                    id: 1,
                    text: 'Recordamos a toda la comunidad educativa que la próxima semana inicia el período de evaluaciones parciales.',
                    sender: {
                        id: 401,
                        name: 'Dirección Académica',
                        role: 'admin',
                    },
                    timestamp: new Date(Date.now() - 172800000), // 2 días atrás
                    read: true,
                    isAnnouncement: true,
                },
                {
                    id: 2,
                    text: 'Se informa que mañana se suspenden las clases por mantenimiento en las instalaciones eléctricas del campus. Las actividades se retomarán con normalidad el día siguiente.',
                    sender: {
                        id: 401,
                        name: 'Dirección Académica',
                        role: 'admin',
                    },
                    timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
                    read: false,
                    isAnnouncement: true,
                    isImportant: true,
                },
            ],
        };

        // Default messages if the specific chat doesn't have any defined
        const defaultMessage: Message = {
            id: 1,
            text: 'Bienvenido al chat. No hay mensajes anteriores.',
            sender: {
                id: 999,
                name: 'Sistema',
                role: 'admin',
            },
            timestamp: new Date(),
            read: true,
        };

        setMessages(mockMessages[groupId] || [defaultMessage]);
    };

    // Handle sending a message
    const handleSendMessage = (
        text: string,
        options?: { isImportant?: boolean; isAnnouncement?: boolean },
    ) => {
        if (!chatDetails) return;

        const newMessage: Message = {
            id: messages.length + 1,
            text,
            sender: {
                id: 301, // User's ID
                name: 'Tú',
                role: userRole,
            },
            timestamp: new Date(),
            read: false,
            isImportant: options?.isImportant,
            isAnnouncement: options?.isAnnouncement,
        };

        setMessages(prev => [...prev, newMessage]);

        // Simulate response after a delay for demo purposes
        if (chatDetails.type === 'private') {
            setTimeout(() => {
                const responseMessage: Message = {
                    id: messages.length + 2,
                    text: 'Gracias por tu mensaje. Te responderé pronto.',
                    sender: {
                        id: chatDetails.id === 5 ? 201 : 202,
                        name: chatDetails.name,
                        role: 'teacher',
                        avatar: chatDetails.id === 5 ? '/images/user1.jpeg' : undefined,
                    },
                    timestamp: new Date(),
                    read: false,
                };
                setMessages(prev => [...prev, responseMessage]);
            }, 2000);
        }
    };

    const handleChatSelect = (chatId: number) => {
        setActiveChat(chatId);
    };

    return {
        messages,
        groups,
        activeChat,
        chatDetails,
        userRole,
        handleChatSelect,
        handleSendMessage,
    };
};
