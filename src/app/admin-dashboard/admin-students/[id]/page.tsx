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
import NotificationBadge from '@/components/ui/NotificationBadge';

// Tab Components
import ProfileTab from './tabs/ProfileTab';
import AcademicsTab from './tabs/AcademicsTab';
import PaymentsTab from './tabs/PaymentsTab';
import DocumentsTab from './tabs/DocumentsTab';
import HealthTab from './tabs/HealthTab';
import CommunicationsTab from './tabs/CommunicationsTab';
import DownloadsTab from './tabs/DownloadsTab';

// Form Components
import StudentFormModal from '../components/StudentFormModal';

// Types
import {
  Document,
  DocumentType,
  Message,
  MessageType,
} from './module-utils/types';

// Mock data y helpers
import { generateMockData, attendanceMockData } from './module-utils/mockData';

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
  const { tabs, changeTab, academicTabs, academicTab, changeAcademicTab } = useStudentProfileTabs();

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

  // Obtener datos simulados
  const mockData = generateMockData();

  // Handlers para acciones
  const handleUploadDocument = (type: DocumentType, file: File) => {
    console.log('Subiendo documento:', type, file.name);
    return Promise.resolve();
  };

  const handleUpdateMedicalInfo = (info: any) => {
    console.log('Actualizando información médica:', info);
    return Promise.resolve();
  };

  const handleSendMessage = (message: { title: string; content: string; type: MessageType }) => {
    console.log('Enviando mensaje:', message);
    return Promise.resolve();
  };

  const handleGenerateDocument = (templateId: string, params: Record<string, string>) => {
    console.log('Generando documento:', templateId, params);
    return Promise.resolve('/docs/generated-document.pdf');
  };

  const handleMarkTaskComplete = (taskId: string) => {
    console.log('Marcar tarea como completada:', taskId);
    return Promise.resolve();
  };

  const handleUploadTaskFile = (taskId: string, file: File) => {
    console.log('Subiendo archivo para tarea:', taskId, file.name);
    return Promise.resolve();
  };

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
      <TabsRoot defaultValue="academics" onValueChange={changeTab}>
        <TabsList className="mb-6">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="px-4 py-2"
            >
              <IconFA icon={tab.icon} className="mr-2" /> {tab.label}
              {tab.id === 'documents' && mockData.documents.filter((doc: Document) => doc.status === 'pendiente').length > 0 && (
                <NotificationBadge count={mockData.documents.filter((doc: Document) => doc.status === 'pendiente').length} type="warning" className="ml-2" />
              )}
              {tab.id === 'communications' && mockData.messages.filter((msg: Message) => msg.status === 'no-leido' && msg.sender.type !== 'estudiante').length > 0 && (
                <NotificationBadge count={mockData.messages.filter((msg: Message) => msg.status === 'no-leido' && msg.sender.type !== 'estudiante').length} type="error" className="ml-2" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Contenido de la pestaña Perfil */}
        <TabsContent value="profile">
          <ProfileTab
            student={student}
            addresses={addresses}
            tutors={tutors}
            onEdit={openEditModal}
            onEditAddresses={handleEditAddresses}
            onAddTutor={handleAddTutor}
            onViewTutorDetails={handleViewTutorDetails}
          />
        </TabsContent>

        {/* Contenido de la pestaña Académico */}
        <TabsContent value="academics">
          <AcademicsTab
            attendance={attendance}
            attendanceMockData={attendanceMockData}
            grades={grades}
            academicTabs={academicTabs}
            academicTab={academicTab}
            mockData={{
              detailedTasks: mockData.detailedTasks,
              messages: mockData.messages,
              documents: mockData.documents
            }}
            onChangeAcademicTab={changeAcademicTab}
            onMarkTaskComplete={handleMarkTaskComplete}
            onUploadTaskFile={handleUploadTaskFile}
          />
        </TabsContent>

        {/* Contenido de la pestaña Pagos */}
        <TabsContent value="payments">
          <PaymentsTab payments={payments} />
        </TabsContent>

        {/* Contenido de la pestaña Documentos */}
        <TabsContent value="documents">
          <DocumentsTab
            documents={mockData.documents}
            onUpload={handleUploadDocument}
            onReview={(id: string, status: string, comments?: string) => Promise.resolve()}
          />
        </TabsContent>

        {/* Contenido de la pestaña Salud & Emergencias */}
        <TabsContent value="health">
          <HealthTab
            medicalInfo={mockData.medicalInfo}
            emergencyContacts={mockData.emergencyContacts}
            onAddContact={() => console.log('Añadir contacto')}
            onUpdateMedicalInfo={handleUpdateMedicalInfo}
            onCallContact={(phone: string) => console.log('Llamando a:', phone)}
            onSendSMS={(phone: string) => console.log('Enviando SMS a:', phone)}
          />
        </TabsContent>

        {/* Contenido de la pestaña Comunicaciones */}
        <TabsContent value="communications">
          <CommunicationsTab
            messages={mockData.messages}
            onSendMessage={handleSendMessage}
            onMarkAsRead={(id: string) => Promise.resolve()}
          />
        </TabsContent>

        {/* Contenido de la pestaña Descargas */}
        <TabsContent value="downloads">
          <DownloadsTab
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