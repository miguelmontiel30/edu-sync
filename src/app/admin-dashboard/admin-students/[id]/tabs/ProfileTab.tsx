import React from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import { BadgesWidget } from '../components/widgets/BadgesWidget';
import PersonalInfoSection from '../components/profile/PersonalInfoSection';
import AddressesSection from '../components/profile/AddressesSection';
import TutorsSection from '../components/profile/TutorsSection';
import { Student, Address, Tutor } from '../module-utils/types';

interface ProfileTabProps {
    student: Student | null;
    addresses: Address[];
    tutors: Tutor[];
    onEdit: () => void;
    onEditAddresses: (data: any) => void;
    onAddTutor: (data: any) => void;
    onViewTutorDetails: (id: number) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
    student,
    addresses,
    tutors,
    onEdit,
    onEditAddresses,
    onAddTutor,
    onViewTutorDetails
}) => {
    if (!student) return null;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Columna izquierda */}
            <div className="xl:col-span-1 space-y-6">
                {/* Perfil del estudiante */}
                <ProfileHeader student={student} />

                {/* Insignias y reconocimientos */}
                <BadgesWidget />
            </div>

            {/* Columna derecha */}
            <div className="xl:col-span-3 space-y-6">
                {/* Información personal */}
                <PersonalInfoSection
                    student={student}
                    onEdit={onEdit}
                />

                {/* Direcciones */}
                <AddressesSection
                    addresses={addresses}
                    onEdit={onEditAddresses}
                />

                {/* Tutores */}
                <TutorsSection
                    tutors={tutors}
                    onAddTutor={onAddTutor}
                    onViewTutorDetails={(id) => onViewTutorDetails(Number(id))}
                />
            </div>
        </div>
    );
};

export default ProfileTab; 