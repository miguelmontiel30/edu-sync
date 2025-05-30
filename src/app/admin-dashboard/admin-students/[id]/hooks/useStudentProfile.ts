import {useState, useEffect, useCallback} from 'react';
import {StudentProfile, LoadingState, ErrorState} from '../module-utils/types';
import {getStudentProfile} from '../module-utils/services';

/**
 * Hook para gestionar el perfil completo de un estudiante
 * @param studentId ID del estudiante
 * @returns Estado y funciones para gestionar el perfil
 */
export default function useStudentProfile(studentId: string) {
    // Estados
    const [student, setStudent] = useState<StudentProfile['student']>(null);
    const [addresses, setAddresses] = useState<StudentProfile['addresses']>([]);
    const [tutors, setTutors] = useState<StudentProfile['tutors']>([]);
    const [payments, setPayments] = useState<StudentProfile['payments']>([]);
    const [grades, setGrades] = useState<StudentProfile['grades']>([]);
    const [attendance, setAttendance] = useState<StudentProfile['attendance']>([]);
    const [badges, setBadges] = useState<StudentProfile['badges']>([]);
    const [groups, setGroups] = useState<StudentProfile['groups']>([]);

    // Estados de carga y error
    const [loadingState, setLoadingState] = useState<LoadingState>({
        student: true,
        addresses: true,
        tutors: true,
        payments: true,
        grades: true,
        attendance: true,
        badges: true,
        groups: true,
    });

    const [errorState, setErrorState] = useState<ErrorState>({});

    /**
     * Función para cargar los datos del estudiante
     */
    const loadStudentData = useCallback(async () => {
        if (!studentId) return;

        try {
            // Iniciar la carga
            setLoadingState(prev => ({...prev, student: true}));
            setErrorState(prev => ({...prev, student: undefined}));

            // Obtener el perfil completo usando el servicio
            const profileData = await getStudentProfile(studentId);

            console.log('profileData: ', profileData);

            // Actualizar los estados con los datos obtenidos
            setStudent(profileData.student);
            setAddresses(profileData.addresses);
            setTutors(profileData.tutors);
            setPayments(profileData.payments);
            setGrades(profileData.grades);
            setAttendance(profileData.attendance);
            setBadges(profileData.badges);
            setGroups(profileData.groups);

            // Finalizar la carga
            setLoadingState({
                student: false,
                addresses: false,
                tutors: false,
                payments: false,
                grades: false,
                attendance: false,
                badges: false,
                groups: false,
            });
        } catch (error) {
            console.error('Error loading student data:', error);

            // Manejar el error
            setErrorState(prev => ({
                ...prev,
                student: 'Error al cargar los datos del estudiante',
            }));

            // Finalizar la carga con error
            setLoadingState(prev => ({...prev, student: false}));
        }
    }, [studentId]);

    // Cargar datos al montar el componente o cambiar el ID
    useEffect(() => {
        loadStudentData();
    }, [loadStudentData]);

    return {
        student,
        addresses,
        tutors,
        payments,
        grades,
        attendance,
        badges,
        groups,
        loadingState,
        errorState,
        loadStudentData,
    };
}
