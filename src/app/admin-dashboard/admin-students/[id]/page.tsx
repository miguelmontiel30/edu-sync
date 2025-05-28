'use client';

import { useParams } from 'next/navigation';

// Hooks
import useStudentProfile from './hooks/useStudentProfile';
import useStudentActions from './hooks/useStudentActions';

// UI Components
import IconFA from '@/components/ui/IconFA';
import Button from '@/components/core/button/Button';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import MetricsChartsWrapper from '@/components/core/metrics/MetricsChartsWrapper';

// Components
import GradesChart from './components/GradesChart';
import ProfileHeader from './components/ProfileHeader';
import RewardsWidget from './components/RewardsWidget';
import PaymentsSection from './components/PaymentsSection';
import AttendanceWidget from './components/AttendanceWidget';
import AddressesSection from './components/AddressesSection';
import PersonalInfoSection from './components/PersonalInfoSection';

export default function StudentProfilePage() {
  // Get the parameters using the Next.js useParams() hook
  const params = useParams();
  const studentId = params.id as string;

  // Hooks for the student profile and actions
  const {
    student,
    addresses,
    tutors,
    payments,
    grades,
    attendance,
    badges,
    loadingState,
    loadStudentData
  } = useStudentProfile(studentId);

  const {
    handleBackToStudents,
    handleEditPersonalInfo,
    handleEditAddresses,
    handleAddTutor,
    handleViewTutorDetails
  } = useStudentActions(studentId, loadStudentData);

  // If all main data is loading
  if (loadingState.student) {
    return (
      <div className="flex items-center justify-center h-screen">
        <IconFA icon="spinner" spin size="xl" className="text-primary-500" />
      </div>
    );
  }

  // If the student is not found
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

  return (
    <div className="mx-auto max-w-screen-2xl md:p-6">
      {/* Breadcrumb navigation */}
      <PageBreadcrumb
        pageTitle="Perfil de Estudiante"
        items={[
          { title: 'Estudiantes', path: '/admin-dashboard/admin-students' },
        ]}
      />

      {/* Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-6">
        {/* Left Sidebar with profile header and attendance widget */}
        <div className="xl:col-span-1">
          {/* Profile Header with Tutors */}
          {student && (
            <ProfileHeader
              student={student}
              tutors={tutors}
              onAddTutor={() => handleAddTutor({})}
              onViewTutorDetails={(id) => handleViewTutorDetails(Number(id))}
            />
          )}

          {/* Attendance Widget */}
          <MetricsChartsWrapper title="Asistencia">
            <AttendanceWidget attendance={attendance} />
          </MetricsChartsWrapper>
        </div>

        {/* Main Content with rewards widget, personal information, addresses, payments, and metrics section */}
        <div className="xl:col-span-3 space-y-6">
          {/* Rewards widget */}
          <RewardsWidget badges={badges.map(sb => sb.badge)} />

          {/* Personal information and addresses section */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Personal Information */}
            {student && (
              <PersonalInfoSection
                student={student}
                onEdit={() => handleEditPersonalInfo({})}
              />
            )}

            {/* Addresses */}
            <AddressesSection
              addresses={addresses}
              onEdit={() => handleEditAddresses({})}
            />
          </div>

          {/* Payments section */}
          <PaymentsSection payments={payments} />

          {/* Metrics section */}

          <MetricsChartsWrapper title="Rendimiento Académico">
            {/* Grades Chart */}
            <GradesChart grades={grades} />
          </MetricsChartsWrapper>

        </div>
      </div>
    </div>
  );
} 