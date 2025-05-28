import {CalendarEvent} from '@/components/core/calendar/types';

export interface DatabaseEvent {
    event_id: number;
    school_id: number;
    event_type_id: number;
    school_year_id: number;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    all_day: boolean;
    status_id: number;
    created_by: number;
    delete_flag: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    event_type?: {
        event_type_id: number;
        name: string;
        color: string;
        icon: string;
    };
    recipients?: Array<{
        event_recipient_id: number;
        event_id: number;
        role_id: number;
        recipient_id?: number;
        recipient_type?: string;
    }>;
}

export interface CalendarData {
    events: CalendarEvent[];
    eventTypes: EventType[];
    roles: Role[];
}

export interface EventType {
    event_type_id: number;
    name: string;
    color: string;
    icon: string;
}

export interface Role {
    id: number;
    name: string;
    [key: string]: any;
}

export interface EventData {
    school_id: number;
    event_type_id: number;
    school_year_id: number;
    title: string;
    description: string;
    start_time: string;
    end_time?: string;
    all_day?: boolean;
    status_id: number;
    created_by: number;
    [key: string]: any;
}

export interface EventRecipient {
    event_id?: number;
    role_id: number;
    recipient_id?: number;
    recipient_type?: string;
}

export interface RepositoryResponse {
    success: boolean;
    data?: any;
    error?: any;
}
