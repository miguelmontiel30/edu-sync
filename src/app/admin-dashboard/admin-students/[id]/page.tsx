'use client';

import { useParams } from 'next/navigation';

// Hooks
import useStudentProfile from './hooks/useStudentProfile';
import useStudentActions from './hooks/useStudentActions';
import useStudentProfileTabs from './hooks/useStudentProfileTabs';
import useStudentModals from './hooks/useStudentModals';

// UI Components
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { TabsList, TabsRoot, TabsTrigger, TabsContent } from '@/components/core/tabs';
import { NotificationBadge } from '@/components/ui';

// Components
import GradesChart from './components/GradesChart';
import ProfileHeader from './components/ProfileHeader';
import { BadgesWidget } from './components/BadgesWidget';
import PaymentsSection from './components/PaymentsSection';
import AttendanceWidget from './components/AttendanceWidget';
import AddressesSection from './components/AddressesSection';
import PersonalInfoSection from './components/PersonalInfoSection';
import TutorsSection from './components/TutorsSection';
import StudentFormModal from '../components/StudentFormModal';
import AttendanceHeatmap from './components/AttendanceHeatmap';

// Nuevos componentes
import TasksWidget from './components/TasksWidget';
import AcademicGoalsWidget from './components/AcademicGoalsWidget';
import DocumentsSection from './components/DocumentsSection';
import DocumentsSummaryWidget from './components/DocumentsSummaryWidget';
import HealthEmergencySection from './components/HealthEmergencySection';
import CommunicationsSection from './components/CommunicationsSection';
import DocumentTemplatesList from './components/DocumentTemplatesList';

// Types
import {
  AttendanceData,
  Document,
  DocumentType,
  EmergencyContact,
  MedicalInfo,
  Message,
  MessageType,
  DocumentTemplate,
  Task,
  AcademicGoal
} from './module-utils/types';

