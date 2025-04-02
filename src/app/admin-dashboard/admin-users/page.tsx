'use client';

// React
import {useState, useEffect} from 'react';

// Components
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/core/button/Button';
import {Table, TableHeader, TableBody, TableRow, TableCell} from '@/components/core/table';
import {Modal} from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';

// Services
import {supabaseClient} from '@/services/config/supabaseClient';

// Interfaces
interface User {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    roles: string[];
}

interface Role {
    role_id: number;
    name: string;
    description: string | null;
}

interface UserRole {
    roles: {
        name: string;
    };
}

export default function AdminUsersDashboard() {
    // States
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role_id: '',
    });

    // Cargar usuarios y roles
    useEffect(() => {
        loadUsers();
        loadRoles();
    }, []);

    const loadUsers = async () => {
        try {
            const {data, error} = await supabaseClient
                .from('users')
                .select(
                    `
                    user_id,
                    email,
                    first_name,
                    last_name,
                    user_roles!inner(
                        roles:role_id(
                            name
                        )
                    )
                `,
                )
                .eq('delete_flag', false);

            if (error) throw error;

            const formattedUsers = data.map(user => ({
                user_id: user.user_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                roles: (user.user_roles as UserRole[]).map(ur => ur.roles.name),
            }));

            setUsers(formattedUsers);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadRoles = async () => {
        try {
            const {data, error} = await supabaseClient
                .from('roles')
                .select('*')
                .eq('delete_flag', false);

            if (error) throw error;
            setRoles(data);
        } catch (error) {
            console.error('Error loading roles:', error);
        }
    };

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Crear usuario
            const {data: userData, error: userError} = await supabaseClient
                .from('users')
                .insert({
                    email: formData.email,
                    password_hash: formData.password, // En producción, hashear la contraseña
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                })
                .select()
                .single();

            if (userError) throw userError;

            // Asignar rol
            const {error: roleError} = await supabaseClient.from('user_roles').insert({
                user_id: userData.user_id,
                role_id: parseInt(formData.role_id),
            });

            if (roleError) throw roleError;

            // Recargar usuarios
            await loadUsers();
            setIsModalOpen(false);
            setFormData({
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                role_id: '',
            });
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <PageBreadcrumb pageTitle="Administración de Usuarios" />

            {/* Botón para agregar usuario */}
            <div className="mb-6">
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white"
                >
                    <i className="fa-duotone fa-user-plus mr-2"></i>
                    Agregar Usuario
                </Button>
            </div>

            {/* Tabla de usuarios */}
            <div className="border-stroke shadow-default dark:border-strokedark dark:bg-boxdark rounded-sm border bg-white px-5 pb-2.5 pt-6 sm:px-7.5 xl:pb-1">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell
                                isHeader
                                className="px-5 py-3 text-center font-outfit text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                            >
                                Nombre
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 text-center font-outfit text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                            >
                                Email
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 text-center font-outfit text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                            >
                                Roles
                            </TableCell>
                            <TableCell
                                isHeader
                                className="px-5 py-3 text-center font-outfit text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                            >
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.user_id}>
                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                    <span className="block font-outfit text-sm font-medium text-gray-800 dark:text-white/90">
                                        {`${user.first_name} ${user.last_name}`}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                    <span className="font-outfit text-sm text-gray-600 dark:text-gray-300">
                                        {user.email}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                    <span className="font-outfit text-sm text-gray-600 dark:text-gray-300">
                                        {user.roles.join(', ')}
                                    </span>
                                </TableCell>
                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            onClick={() => {}}
                                            className="text-primary hover:text-primary/80"
                                        >
                                            <i className="fa-duotone fa-pen-to-square"></i>
                                        </Button>
                                        <Button
                                            onClick={() => {}}
                                            className="text-danger hover:text-danger/80"
                                        >
                                            <i className="fa-duotone fa-trash"></i>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal para agregar/editar usuario */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="custom-scrollbar flex flex-col overflow-y-auto px-2">
                    <div>
                        <h5 className="modal-title mb-2 font-outfit text-theme-xl font-semibold text-gray-800 dark:text-white/90 lg:text-2xl">
                            Agregar Usuario
                        </h5>
                        <p className="font-outfit text-sm text-gray-500 dark:text-gray-400">
                            Ingresa la información del usuario para registrarlo en el sistema.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="first_name">Nombre</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="last_name">Apellido</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="role_id">Rol</Label>
                                <Select
                                    options={roles.map(role => ({
                                        value: role.role_id.toString(),
                                        label: role.name,
                                    }))}
                                    placeholder="Seleccionar rol"
                                    onChange={value =>
                                        handleInputChange({target: {name: 'role_id', value}} as any)
                                    }
                                    defaultValue={formData.role_id}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="bg-primary hover:bg-primary/90 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <i className="fa-duotone fa-spinner fa-spin mr-2"></i>
                                ) : (
                                    <i className="fa-duotone fa-save mr-2"></i>
                                )}
                                Guardar
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
