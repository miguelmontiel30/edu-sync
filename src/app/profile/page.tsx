'use client';

// React
import React, {useState, ChangeEvent} from 'react';

// Next.js
// import {useRouter} from 'next/navigation'; // Comentado si no se usa directamente

// Components
// import ComponentCard from '@/components/common/ComponentCard'; // Comentado si no se usa
// import PageBreadcrumb from '@/components/common/PageBreadCrumb'; // Se usará un breadcrumb simple o importa el tuyo
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/core/button/Button';
import IconFA from '@/components/ui/IconFA';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

// --- Inicio: Componente ProfileAvatar Placeholder ---
// ¡IMPORTANTE! Reemplaza esto con la importación de tu componente real ProfileAvatar
// Ejemplo: import ProfileAvatar from '@/components/core/ProfileAvatar';
interface ProfileAvatarProps {
  size: "sm" | "md" | "lg" | string; // Permitir string para tamaños como "xl", "2xl", etc.
  name: string;
  imageUrl?: string;
  className?: string;
  // Añade otras props que tu componente ProfileAvatar pueda necesitar (e.g., onClick, editIcon)
}
const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ size, name, imageUrl, className }) => {
  // Lógica simplificada para el placeholder
  const sizeMap: Record<string, string> = {
    sm: "w-32 h-32 text-4xl", // Tamaño original de ProfileSidebar
    md: "w-20 h-20 text-2xl",
    lg: "w-24 h-24 text-3xl",
    xl: "w-40 h-40 text-5xl",
  };
  const currentSizeClass = sizeMap[size as string] || "w-32 h-32 text-4xl"; // Default a 'sm' si el tamaño no está en map

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={name} 
        className={`rounded-full object-cover ${currentSizeClass} ${className || ''}`}
      />
    );
  }
  return (
    <div 
      className={`rounded-full flex items-center justify-center bg-purple-500 text-white font-semibold ${currentSizeClass} ${className || ''}`}
    >
      {initials}
    </div>
  );
};
// --- Fin: Componente ProfileAvatar Placeholder ---

// Context
// import {useAuth} from '@/context/AuthContext'; // Comentado si no se usa

// Services
// import {supabaseClient} from '@/services/config/supabaseClient'; // Comentado si no se usa

const fakeStudentProfileData = {
  userId: 1,
  studentId: 'S2400123',
  userEmail: 'gabi.richardson@example.com',
  firstName: 'Gabriela',
  fatherLastName: 'Richardson',
  motherLastName: 'Smith',
  birthDate: '1999-03-12',
  genderId: 2,
  curp: 'RICS990312MDFLN01',
  phone: '555-0123-4567',
  contactEmail: 'contact.gabi@example.net',
  imageUrl: 'https://via.placeholder.com/256/C5B4E3/4A4A4A?Text=GR',
  currentAddress: {
    addressLine: 'Evergreen Meadows 12345',
    city: 'Springfield',
    postalCode: '90210',
    isPrimary: true,
  },
};

