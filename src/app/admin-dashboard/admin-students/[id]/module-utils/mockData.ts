import {
    Task,
    AcademicGoal,
    Document,
    MedicalInfo,
    EmergencyContact,
    Message,
    DocumentTemplate,
    DetailedTask,
    AttendanceData,
} from './types';

/**
 * Genera datos simulados para la aplicación
 */
export function generateMockData() {
    return {
        // Tareas académicas
        tasks: [
            {
                id: '1',
                title: 'Ensayo de Historia',
                subject: 'Historia',
                dueDate: '2025-06-01',
                status: 'pendiente',
                priority: 'alta',
                assignedBy: 'Prof. García',
            },
            {
                id: '2',
                title: 'Ejercicios Matemáticas',
                subject: 'Matemáticas',
                dueDate: '2025-05-28',
                status: 'pendiente',
                priority: 'media',
                assignedBy: 'Prof. Rodríguez',
            },
            {
                id: '3',
                title: 'Proyecto de Ciencias',
                subject: 'Ciencias',
                dueDate: '2025-05-25',
                status: 'vencida',
                priority: 'alta',
                assignedBy: 'Prof. López',
            },
            {
                id: '4',
                title: 'Vocabulario Inglés',
                subject: 'Inglés',
                dueDate: '2025-06-10',
                status: 'pendiente',
                priority: 'baja',
                assignedBy: 'Prof. Smith',
            },
        ] as Task[],

        // Metas académicas
        goals: [
            {id: '1', title: 'Promedio general', target: 9, current: 8.5, period: 'Trimestre 2'},
            {
                id: '2',
                title: 'Promedio Matemáticas',
                target: 10,
                current: 8,
                period: 'Trimestre 2',
                subject: 'Matemáticas',
            },
            {
                id: '3',
                title: 'Lectura de libros',
                target: 5,
                current: 4,
                period: 'Trimestre 2',
                subject: 'Español',
            },
            {
                id: '4',
                title: 'Proyecto final',
                target: 10,
                current: 3,
                period: 'Trimestre 2',
                subject: 'Ciencias',
            },
        ] as AcademicGoal[],

        // Documentos
        documents: [
            {
                id: '1',
                type: 'acta',
                name: 'Acta de Nacimiento.pdf',
                fileUrl: '/docs/acta.pdf',
                status: 'aprobado',
                uploadedAt: '2025-01-15',
                updatedAt: '2025-01-20',
            },
            {
                id: '2',
                type: 'curp',
                name: 'CURP.pdf',
                fileUrl: '/docs/curp.pdf',
                status: 'aprobado',
                uploadedAt: '2025-01-15',
                updatedAt: '2025-01-20',
            },
            {
                id: '3',
                type: 'domicilio',
                name: 'Comprobante de domicilio.pdf',
                fileUrl: '/docs/domicilio.pdf',
                status: 'pendiente',
                comments: 'El documento está vencido, por favor suba uno actualizado',
                uploadedAt: '2025-04-01',
                updatedAt: '2025-04-05',
            },
        ] as Document[],

        // Información médica
        medicalInfo: {
            allergies: ['Penicilina', 'Polen', 'Mariscos'],
            medicalConditions: 'Asma leve, requiere inhalador en caso de actividad física intensa',
            bloodType: 'O+',
            insurance: {provider: 'Seguros Médicos Nacionales', policyNumber: 'SM-123456789'},
        } as MedicalInfo,

        // Contactos de emergencia
        emergencyContacts: [
            {
                id: '1',
                name: 'María Rodríguez',
                relationship: 'Madre',
                phone: '555-123-4567',
                isMain: true,
            },
            {
                id: '2',
                name: 'Carlos Sánchez',
                relationship: 'Tío',
                phone: '555-987-6543',
                isMain: false,
            },
        ] as EmergencyContact[],

        // Mensajes
        messages: [
            {
                id: '1',
                title: 'Reunión de padres',
                content:
                    'Se convoca a reunión de padres el próximo viernes 28 de mayo a las 17:00 hrs.',
                type: 'evento',
                status: 'no-leido',
                sender: {id: '1', name: 'Dirección Escolar', type: 'admin'},
                createdAt: '2025-05-20T10:00:00Z',
            },
            {
                id: '2',
                title: 'Entrega de tarea pendiente',
                content: 'Favor de entregar el ensayo de Historia antes del lunes 24 de mayo.',
                type: 'tarea',
                status: 'leido',
                sender: {id: '2', name: 'Prof. García', type: 'profesor'},
                createdAt: '2025-05-18T14:30:00Z',
            },
            {
                id: '3',
                title: 'Consulta sobre calificación',
                content:
                    'Estimado profesor, quisiera consultar sobre mi calificación en el último examen.',
                type: 'general',
                status: 'leido',
                sender: {id: '3', name: 'Juan Pérez', type: 'estudiante'},
                createdAt: '2025-05-17T09:15:00Z',
            },
            {
                id: '4',
                title: 'Recordatorio de pago',
                content:
                    'Le recordamos que tiene un pago pendiente correspondiente al mes de mayo.',
                type: 'pago',
                status: 'no-leido',
                sender: {id: '4', name: 'Administración', type: 'admin'},
                createdAt: '2025-05-15T11:45:00Z',
            },
        ] as Message[],

        // Plantillas de documentos
        documentTemplates: [
            {
                id: '1',
                type: 'boleta',
                name: 'Boleta trimestral',
                description: 'Calificaciones del trimestre actual',
                availableParams: ['trimestre', 'cicloEscolar'],
            },
            {
                id: '2',
                type: 'constancia',
                name: 'Constancia de estudios',
                description: 'Documento oficial que acredita inscripción',
                availableParams: ['fechaEmision', 'cicloEscolar'],
            },
            {
                id: '3',
                type: 'certificado',
                name: 'Certificado de conducta',
                description: 'Certificado de comportamiento',
                availableParams: ['fechaEmision', 'periodo'],
            },
            {
                id: '4',
                type: 'recibo',
                name: 'Recibo de pago',
                description: 'Comprobante de pago de colegiatura',
                availableParams: ['mes', 'monto', 'concepto', 'fechaPago'],
            },
        ] as DocumentTemplate[],

        // Tareas académicas detalladas
        detailedTasks: [
            {
                id: '1',
                subject: 'Historia',
                title: 'Ensayo sobre la Revolución Francesa',
                description:
                    'Redactar un ensayo de 500 palabras analizando las causas principales de la Revolución Francesa y sus consecuencias a nivel político y social.',
                assignedDate: '2025-05-20',
                dueDate: '2025-06-01',
                status: 'pendiente',
                type: 'academica',
                materials: ['Libro de texto Cap. 12', 'Fuentes primarias'],
                teacherNotes: 'Incluir bibliografía en formato APA',
                assignedBy: 'Prof. García',
                priority: 'alta',
            },
            {
                id: '2',
                subject: 'Ciencias',
                title: 'Maqueta del Sistema Solar',
                description:
                    'Crear una maqueta a escala del sistema solar que muestre los planetas y sus características principales.',
                assignedDate: '2025-05-15',
                dueDate: '2025-05-29',
                status: 'vencida',
                type: 'material',
                materials: ['Cartulina negra', 'Esferas de diferentes tamaños', 'Pinturas'],
                assignedBy: 'Prof. López',
                priority: 'alta',
            },
            {
                id: '3',
                subject: 'Matemáticas',
                title: 'Ejercicios de álgebra',
                description:
                    'Resolver los ejercicios 1-20 del capítulo 8 del libro de texto. Mostrar el procedimiento paso a paso.',
                assignedDate: '2025-05-25',
                dueDate: '2025-06-02',
                status: 'en-progreso',
                type: 'academica',
                materials: ['Calculadora científica', 'Regla'],
                teacherNotes: 'Mostrar todos los pasos del procedimiento',
                assignedBy: 'Prof. Rodríguez',
                priority: 'media',
            },
            {
                id: '4',
                subject: 'Inglés',
                title: 'Vocabulario semanal',
                description:
                    'Aprender y practicar las palabras del vocabulario semanal. Prepararse para la prueba del viernes.',
                assignedDate: '2025-05-28',
                dueDate: '2025-06-10',
                status: 'pendiente',
                type: 'academica',
                materials: ['Lista de vocabulario', 'Cuaderno de ejercicios'],
                assignedBy: 'Prof. Smith',
                priority: 'baja',
            },
        ] as DetailedTask[],
    };
}

