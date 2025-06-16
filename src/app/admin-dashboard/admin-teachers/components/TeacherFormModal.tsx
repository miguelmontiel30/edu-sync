import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/core/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import IconFA from '@/components/ui/IconFA';
import { Teacher, TeacherForm } from './types';
import { loadGenders } from './services';

interface TeacherFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (teacherData: TeacherForm) => void;
    selectedTeacher: Teacher | null;
    isSaving: boolean;
}

export default function TeacherFormModal({
    isOpen,
    onClose,
    onSave,
    selectedTeacher,
    isSaving,
}: TeacherFormModalProps) {
    // Estado para el formulario
    const [formData, setFormData] = useState<TeacherForm>({
        first_name: '',
        father_last_name: '',
        mother_last_name: '',
        birth_date: '',
        gender_id: 0,
        curp: '',
        email: '',
        phone: '',
        image_url: '',
    });

    // Estado para géneros
    const [genders, setGenders] = useState<{ gender_id: number; name: string }[]>([]);
    const [isLoadingGenders, setIsLoadingGenders] = useState(false);

    // Cargar géneros al montar el componente
    useEffect(() => {
        async function fetchGenders() {
            setIsLoadingGenders(true);
            try {
                const data = await loadGenders();
                setGenders(data);
            } catch (error) {
                console.error('Error al cargar géneros:', error);
            } finally {
                setIsLoadingGenders(false);
            }
        }

        fetchGenders();
    }, []);

    // Actualizar el formulario cuando cambia el profesor seleccionado
    useEffect(() => {
        if (selectedTeacher) {
            setFormData({
                first_name: selectedTeacher.first_name,
                father_last_name: selectedTeacher.father_last_name,
                mother_last_name: selectedTeacher.mother_last_name || '',
                birth_date: selectedTeacher.birth_date,
                gender_id: selectedTeacher.gender_id,
                curp: selectedTeacher.curp || '',
                email: selectedTeacher.email || '',
                phone: selectedTeacher.phone || '',
                image_url: selectedTeacher.image_url || '',
            });
        } else {
            // Resetear el formulario
            setFormData({
                first_name: '',
                father_last_name: '',
                mother_last_name: '',
                birth_date: '',
                gender_id: 0,
                curp: '',
                email: '',
                phone: '',
                image_url: '',
            });
        }
    }, [selectedTeacher]);

    // Manejar cambios en los campos del formulario
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Convertir gender_id a número si es necesario
        if (name === 'gender_id') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Manejar cambios en los campos del Select
    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, gender_id: parseInt(value, 10) }));
    };

    // Manejar el envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-6 lg:p-10">
            <div className="custom-scrollbar flex flex-col overflow-y-auto px-2">
                <div>
                    <h5 className="modal-title mb-2 font-outfit text-theme-xl font-semibold text-gray-800 dark:text-white/90 lg:text-2xl">
                        {selectedTeacher ? 'Editar profesor' : 'Define un nuevo profesor'}
                    </h5>
                    <p className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                        Ingresa la información del profesor para registrarlo en el sistema.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Nombre */}
                        <div>
                            <Label htmlFor="first_name">Nombre</Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                placeholder="Nombre(s)"
                                className="w-full"
                            />
                        </div>

                        {/* Apellido Paterno */}
                        <div>
                            <Label htmlFor="father_last_name">Apellido Paterno</Label>
                            <Input
                                id="father_last_name"
                                name="father_last_name"
                                value={formData.father_last_name}
                                onChange={handleInputChange}
                                placeholder="Apellido paterno"
                                className="w-full"
                            />
                        </div>

                        {/* Apellido Materno */}
                        <div>
                            <Label htmlFor="mother_last_name">Apellido Materno</Label>
                            <Input
                                id="mother_last_name"
                                name="mother_last_name"
                                value={formData.mother_last_name}
                                onChange={handleInputChange}
                                placeholder="Apellido materno (opcional)"
                                className="w-full"
                            />
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div>
                            <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
                            <Input
                                id="birth_date"
                                name="birth_date"
                                type="date"
                                value={formData.birth_date}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>

                        {/* Género */}
                        <div>
                            <Label htmlFor="gender_id">Género</Label>
                            {isLoadingGenders ? (
                                <div className="flex h-10 items-center space-x-2">
                                    <IconFA icon="spinner" spin className="text-gray-400" />
                                    <span className="text-sm text-gray-500">
                                        Cargando géneros...
                                    </span>
                                </div>
                            ) : (
                                <Select
                                    options={[
                                        { value: '', label: 'Selecciona un género' },
                                        ...genders.map(g => ({
                                            value: g.gender_id.toString(),
                                            label: g.name,
                                        })),
                                    ]}
                                    onChange={handleSelectChange}
                                    defaultValue={formData.gender_id.toString()}
                                    placeholder="Selecciona un género"
                                />
                            )}
                        </div>

                        {/* CURP */}
                        <div>
                            <Label htmlFor="curp">CURP</Label>
                            <Input
                                id="curp"
                                name="curp"
                                value={formData.curp}
                                onChange={handleInputChange}
                                placeholder="CURP (opcional)"
                                className="w-full"
                                maxLength={18}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Correo electrónico"
                                className="w-full"
                            />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Número telefónico"
                                className="w-full"
                            />
                        </div>

                        {/* URL de Imagen */}
                        <div>
                            <Label htmlFor="image_url">URL de Imagen</Label>
                            <Input
                                id="image_url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleInputChange}
                                placeholder="URL de la imagen de perfil"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="modal-footer mt-6 flex items-center gap-3 sm:justify-end">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="sm:w-auto"
                            disabled={isSaving}
                        >
                            <span className="font-outfit">Cancelar</span>
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="sm:w-auto"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <IconFA icon="spinner" spin className="mr-2" />
                                    <span className="font-outfit">Guardando...</span>
                                </>
                            ) : (
                                <span className="font-outfit">
                                    {selectedTeacher ? 'Actualizar Profesor' : 'Crear Profesor'}
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
