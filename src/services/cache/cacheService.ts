/**
 * Servicio de caché en memoria para reducir llamadas a API
 */
type CacheData = {
    [key: string]: {
        data: any;
        timestamp: number;
        expiry: number;
    };
};

class CacheService {
    private static instance: CacheService;
    private cache: CacheData = {};
    private defaultExpiry = 5 * 60 * 1000; // 5 minutos por defecto

    private constructor() {}

    public static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    /**
     * Guarda datos en caché
     * @param key Clave para identificar los datos
     * @param data Datos a guardar
     * @param expiry Tiempo de expiración en ms (opcional, por defecto 5 min)
     */
    public set(key: string, data: any, expiry: number = this.defaultExpiry): void {
        this.cache[key] = {
            data,
            timestamp: Date.now(),
            expiry,
        };
    }

    /**
     * Obtiene datos de la caché
     * @param key Clave de los datos
     * @returns Datos almacenados o null si no existen o están expirados
     */
    public get<T>(key: string): T | null {
        const item = this.cache[key];

        if (!item) return null;

        // Comprobar si los datos han expirado
        if (Date.now() > item.timestamp + item.expiry) {
            this.remove(key);
            return null;
        }

        return item.data as T;
    }

    /**
     * Comprueba si existe una clave en la caché y no ha expirado
     */
    public has(key: string): boolean {
        const item = this.cache[key];
        if (!item) return false;

        if (Date.now() > item.timestamp + item.expiry) {
            this.remove(key);
            return false;
        }

        return true;
    }

    /**
     * Elimina datos de la caché
     */
    public remove(key: string): void {
        delete this.cache[key];
    }

    /**
     * Limpia toda la caché
     */
    public clear(): void {
        this.cache = {};
    }
}

export default CacheService.getInstance();
