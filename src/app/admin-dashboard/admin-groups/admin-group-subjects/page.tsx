'use client';
import { useState, useEffect } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/core/table';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { supabaseClient } from '@/services/config/supabaseClient';

interface Group {
    id: number;
    grade: number;
    group: string;
    schoolYear: {
        id: number;
        name: string;
    };
}

interface Subject {
    id: number;
    name: string;
}

interface Teacher {
    id: number;
    name: string;
}

interface GroupSubject {
    id: number;
    groupId: number;
    subjectId: number;
    teacherId: number;
    group: Group;
    subject: Subject;
    teacher: Teacher;
}

export default function GroupSubjectsDashboard() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [groupSubjects, setGroupSubjects] = useState<GroupSubject[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroupSubject, setSelectedGroupSubject] = useState<GroupSubject | null>(null);
    const [formData, setFormData] = useState({
        groupId: '',
        subjectId: '',
        teacherId: ''
    });

    useEffect(() => {
        loadGroups();
        loadSubjects();
        loadTeachers();
        loadGroupSubjects();
    }, []);

    async function loadGroups() {
        try {
            const { data, error } = await supabaseClient
                .from('groups')
                .select(`
                    group_id,
                    grade,
                    group_name,
                    school_years (
                        school_year_id,
                        name
                    )
                `)
                .eq('delete_flag', false)
                .eq('status', 'active');

            if (error) throw error;

            if (data) {
                setGroups(data.map((group: any) => ({
                    id: group.group_id,
                    grade: group.grade,
                    group: group.group_name,
                    schoolYear: {
                        id: group.school_years.school_year_id,
                        name: group.school_years.name
                    }
                })));
            }
        } catch (error) {
            console.error('Error al cargar los grupos:', error);
        }
    }

    async function loadSubjects() {
        try {
            const { data, error } = await supabaseClient
                .from('subjects')
                .select('subject_id, name')
                .eq('delete_flag', false);

            if (error) throw error;

            if (data) {
                setSubjects(data.map((subject: any) => ({
                    id: subject.subject_id,
                    name: subject.name
                })));
            }
        } catch (error) {
            console.error('Error al cargar las materias:', error);
        }
    }

    async function loadTeachers() {
        try {
            const { data, error } = await supabaseClient
                .from('teachers')
                .select('teacher_id, name')
                .eq('delete_flag', false);

            if (error) throw error;

            if (data) {
                setTeachers(data.map(teacher => ({
                    id: teacher.teacher_id,
                    name: teacher.name
                })));
            }
        } catch (error) {
            console.error('Error al cargar los profesores:', error);
        }
    }

    async function loadGroupSubjects() {
        try {
            const { data, error } = await supabaseClient
                .from('group_subjects')
                .select(`
                    group_subject_id,
                    group_id,
                    subject_id,
                    teacher_id,
                    groups (
                        group_id,
                        grade,
                        group_name,
                        school_years (
                            school_year_id,
                            name
                        )
                    ),
                    subjects (
                        subject_id,
                        name
                    ),
                    teachers (
                        teacher_id,
                        name
                    )
                `)
                .eq('delete_flag', false);

            if (error) throw error;

            if (data) {
                setGroupSubjects(data.map((item: any) => ({
                    id: item.group_subject_id,
                    groupId: item.group_id,
                    subjectId: item.subject_id,
                    teacherId: item.teacher_id,
                    group: {
                        id: item.groups.group_id,
                        grade: item.groups.grade,
                        group: item.groups.group_name,
                        schoolYear: {
                            id: item.groups.school_years.school_year_id,
                            name: item.groups.school_years.name
                        }
                    },
                    subject: {
                        id: item.subjects.subject_id,
                        name: item.subjects.name
                    },
                    teacher: {
                        id: item.teachers.teacher_id,
                        name: item.teachers.name
                    }
                })));
            }
        } catch (error) {
            console.error('Error al cargar las asignaciones:', error);
        }
    }

    function openModal() {
        setSelectedGroupSubject(null);
        setFormData({
            groupId: '',
            subjectId: '',
            teacherId: ''
        });
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSave() {
        try {
            if (!formData.groupId || !formData.subjectId || !formData.teacherId) {
                alert('Por favor completa todos los campos requeridos');
                return;
            }

            if (selectedGroupSubject) {
                // Actualizar asignación existente
                const { error } = await supabaseClient
                    .from('group_subjects')
                    .update({
                        group_id: parseInt(formData.groupId),
                        subject_id: parseInt(formData.subjectId),
                        teacher_id: parseInt(formData.teacherId),
                        updated_at: new Date().toISOString()
                    })
                    .eq('group_subject_id', selectedGroupSubject.id);

                if (error) throw error;
            } else {
                // Crear nueva asignación
                const { error } = await supabaseClient
                    .from('group_subjects')
                    .insert([{
                        group_id: parseInt(formData.groupId),
                        subject_id: parseInt(formData.subjectId),
                        teacher_id: parseInt(formData.teacherId)
                    }]);

                if (error) throw error;
            }

            loadGroupSubjects();
            closeModal();
        } catch (error) {
            console.error('Error al guardar la asignación:', error);
            alert('Error al guardar la asignación. Por favor intenta nuevamente.');
        }
    }

    async function handleDelete(id: number) {
        try {
            const { error } = await supabaseClient
                .from('group_subjects')
                .update({
                    delete_flag: true,
                    deleted_at: new Date().toISOString()
                })
                .eq('group_subject_id', id);

            if (error) throw error;

            setGroupSubjects(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error al eliminar la asignación:', error);
            alert('Error al eliminar la asignación. Por favor intenta nuevamente.');
        }
    }

    return (
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6">
            <PageBreadcrumb pageTitle="Administración de grupos y materias" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                <ComponentCard title="Asignaciones de materias" className="w-100 p-4">
                    <div className="mb-4 flex justify-end">
                        <Button
                            variant="primary"
                            startIcon={<i className="fa-duotone fa-solid fa-book-medical"></i>}
                            onClick={openModal}
                        >
                            Nueva Asignación
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        <div className="max-w-full overflow-x-auto">
                            <div className="min-w-[1102px]">
                                <Table>
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                            >
                                                Grupo
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                            >
                                                Materia
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                            >
                                                Profesor
                                            </TableCell>
                                            <TableCell
                                                isHeader
                                                className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit"
                                            >
                                                Acciones
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {groupSubjects.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                        {item.group.grade}° {item.group.group}
                                                    </span>
                                                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-outfit">
                                                        {item.group.schoolYear.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                        {item.subject.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                        {item.teacher.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        startIcon={<i className="fa-duotone fa-solid fa-trash"></i>}
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </ComponentCard>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                            {selectedGroupSubject ? "Editar asignación" : "Nueva asignación"}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            Asigna una materia y un profesor a un grupo específico.
                        </p>
                    </div>
                    <div className="mt-8">
                        <div className="mt-6">
                            <Label htmlFor="group-select">
                                Grupo
                            </Label>
                            <Select
                                options={groups.map(group => ({
                                    value: group.id.toString(),
                                    label: `${group.grade}° ${group.group} - ${group.schoolYear.name}`
                                }))}
                                placeholder="Seleccione un grupo"
                                onChange={(value) => handleInputChange({ target: { name: 'groupId', value } } as any)}
                                defaultValue={formData.groupId}
                            />
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="subject-select">
                                Materia
                            </Label>
                            <Select
                                options={subjects.map(subject => ({
                                    value: subject.id.toString(),
                                    label: subject.name
                                }))}
                                placeholder="Seleccione una materia"
                                onChange={(value) => handleInputChange({ target: { name: 'subjectId', value } } as any)}
                                defaultValue={formData.subjectId}
                            />
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="teacher-select">
                                Profesor
                            </Label>
                            <Select
                                options={teachers.map(teacher => ({
                                    value: teacher.id.toString(),
                                    label: teacher.name
                                }))}
                                placeholder="Seleccione un profesor"
                                onChange={(value) => handleInputChange({ target: { name: 'teacherId', value } } as any)}
                                defaultValue={formData.teacherId}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                        <Button
                            onClick={closeModal}
                            variant="outline"
                            className="sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            variant="primary"
                            className="sm:w-auto"
                        >
                            {selectedGroupSubject ? "Actualizar" : "Crear"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
} 