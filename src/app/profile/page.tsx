'use client';

// React
import React, {useState} from 'react';

// Next.js
import {useRouter} from 'next/navigation';

// Components
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/core/button/Button';

// Context
import {useAuth} from '@/context/AuthContext';

// Services
import {supabaseClient} from '@/services/config/supabaseClient';

export default function ProfilePage() {
    const {profile} = useAuth();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        email: profile?.email || '',
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Actualizar datos del perfil
            const {error: updateError} = await supabaseClient
                .from('users')
                .update({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                })
                .eq('user_id', profile?.user_id);

            if (updateError) throw updateError;

            // Si se proporcionó una nueva contraseña, actualizarla
            if (formData.new_password) {
                if (formData.new_password !== formData.confirm_password) {
                    throw new Error('Las contraseñas no coinciden');
                }

                const {error: passwordError} = await supabaseClient.auth.updateUser({
                    password: formData.new_password,
                });

                if (passwordError) throw passwordError;
            }

            // Limpiar campos de contraseña
            setFormData(prev => ({
                ...prev,
                current_password: '',
                new_password: '',
                confirm_password: '',
            }));

            // Recargar la página para mostrar los cambios
            router.refresh();
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            alert('Error al actualizar el perfil. Por favor, intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!profile) return null;

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <PageBreadcrumb pageTitle="Mi Perfil" />
            <div className="grid grid-cols-1 gap-6">
                <ComponentCard title="Información Personal" className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label htmlFor="first_name">Nombre(s)</Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="fa-duotone fa-user h-5 w-5 text-gray-400"></i>
                                    </div>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        className="w-full pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="last_name">Apellidos</Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="fa-duotone fa-user h-5 w-5 text-gray-400"></i>
                                    </div>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        className="w-full pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="fa-duotone fa-envelope h-5 w-5 text-gray-400"></i>
                                    </div>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                Cambiar Contraseña
                            </h3>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="current_password">Contraseña Actual</Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <i className="fa-duotone fa-lock h-5 w-5 text-gray-400"></i>
                                        </div>
                                        <Input
                                            id="current_password"
                                            name="current_password"
                                            type="password"
                                            value={formData.current_password}
                                            onChange={handleInputChange}
                                            className="w-full pl-10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="new_password">Nueva Contraseña</Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <i className="fa-duotone fa-lock h-5 w-5 text-gray-400"></i>
                                        </div>
                                        <Input
                                            id="new_password"
                                            name="new_password"
                                            type="password"
                                            value={formData.new_password}
                                            onChange={handleInputChange}
                                            className="w-full pl-10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="confirm_password">
                                        Confirmar Nueva Contraseña
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <i className="fa-duotone fa-lock h-5 w-5 text-gray-400"></i>
                                        </div>
                                        <Input
                                            id="confirm_password"
                                            name="confirm_password"
                                            type="password"
                                            value={formData.confirm_password}
                                            onChange={handleInputChange}
                                            className="w-full pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="primary" disabled={isSaving} className="min-w-[120px]">
                                {isSaving ? (
                                    <>
                                        <i className="fa-duotone fa-solid fa-spinner fa-spin mr-2"></i>
                                        <span className="font-outfit">Guardando...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-duotone fa-save mr-2"></i>
                                        <span className="font-outfit">Guardar Cambios</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}
