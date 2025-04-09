'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import statusService, { Status } from '@/services/status/statusService';

interface StatusContextType {
    schoolYearStatuses: Status[];
    groupStatuses: Status[];
    studentGroupStatuses: Status[];
    evaluationPeriodStatuses: Status[];
    isLoading: boolean;
    refreshStatuses: () => Promise<void>;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const useStatusContext = () => {
    const context = useContext(StatusContext);
    if (context === undefined) {
        throw new Error('useStatusContext debe ser usado dentro de un StatusProvider');
    }
    return context;
};

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [schoolYearStatuses, setSchoolYearStatuses] = useState<Status[]>([]);
    const [groupStatuses, setGroupStatuses] = useState<Status[]>([]);
    const [studentGroupStatuses, setStudentGroupStatuses] = useState<Status[]>([]);
    const [evaluationPeriodStatuses, setEvaluationPeriodStatuses] = useState<Status[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadAllStatuses = async () => {
        setIsLoading(true);
        try {
            const [
                schoolYear,
                group,
                studentGroup,
                evaluationPeriod
            ] = await Promise.all([
                statusService.getSchoolYearStatuses(),
                statusService.getGroupStatuses(),
                statusService.getStudentGroupStatuses(),
                statusService.getEvaluationPeriodStatuses()
            ]);

            setSchoolYearStatuses(schoolYear);
            setGroupStatuses(group);
            setStudentGroupStatuses(studentGroup);
            setEvaluationPeriodStatuses(evaluationPeriod);
        } catch (error) {
            console.error('Error cargando estados:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar estados al montar el componente
    useEffect(() => {
        loadAllStatuses();
    }, []);

    const refreshStatuses = async () => {
        // Limpiar la caché antes de recargar
        statusService.clearStatusCache();
        await loadAllStatuses();
    };

    return (
        <StatusContext.Provider
            value={{
                schoolYearStatuses,
                groupStatuses,
                studentGroupStatuses,
                evaluationPeriodStatuses,
                isLoading,
                refreshStatuses
            }}
        >
            {children}
        </StatusContext.Provider>
    );
};

// Helpers para acceder a estados específicos por código
export const useSchoolYearStatusByCode = (code: string) => {
    const { schoolYearStatuses } = useStatusContext();
    return schoolYearStatuses.find(status => status.code === code);
};

export const useGroupStatusByCode = (code: string) => {
    const { groupStatuses } = useStatusContext();
    return groupStatuses.find(status => status.code === code);
};

export const useStudentGroupStatusByCode = (code: string) => {
    const { studentGroupStatuses } = useStatusContext();
    return studentGroupStatuses.find(status => status.code === code);
};

export const useEvaluationPeriodStatusByCode = (code: string) => {
    const { evaluationPeriodStatuses } = useStatusContext();
    return evaluationPeriodStatuses.find(status => status.code === code);
};

export default StatusContext; 