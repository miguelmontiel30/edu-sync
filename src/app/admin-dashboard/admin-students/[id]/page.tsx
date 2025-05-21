'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React from 'react';

// UI Components
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import Badge from '@/components/core/badge/Badge';
import ComponentCard from '@/components/common/ComponentCard';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/core/table';
import MetricsChartsWrapper from '@/components/core/metrics/MetricsChartsWrapper';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

// Fake data and types
interface Student {
  id: number;
  full_name: string;
  first_name: string;
  father_last_name: string;
  mother_last_name: string;
  curp: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  image_url: string;
  addresses: Address[];
  tutors: Tutor[];
  payments: Payment[];
  grades: Grade[];
  attendance: { date: string; status: 'present' | 'absent' | 'late' }[];
  badges: { id: number; name: string; description: string; icon: string }[];
}

interface Address {
  id: number;
  street: string;
  exterior_number: string;
  interior_number?: string;
  neighborhood: string;
  postal_code: string;
  reference?: string;
  is_current: boolean;
  address_type: 'home' | 'other';
}

interface Tutor {
  id: number;
  full_name: string;
  relationship: string;
  phone: string;
  is_primary: boolean;
  can_pickup: boolean;
}

interface Payment {
  id: number;
  month: string;
  amount: number;
  payment_date: string | null;
  status: 'paid' | 'pending' | 'overdue';
}

interface Grade {
  id: number;
  subject: string;
  period: string;
  score: number;
}

// Componentes de la página
const ProfileHeader = ({ student }: { student: Student }) => (
  <div className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="relative w-32 h-32 mx-auto md:mx-0">
      <Image
        src={student.image_url || '/assets/images/avatars/placeholder.png'}
        alt={student.full_name}
        fill
        className="rounded-full object-cover border-4 border-primary-100"
      />
    </div>
    <div className="flex-1">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{student.full_name}</h1>
          <p className="text-gray-500 dark:text-gray-400">ID: {student.id}</p>
        </div>
        <Button
          variant="outline"
          startIcon={<IconFA icon="chevron-left" />}
          onClick={() => window.history.back()}
        >
          Volver a Estudiantes
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="flex items-center gap-2">
          <IconFA icon="envelope" className="text-gray-400" />
          <span>{student.email || 'Sin correo'}</span>
        </div>
        <div className="flex items-center gap-2">
          <IconFA icon="phone" className="text-gray-400" />
          <span>{student.phone || 'Sin teléfono'}</span>
        </div>
        <div className="flex items-center gap-2">
          <IconFA icon="calendar" className="text-gray-400" />
          <span>{new Date(student.birth_date).toLocaleDateString('es-MX')}</span>
        </div>
      </div>
    </div>
  </div>
);

