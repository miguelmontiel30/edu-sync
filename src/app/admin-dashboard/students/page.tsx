'use client';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import React from 'react';

export default function FormElements() {
    const handleSelectChangeGenero = (value: string) => {
        console.log('Selected value:', value);
    };

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <PageBreadcrumb pageTitle="Añadir nuevo alumno" />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ComponentCard title="Detalles del Alumno" className={`p-4`}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label>Nombre</Label>
                            <Input placeholder="Ingrese el nombre del alumno" />
                        </div>

                        <div>
                            <Label>Apellido paterno</Label>
                            <Input placeholder="Ingrese el apellido paterno del alumno" />
                        </div>

                        <div>
                            <Label>Apellido materno</Label>
                            <Input placeholder="Ingrese el apellido materno del alumno" />
                        </div>

                        <div>
                            <Label htmlFor="datePicker">Fecha de Nacimiento</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    id="datePicker"
                                    name="datePicker"
                                    onChange={e => {
                                        console.log(e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Género</Label>
                            <Select
                                options={[
                                    {value: 'masculino', label: 'Masculino'},
                                    {value: 'femenino', label: 'Femenino'},
                                ]}
                                placeholder="Selecciona una opción"
                                onChange={handleSelectChangeGenero}
                                className="dark:bg-dark-900"
                            />
                        </div>

                        <div>
                            <Label>CURP</Label>
                            <Input placeholder="Ingrese CURP del alumno" />
                        </div>
                    </div>
                </ComponentCard>

                <ComponentCard title="Dirección del Alumno" className={`p-4`}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label>Calle</Label>
                            <Input placeholder="Dirección completa" />
                        </div>

                        <div>
                            <Label>Colonia</Label>
                            <Input placeholder="Dirección completa" />
                        </div>

                        <div>
                            <Label>No. Interior</Label>
                            <Input placeholder="Dirección completa" />
                        </div>

                        <div>
                            <Label>No. Exterior</Label>
                            <Input placeholder="Dirección completa" />
                        </div>

                        <div>
                            <Label>C.P.</Label>
                            <Input placeholder="Dirección completa" />
                        </div>

                        <div>
                            <Label>Referencia</Label>
                            <TextArea placeholder="Dirección completa" />
                        </div>
                    </div>
                </ComponentCard>

                <ComponentCard title="Contacto" className={`p-4`}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label>Teléfono</Label>
                            <Input placeholder="Número de contacto" />
                        </div>

                        <div>
                            <Label>Correo Electrónico</Label>
                            <Input placeholder="Correo electrónico" />
                        </div>

                        <div>
                            <Label>Grado o Nivel a Ingresar</Label>
                            <Input placeholder="Ej. 3° primaria" />
                        </div>

                        <div>
                            <Label>Nombre del Tutor</Label>
                            <Input placeholder="Nombre del tutor" />
                        </div>

                        <div>
                            <Label>Contacto del Tutor</Label>
                            <Input placeholder="Teléfono o correo del tutor" />
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </div>
    );
}
