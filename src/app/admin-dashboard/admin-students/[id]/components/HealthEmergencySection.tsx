import React, { useState } from 'react';
import { EmergencyContact, MedicalInfo } from '../module-utils/types';
import ComponentCard from '@/components/common/ComponentCard';
import { IconFA } from '@/components/ui';

interface HealthEmergencySectionProps {
    medicalInfo?: MedicalInfo;
    emergencyContacts: EmergencyContact[];
    onAddContact: () => void;
    onUpdateMedicalInfo: (info: Partial<MedicalInfo>) => Promise<void>;
    onCallContact: (phone: string) => void;
    onSendSMS: (phone: string) => void;
}

const HealthEmergencySection: React.FC<HealthEmergencySectionProps> = ({
    medicalInfo,
    emergencyContacts,
    onAddContact,
    onUpdateMedicalInfo,
    onCallContact,
    onSendSMS
}) => {
    // Estado para control de edición
    const [isEditingMedical, setIsEditingMedical] = useState(false);
    const [updatedMedicalInfo, setUpdatedMedicalInfo] = useState<Partial<MedicalInfo>>(
        medicalInfo ? { ...medicalInfo } : {
            allergies: [],
            medicalConditions: '',
            bloodType: '',
            insurance: { provider: '', policyNumber: '' }
        }
    );

    // Manejo de campos
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'allergies') {
            // Convertir input de alergias separadas por comas a array
            setUpdatedMedicalInfo(prev => ({
                ...prev,
                allergies: value.split(',').map(item => item.trim()).filter(Boolean)
            }));
        } else if (name === 'provider' || name === 'policyNumber') {
            // Actualizar campos anidados del seguro
            setUpdatedMedicalInfo(prev => ({
                ...prev,
                insurance: {
                    ...prev.insurance,
                    [name]: value
                }
            }));
        } else {
            // Otros campos
            setUpdatedMedicalInfo(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Guardar cambios médicos
    const handleSaveMedicalInfo = async () => {
        try {
            await onUpdateMedicalInfo(updatedMedicalInfo);
            setIsEditingMedical(false);
        } catch (error) {
            console.error('Error al actualizar información médica:', error);
        }
    };

    return (
        <ComponentCard title="Salud y Contactos de Emergencia" desc="Información médica relevante y contactos en caso de emergencia">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Columna de información médica */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-800 dark:text-white">Información Médica</h3>
                        {!isEditingMedical ? (
                            <button
                                onClick={() => setIsEditingMedical(true)}
                                className="text-primary-500 hover:text-primary-600 text-sm flex items-center"
                            >
                                <IconFA icon="edit" className="mr-1" /> Editar
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setIsEditingMedical(false)}
                                    className="text-gray-500 hover:text-gray-600 text-sm flex items-center"
                                >
                                    <IconFA icon="times" className="mr-1" /> Cancelar
                                </button>
                                <button
                                    onClick={handleSaveMedicalInfo}
                                    className="text-primary-500 hover:text-primary-600 text-sm flex items-center"
                                >
                                    <IconFA icon="check" className="mr-1" /> Guardar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Alergias */}
                    <div>
                        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">ALERGIAS</h4>
                        {isEditingMedical ? (
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="allergies"
                                    value={updatedMedicalInfo.allergies?.join(', ') || ''}
                                    onChange={handleInputChange}
                                    placeholder="Ingresa alergias separadas por comas"
                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm py-2"
                                />
                                <p className="text-xs text-gray-500 mt-1">Separa múltiples alergias con comas</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {medicalInfo?.allergies && medicalInfo.allergies.length > 0 ? (
                                    medicalInfo.allergies.map((allergy, index) => (
                                        <span
                                            key={index}
                                            className="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-md text-sm"
                                        >
                                            {allergy}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-400 text-sm">No se han registrado alergias</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Condiciones médicas */}
                    <div>
                        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">CONDICIONES MÉDICAS</h4>
                        {isEditingMedical ? (
                            <textarea
                                name="medicalConditions"
                                value={updatedMedicalInfo.medicalConditions || ''}
                                onChange={handleInputChange}
                                placeholder="Describe condiciones médicas relevantes"
                                className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm py-2 min-h-[80px]"
                            />
                        ) : (
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                {medicalInfo?.medicalConditions || "No se han registrado condiciones médicas"}
                            </div>
                        )}
                    </div>

                    {/* Tipo de sangre */}
                    <div>
                        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">TIPO DE SANGRE</h4>
                        {isEditingMedical ? (
                            <select
                                name="bloodType"
                                value={updatedMedicalInfo.bloodType || ''}
                                onChange={(e) => setUpdatedMedicalInfo(prev => ({ ...prev, bloodType: e.target.value }))}
                                className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm py-2"
                            >
                                <option value="">Seleccionar tipo de sangre</option>
                                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                {medicalInfo?.bloodType || "No especificado"}
                            </div>
                        )}
                    </div>

                    {/* Seguro médico */}
                    <div>
                        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">SEGURO MÉDICO</h4>
                        {isEditingMedical ? (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Proveedor</label>
                                    <input
                                        type="text"
                                        name="provider"
                                        value={updatedMedicalInfo.insurance?.provider || ''}
                                        onChange={handleInputChange}
                                        placeholder="Nombre del seguro"
                                        className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm py-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Número de póliza</label>
                                    <input
                                        type="text"
                                        name="policyNumber"
                                        value={updatedMedicalInfo.insurance?.policyNumber || ''}
                                        onChange={handleInputChange}
                                        placeholder="Número de póliza"
                                        className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm py-2"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-xs text-gray-500">PROVEEDOR</p>
                                        <p>{medicalInfo?.insurance?.provider || "No disponible"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">PÓLIZA</p>
                                        <p>{medicalInfo?.insurance?.policyNumber || "No disponible"}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Columna de contactos de emergencia */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-800 dark:text-white">Contactos de Emergencia</h3>
                        <button
                            onClick={onAddContact}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                        >
                            <IconFA icon="plus" className="mr-1" /> Añadir
                        </button>
                    </div>

                    {emergencyContacts.length > 0 ? (
                        <div className="space-y-4">
                            {emergencyContacts.map(contact => (
                                <div
                                    key={contact.id}
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                                >
                                    <div className="flex justify-between">
                                        <h4 className="font-medium">{contact.name}</h4>
                                        <p className="text-sm text-gray-500">{contact.relationship}</p>
                                    </div>

                                    <p className="text-sm my-2">{contact.phone}</p>

                                    <div className="flex space-x-2 mt-3">
                                        <button
                                            onClick={() => onCallContact(contact.phone)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                                        >
                                            <IconFA icon="phone" className="mr-1" /> Llamar
                                        </button>
                                        <button
                                            onClick={() => onSendSMS(contact.phone)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                                        >
                                            <IconFA icon="comment-sms" className="mr-1" /> SMS
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                            <IconFA icon="user-plus" className="text-gray-400 mb-2" size="xl" />
                            <p className="text-gray-500 dark:text-gray-400">No hay contactos de emergencia</p>
                            <button
                                onClick={onAddContact}
                                className="mt-3 bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-md text-sm"
                            >
                                Agregar contacto
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ComponentCard>
    );
};

export default HealthEmergencySection; 