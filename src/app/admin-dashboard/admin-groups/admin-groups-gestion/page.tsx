'use client';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/core/badge/Badge';
import Button from '@/components/core/button/Button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/core/table';
import { supabaseClient } from '@/services/config/supabaseClient';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';

interface Student {
    student_id: number;
    first_name: string;
    father_last_name: string;
    mother_last_name: string;
    curp: string;
    grade_level: string;
    status: string;
}

interface Group {
    group_id: number;
    grade: number;
    group_name: string;
    school_year_id: number;
    school_year_name: string;
    subjectsNumber: number;
}

interface GroupStudent {
    student_group_id: number;
    student_id: number;
    group_id: number;
    enrollment_date: string;
    status: string;
    deleted_at?: string;
    student: Student;
}

interface GroupSubject {
    subject_id: number;
    name: string;
    teacher?: {
        name: string;
    };
    delete_flag?: boolean;
    deleted_at?: string;
}

interface Teacher {
    teacher_id: number;
    name: string;
}

interface Subject {
    subject_id: number;
    name: string;
}

interface SubjectAssignment {
    subject_id: number;
    teacher_id: string | null;
}

export default function GroupStudentsDashboard() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [groupStudents, setGroupStudents] = useState<GroupStudent[]>([]);
    const [groupSubjects, setGroupSubjects] = useState<GroupSubject[]>([]);
    const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
    const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
    const [availableTeachers, setAvailableTeachers] = useState<Teacher[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [sortField, setSortField] = useState<'name' | 'curp' | 'status'>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
    const [selectedSubjects, setSelectedSubjects] = useState<SubjectAssignment[]>([]);
    const [subjectSearchTerm, setSubjectSearchTerm] = useState('');
    const [modalSubjectSearchTerm, setModalSubjectSearchTerm] = useState('');
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [editingSubject, setEditingSubject] = useState<GroupSubject | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [subjectsPage, setSubjectsPage] = useState(1);
    const itemsPerPage = 10;
    const [studentsDeleted, setStudentsDeleted] = useState<GroupStudent[]>([]);
    const [subjectsDeleted, setSubjectsDeleted] = useState<GroupSubject[]>([]);
    const [deletedTab, setDeletedTab] = useState<'students' | 'subjects'>('students');
    const [showDeleted, setShowDeleted] = useState(false);
    const [deletedPage, setDeletedPage] = useState(1);

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            loadGroupStudents();
            loadAvailableStudents();
            loadGroupSubjects();
        }
    }, [selectedGroup]);

    async function loadGroups() {
        setIsLoadingGroups(true);
        try {
            const { data, error } = await supabaseClient
                .from('groups')
                .select(`
                    group_id,
                    grade,
                    group_name,
                    school_year_id,
                    school_years!inner (
                        name
                    ),
                    group_subjects!inner (
                        count
                    )
                `)
                .eq('delete_flag', false)
                .eq('status', 'active')
                .order('grade', { ascending: true })
                .order('group_name', { ascending: true });

            if (error) throw error;

            if (data) {
                const formattedGroups: Group[] = data.map((group: any) => ({
                    group_id: group.group_id,
                    grade: group.grade,
                    group_name: group.group_name,
                    school_year_id: group.school_year_id,
                    school_year_name: group.school_years.name,
                    subjectsNumber: group.group_subjects[0]?.count || 0
                }));
                setGroups(formattedGroups);
            }
        } catch (error) {
            console.error('Error al cargar los grupos:', error);
            alert('Error al cargar los grupos. Por favor recarga la página.');
        } finally {
            setIsLoadingGroups(false);
        }
    }

    async function loadGroupStudents() {
        if (!selectedGroup) return;
        setIsLoadingStudents(true);
        try {
            const { data, error } = await supabaseClient
                .from('student_groups')
                .select(`
                    student_group_id,
                    student_id,
                    group_id,
                    enrollment_date,
                    status,
                    students (
                        student_id,
                        first_name,
                        father_last_name,
                        mother_last_name,
                        curp,
                        grade_level
                    )
                `)
                .eq('group_id', selectedGroup.group_id)
                .eq('delete_flag', false);

            if (error) throw error;

            if (data) {
                const formattedStudents: GroupStudent[] = data.map((item: any) => ({
                    student_group_id: item.student_group_id,
                    student_id: item.student_id,
                    group_id: item.group_id,
                    enrollment_date: item.enrollment_date,
                    status: item.status,
                    student: {
                        student_id: item.students.student_id,
                        first_name: item.students.first_name,
                        father_last_name: item.students.father_last_name,
                        mother_last_name: item.students.mother_last_name,
                        curp: item.students.curp,
                        grade_level: item.students.grade_level,
                        status: item.status
                    }
                }));
                setGroupStudents(formattedStudents);
            }
        } catch (error) {
            console.error('Error al cargar los estudiantes del grupo:', error);
            alert('Error al cargar los estudiantes del grupo. Por favor recarga la página.');
        } finally {
            setIsLoadingStudents(false);
        }
    }

    async function loadAvailableStudents() {
        if (!selectedGroup) return;
        setIsLoadingMetrics(true);
        try {
            const { data: groupStudents, error: groupError } = await supabaseClient
                .from('student_groups')
                .select(`
                    student_id,
                    groups!inner (
                        school_year_id
                    )
                `)
                .eq('groups.school_year_id', selectedGroup.school_year_id)
                .eq('delete_flag', false);

            if (groupError) throw groupError;

            if (!groupStudents || groupStudents.length === 0) {
                const { data, error } = await supabaseClient
                    .from('students')
                    .select('*')
                    .eq('delete_flag', false);

                if (error) throw error;
                setAvailableStudents(data || []);
                return;
            }

            // Obtener todos los estudiantes que no están activos en ningún grupo del ciclo escolar
            const { data, error } = await supabaseClient
                .from('students')
                .select('*')
                .eq('delete_flag', false)
                .not('student_id', 'in', `(${groupStudents.map(gs => gs.student_id).join(',')})`);

            if (error) throw error;
            setAvailableStudents(data || []);
        } catch (error) {
            console.error('Error al cargar los estudiantes disponibles:', error);
            alert('Error al cargar los estudiantes disponibles. Por favor recarga la página.');
        } finally {
            setIsLoadingMetrics(false);
        }
    }

    async function loadGroupSubjects() {
        if (!selectedGroup) return;
        try {
            const { data, error } = await supabaseClient
                .from('group_subjects')
                .select(`
                    subject_id,
                    subjects (
                        name
                    ),
                    teachers (
                        name
                    )
                `)
                .eq('group_id', selectedGroup.group_id)
                .eq('delete_flag', false);

            if (error) throw error;

            if (data) {
                const formattedSubjects: GroupSubject[] = data.map((item: any) => ({
                    subject_id: item.subject_id,
                    name: item.subjects.name,
                    teacher: item.teachers ? { name: item.teachers.name } : undefined
                }));
                setGroupSubjects(formattedSubjects);
            }
        } catch (error) {
            console.error('Error al cargar las materias del grupo:', error);
        }
    }

    function handleGroupChange(value: string) {
        const group = groups.find(g => `${g.grade}${g.group_name}` === value);
        setSelectedGroup(group || null);
        setSelectedStudents([]);
    }

    async function handleAddStudents() {
        if (!selectedGroup || selectedStudents.length === 0) return;
        setIsSaving(true);
        setIsLoadingAll(true);
        try {
            // Verificamos si los estudiantes ya tienen un registro activo en el mismo ciclo escolar
            const { data: existingStudents, error: checkError } = await supabaseClient
                .from('student_groups')
                .select(`
                    student_id,
                    delete_flag,
                    group_id,
                    student_group_id,
                    groups!inner (
                        school_year_id
                    )
                `)
                .eq('groups.school_year_id', selectedGroup.school_year_id)
                .eq('delete_flag', false)
                .in('student_id', selectedStudents);

            if (checkError) throw checkError;

            // Si hay estudiantes activos en otro grupo del mismo ciclo, los marcamos como eliminados
            if (existingStudents && existingStudents.length > 0) {
                const { error: deleteError } = await supabaseClient
                    .from('student_groups')
                    .update({
                        delete_flag: true,
                        deleted_at: new Date().toISOString()
                    })
                    .in('student_group_id', existingStudents.map(es => es.student_group_id));

                if (deleteError) throw deleteError;
            }

            // Verificamos si los estudiantes ya existen en el grupo actual
            const { data: existingInGroup, error: groupCheckError } = await supabaseClient
                .from('student_groups')
                .select('student_id')
                .eq('group_id', selectedGroup.group_id)
                .eq('delete_flag', false)
                .in('student_id', selectedStudents);

            if (groupCheckError) throw groupCheckError;

            // Filtramos los estudiantes que no están en el grupo actual
            const studentsToAdd = selectedStudents.filter(studentId =>
                !existingInGroup?.some(es => es.student_id === studentId)
            );

            if (studentsToAdd.length === 0) {
                alert('Los estudiantes seleccionados ya están en este grupo.');
                return;
            }

            // Creamos nuevos registros activos solo para los estudiantes que no están en el grupo
            const { error: insertError } = await supabaseClient
                .from('student_groups')
                .insert(
                    studentsToAdd.map(studentId => ({
                        student_id: studentId,
                        group_id: selectedGroup.group_id,
                        status: 'active',
                        enrollment_date: new Date().toISOString(),
                        delete_flag: false,
                        deleted_at: null
                    }))
                );

            if (insertError) throw insertError;

            // Actualizar todos los datos
            await Promise.all([
                loadGroups(),
                loadGroupStudents(),
                loadAvailableStudents(),
                loadGroupSubjects()
            ]);

            setIsModalOpen(false);
            setSelectedStudents([]);
        } catch (error) {
            console.error('Error al añadir estudiantes al grupo:', error);
            alert('Error al añadir estudiantes al grupo. Por favor intenta de nuevo.');
        } finally {
            setIsSaving(false);
            setIsLoadingAll(false);
        }
    }

    async function handleRemoveStudent(studentGroupId: number) {
        if (!confirm('¿Estás seguro de que deseas quitar este estudiante del grupo?')) return;
        setIsSaving(true);
        setIsLoadingAll(true);
        try {
            const { error } = await supabaseClient
                .from('student_groups')
                .update({ delete_flag: true, deleted_at: new Date().toISOString() })
                .eq('student_group_id', studentGroupId);

            if (error) throw error;

            // Actualizar todos los datos
            await Promise.all([
                loadGroups(),
                loadGroupStudents(),
                loadAvailableStudents(),
                loadGroupSubjects()
            ]);
        } catch (error) {
            console.error('Error al quitar el estudiante del grupo:', error);
            alert('Error al quitar el estudiante del grupo. Por favor intenta de nuevo.');
        } finally {
            setIsSaving(false);
            setIsLoadingAll(false);
        }
    }

    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortStudents = (students: GroupStudent[]) => {
        return [...students].sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'name':
                    comparison = `${a.student.first_name} ${a.student.father_last_name}`.localeCompare(
                        `${b.student.first_name} ${b.student.father_last_name}`
                    );
                    break;
                case 'curp':
                    comparison = a.student.curp.localeCompare(b.student.curp);
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                default:
                    comparison = 0;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    };

    const filterStudents = (students: GroupStudent[], term: string) => {
        if (!term) return students;
        const searchTermLower = term.toLowerCase();
        return students.filter(student =>
            student.student.first_name.toLowerCase().includes(searchTermLower) ||
            student.student.father_last_name.toLowerCase().includes(searchTermLower) ||
            student.student.mother_last_name?.toLowerCase().includes(searchTermLower) ||
            student.student.curp.toLowerCase().includes(searchTermLower)
        );
    };

    // Calcular métricas
    const totalStudents = groupStudents.length;
    const activeStudents = groupStudents.filter(s => s.status === 'active').length;
    const inactiveStudents = groupStudents.filter(s => s.status === 'inactive').length;

    // Configuración de gráficas
    const genderOptions: ApexOptions = {
        chart: {
            type: 'donut',
            height: 180,
        },
        labels: ['Activos', 'Inactivos'],
        colors: ['#63e6be', '#4dabf7'], // Verde pastel para activos, azul pastel para inactivos
        legend: {
            position: 'bottom',
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const genderSeries = [activeStudents, inactiveStudents];

    async function handleRemoveSubject(subjectId: number) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta materia del grupo?')) return;
        try {
            const { error } = await supabaseClient
                .from('group_subjects')
                .update({ delete_flag: true, deleted_at: new Date().toISOString() })
                .eq('subject_id', subjectId)
                .eq('group_id', selectedGroup?.group_id);

            if (error) throw error;
            await loadGroupSubjects();
        } catch (error) {
            console.error('Error al eliminar la materia:', error);
            alert('Error al eliminar la materia. Por favor intenta de nuevo.');
        }
    }

    async function loadAvailableSubjects() {
        if (!selectedGroup) return;
        try {
            // Obtener todas las materias activas
            const { data: allSubjects, error: subjectsError } = await supabaseClient
                .from('subjects')
                .select('*')
                .eq('delete_flag', false);

            if (subjectsError) throw subjectsError;

            // Obtener las materias ya asignadas al grupo
            const { data: assignedSubjects, error: assignedError } = await supabaseClient
                .from('group_subjects')
                .select('subject_id')
                .eq('group_id', selectedGroup.group_id)
                .eq('delete_flag', false);

            if (assignedError) throw assignedError;

            // Filtrar las materias disponibles (no asignadas)
            const assignedSubjectIds = assignedSubjects?.map(as => as.subject_id) || [];
            const availableSubjectsList = allSubjects?.filter(subject =>
                !assignedSubjectIds.includes(subject.subject_id)
            ) || [];

            setAvailableSubjects(availableSubjectsList);
        } catch (error) {
            console.error('Error al cargar las materias disponibles:', error);
        }
    }

    async function loadAvailableTeachers() {
        try {
            const { data, error } = await supabaseClient
                .from('teachers')
                .select('*')
                .eq('delete_flag', false);

            if (error) throw error;
            setAvailableTeachers(data || []);
        } catch (error) {
            console.error('Error al cargar los profesores:', error);
        }
    }

    useEffect(() => {
        if (selectedGroup) {
            loadAvailableSubjects();
            loadAvailableTeachers();
        }
    }, [selectedGroup]);

    async function handleAssignSubjects() {
        if (!selectedGroup || selectedSubjects.length === 0) return;
        setIsSaving(true);
        setIsLoadingAll(true);
        try {
            const { error } = await supabaseClient
                .from('group_subjects')
                .insert(
                    selectedSubjects.map(subject => ({
                        group_id: selectedGroup.group_id,
                        subject_id: subject.subject_id,
                        teacher_id: subject.teacher_id
                    }))
                );

            if (error) throw error;

            // Actualizar todos los datos
            await Promise.all([
                loadGroups(),
                loadGroupStudents(),
                loadAvailableStudents(),
                loadGroupSubjects(),
                loadAvailableSubjects()
            ]);

            // Actualizar el número de materias del grupo seleccionado
            const { data: updatedGroup, error: groupError } = await supabaseClient
                .from('groups')
                .select(`
                    group_id,
                    grade,
                    group_name,
                    school_year_id,
                    school_years!inner (
                        name
                    ),
                    group_subjects!inner (
                        count
                    )
                `)
                .eq('group_id', selectedGroup.group_id)
                .eq('delete_flag', false)
                .eq('status', 'active')
                .single();

            if (groupError) throw groupError;

            if (updatedGroup) {
                setSelectedGroup({
                    ...selectedGroup,
                    subjectsNumber: updatedGroup.group_subjects[0]?.count || 0
                });
            }

            setIsSubjectModalOpen(false);
            setSelectedSubjects([]);
        } catch (error) {
            console.error('Error al asignar las materias:', error);
            alert('Error al asignar las materias. Por favor intenta de nuevo.');
        } finally {
            setIsSaving(false);
            setIsLoadingAll(false);
        }
    }

    async function handleEditSubject(subject: GroupSubject) {
        setEditingSubject(subject);
        setIsSubjectModalOpen(true);
    }

    async function handleUpdateSubject() {
        if (!selectedGroup || !editingSubject) return;
        setIsSaving(true);
        setIsLoadingAll(true);
        try {
            const { error } = await supabaseClient
                .from('group_subjects')
                .update({
                    teacher_id: selectedTeacher
                })
                .eq('subject_id', editingSubject.subject_id)
                .eq('group_id', selectedGroup.group_id);

            if (error) throw error;

            // Actualizar todos los datos
            await Promise.all([
                loadGroups(),
                loadGroupStudents(),
                loadAvailableStudents(),
                loadGroupSubjects(),
                loadAvailableSubjects()
            ]);

            setIsSubjectModalOpen(false);
            setEditingSubject(null);
            setSelectedTeacher(null);
        } catch (error) {
            console.error('Error al actualizar la materia:', error);
            alert('Error al actualizar la materia. Por favor intenta de nuevo.');
        } finally {
            setIsSaving(false);
            setIsLoadingAll(false);
        }
    }

    const filterAssignedSubjects = (subjects: GroupSubject[], term: string) => {
        if (!term) return subjects;
        const searchTermLower = term.toLowerCase();
        return subjects.filter(subject =>
            subject.name.toLowerCase().includes(searchTermLower) ||
            (subject.teacher?.name || '').toLowerCase().includes(searchTermLower)
        );
    };

    // Funciones de paginación
    const paginateStudents = (items: GroupStudent[]) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    };

    const paginateSubjects = (items: GroupSubject[]) => {
        const startIndex = (subjectsPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    };

    async function loadDeletedRecords() {
        if (!selectedGroup) return;

        try {
            // Cargar estudiantes eliminados
            const { data: deletedStudents, error: studentsError } = await supabaseClient
                .from('student_groups')
                .select(`
                    student_group_id,
                    student_id,
                    group_id,
                    enrollment_date,
                    status,
                    deleted_at,
                    students (
                        student_id,
                        first_name,
                        father_last_name,
                        mother_last_name,
                        curp,
                        grade_level
                    )
                `)
                .eq('group_id', selectedGroup.group_id)
                .eq('delete_flag', true)
                .order('deleted_at', { ascending: false });

            if (studentsError) throw studentsError;

            // Cargar materias eliminadas
            const { data: deletedSubjects, error: subjectsError } = await supabaseClient
                .from('group_subjects')
                .select(`
                    subject_id,
                    deleted_at,
                    subjects (
                        name
                    ),
                    teachers (
                        name
                    )
                `)
                .eq('group_id', selectedGroup.group_id)
                .eq('delete_flag', true)
                .order('deleted_at', { ascending: false });

            if (subjectsError) throw subjectsError;

            if (deletedStudents) {
                const formattedStudents: GroupStudent[] = deletedStudents.map((item: any) => ({
                    student_group_id: item.student_group_id,
                    student_id: item.student_id,
                    group_id: item.group_id,
                    enrollment_date: item.enrollment_date,
                    status: item.status,
                    deleted_at: item.deleted_at,
                    student: {
                        student_id: item.students.student_id,
                        first_name: item.students.first_name,
                        father_last_name: item.students.father_last_name,
                        mother_last_name: item.students.mother_last_name,
                        curp: item.students.curp,
                        grade_level: item.students.grade_level,
                        status: item.status
                    }
                }));
                setStudentsDeleted(formattedStudents);
            }

            if (deletedSubjects) {
                const formattedSubjects: GroupSubject[] = deletedSubjects.map((item: any) => ({
                    subject_id: item.subject_id,
                    name: item.subjects.name,
                    deleted_at: item.deleted_at,
                    teacher: item.teachers ? { name: item.teachers.name } : undefined,
                    delete_flag: true
                }));
                setSubjectsDeleted(formattedSubjects);
            }
        } catch (error) {
            console.error('Error al cargar registros eliminados:', error);
        }
    }

    useEffect(() => {
        if (selectedGroup) {
            loadDeletedRecords();
        }
    }, [selectedGroup]);

    useEffect(() => {
        if (showDeleted) {
            loadDeletedRecords();
        }
    }, [showDeleted]);

    const paginateDeleted = <T extends GroupStudent | GroupSubject>(items: T[]): T[] => {
        const startIndex = (deletedPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
    };

    async function handleRestoreStudent(studentGroupId: number) {
        if (!confirm('¿Estás seguro de que deseas restaurar este estudiante?')) return;
        setIsSaving(true);

        try {
            const { error } = await supabaseClient
                .from('student_groups')
                .update({
                    delete_flag: false,
                    deleted_at: null
                })
                .eq('student_group_id', studentGroupId);

            if (error) throw error;

            await Promise.all([
                loadGroupStudents(),
                loadDeletedRecords()
            ]);

        } catch (error) {
            console.error('Error al restaurar el estudiante:', error);
            alert('Error al restaurar el estudiante. Por favor intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleRestoreSubject(subjectId: number) {
        if (!confirm('¿Estás seguro de que deseas restaurar esta materia?')) return;
        setIsSaving(true);

        try {
            const { error } = await supabaseClient
                .from('group_subjects')
                .update({
                    delete_flag: false,
                    deleted_at: null
                })
                .eq('subject_id', subjectId)
                .eq('group_id', selectedGroup?.group_id);

            if (error) throw error;

            await Promise.all([
                loadGroupSubjects(),
                loadDeletedRecords()
            ]);

        } catch (error) {
            console.error('Error al restaurar la materia:', error);
            alert('Error al restaurar la materia. Por favor intenta de nuevo.');
        } finally {
            setIsSaving(false);
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
=======

// Components
import Label from '@/components/form/Label';
import IconFA from '@/components/ui/IconFA';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';

// Hooks
import { useGroupStudentsManagement } from './hooks/useGroupStudentsManagement';
import ItemsList from '../../core/Tables/ItemsList';

export default function GroupStudentsDashboard() {
=======

// Components
import Label from '@/components/form/Label';
import IconFA from '@/components/ui/IconFA';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';

// Hooks
import { useGroupStudentsManagement } from './hooks/useGroupStudentsManagement';
import ItemsList from '../../core/Tables/ItemsList';

export default function GroupStudentsDashboard() {
>>>>>>> Stashed changes
=======

// Components
import Label from '@/components/form/Label';
import IconFA from '@/components/ui/IconFA';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import SelectWithCategories from '@/components/core/select/SelectWithCategories';

// Hooks
import { useGroupStudentsManagement } from './hooks/useGroupStudentsManagement';
import ItemsList from '../../core/Tables/ItemsList';

export default function GroupStudentsDashboard() {
>>>>>>> Stashed changes
    // Usar el hook para gestionar grupos y estudiantes
    const {
        groupCategories,
        isLoading,
        error,
        handleGroupChange,
        selectedGroup
    } = useGroupStudentsManagement();

    console.log('selectedGroup: ', selectedGroup);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

    return (
        <div className="container mx-auto p-6">
            <PageBreadcrumb pageTitle="Gestión de Estudiantes por Grupo" />

            {/* Selector de Grupo */}
            <ComponentCard title="Seleccionar Grupo" desc="Selecciona un grupo para gestionar los estudiantes." className={`mb-6`}>
                <div className="mb-6">
                    <Label htmlFor="group-select" className="font-outfit">
                        Seleccionar Grupo
                    </Label>

                    <div className="relative">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <Select
                            options={[
                                { value: "", label: "Selecciona un grupo" },
                                ...groups.map(group => ({
                                    value: `${group.grade}${group.group_name}`,
                                    label: `${group.grade}° ${group.group_name} - ${group.school_year_name}`
                                }))
                            ]}
                            placeholder="Selecciona un grupo"
                            onChange={handleGroupChange}
                        />
                        {isLoadingGroups && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                            </div>
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                        {isLoading ? (
                            <div className="flex items-center space-x-2 text-gray-500 mb-2">
                                <IconFA icon="spinner" spin />
                                <span>Cargando grupos...</span>
                            </div>
                        ) : error ? (
                            <div className="text-red-500 mb-2">
                                {error}
                            </div>
                        ) : (
                            <SelectWithCategories
                                options={groupCategories}
                                placeholder="Selecciona un grupo"
                                onChange={handleGroupChange}
                                defaultValue={selectedGroup?.id.toString() || ''}
                                maxMenuHeight="max-h-64"
                            />
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                        )}
                    </div>

                </div>
            </ComponentCard>

            {selectedGroup && (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                <>
                    {/* Métricas y Gráfica */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Métricas Combinadas */}
                        <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit mb-4">
                                Resumen del Grupo
                            </h3>
                            <div className="flex flex-col gap-3">
                                {/* Total de Estudiantes */}
                                <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3 dark:bg-blue-900/20">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-500/20">
                                        <i className="fa-duotone fa-solid fa-user-graduate text-blue-600 dark:text-blue-400"></i>
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                            Total de Estudiantes
                                        </span>
                                        <span className="text-xl font-bold text-gray-800 dark:text-white/90 font-outfit">
                                            {isLoadingAll || isLoadingMetrics ? (
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                                                    <i className="fa-duotone fa-solid fa-spinner fa-spin text-primary dark:text-primary/90"></i>
                                                </div>
                                            ) : (
                                                totalStudents
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Materias Asignadas */}
                                <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3 dark:bg-green-900/20">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10 dark:bg-green-500/20">
                                        <i className="fa-duotone fa-solid fa-book text-green-500 dark:text-green-400"></i>
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                            Materias Asignadas
                                        </span>
                                        <span className="text-xl font-bold text-gray-800 dark:text-white/90 font-outfit">
                                            {isLoadingAll || isLoadingMetrics ? (
                                                <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400 dark:text-gray-300"></i>
                                            ) : (
                                                groupSubjects.filter(subject => !subject.delete_flag).length
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Profesores Asignados */}
                                <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-3 dark:bg-purple-900/20">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10 dark:bg-purple-500/20">
                                        <i className="fa-duotone fa-solid fa-chalkboard-teacher text-purple-500 dark:text-purple-400"></i>
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                            Profesores Asignados
                                        </span>
                                        <span className="text-xl font-bold text-gray-800 dark:text-white/90 font-outfit">
                                            {isLoadingAll || isLoadingMetrics ? (
                                                <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400 dark:text-gray-300"></i>
                                            ) : (
                                                new Set(groupSubjects.filter(subject => subject.teacher).map(subject => subject.teacher?.name)).size
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gráfica de Distribución */}
                        <div className="relative rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 font-outfit mb-4">
                                Distribución de Estudiantes
                            </h3>
                            <div className="flex items-center justify-center w-full">
                                {isLoadingAll || isLoadingMetrics ? (
                                    <div className="flex items-center justify-center h-[180px]">
                                        <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400 dark:text-gray-300"></i>
                                    </div>
                                ) : (
                                    <div className="w-full h-[180px]">
                                        <ReactApexChart
                                            options={{
                                                ...genderOptions,
                                                colors: ['#63e6be', '#4dabf7'], // Verde pastel para activos, azul pastel para inactivos
                                                legend: {
                                                    ...genderOptions.legend,
                                                    labels: {
                                                        colors: ['#374151', '#f9fafb'],
                                                        useSeriesColors: false
                                                    },
                                                    markers: {
                                                        size: 12,
                                                        strokeWidth: 0,
                                                        shape: 'circle'
                                                    },
                                                    itemMargin: {
                                                        horizontal: 10,
                                                        vertical: 5
                                                    },
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    fontFamily: 'Outfit, sans-serif'
                                                },
                                                labels: ['Activos', 'Inactivos'],
                                                dataLabels: {
                                                    enabled: true,
                                                    formatter: function (val) {
                                                        return (val as number).toFixed(1) + '%'
                                                    },
                                                    style: {
                                                        fontSize: '14px',
                                                        fontFamily: 'Outfit, sans-serif',
                                                        fontWeight: 600,
                                                        colors: ['#fff']
                                                    }
                                                },
                                                stroke: {
                                                    width: 2,
                                                    colors: ['#fff']
                                                },
                                                tooltip: {
                                                    theme: 'dark'
                                                }
                                            }}
                                            series={genderSeries}
                                            type="donut"
                                            height={180}
                                            width="100%"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Estudiantes */}
                    <ComponentCard
                        title="Estudiantes del Grupo"
                        desc="Aquí podrás ver todos los estudiantes asignados a este grupo y gestionarlos."
                    >
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative w-full sm:w-64">
                                <Input
                                    type="text"
                                    placeholder="Buscar estudiantes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                    startIcon={<i className="fa-duotone fa-solid fa-search text-gray-400"></i>}
                                />
                            </div>
                            <Button
                                variant="primary"
                                startIcon={<i className="fa-duotone fa-solid fa-user-plus"></i>}
                                onClick={() => setIsModalOpen(true)}
                                disabled={isSaving || isLoadingAll}
                            >
                                <span className="font-outfit">Añadir Estudiantes</span>
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            {isLoadingAll || isLoadingStudents ? (
                                <div className="flex items-center justify-center h-[200px]">
                                    <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                                </div>
                            ) : (
                                <>
                                    <Table className="min-w-full">
                                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                            <TableRow>
                                                <TableCell
                                                    isHeader
                                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                                    onClick={() => handleSort('name')}
                                                >
                                                    <div className="flex items-center justify-center gap-1">
                                                        Nombre
                                                        {sortField === 'name' && (
                                                            <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    isHeader
                                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                                    onClick={() => handleSort('curp')}
                                                >
                                                    <div className="flex items-center justify-center gap-1">
                                                        CURP
                                                        {sortField === 'curp' && (
                                                            <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    isHeader
                                                    className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                                                    onClick={() => handleSort('status')}
                                                >
                                                    <div className="flex items-center justify-center gap-1">
                                                        Estado
                                                        {sortField === 'status' && (
                                                            <i className={`fa-duotone fa-solid fa-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                                                        )}
                                                    </div>
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
                                            {paginateStudents(sortStudents(filterStudents(groupStudents, searchTerm))).map((student) => (
                                                <TableRow key={student.student_group_id}>
                                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                                        <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                            {student.student.first_name} {student.student.father_last_name} {student.student.mother_last_name}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                            {student.student.curp}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                                        <Badge
                                                            color={student.status === 'active' ? 'success' : 'error'}
                                                            variant="light"
                                                        >
                                                            <span className="font-outfit">
                                                                {student.status === 'active' ? 'Activo' : 'Inactivo'}
                                                            </span>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            startIcon={<i className="fa-duotone fa-solid fa-user-minus"></i>}
                                                            onClick={() => handleRemoveStudent(student.student_group_id)}
                                                        >
                                                            <span className="font-outfit">Quitar</span>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {groupStudents.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="px-5 py-4 text-center sm:px-6">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                            {searchTerm ? 'No se encontraron estudiantes que coincidan con la búsqueda.' : 'No hay estudiantes en este grupo.'}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>

                                    {/* Paginación de Estudiantes */}
                                    {groupStudents.length > 0 && (
                                        <div className="flex justify-between items-center mt-4 px-2">
                                            <div className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                Mostrando {Math.min(itemsPerPage, filterStudents(groupStudents, searchTerm).length)} de {filterStudents(groupStudents, searchTerm).length} estudiantes
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                >
                                                    <i className="fa-duotone fa-solid fa-chevron-left text-gray-600"></i>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                                    disabled={currentPage * itemsPerPage >= filterStudents(groupStudents, searchTerm).length}
                                                >
                                                    <i className="fa-duotone fa-solid fa-chevron-right text-gray-600"></i>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </ComponentCard>

                    {/* Tabla de Materias Asignadas */}
                    <ComponentCard title="Materias Asignadas" desc="Materias asignadas al grupo." className={`my-6`}>
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <Input
                                        type="text"
                                        placeholder="Buscar materias o profesores..."
                                        value={subjectSearchTerm}
                                        onChange={(e) => setSubjectSearchTerm(e.target.value)}
                                        className="pl-10"
                                        startIcon={<i className="fa-duotone fa-solid fa-search text-gray-400"></i>}
                                    />
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                startIcon={<i className="fa-duotone fa-solid fa-book-medical"></i>}
                                onClick={() => setIsSubjectModalOpen(true)}
                                disabled={isLoadingAll}
                            >
                                <span className="font-outfit">Asignar Materias</span>
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            {isLoadingAll ? (
                                <div className="flex items-center justify-center h-[200px]">
                                    <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                                </div>
                            ) : (
                                <>
                                    <Table className="min-w-full">
                                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                            <TableRow>
                                                <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit">
                                                    Materia
                                                </TableCell>
                                                <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit">
                                                    Profesor
                                                </TableCell>
                                                <TableCell isHeader className="px-5 py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400 font-outfit">
                                                    Acciones
                                                </TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {groupSubjects.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="px-5 py-4 text-center sm:px-6">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                            No hay materias asignadas a este grupo.
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                paginateSubjects(filterAssignedSubjects(groupSubjects, subjectSearchTerm)).map((subject) => (
                                                    <TableRow key={subject.subject_id}>
                                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                                            <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                                {subject.name}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                                            <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                                {subject.teacher?.name || 'Sin asignar'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                                            <div className="flex justify-center gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    startIcon={<i className="fa-duotone fa-solid fa-pen-to-square"></i>}
                                                                    onClick={() => handleEditSubject(subject)}
                                                                >
                                                                    <span className="font-outfit">Editar</span>
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    startIcon={<i className="fa-duotone fa-solid fa-trash-can"></i>}
                                                                    onClick={() => handleRemoveSubject(subject.subject_id)}
                                                                >
                                                                    <span className="font-outfit">Eliminar</span>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>

                                    {/* Paginación de Materias */}
                                    {groupSubjects.length > 0 && (
                                        <div className="flex justify-between items-center mt-4 px-2">
                                            <div className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                Mostrando {Math.min(itemsPerPage, filterAssignedSubjects(groupSubjects, subjectSearchTerm).length)} de {filterAssignedSubjects(groupSubjects, subjectSearchTerm).length} materias
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSubjectsPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={subjectsPage === 1}
                                                >
                                                    <i className="fa-duotone fa-solid fa-chevron-left text-gray-600"></i>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSubjectsPage(prev => prev + 1)}
                                                    disabled={subjectsPage * itemsPerPage >= filterAssignedSubjects(groupSubjects, subjectSearchTerm).length}
                                                >
                                                    <i className="fa-duotone fa-solid fa-chevron-right text-gray-600"></i>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </ComponentCard>

                    {/* Modal para Asignar/Editar Materias */}
                    <Modal
                        isOpen={isSubjectModalOpen}
                        onClose={() => {
                            setIsSubjectModalOpen(false);
                            setSelectedSubjects([]);
                            setEditingSubject(null);
                            setSelectedTeacher(null);
                            setModalSubjectSearchTerm('');
                        }}
                        className="max-w-[700px] p-6 lg:p-10"
                    >
                        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                            <div>
                                <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                                    {editingSubject ? 'Editar asignación de materia' : 'Asignar materias al grupo'}
                                </h5>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                    {editingSubject
                                        ? `Edita la asignación de la materia ${editingSubject.name} para el grupo ${selectedGroup?.grade}° ${selectedGroup?.group_name}`
                                        : `Selecciona las materias que deseas asignar al grupo ${selectedGroup?.grade}° ${selectedGroup?.group_name}`
                                    }
                                </p>
                            </div>
                            <div className="mt-8">
                                {editingSubject ? (
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="font-outfit">Materia</Label>
                                            <Input
                                                type="text"
                                                value={editingSubject.name}
                                                className="mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
                                                onChange={() => { }}
                                            />
                                        </div>
                                        <div>
                                            <Label className="font-outfit">Profesor</Label>
                                            <Select
                                                defaultValue={selectedTeacher || ""}
                                                onChange={(value) => setSelectedTeacher(value)}
                                                placeholder="Selecciona un profesor"
                                                options={[
                                                    { value: "", label: "Selecciona un profesor" },
                                                    ...availableTeachers.map(teacher => ({
                                                        value: teacher.teacher_id.toString(),
                                                        label: teacher.name
                                                    }))
                                                ]}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-4">
                                            <Input
                                                type="text"
                                                placeholder="Buscar materias disponibles..."
                                                value={modalSubjectSearchTerm}
                                                onChange={(e) => setModalSubjectSearchTerm(e.target.value)}
                                                className="pl-10"
                                                startIcon={<i className="fa-duotone fa-solid fa-search text-gray-400"></i>}
                                            />
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            <Table className="min-w-full">
                                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                                    <TableRow>
                                                        <TableCell isHeader>
                                                            <input
                                                                type="checkbox"
                                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedSubjects(availableSubjects.map(s => ({
                                                                            subject_id: s.subject_id,
                                                                            teacher_id: null
                                                                        })));
                                                                    } else {
                                                                        setSelectedSubjects([]);
                                                                    }
                                                                }}
                                                                checked={selectedSubjects.length === availableSubjects.length}
                                                            />
                                                        </TableCell>
                                                        <TableCell isHeader>Materia</TableCell>
                                                        <TableCell isHeader>Profesor</TableCell>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                                    {availableSubjects
                                                        .filter(subject =>
                                                            subject.name.toLowerCase().includes(modalSubjectSearchTerm.toLowerCase())
                                                        )
                                                        .map((subject) => (
                                                            <TableRow key={subject.subject_id}>
                                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                                                        checked={selectedSubjects.some(s => s.subject_id === subject.subject_id)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedSubjects([...selectedSubjects, {
                                                                                    subject_id: subject.subject_id,
                                                                                    teacher_id: null
                                                                                }]);
                                                                            } else {
                                                                                setSelectedSubjects(selectedSubjects.filter(s => s.subject_id !== subject.subject_id));
                                                                            }
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                                        {subject.name}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="px-5 py-4 text-center sm:px-6">
                                                                    <Select
                                                                        defaultValue=""
                                                                        onChange={(value) => {
                                                                            setSelectedSubjects(selectedSubjects.map(s =>
                                                                                s.subject_id === subject.subject_id
                                                                                    ? { ...s, teacher_id: value }
                                                                                    : s
                                                                            ));
                                                                        }}
                                                                        placeholder="Selecciona un profesor"
                                                                        options={[
                                                                            { value: "", label: "Selecciona un profesor" },
                                                                            ...availableTeachers.map(teacher => ({
                                                                                value: teacher.teacher_id.toString(),
                                                                                label: teacher.name
                                                                            }))
                                                                        ]}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    {availableSubjects.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={3} className="px-5 py-4 text-center sm:px-6">
                                                                <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                                    No hay materias disponibles para asignar.
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                                <Button
                                    onClick={() => {
                                        setIsSubjectModalOpen(false);
                                        setSelectedSubjects([]);
                                        setEditingSubject(null);
                                        setSelectedTeacher(null);
                                    }}
                                    variant="outline"
                                    className="sm:w-auto"
                                    disabled={isSaving}
                                >
                                    <span className="font-outfit">Cancelar</span>
                                </Button>
                                <Button
                                    onClick={editingSubject ? handleUpdateSubject : handleAssignSubjects}
                                    variant="primary"
                                    className="sm:w-auto"
                                    disabled={
                                        editingSubject
                                            ? !selectedTeacher || isSaving
                                            : selectedSubjects.length === 0 || isSaving || selectedSubjects.some(s => !s.teacher_id)
                                    }
                                >
                                    {isSaving ? (
                                        <>
                                            <i className="fa-duotone fa-solid fa-spinner fa-spin mr-2"></i>
                                            <span className="font-outfit">Guardando...</span>
                                        </>
                                    ) : (
                                        <span className="font-outfit">
                                            {editingSubject ? 'Actualizar Asignación' : `Asignar ${selectedSubjects.length} Materias`}
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </>
            )}

            {/* Componente de Registros Eliminados */}
            {selectedGroup && (
                <ComponentCard
                    title="Registros Eliminados"
                    desc="Historial de estudiantes y materias eliminados de este grupo."
                    className="mt-6"
                >
                    <div className="mb-4 flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex w-full sm:w-auto">
                            <Button
                                variant={deletedTab === 'students' ? 'primary' : 'outline'}
                                onClick={() => setDeletedTab('students')}
                                className="rounded-r-none flex-1 sm:flex-initial"
                            >
                                <div className="flex items-center gap-1">
                                    <i className="fa-duotone fa-solid fa-user-graduate text-sm"></i>
                                    <span className="font-outfit">Estudiantes</span>
                                </div>
                            </Button>
                            <Button
                                variant={deletedTab === 'subjects' ? 'primary' : 'outline'}
                                onClick={() => setDeletedTab('subjects')}
                                className="rounded-l-none flex-1 sm:flex-initial"
                            >
                                <div className="flex items-center gap-1">
                                    <i className="fa-duotone fa-solid fa-book text-sm"></i>
                                    <span className="font-outfit">Materias</span>
                                </div>
                            </Button>
                        </div>
                        <div className="ml-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setShowDeleted(!showDeleted);
                                    if (!showDeleted) loadDeletedRecords();
                                }}
                                className="flex items-center gap-1"
                            >
                                <i className={`fa-duotone fa-solid fa-${showDeleted ? 'eye-slash' : 'eye'} text-gray-500`}></i>
                                <span className="font-outfit">{showDeleted ? 'Ocultar' : 'Mostrar'} Eliminados</span>
                            </Button>
                        </div>
                    </div>

                    {showDeleted && (
                        <div className="overflow-x-auto">
                            {deletedTab === 'students' ? (
                                <>
                                    <Table className="min-w-full">
                                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                            <TableRow>
                                                <TableCell isHeader>Nombre</TableCell>
                                                <TableCell isHeader>CURP</TableCell>
                                                <TableCell isHeader>Fecha de Eliminación</TableCell>
                                                <TableCell isHeader>Acciones</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                            {studentsDeleted.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="px-5 py-4 text-center sm:px-6">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                            No hay estudiantes eliminados para este grupo.
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                paginateDeleted(studentsDeleted).map((student: GroupStudent) => (
                                                    <TableRow key={student.student_group_id}>
                                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                                            <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                                {student.student.first_name} {student.student.father_last_name} {student.student.mother_last_name}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                                            <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                                {student.student.curp}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                                            <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                                {formatDate(student.deleted_at as string)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                startIcon={<i className="fa-duotone fa-solid fa-rotate-left"></i>}
                                                                onClick={() => handleRestoreStudent(student.student_group_id)}
                                                                disabled={isSaving}
                                                            >
                                                                <span className="font-outfit">Restaurar</span>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                    {studentsDeleted.length > itemsPerPage && (
                                        <div className="flex justify-between items-center mt-4 px-2">
                                            <div className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                Mostrando {Math.min(itemsPerPage, studentsDeleted.length)} de {studentsDeleted.length} registros
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeletedPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={deletedPage === 1}
                                                >
                                                    <i className="fa-duotone fa-solid fa-chevron-left text-gray-600"></i>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeletedPage(prev => prev + 1)}
                                                    disabled={deletedPage * itemsPerPage >= studentsDeleted.length}
                                                >
                                                    <i className="fa-duotone fa-solid fa-chevron-right text-gray-600"></i>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Table className="min-w-full">
                                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                            <TableRow>
                                                <TableCell isHeader>Materia</TableCell>
                                                <TableCell isHeader>Profesor</TableCell>
                                                <TableCell isHeader>Fecha de Eliminación</TableCell>
                                                <TableCell isHeader>Acciones</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                            {subjectsDeleted.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="px-5 py-4 text-center sm:px-6">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                            No hay materias eliminadas para este grupo.
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                paginateDeleted(subjectsDeleted).map((subject: GroupSubject) => (
                                                    <TableRow key={subject.subject_id}>
                                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                                            <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                                {subject.name}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                                            <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                                {subject.teacher?.name || 'Sin asignar'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                                            <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                                {formatDate(subject.deleted_at as string)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-5 py-4 text-center sm:px-6">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                startIcon={<i className="fa-duotone fa-solid fa-rotate-left"></i>}
                                                                onClick={() => handleRestoreSubject(subject.subject_id)}
                                                                disabled={isSaving}
                                                            >
                                                                <span className="font-outfit">Restaurar</span>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                    {subjectsDeleted.length > itemsPerPage && (
                                        <div className="flex justify-between items-center mt-4 px-2">
                                            <div className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                Mostrando {Math.min(itemsPerPage, subjectsDeleted.length)} de {subjectsDeleted.length} registros
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeletedPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={deletedPage === 1}
                                                >
                                                    <i className="fa-duotone fa-solid fa-chevron-left text-gray-600"></i>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeletedPage(prev => prev + 1)}
                                                    disabled={deletedPage * itemsPerPage >= subjectsDeleted.length}
                                                >
                                                    <i className="fa-duotone fa-solid fa-chevron-right text-gray-600"></i>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </ComponentCard>
            )}

            {/* Modal para Añadir Estudiantes */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedStudents([]);
                }}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl font-outfit">
                            Añadir estudiantes al grupo
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                            Selecciona los estudiantes que deseas añadir al grupo <strong>{selectedGroup?.grade}° {selectedGroup?.group_name}</strong>.
                        </p>
                    </div>
                    <div className="mt-8">
                        <div className="mb-4">
                            <Input
                                type="text"
                                placeholder="Buscar estudiantes disponibles..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                startIcon={<i className="fa-duotone fa-solid fa-search text-gray-400"></i>}
                            />
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {isLoadingMetrics ? (
                                <div className="flex items-center justify-center h-[200px]">
                                    <i className="fa-duotone fa-solid fa-spinner fa-spin text-gray-400"></i>
                                </div>
                            ) : (
                                <Table className="min-w-full">
                                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                        <TableRow>
                                            <TableCell isHeader>
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedStudents(availableStudents.map(s => s.student_id));
                                                        } else {
                                                            setSelectedStudents([]);
                                                        }
                                                    }}
                                                    checked={selectedStudents.length === availableStudents.length}
                                                />
                                            </TableCell>
                                            <TableCell isHeader>Nombre</TableCell>
                                            <TableCell isHeader>CURP</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                        {availableStudents
                                            .filter(student =>
                                                student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                student.father_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                student.mother_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                student.curp.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((student) => (
                                                <TableRow
                                                    key={student.student_id}
                                                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                    onClick={() => {
                                                        if (selectedStudents.includes(student.student_id)) {
                                                            setSelectedStudents(selectedStudents.filter(id => id !== student.student_id));
                                                        } else {
                                                            setSelectedStudents([...selectedStudents, student.student_id]);
                                                        }
                                                    }}
                                                >
                                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                                            checked={selectedStudents.includes(student.student_id)}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                if (e.target.checked) {
                                                                    setSelectedStudents([...selectedStudents, student.student_id]);
                                                                } else {
                                                                    setSelectedStudents(selectedStudents.filter(id => id !== student.student_id));
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                                        <span className="block text-sm font-medium text-gray-800 dark:text-white/90 font-outfit">
                                                            {student.first_name} {student.father_last_name} {student.mother_last_name}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-5 py-4 text-center sm:px-6">
                                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-outfit">
                                                            {student.curp}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        {availableStudents.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="px-5 py-4 text-center sm:px-6">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-outfit">
                                                        No hay estudiantes disponibles para añadir.
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                        <Button
                            onClick={() => {
                                setIsModalOpen(false);
                                setSelectedStudents([]);
                            }}
                            variant="outline"
                            className="sm:w-auto"
                            disabled={isSaving}
                        >
                            <span className="font-outfit">Cancelar</span>
                        </Button>
                        <Button
                            onClick={handleAddStudents}
                            variant="primary"
                            className="sm:w-auto"
                            disabled={selectedStudents.length === 0 || isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <i className="fa-duotone fa-solid fa-spinner fa-spin mr-2"></i>
                                    <span className="font-outfit">Guardando...</span>
                                </>
                            ) : (
                                <span className="font-outfit">Añadir {selectedStudents.length} Estudiantes</span>
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                <ItemsList
                    items={[{
                        id: 1,
                        first_name: 'Juan',
                        last_name: 'Perez',
                        curp: '1234567890',
                        status: 'active'
                    }]}
                    columns={[
                        {
                            key: 'full_name',
                            header: 'Nombre Completo',
                            render: (item) => `${item.first_name} ${item.last_name}`
                        },
                        {
                            key: 'curp',
                            header: 'CURP',
                        },
                        {
                            key: 'status',
                            header: 'Estado',
                            render: (item) => item.status === 'active' ? 'Activo' : 'Inactivo'
                        }
                    ]}
                    isLoading={false}
                    config={{
                        title: 'Estudiantes del grupo',
                        description: 'Lista de estudiantes del grupo seleccionado',
                        addButtonLabel: 'Añadir estudiante',
                        addButtonIcon: 'plus',
                        noDataMessage: 'No hay estudiantes en este grupo',
                    }}
                />
            )}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        </div>
    );
} 