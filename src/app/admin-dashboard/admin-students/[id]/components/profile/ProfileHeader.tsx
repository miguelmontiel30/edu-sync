// Components
import IconFA from '@/components/ui/IconFA';
import { ProfileAvatar } from '@/components/core/avatar';
import ComponentCard from '@/components/common/ComponentCard';

// Types
import { Student } from '../../module-utils/types';

/**
 * Componente para mostrar el encabezado del perfil del estudiante
 * @param {Student} student - Estudiante a mostrar
 * @returns {JSX.Element} Componente de encabezado del perfil del estudiante
 */
const ProfileHeader: React.FC<{ student: Student }> = ({ student }) => {
    return (
        <>
            <ComponentCard className='p-5'>
                {/* Información del perfil */}
                <div className="flex flex-col items-center text-center">
                    <ProfileAvatar
                        imageUrl={student.avatar_url}
                        name={student.full_name}
                        size="2xl"
                        className="mb-4"
                    />

                    <h1 className="text-xl font-outfit font-semibold text-gray-800 dark:text-white/90 mb-2">
                        {student.full_name}
                    </h1>

                    <div className="flex flex-col gap-2 w-full text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2 justify-center">
                            <IconFA icon="envelope" className="text-gray-400" />
                            <span className="truncate">{student.email || 'Sin correo'}</span>
                        </div>

                        <div className="flex items-center gap-2 justify-center">
                            <IconFA icon="phone" className="text-gray-400" />
                            <span>{student.phone || 'Sin teléfono'}</span>
                        </div>

                        <div className="flex items-center gap-2 justify-center">
                            <IconFA icon="calendar" className="text-gray-400" />
                            <span>{student.birth_date ? new Date(student.birth_date).toLocaleDateString('es-MX') : 'No disponible'}</span>
                        </div>
                    </div>
                </div>
            </ComponentCard>
        </>
    );
};

export default ProfileHeader; 