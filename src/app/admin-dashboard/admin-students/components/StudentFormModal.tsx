// React
import { useState, useEffect } from 'react';

// Componentes UI
import IconFA from '@/components/ui/IconFA';
import { Modal } from '@/components/ui/modal';
import Alert from '@/components/core/alert/Alert';
import Button from '@/components/core/button/Button';

// Componentes de formulario
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';

// Types & Utils
import { Student, StudentFormData } from '../module-utils/types';

// Hooks
import { useStatusOptions } from '@/hooks/useStatusData';
import useGenderOptions from '@/hooks/useGenderOptions';

interface StudentFormModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onSave: (studentData: StudentFormData) => Promise<void>;
    readonly selectedStudent: Student | null;
    readonly isSaving: boolean;
}

interface AlertState {
    show: boolean;
    variant: 'warning' | 'error' | 'success' | 'info';
    title: string;
    message: string;
}

export default function StudentFormModal({
    isOpen,
    onClose,
    onSave,
    selectedStudent,
    isSaving
}: StudentFormModalProps) {
    // Opciones de género y estado
    const { options: genderOptions, isLoading: isLoadingGenders } = useGenderOptions();
    const { options: statusOptions, isLoading: isLoadingStatus } = useStatusOptions('student');

    // Estado del formulario
    const [studentForm, setStudentForm] = useState<StudentFormData>({
        first_name: '',
        father_last_name: '',
        mother_last_name: '',
        birth_date: '',
        gender_id: '',
        curp: '',
        phone: '',
        email: ''
    });

    // Estado de alertas
    const [alertState, setAlertState] = useState<AlertState>({
        show: false,
        variant: 'warning',
        title: '',
        message: ''
    });

    // Función para obtener el valor inicial del género
    const getInitialGender = () => {
        if (!selectedStudent || !genderOptions.length) return '';

        // Validar que exista gender_id en el estudiante
        if (selectedStudent.gender_id === undefined) return '';

        // Buscar la opción correspondiente en las opciones de género
        const genderId = selectedStudent.gender_id.toString();
        const option = genderOptions.find(opt => opt.value === genderId);
        return option ? option.value : '';
    };

    // Función para obtener el valor inicial del estado
    const getInitialStatus = () => {
        if (!selectedStudent || !statusOptions.length) return '';

        // Validar que exista status_id en el estudiante
        if (selectedStudent.status_id === undefined) return '';

        // Buscar la opción correspondiente en las opciones de estado
        const statusId = selectedStudent.status_id.toString();
        const option = statusOptions.find(opt => opt.value === statusId);
        return option ? option.value : '';
    };

    // Efecto para cerrar automáticamente la alerta después de 5 segundos
    useEffect(() => {
        if (alertState.show) {
            const timer = setTimeout(() => {
                setAlertState(prev => ({ ...prev, show: false }));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alertState.show]);

    // Efecto para inicializar el formulario
    useEffect(() => {
        if (isOpen) {
            if (selectedStudent) {
                // Modo edición
                setStudentForm({
                    id: selectedStudent.id,
                    first_name: selectedStudent.first_name,
                    father_last_name: selectedStudent.father_last_name,
                    mother_last_name: selectedStudent.mother_last_name || '',
                    birth_date: selectedStudent.birth_date,
                    gender_id: selectedStudent.gender_id.toString(),
                    curp: selectedStudent.curp,
                    phone: selectedStudent.phone || '',
                    email: selectedStudent.email || '',
                    status_id: selectedStudent.status_id.toString()
                });
            } else {
                // Modo creación
                setStudentForm({
                    first_name: '',
                    father_last_name: '',
                    mother_last_name: '',
                    birth_date: new Date().toISOString().split('T')[0],
                    gender_id: '',
                    curp: '',
                    phone: '',
                    email: '',
                    status_id: '7' // Valor por defecto: STUDENT_ACTIVE
                });
            }
        } else {
            resetForm();
        }
    }, [selectedStudent, isOpen, genderOptions, statusOptions]);

    // Reiniciar formulario
    function resetForm() {
        setStudentForm({
            first_name: '',
            father_last_name: '',
            mother_last_name: '',
            birth_date: '',
            gender_id: '',
            curp: '',
            phone: '',
            email: '',
            status_id: '7'
        });
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setStudentForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleSelectChange(field: string, value: string) {
        setStudentForm(prev => ({
            ...prev,
            [field]: value
        }));
    }

    async function handleSaveStudent() {
        // Validar campos requeridos
        if (!studentForm.first_name || !studentForm.father_last_name || !studentForm.birth_date ||
            !studentForm.gender_id || !studentForm.curp) {
            setAlertState({
                show: true,
                variant: 'error',
                title: 'Error',
                message: 'Por favor, complete todos los campos obligatorios.'
            });
            return;
        }

        // Validar CURP (18 caracteres)
        if (studentForm.curp.length !== 18) {
            setAlertState({
                show: true,
                variant: 'error',
                title: 'Error',
                message: 'La CURP debe tener exactamente 18 caracteres.'
            });
            return;
        }

        // Validar correo electrónico si se proporciona
        if (studentForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentForm.email)) {
            setAlertState({
                show: true,
                variant: 'error',
                title: 'Error',
                message: 'Por favor, ingrese un correo electrónico válido.'
            });
            return;
        }

        // Asegurarse de que status_id es un número
        if (studentForm.status_id && typeof studentForm.status_id === 'string') {
            studentForm.status_id = parseInt(studentForm.status_id, 10);
        }

        try {
            await onSave(studentForm);
        } catch (error: any) {
            setAlertState({
                show: true,
                variant: 'error',
                title: 'Error',
                message: error.message || 'Ocurrió un error al guardar el estudiante.'
            });
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-[700px] p-6 lg:p-10"
        >
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div className="mb-4">
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                        {selectedStudent ? "Editar estudiante" : "Registrar nuevo estudiante"}
                    </h5>

                    <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                        {selectedStudent
                            ? "Actualiza la información del estudiante en el sistema."
                            : "Completa el formulario para registrar un nuevo estudiante en el sistema."}
                    </p>
                </div>

                {alertState.show && (
                    <Alert
                        variant={alertState.variant}
                        title={alertState.title}
                        message={alertState.message}
                    />
                )}

                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                    {/* Nombres y apellidos */}
                    <div>
                        <Label htmlFor="first_name" className="font-outfit">
                            Nombre(s) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="first_name"
                            name="first_name"
                            type="text"
                            placeholder="Ej. Juan Carlos"
                            value={studentForm.first_name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="father_last_name" className="font-outfit">
                            Apellido Paterno <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="father_last_name"
                            name="father_last_name"
                            type="text"
                            placeholder="Ej. García"
                            value={studentForm.father_last_name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="mother_last_name" className="font-outfit">
                            Apellido Materno
                        </Label>
                        <Input
                            id="mother_last_name"
                            name="mother_last_name"
                            type="text"
                            placeholder="Ej. López"
                            value={studentForm.mother_last_name}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Fecha de nacimiento y género */}
                    <div>
                        <Label htmlFor="birth_date" className="font-outfit">
                            Fecha de Nacimiento <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="birth_date"
                            name="birth_date"
                            type="date"
                            value={studentForm.birth_date}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label className="font-outfit">
                            Género <span className="text-red-500">*</span>
                        </Label>

                        {isLoadingGenders ? (
                            <div className="flex items-center justify-center h-[38px] bg-gray-50 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                                <IconFA icon="spinner" spin className="text-gray-400" />
                            </div>
                        ) : (
                            <Select
                                key={`gender-select-${isOpen}-${selectedStudent?.id || 'new'}-${genderOptions.length}`}
                                options={genderOptions}
                                placeholder="Seleccione un género"
                                onChange={(value) => handleSelectChange('gender_id', value)}
                                defaultValue={getInitialGender()}
                            />
                        )}
                    </div>

                    {/* CURP */}
                    <div>
                        <Label htmlFor="curp" className="font-outfit">
                            CURP <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="curp"
                            name="curp"
                            type="text"
                            placeholder="Ej. GARC900101HDFRRD09"
                            value={studentForm.curp}
                            onChange={handleInputChange}
                            className="uppercase"
                            maxLength={18}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Debe tener exactamente 18 caracteres
                        </p>
                    </div>

                    {/* Información de contacto */}
                    <div>
                        <Label htmlFor="email" className="font-outfit">
                            Correo Electrónico
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Ej. estudiante@ejemplo.com"
                            value={studentForm.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="phone" className="font-outfit">
                            Teléfono
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Ej. 55 1234 5678"
                            value={studentForm.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Estado (solo para edición) */}
                    {selectedStudent && (
                        <div>
                            <Label className="font-outfit">
                                Estado
                            </Label>

                            {isLoadingStatus ? (
                                <div className="flex items-center justify-center h-[38px] bg-gray-50 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                                    <IconFA icon="spinner" spin className="text-gray-400" />
                                </div>
                            ) : (
                                <Select
                                    key={`status-select-${isOpen}-${selectedStudent?.id || 'new'}-${statusOptions.length}`}
                                    options={statusOptions}
                                    placeholder="Seleccione un estado"
                                    onChange={(value) => handleSelectChange('status_id', value)}
                                    defaultValue={getInitialStatus()}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleSaveStudent}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <IconFA icon="spinner" spin className="mr-2" />
                                <span className="font-outfit">Guardando...</span>
                            </>
                        ) : (
                            <span className="font-outfit">{selectedStudent ? "Actualizar Estudiante" : "Guardar Estudiante"}</span>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}