const fakeGenders = [
  { gender_id: 1, name: 'Masculino' },
  { gender_id: 2, name: 'Femenino' },
  { gender_id: 3, name: 'Otro' },
  { gender_id: 4, name: 'Prefiero no decirlo' },
];

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { children: React.ReactNode; }
const Card = ({ children, className, ...props }: CardProps) => (
  <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl ${className || ''}`} {...props}>{children}</div>
);
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> { children: React.ReactNode; }
const CardHeader = ({ children, className, ...props }: CardHeaderProps) => (
  <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className || ''}`} {...props}>{children}</div>
);
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { children: React.ReactNode; }
const CardTitle = ({ children, className, ...props }: CardTitleProps) => (
  <h3 className={`text-xl font-semibold text-gray-900 dark:text-white ${className || ''}`} {...props}>{children}</h3>
);
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> { children: React.ReactNode; }
const CardDescription = ({ children, className, ...props }: CardDescriptionProps) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${className || ''}`} {...props}>{children}</p>
);
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> { children: React.ReactNode; }
const CardContent = ({ children, className, ...props }: CardContentProps) => (
  <div className={`p-6 ${className || ''}`} {...props}>{children}</div>
);

function PersonalInfoForm() {
  const [userData, setUserData] = useState({
    firstName: fakeStudentProfileData.firstName,
    fatherLastName: fakeStudentProfileData.fatherLastName,
    motherLastName: fakeStudentProfileData.motherLastName,
    contactEmail: fakeStudentProfileData.contactEmail,
    phone: fakeStudentProfileData.phone,
    birthDate: fakeStudentProfileData.birthDate,
    curp: fakeStudentProfileData.curp,
    genderId: fakeStudentProfileData.genderId,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: name === 'genderId' ? parseInt(value, 10) : value }));
  };

    return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Información Personal</CardTitle>
          <Button variant="outline" size="sm" className="p-1.5 h-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <IconFA icon="ellipsis-h" />
          </Button>
        </div>
        <CardDescription>Actualiza tu información personal y de contacto.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <Label htmlFor="firstName">Nombre(s)</Label>
            <Input id="firstName" name="firstName" type="text" value={userData.firstName} onChange={handleInputChange} startIcon={<IconFA icon="user" className="text-gray-400"/>} />
          </div>
                            <div>
            <Label htmlFor="fatherLastName">Apellido Paterno</Label>
            <Input id="fatherLastName" name="fatherLastName" type="text" value={userData.fatherLastName} onChange={handleInputChange} startIcon={<IconFA icon="user" className="text-gray-400"/>} />
                                    </div>
          <div>
            <Label htmlFor="motherLastName">Apellido Materno (Opcional)</Label>
            <Input id="motherLastName" name="motherLastName" type="text" value={userData.motherLastName} onChange={handleInputChange} startIcon={<IconFA icon="user" className="text-gray-400"/>} />
                                </div>
          <div>
            <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
            <Input id="birthDate" name="birthDate" type="date" value={userData.birthDate} onChange={handleInputChange} startIcon={<IconFA icon="calendar-alt" className="text-gray-400" />} />
                            </div>
                            <div>
            <Label htmlFor="curp">CURP</Label>
            <Input id="curp" name="curp" type="text" value={userData.curp} onChange={handleInputChange} startIcon={<IconFA icon="id-card" className="text-gray-400"/>} />
          </div>
                                <div className="relative">
            <Label htmlFor="genderId">Género</Label>
            <select 
                id="genderId" 
                name="genderId" 
                value={userData.genderId} 
                                        onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500 pl-10"
            >
                <option value="" disabled>Selecciona un género</option>
                {fakeGenders.map(gender => (
                    <option key={gender.gender_id} value={gender.gender_id}>{gender.name}</option>
                ))}
            </select>
             <div className="pointer-events-none absolute inset-y-0 left-0 top-7 flex items-center pl-3">
                 <IconFA icon="venus-mars" className="text-gray-400 h-5 w-5" />
                                </div>
                            </div>
                            <div>
            <Label htmlFor="contactEmail">Email de Contacto</Label>
            <Input id="contactEmail" name="contactEmail" type="email" value={userData.contactEmail} onChange={handleInputChange} startIcon={<IconFA icon="envelope" className="text-gray-400"/>} />
                                    </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" type="tel" value={userData.phone} onChange={handleInputChange} startIcon={<IconFA icon="phone" className="text-gray-400"/>} />
                                </div>
                            </div>
      </CardContent>
    </Card>
  );
}

function UserAccountInfo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Información de Cuenta</CardTitle>
          <Button variant="outline" size="sm" className="p-1.5 h-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <IconFA icon="shield-alt" />
          </Button>
                        </div>
        <CardDescription>Detalles de tu cuenta de usuario y seguridad.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
                                <div>
          <Label htmlFor="userLoginEmail">Email de Acceso (Login)</Label>
          {/* Si tu componente Input tiene una prop para solo lectura como `readOnly` o `disabled`, úsala aquí. */}
          {/* Ejemplo: <Input ... readOnly /> o <Input ... disabled /> */}
          <Input id="userLoginEmail" name="userLoginEmail" type="email" value={fakeStudentProfileData.userEmail} className="bg-gray-100 dark:bg-gray-700/50" startIcon={<IconFA icon="at" className="text-gray-400"/>} />
                                </div>
                                <div>
            <Button variant="outline" className="w-full sm:w-auto">
                <IconFA icon="key" className="mr-2" />
                Cambiar Contraseña
            </Button>
                                        </div>
      </CardContent>
    </Card>
  );
}

function ProfileSidebar() {
  const [userImage, setUserImage] = useState(fakeStudentProfileData.imageUrl);
  const fullName = `${fakeStudentProfileData.firstName} ${fakeStudentProfileData.fatherLastName}`.trim();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setUserImage(e.target?.result as string);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="text-center p-6">
        <CardContent className="p-0 flex flex-col items-center">
          <div className="relative mb-4 group">
            <ProfileAvatar 
              size="xl"
              name={`${fakeStudentProfileData.firstName} ${fakeStudentProfileData.fatherLastName}`} 
              className="border-4 border-white dark:border-gray-700 shadow-lg" 
            />
            <label 
              htmlFor="profileImageUpload"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              <IconFA icon="camera" size="xl" className="text-white" />
            </label>
            <input 
              type="file" 
              id="profileImageUpload" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
            />
            <Button 
              variant="primary"
              size="sm"
              className="absolute bottom-0 right-0 w-9 h-9 p-0 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-gray-800 hover:bg-purple-700"
              onClick={() => document.getElementById('profileImageUpload')?.click()} 
              aria-label="Change profile picture"
            >
              <IconFA icon="pencil-alt" size="sm" />
            </Button>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{fullName}</h2>
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{fakeStudentProfileData.studentId}</p>
          <div className="mt-3">
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">Estudiante</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center"><IconFA icon="map-marker-alt" className="mr-2 text-purple-500"/> Ubicación Principal</CardTitle>
           <Button variant="outline" size="sm" className="p-1.5 h-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <IconFA icon="plus" />
          </Button>
        </CardHeader>
        <CardContent>
          {fakeStudentProfileData.currentAddress ? (
                                <div>
              <p className="text-gray-800 dark:text-gray-200 text-sm">{fakeStudentProfileData.currentAddress.addressLine}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{fakeStudentProfileData.currentAddress.city}, CP {fakeStudentProfileData.currentAddress.postalCode}</p>
                                        </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay dirección principal registrada.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="flex items-center"><IconFA icon="map-signs" className="mr-2 text-purple-500"/> Direcciones</CardTitle>
                <Button variant="outline" size="sm" className="p-1.5 h-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 gap-1">
                    <IconFA icon="plus" /> Nueva
                </Button>
                                    </div>
            <CardDescription>Administra tus direcciones guardadas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {[fakeStudentProfileData.currentAddress, {addressLine: '123 Other St, Worksville', city:'Metropolis', postalCode:'60606', isPrimary: false}].map((addr, index) => addr && (
            <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-medium text-sm text-gray-800 dark:text-white">{addr.addressLine}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{addr.city}{addr.postalCode ? `, CP ${addr.postalCode}` : ''} {addr.isPrimary ? <span className="text-green-600 dark:text-green-400">(Principal)</span> : ''}</p>
                                </div>
                    <Button variant="outline" size="sm" className="p-1 h-auto text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                        <IconFA icon="pencil-alt" />
                            </Button>
                        </div>
            </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

const tabs = [
  { name: 'Información de Perfil', value: 'information' }, // Nombre actualizado para claridad
  { name: 'Configuración de Cuenta', value: 'account-setting' },
  { name: 'Suscripción y Pagos', value: 'subscription-payments' },
  { name: 'Notificaciones', value: 'notifications' },
  { name: 'Seguridad', value: 'account-security' },
  { name: 'Cerrar Cuenta', value: 'close-account' },
];

function ProfileTabs() {
  const [currentTab, setCurrentTab] = useState('information'); // Default a 'information'

  return (
    <div className="mb-6">
      {/* Idealmente, aquí usarías tu componente TabsCore */}
      

      {/* Contenido de las pestañas */}
      {currentTab === 'information' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 order-first lg:order-first">
              <ProfileSidebar />
            </div>
            <div className="lg:col-span-2 space-y-6 order-last lg:order-last">
              <PersonalInfoForm />
              <UserAccountInfo /> 
            </div>
          </div>
      )}
      {currentTab === 'account-setting' && <div className="p-4"><Card><CardContent><p className="text-gray-700 dark:text-gray-300">Contenido de Configuración de Cuenta (Placeholder).</p></CardContent></Card></div>}
      {currentTab === 'subscription-payments' && <div className="p-4"><Card><CardContent><p className="text-gray-700 dark:text-gray-300">Contenido de Suscripción y Pagos (Placeholder).</p></CardContent></Card></div>}
      {currentTab === 'notifications' && <div className="p-4"><Card><CardContent><p className="text-gray-700 dark:text-gray-300">Contenido de Notificaciones (Placeholder).</p></CardContent></Card></div>}
      {currentTab === 'account-security' && <div className="p-4"><Card><CardContent><p className="text-gray-700 dark:text-gray-300">Contenido de Seguridad de la Cuenta (Placeholder).</p></CardContent></Card></div>}
      {currentTab === 'close-account' && <div className="p-4"><Card><CardContent><p className="text-red-600 dark:text-red-400">Contenido para Cerrar Cuenta (Placeholder).</p></CardContent></Card></div>}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-screen-2xl md:p-6">
    {/* Breadcrumb */}
    <PageBreadcrumb pageTitle="Estudiantes" />

        

    <ProfileTabs /> 
      
      <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
         <Button variant="outline" className="w-full sm:w-auto">Cancelar</Button>
         <Button variant="primary" className="w-full sm:w-auto">Guardar Cambios</Button>
      </div>
    </div>
    );
}