export default function StudentProfilePage() {
  // Get the parameters using the Next.js useParams() hook
  const params = useParams();
  const studentId = params.id as string;

  // Hook para datos del perfil
  const {
    student,
    addresses,
    tutors,
    payments,
    grades,
    attendance,
    groups,
    loadingState,
    loadStudentData
  } = useStudentProfile(studentId);

  // Hook para acciones del estudiante
  const {
    isSaving,
    handleBackToStudents,
    handleEditPersonalInfo,
    handleEditAddresses,
    handleAddTutor,
    handleViewTutorDetails
  } = useStudentActions(studentId, { loadStudentData });

  // Hook para gestión de pestañas
  const { tabs, changeTab } = useStudentProfileTabs();

  // Hook para gestión de modales
  const {
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    handleSaveStudentInfo,
    adaptedStudent
  } = useStudentModals(student, handleEditPersonalInfo, isSaving);

  // Si los datos están cargando
  if (loadingState.student) {
    return (
      <div className="flex items-center justify-center h-screen">
        <IconFA icon="spinner" spin size="xl" className="text-primary-500" />
      </div>
    );
  }

  // Si el estudiante no existe
  if (!student && !loadingState.student) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <IconFA icon="exclamation-circle" size="xl" className="text-error-500 mb-4" />
        <h2 className="text-xl font-medium">Estudiante no encontrado</h2>
        <p className="text-gray-500 mt-2">No se pudo encontrar el estudiante con ID: {studentId}</p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={handleBackToStudents}
        >
          Volver a Estudiantes
        </Button>
      </div>
    );
  }

  // Mock data para nuevos componentes
  // Esta sería reemplazada por datos reales en la implementación completa
  const mockData = {
    // Tareas académicas
    tasks: [
      { id: '1', title: 'Ensayo de Historia', subject: 'Historia', dueDate: '2025-06-01', status: 'pendiente', priority: 'alta', assignedBy: 'Prof. García' },
      { id: '2', title: 'Ejercicios Matemáticas', subject: 'Matemáticas', dueDate: '2025-05-28', status: 'pendiente', priority: 'media', assignedBy: 'Prof. Rodríguez' },
      { id: '3', title: 'Proyecto de Ciencias', subject: 'Ciencias', dueDate: '2025-05-25', status: 'vencida', priority: 'alta', assignedBy: 'Prof. López' },
      { id: '4', title: 'Vocabulario Inglés', subject: 'Inglés', dueDate: '2025-06-10', status: 'pendiente', priority: 'baja', assignedBy: 'Prof. Smith' }
    ] as Task[],

    // Metas académicas
    goals: [
      { id: '1', title: 'Promedio general', target: 9, current: 8.5, period: 'Trimestre 2' },
      { id: '2', title: 'Promedio Matemáticas', target: 10, current: 8, period: 'Trimestre 2', subject: 'Matemáticas' },
      { id: '3', title: 'Lectura de libros', target: 5, current: 4, period: 'Trimestre 2', subject: 'Español' },
      { id: '4', title: 'Proyecto final', target: 10, current: 3, period: 'Trimestre 2', subject: 'Ciencias' }
    ] as AcademicGoal[],

    // Documentos
    documents: [
      { id: '1', type: 'acta', name: 'Acta de Nacimiento.pdf', fileUrl: '/docs/acta.pdf', status: 'aprobado', uploadedAt: '2025-01-15', updatedAt: '2025-01-20' },
      { id: '2', type: 'curp', name: 'CURP.pdf', fileUrl: '/docs/curp.pdf', status: 'aprobado', uploadedAt: '2025-01-15', updatedAt: '2025-01-20' },
      { id: '3', type: 'domicilio', name: 'Comprobante de domicilio.pdf', fileUrl: '/docs/domicilio.pdf', status: 'pendiente', comments: 'El documento está vencido, por favor suba uno actualizado', uploadedAt: '2025-04-01', updatedAt: '2025-04-05' }
    ] as Document[],

    // Información médica
    medicalInfo: {
      allergies: ['Penicilina', 'Polen', 'Mariscos'],
      medicalConditions: 'Asma leve, requiere inhalador en caso de actividad física intensa',
      bloodType: 'O+',
      insurance: { provider: 'Seguros Médicos Nacionales', policyNumber: 'SM-123456789' }
    } as MedicalInfo,

    // Contactos de emergencia
    emergencyContacts: [
      { id: '1', name: 'María Rodríguez', relationship: 'Madre', phone: '555-123-4567', isMain: true },
      { id: '2', name: 'Carlos Sánchez', relationship: 'Tío', phone: '555-987-6543', isMain: false }
    ] as EmergencyContact[],

    // Mensajes
    messages: [
      { id: '1', title: 'Reunión de padres', content: 'Se convoca a reunión de padres el próximo viernes 28 de mayo a las 17:00 hrs.', type: 'evento', status: 'no-leido', sender: { id: '1', name: 'Dirección Escolar', type: 'admin' }, createdAt: '2025-05-20T10:00:00Z' },
      { id: '2', title: 'Entrega de tarea pendiente', content: 'Favor de entregar el ensayo de Historia antes del lunes 24 de mayo.', type: 'tarea', status: 'leido', sender: { id: '2', name: 'Prof. García', type: 'profesor' }, createdAt: '2025-05-18T14:30:00Z' },
      { id: '3', title: 'Consulta sobre calificación', content: 'Estimado profesor, quisiera consultar sobre mi calificación en el último examen.', type: 'general', status: 'leido', sender: { id: '3', name: 'Juan Pérez', type: 'estudiante' }, createdAt: '2025-05-17T09:15:00Z' },
      { id: '4', title: 'Recordatorio de pago', content: 'Le recordamos que tiene un pago pendiente correspondiente al mes de mayo.', type: 'pago', status: 'no-leido', sender: { id: '4', name: 'Administración', type: 'admin' }, createdAt: '2025-05-15T11:45:00Z' }
    ] as Message[],

    // Plantillas de documentos
    documentTemplates: [
      { id: '1', type: 'boleta', name: 'Boleta trimestral', description: 'Calificaciones del trimestre actual', availableParams: ['trimestre', 'cicloEscolar'] },
      { id: '2', type: 'constancia', name: 'Constancia de estudios', description: 'Documento oficial que acredita inscripción', availableParams: ['fechaEmision', 'cicloEscolar'] },
      { id: '3', type: 'certificado', name: 'Certificado de conducta', description: 'Certificado de comportamiento', availableParams: ['fechaEmision', 'periodo'] },
      { id: '4', type: 'recibo', name: 'Recibo de pago', description: 'Comprobante de pago de colegiatura', availableParams: ['mes', 'monto', 'concepto', 'fechaPago'] }
    ] as DocumentTemplate[]
  };

  // Manejo de documentos
  const handleUploadDocument = (type: DocumentType, file: File) => {
    console.log('Subiendo documento:', type, file.name);
    // En implementación real: llamar a API para subir documento
    return Promise.resolve();
  };

  // Manejo de información médica
  const handleUpdateMedicalInfo = (info: Partial<MedicalInfo>) => {
    console.log('Actualizando información médica:', info);
    // En implementación real: llamar a API para actualizar info médica
    return Promise.resolve();
  };

  // Manejo de comunicaciones
  const handleSendMessage = (message: { title: string; content: string; type: MessageType }) => {
    console.log('Enviando mensaje:', message);
    // En implementación real: llamar a API para enviar mensaje
    return Promise.resolve();
  };

  // Manejo de documentos generados
  const handleGenerateDocument = (templateId: string, params: Record<string, string>) => {
    console.log('Generando documento:', templateId, params);
    // En implementación real: llamar a API para generar documento
    return Promise.resolve('/docs/generated-document.pdf');
  };

  const attendanceMockData: AttendanceData[] = [
    { date: '2025-01-01', type: 'presente' },
    { date: '2025-01-02', type: 'retardo' },
    { date: '2025-01-03', type: 'ausente' },
    { date: '2025-01-04', type: 'sin-registro' },
    { date: '2025-01-05', type: 'presente' },
    { date: '2025-01-06', type: 'retardo' },
    { date: '2025-01-07', type: 'ausente' },
    { date: '2025-01-08', type: 'sin-registro' },
    { date: '2025-01-09', type: 'presente' },
    { date: '2025-01-10', type: 'retardo' },
    { date: '2025-01-11', type: 'ausente' },
    { date: '2025-01-12', type: 'sin-registro' },
    { date: '2025-01-13', type: 'presente' },
    { date: '2025-01-14', type: 'retardo' },
    { date: '2025-01-15', type: 'ausente' },
    { date: '2025-01-16', type: 'sin-registro' },
    { date: '2025-01-17', type: 'presente' },
    { date: '2025-01-18', type: 'retardo' },
    { date: '2025-01-19', type: 'ausente' },
    { date: '2025-01-20', type: 'sin-registro' },
    { date: '2025-01-21', type: 'presente' },
    { date: '2025-01-22', type: 'retardo' },
    { date: '2025-01-23', type: 'ausente' },
    { date: '2025-01-24', type: 'sin-registro' },
    { date: '2025-01-25', type: 'presente' },
    { date: '2025-01-26', type: 'retardo' },
    { date: '2025-01-27', type: 'ausente' },
    { date: '2025-01-28', type: 'sin-registro' },
    { date: '2025-01-29', type: 'presente' },
    { date: '2025-01-30', type: 'retardo' },
    { date: '2025-01-31', type: 'ausente' },
    { date: '2025-02-01', type: 'sin-registro' },
    { date: '2025-02-02', type: 'presente' },
    { date: '2025-02-03', type: 'retardo' },
    { date: '2025-02-04', type: 'ausente' },
    { date: '2025-02-05', type: 'sin-registro' },
    { date: '2025-02-06', type: 'presente' },
    { date: '2025-02-07', type: 'retardo' },
    { date: '2025-02-08', type: 'ausente' },
    { date: '2025-02-09', type: 'sin-registro' },
    { date: '2025-02-10', type: 'presente' },
    { date: '2025-02-11', type: 'retardo' },
    { date: '2025-02-12', type: 'ausente' },
    { date: '2025-02-13', type: 'sin-registro' },
    { date: '2025-02-14', type: 'presente' },
    { date: '2025-02-15', type: 'retardo' },
    { date: '2025-02-16', type: 'ausente' },
    { date: '2025-02-17', type: 'sin-registro' },
    { date: '2025-02-18', type: 'presente' },
    { date: '2025-02-19', type: 'retardo' },
    { date: '2025-02-20', type: 'ausente' },
    { date: '2025-02-21', type: 'sin-registro' },
    { date: '2025-02-22', type: 'presente' },
    { date: '2025-02-23', type: 'retardo' },
    { date: '2025-02-24', type: 'ausente' },
    { date: '2025-02-25', type: 'sin-registro' },
    { date: '2025-02-26', type: 'presente' },
    { date: '2025-02-27', type: 'retardo' },
    { date: '2025-02-28', type: 'ausente' },
    { date: '2025-03-01', type: 'sin-registro' },
    { date: '2025-03-02', type: 'presente' },
    { date: '2025-03-03', type: 'retardo' },
    { date: '2025-03-04', type: 'ausente' },
    { date: '2025-03-05', type: 'sin-registro' },
    { date: '2025-03-06', type: 'presente' },
    { date: '2025-03-07', type: 'retardo' },
    { date: '2025-03-08', type: 'ausente' },
    { date: '2025-03-09', type: 'sin-registro' },
    { date: '2025-03-10', type: 'presente' },
    { date: '2025-03-11', type: 'retardo' },
    { date: '2025-03-12', type: 'ausente' },
    { date: '2025-03-13', type: 'sin-registro' },
    { date: '2025-03-14', type: 'presente' },
    { date: '2025-03-15', type: 'retardo' },
    { date: '2025-03-16', type: 'ausente' },
    { date: '2025-03-17', type: 'sin-registro' },
    { date: '2025-03-18', type: 'presente' },
    { date: '2025-03-19', type: 'retardo' },
    { date: '2025-03-20', type: 'ausente' },
    { date: '2025-03-21', type: 'sin-registro' },
    { date: '2025-03-22', type: 'presente' },
    { date: '2025-03-23', type: 'retardo' },
    { date: '2025-03-24', type: 'ausente' },
    { date: '2025-03-25', type: 'sin-registro' },
    { date: '2025-03-26', type: 'presente' },
    { date: '2025-03-27', type: 'retardo' },
    { date: '2025-03-28', type: 'ausente' },
    { date: '2025-03-29', type: 'sin-registro' },
    { date: '2025-03-30', type: 'presente' },
    { date: '2025-03-31', type: 'retardo' },
    { date: '2025-04-01', type: 'ausente' },
    { date: '2025-04-02', type: 'sin-registro' },
    { date: '2025-04-03', type: 'presente' },
    { date: '2025-04-04', type: 'retardo' },
    { date: '2025-04-05', type: 'ausente' },
    { date: '2025-04-06', type: 'sin-registro' },
    { date: '2025-04-07', type: 'presente' },
    { date: '2025-04-08', type: 'retardo' },
    { date: '2025-04-09', type: 'ausente' },
    { date: '2025-04-10', type: 'sin-registro' },
    { date: '2025-04-11', type: 'presente' },
    { date: '2025-04-12', type: 'retardo' },
    { date: '2025-04-13', type: 'ausente' },
    { date: '2025-04-14', type: 'sin-registro' },
    { date: '2025-04-15', type: 'presente' },
    { date: '2025-04-16', type: 'retardo' },
    { date: '2025-04-17', type: 'ausente' },
    { date: '2025-04-18', type: 'sin-registro' },
    { date: '2025-04-19', type: 'presente' },
    { date: '2025-04-20', type: 'retardo' },
    { date: '2025-04-21', type: 'ausente' },
    { date: '2025-04-22', type: 'sin-registro' },
    { date: '2025-04-23', type: 'presente' },
    { date: '2025-04-24', type: 'retardo' },
    { date: '2025-04-25', type: 'ausente' },
    { date: '2025-04-26', type: 'sin-registro' },
    { date: '2025-04-27', type: 'presente' },
    { date: '2025-04-28', type: 'retardo' },
    { date: '2025-04-29', type: 'ausente' },
    { date: '2025-04-30', type: 'sin-registro' },
    { date: '2025-05-01', type: 'presente' },
    { date: '2025-05-02', type: 'retardo' },
    { date: '2025-05-03', type: 'ausente' },
    { date: '2025-05-04', type: 'sin-registro' },
    { date: '2025-05-05', type: 'presente' },
    { date: '2025-05-06', type: 'retardo' },
    { date: '2025-05-07', type: 'ausente' },
    { date: '2025-05-08', type: 'sin-registro' },
    { date: '2025-05-09', type: 'presente' },
    { date: '2025-05-10', type: 'retardo' },
    { date: '2025-05-11', type: 'ausente' },
    { date: '2025-05-12', type: 'sin-registro' },
    { date: '2025-05-13', type: 'presente' },
    { date: '2025-05-14', type: 'retardo' },
    { date: '2025-05-15', type: 'ausente' },
    { date: '2025-05-16', type: 'sin-registro' },
    { date: '2025-05-17', type: 'presente' },
    { date: '2025-05-18', type: 'retardo' },
    { date: '2025-05-19', type: 'ausente' },
    { date: '2025-05-20', type: 'sin-registro' },
    { date: '2025-05-21', type: 'presente' },
    { date: '2025-05-22', type: 'retardo' },
    { date: '2025-05-23', type: 'ausente' },
    { date: '2025-05-24', type: 'sin-registro' },
    { date: '2025-05-25', type: 'presente' },
  ];

  return (
    <div className="mx-auto max-w-screen-2xl md:p-6">
      {/* Breadcrumb navigation */}
      <PageBreadcrumb
        pageTitle="Perfil de Estudiante"
        items={[
          { title: 'Estudiantes', path: '/admin-dashboard/admin-students' },
        ]}
      />

      {/* Navegación por pestañas */}
      <TabsRoot defaultValue="profile" onValueChange={changeTab}>
        <TabsList className="mb-6">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="px-4 py-2"
            >
              <IconFA icon={tab.icon} className="mr-2" /> {tab.label}
              {tab.id === 'documents' && mockData.documents.filter(doc => doc.status === 'pendiente').length > 0 && (
                <NotificationBadge count={mockData.documents.filter(doc => doc.status === 'pendiente').length} type="warning" className="ml-2" />
              )}
              {tab.id === 'communications' && mockData.messages.filter(msg => msg.status === 'no-leido' && msg.sender.type !== 'estudiante').length > 0 && (
                <NotificationBadge count={mockData.messages.filter(msg => msg.status === 'no-leido' && msg.sender.type !== 'estudiante').length} type="error" className="ml-2" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Contenido de la pestaña Perfil */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Columna izquierda */}
            <div className="xl:col-span-1 space-y-6">
              {/* Perfil del estudiante */}
              {student && (
                <ProfileHeader
                  student={student}
                />
              )}

              {/* Insignias y reconocimientos */}
              <BadgesWidget />
            </div>

            {/* Columna derecha */}
            <div className="xl:col-span-3 space-y-6">
              {/* Información personal */}
              {student && (
                <PersonalInfoSection
                  student={student}
                  onEdit={openEditModal}
                />
              )}

              {/* Direcciones */}
              <AddressesSection
                addresses={addresses}
                onEdit={() => handleEditAddresses({})}
              />

              {/* Tutores */}
              <TutorsSection
                tutors={tutors}
                onAddTutor={() => handleAddTutor({})}
                onViewTutorDetails={(id) => handleViewTutorDetails(Number(id))}
              />
            </div>
          </div>
        </TabsContent>

        {/* Contenido de la pestaña Académico */}
        <TabsContent value="academics">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Columna izquierda */}
            <div className="xl:col-span-1 space-y-6">
              {/* Asistencia */}
              <AttendanceWidget attendance={attendance} />

              {/* Tareas pendientes */}
              <TasksWidget
                tasks={mockData.tasks}
                onMarkComplete={(_id) => Promise.resolve()}
              />

              {/* Progreso de metas */}
              <AcademicGoalsWidget goals={mockData.goals} />
            </div>

            {/* Columna derecha */}
            <div className="xl:col-span-3 space-y-6">
              {/* Rendimiento académico */}
              <GradesChart grades={grades} />

              {/* Asistencia */}
              <AttendanceHeatmap year={2025} data={attendanceMockData} />

              {/* Historial de grupos */}
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Historial de Grupos</h3>
                {groups && groups.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grupo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nivel</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                        {groups.map((groupItem: any) => (
                          <tr key={groupItem.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{groupItem.group.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{groupItem.group.grade}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{groupItem.group.level}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No hay información de grupos disponible</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Contenido de la pestaña Pagos */}
        <TabsContent value="payments">
          <div className="grid grid-cols-1 gap-6">
            {/* Pagos recientes */}
            <PaymentsSection payments={payments} />

            {/* Historial completo de pagos */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Historial Completo de Pagos</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Aquí se mostraría un historial completo de todos los pagos realizados por el estudiante,
                incluyendo matrículas, mensualidades, servicios adicionales y otros conceptos.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Contenido de la pestaña Documentos */}
        <TabsContent value="documents">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Columna izquierda */}
            <div className="xl:col-span-1 space-y-6">
              <DocumentsSummaryWidget
                documents={mockData.documents}
                pendingCount={mockData.documents.filter(d => d.status === 'pendiente').length}
              />
            </div>

            {/* Columna derecha */}
            <div className="xl:col-span-3 space-y-6">
              <DocumentsSection
                documents={mockData.documents}
                onUpload={handleUploadDocument}
                onReview={(_id, _status, _comments) => Promise.resolve()}
              />
            </div>
          </div>
        </TabsContent>

        {/* Contenido de la pestaña Salud & Emergencias */}
        <TabsContent value="health">
          <HealthEmergencySection
            medicalInfo={mockData.medicalInfo}
            emergencyContacts={mockData.emergencyContacts}
            onAddContact={() => console.log('Añadir contacto')}
            onUpdateMedicalInfo={handleUpdateMedicalInfo}
            onCallContact={(phone) => console.log('Llamando a:', phone)}
            onSendSMS={(phone) => console.log('Enviando SMS a:', phone)}
          />
        </TabsContent>

        {/* Contenido de la pestaña Comunicaciones */}
        <TabsContent value="communications">
          <CommunicationsSection
            messages={mockData.messages}
            onSendMessage={handleSendMessage}
            onMarkAsRead={(_id) => Promise.resolve()}
          />
        </TabsContent>

        {/* Contenido de la pestaña Descargas */}
        <TabsContent value="downloads">
          <DocumentTemplatesList
            templates={mockData.documentTemplates}
            onGenerateDocument={handleGenerateDocument}
          />
        </TabsContent>
      </TabsRoot>

      {/* Modal de edición de información personal */}
      {adaptedStudent && (
        <StudentFormModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSave={handleSaveStudentInfo}
          selectedStudent={adaptedStudent}
          isSaving={isSaving}
        />
      )}
    </div>
  );
} 