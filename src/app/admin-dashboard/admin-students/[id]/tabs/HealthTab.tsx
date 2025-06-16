import React from 'react';
import HealthEmergencySection from '../components/health/HealthEmergencySection';
import { EmergencyContact, MedicalInfo } from '../module-utils/types';

interface HealthTabProps {
    medicalInfo: MedicalInfo;
    emergencyContacts: EmergencyContact[];
    onAddContact: () => void;
    onUpdateMedicalInfo: (info: Partial<MedicalInfo>) => Promise<void>;
    onCallContact: (phone: string) => void;
    onSendSMS: (phone: string) => void;
}

const HealthTab: React.FC<HealthTabProps> = ({
    medicalInfo,
    emergencyContacts,
    onAddContact,
    onUpdateMedicalInfo,
    onCallContact,
    onSendSMS
}) => {
    return (
        <HealthEmergencySection
            medicalInfo={medicalInfo}
            emergencyContacts={emergencyContacts}
            onAddContact={onAddContact}
            onUpdateMedicalInfo={onUpdateMedicalInfo}
            onCallContact={onCallContact}
            onSendSMS={onSendSMS}
        />
    );
};

export default HealthTab; 