export interface MetricConfig {
    id: string;
    icon: string;
    title: string;
    value: string | number;
    badgeColor?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark';
    badgeText?: string;
}