/**
 * Datos de asistencia simulados
 */
export const attendanceMockData: AttendanceData[] = [
    {date: '2025-01-01', type: 'presente'},
    {date: '2025-01-02', type: 'retardo'},
    {date: '2025-01-03', type: 'ausente'},
    {date: '2025-01-04', type: 'sin-registro'},
    {date: '2025-01-05', type: 'presente'},
    {date: '2025-01-06', type: 'retardo'},
    {date: '2025-01-07', type: 'ausente'},
    {date: '2025-01-08', type: 'sin-registro'},
    {date: '2025-01-09', type: 'presente'},
    {date: '2025-01-10', type: 'retardo'},
    {date: '2025-01-11', type: 'ausente'},
    {date: '2025-01-12', type: 'sin-registro'},
    {date: '2025-01-13', type: 'presente'},
    {date: '2025-01-14', type: 'retardo'},
    {date: '2025-01-15', type: 'ausente'},
    {date: '2025-01-16', type: 'sin-registro'},
    {date: '2025-01-17', type: 'presente'},
    {date: '2025-01-18', type: 'retardo'},
    {date: '2025-01-19', type: 'ausente'},
    {date: '2025-01-20', type: 'sin-registro'},
    {date: '2025-01-21', type: 'presente'},
    {date: '2025-01-22', type: 'retardo'},
    {date: '2025-01-23', type: 'ausente'},
    {date: '2025-01-24', type: 'sin-registro'},
    {date: '2025-01-25', type: 'presente'},
    {date: '2025-02-01', type: 'sin-registro'},
    {date: '2025-02-15', type: 'retardo'},
    {date: '2025-03-01', type: 'sin-registro'},
    {date: '2025-03-15', type: 'retardo'},
    {date: '2025-04-01', type: 'ausente'},
    {date: '2025-04-15', type: 'presente'},
    {date: '2025-05-01', type: 'presente'},
    {date: '2025-05-15', type: 'ausente'},
    {date: '2025-05-25', type: 'presente'},
];