const PersonalInfoSection = ({ student, onEdit }: { student: Student; onEdit: () => void }) => (
  <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
    <div className="px-6 py-5 flex justify-between items-center">
      <div>
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Información Personal</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Datos personales del estudiante</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        startIcon={<IconFA icon="pen" />}
        onClick={onEdit}
      >
        Editar
      </Button>
    </div>
    <div className="border-t border-gray-100 dark:border-gray-800 p-2 sm:p-2">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre completo</h3>
            <p className="text-base">{student.full_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">CURP</h3>
            <p className="text-base">{student.curp}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de nacimiento</h3>
            <p className="text-base">{new Date(student.birth_date).toLocaleDateString('es-MX')}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Género</h3>
            <p className="text-base">{student.gender}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Correo electrónico</h3>
            <p className="text-base">{student.email || 'No registrado'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</h3>
            <p className="text-base">{student.phone || 'No registrado'}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AddressesSection = ({ addresses, onEdit }: { addresses: Address[]; onEdit: () => void }) => (
  <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
    <div className="px-6 py-5 flex justify-between items-center">
      <div>
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Direcciones</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Direcciones registradas del estudiante</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        startIcon={<IconFA icon="pen" />}
        onClick={onEdit}
      >
        Editar
      </Button>
    </div>
    <div className="border-t border-gray-100 dark:border-gray-800 p-2 sm:p-2">
      <div className="space-y-6">
        {addresses.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">No hay direcciones registradas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map(address => (
              <div key={address.id} className="border rounded-md p-4 relative">
                {address.is_current && (
                  <Badge color="success">
                    Actual
                  </Badge>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Calle</h3>
                    <p>{address.street} {address.exterior_number}{address.interior_number ? `, Int. ${address.interior_number}` : ''}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Colonia</h3>
                    <p>{address.neighborhood}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Código Postal</h3>
                    <p>{address.postal_code}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo</h3>
                    <p className="capitalize">{address.address_type === 'home' ? 'Casa' : 'Otro'}</p>
                  </div>
                  {address.reference && (
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Referencia</h3>
                      <p>{address.reference}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

const PaymentsSection = ({ payments }: { payments: Payment[] }) => (
  <ComponentCard
    title="Pagos de Colegiatura"
    desc="Historial de pagos realizados"
    className="p-6"
  >
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell isHeader>Mes</TableCell>
          <TableCell isHeader>Monto</TableCell>
          <TableCell isHeader>Fecha de Pago</TableCell>
          <TableCell isHeader>Estado</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map(payment => (
          <TableRow key={payment.id}>
            <TableCell>{payment.month}</TableCell>
            <TableCell>${payment.amount.toFixed(2)}</TableCell>
            <TableCell>
              {payment.payment_date
                ? new Date(payment.payment_date).toLocaleDateString('es-MX')
                : '-'}
            </TableCell>
            <TableCell>
              <Badge
                color={
                  payment.status === 'paid' ? 'success' :
                    payment.status === 'pending' ? 'warning' : 'error'
                }
              >
                {payment.status === 'paid' ? 'Pagado' :
                  payment.status === 'pending' ? 'Pendiente' : 'Vencido'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </ComponentCard>
);

const TutorsSection = ({ tutors, onAddTutor, onViewDetails }: {
  tutors: Tutor[];
  onAddTutor: () => void;
  onViewDetails: (id: number) => void;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
    <div className="px-6 py-5 flex justify-between items-center">
      <div>
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Tutores</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tutores registrados del estudiante</p>
      </div>
      <Button
        variant="primary"
        size="sm"
        startIcon={<IconFA icon="plus" />}
        onClick={onAddTutor}
      >
        Agregar Tutor
      </Button>
    </div>
    <div className="border-t border-gray-100 dark:border-gray-800 p-2 sm:p-2">
      <div className="space-y-6">
        {tutors.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">No hay tutores registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tutors.map(tutor => (
              <div key={tutor.id} className="border rounded-md p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{tutor.full_name}</h3>
                    {tutor.is_primary && (
                      <Badge color="primary" size="sm">Principal</Badge>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">{tutor.relationship}</p>
                  <p className="text-sm mt-1">{tutor.phone}</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(tutor.id)}
                  >
                    Ver detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

const GradesChart = ({ grades }: { grades: Grade[] }) => {
  // Simulación simplificada de un gráfico de calificaciones
  return (
    <ComponentCard title="Calificaciones" desc="Calificaciones por materia y periodo" className="p-6">
      {grades.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No hay calificaciones registradas</p>
        </div>
      ) : (
        <div className="h-72">
          <div className="h-full flex items-end gap-2">
            {grades.map(grade => (
              <div key={grade.id} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-primary-500 rounded-t-md transition-all duration-500"
                  style={{
                    height: `${(grade.score / 10) * 80}%`,
                    backgroundColor: grade.score >= 8
                      ? '#10b981' // success
                      : grade.score >= 6
                        ? '#f59e0b' // warning
                        : '#ef4444' // danger
                  }}
                />
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium">{grade.subject}</p>
                  <p className="text-sm font-bold">{grade.score.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">{grade.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ComponentCard>
  );
};

const AttendanceWidget = ({ attendance }: { attendance: Student['attendance'] }) => {
  // Calcular porcentaje de asistencia
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'present').length;
  const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

  return (
    <ComponentCard title="Asistencia" desc="Registro de asistencia reciente" className="p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-32 h-32 relative">
          <div
            className="w-full h-full rounded-full flex items-center justify-center border-8"
            style={{
              borderColor: attendanceRate >= 90
                ? '#10b981' // success
                : attendanceRate >= 80
                  ? '#f59e0b' // warning
                  : '#ef4444', // danger
            }}
          >
            <span className="text-2xl font-bold">{Math.round(attendanceRate)}%</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Presente</span>
              </div>
              <span>{attendance.filter(a => a.status === 'present').length} días</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Retardo</span>
              </div>
              <span>{attendance.filter(a => a.status === 'late').length} días</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Ausente</span>
              </div>
              <span>{attendance.filter(a => a.status === 'absent').length} días</span>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

const BadgesWidget = ({ badges }: { badges: Student['badges'] }) => (
  <ComponentCard title="Insignias" desc="Logros y reconocimientos" className="p-6">
    {badges.length === 0 ? (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400">No hay insignias disponibles</p>
      </div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map(badge => (
          <div
            key={badge.id}
            className="flex flex-col items-center justify-center p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <IconFA
              icon={badge.icon}
              style="duotone"
              size="2xl"
              className="text-primary-500 mb-2"
            />
            <h3 className="font-medium text-center">{badge.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    )}
  </ComponentCard>
);

// Extraer el componente Page envuelto con la función use
function InnerStudentProfilePage({ id }: { id: string }) {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de datos del estudiante
    const loadStudent = async () => {
      setLoading(true);
      // En un caso real, aquí se haría la llamada a la API
      try {
        // Simulamos una carga de datos con 1 segundo de retraso
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Datos de ejemplo
        const studentData: Student = {
          id: parseInt(id),
          full_name: "Ana María López García",
          first_name: "Ana María",
          father_last_name: "López",
          mother_last_name: "García",
          curp: "LOGA010523MDFPRN03",
          email: "ana.lopez@example.com",
          phone: "555-123-4567",
          birth_date: "2001-05-23",
          gender: "Femenino",
          image_url: "/assets/images/avatars/student-female.png", // Cambiado a ruta local
          addresses: [
            {
              id: 1,
              street: "Av. Insurgentes Sur",
              exterior_number: "1234",
              interior_number: "301",
              neighborhood: "Del Valle",
              postal_code: "03100",
              reference: "Frente al parque",
              is_current: true,
              address_type: "home"
            },
            {
              id: 2,
              street: "Calle Reforma",
              exterior_number: "567",
              neighborhood: "Juárez",
              postal_code: "06600",
              is_current: false,
              address_type: "other"
            }
          ],
          tutors: [
            {
              id: 1,
              full_name: "Carlos López Martínez",
              relationship: "Padre",
              phone: "555-987-6543",
              is_primary: true,
              can_pickup: true
            },
            {
              id: 2,
              full_name: "Sofía García Hernández",
              relationship: "Madre",
              phone: "555-654-3210",
              is_primary: false,
              can_pickup: true
            }
          ],
          payments: [
            { id: 1, month: "Enero 2023", amount: 1500, payment_date: "2023-01-10", status: "paid" },
            { id: 2, month: "Febrero 2023", amount: 1500, payment_date: "2023-02-15", status: "paid" },
            { id: 3, month: "Marzo 2023", amount: 1500, payment_date: "2023-03-12", status: "paid" },
            { id: 4, month: "Abril 2023", amount: 1500, payment_date: "2023-04-10", status: "paid" },
            { id: 5, month: "Mayo 2023", amount: 1500, payment_date: null, status: "pending" },
            { id: 6, month: "Junio 2023", amount: 1500, payment_date: null, status: "overdue" }
          ],
          grades: [
            { id: 1, subject: "Matemáticas", period: "1er Periodo", score: 8.5 },
            { id: 2, subject: "Español", period: "1er Periodo", score: 9.0 },
            { id: 3, subject: "Historia", period: "1er Periodo", score: 7.5 },
            { id: 4, subject: "Ciencias", period: "1er Periodo", score: 8.0 },
            { id: 5, subject: "Matemáticas", period: "2do Periodo", score: 7.8 },
            { id: 6, subject: "Español", period: "2do Periodo", score: 9.2 },
            { id: 7, subject: "Historia", period: "2do Periodo", score: 8.5 },
            { id: 8, subject: "Ciencias", period: "2do Periodo", score: 8.3 }
          ],
          attendance: Array.from({ length: 30 }, (_, i) => {
            const randomValue = Math.random();
            let status: 'present' | 'absent' | 'late';

            if (randomValue < 0.8) status = 'present';
            else if (randomValue < 0.9) status = 'late';
            else status = 'absent';

            const date = new Date();
            date.setDate(date.getDate() - i);

            return {
              date: date.toISOString().split('T')[0],
              status
            };
          }),
          badges: [
            { id: 1, name: "Asistencia Perfecta", description: "30 días consecutivos de asistencia", icon: "award" },
            { id: 2, name: "Mejor de la Clase", description: "Calificación más alta en Español", icon: "trophy" },
            { id: 3, name: "Deportista", description: "Participación destacada en actividades deportivas", icon: "medal" },
            { id: 4, name: "Colaborador", description: "Ayuda constante a compañeros", icon: "handshake" }
          ]
        };

        setStudent(studentData);
      } catch (error) {
        console.error("Error cargando datos del estudiante:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  // Manejadores de eventos
  const handleEditPersonalInfo = () => {
    alert("Editar información personal");
  };

  const handleEditAddresses = () => {
    alert("Editar direcciones");
  };

  const handleAddTutor = () => {
    alert("Agregar tutor");
  };

  const handleViewTutorDetails = (id: number) => {
    alert(`Ver detalles del tutor con ID: ${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <IconFA icon="spinner" spin size="xl" className="text-primary-500" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <IconFA icon="exclamation-circle" size="xl" className="text-error-500 mb-4" />
        <h2 className="text-xl font-medium">Estudiante no encontrado</h2>
        <p className="text-gray-500 mt-2">No se pudo encontrar el estudiante con ID: {id}</p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => router.push('/admin-dashboard/admin-students')}
        >
          Volver a Estudiantes
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl md:p-6 pb-10">
      {/* Breadcrumb */}
      <PageBreadcrumb pageTitle="Perfil de Estudiante" />

      {/* Profile Header */}
      <ProfileHeader student={student} />

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Personal Information */}
          <PersonalInfoSection student={student} onEdit={handleEditPersonalInfo} />

          {/* Addresses */}
          <AddressesSection addresses={student.addresses} onEdit={handleEditAddresses} />

          {/* Payments */}
          <PaymentsSection payments={student.payments} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Tutors Section */}
          <TutorsSection
            tutors={student.tutors}
            onAddTutor={handleAddTutor}
            onViewDetails={handleViewTutorDetails}
          />

          {/* Badges Widget */}
          <BadgesWidget badges={student.badges} />
        </div>
      </div>

      {/* Metrics Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">Rendimiento Académico</h3>
        <MetricsChartsWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Grades Chart */}
            <GradesChart grades={student.grades} />

            {/* Attendance Widget */}
            <AttendanceWidget attendance={student.attendance} />
          </div>
        </MetricsChartsWrapper>
      </div>
    </div>
  );
}

// Componente principal que usa React.use() para obtener el id
export default function StudentProfilePage({ params }: { params: { id: string } }) {
  // En caso de problemas con React.use, puedes cambiar a este enfoque alternativo
  // const studentId = params.id;
  // if (studentId) return <InnerStudentProfilePage id={studentId} />;

  // Usar React.use() con conversiones de tipo para solucionar los errores de tipado
  const unwrappedParams = React.use(params as any) as { id: string };
  return <InnerStudentProfilePage id={unwrappedParams.id} />;
} 