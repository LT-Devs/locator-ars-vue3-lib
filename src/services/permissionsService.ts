import axios, { AxiosInstance } from 'axios'

export interface PermissionsOptions {
    baseUrl?: string
    endpoint?: string
    application?: string
}

export class PermissionsService {
    private axios: AxiosInstance
    private cache: Map<string, boolean | string> = new Map()
    private endpoint: string
    private application?: string

    constructor(options?: PermissionsOptions) {
        this.axios = axios.create({
            baseURL: options?.baseUrl || ''
        })
        this.endpoint = options?.endpoint || '/api/v1/dashboard/access'
        this.application = options?.application

        // Если указано application, добавляем его в заголовки по умолчанию
        if (this.application) {
            this.axios.defaults.headers.common['Application'] = this.application
        }
    }

    async can(action: string | string[]): Promise<boolean> {
        // Преобразуем массив в строку вида ['value1','value2','value3']
        const actionKey = Array.isArray(action) ? JSON.stringify(action) : action;

        // Check if we have a cached result
        if (this.cache.has(actionKey)) {
            return this.cache.get(actionKey) as boolean;
        }

        try {
            let params: { action: string | string[] } = { action };

            // Если это массив, преобразуем его в строку вида ['value1','value2','value3']
            if (Array.isArray(action)) {
                params = { action: JSON.stringify(action) };
            }

            const response = await this.axios.get(this.endpoint, { params });
            const allowed = response.data.allowed || false;

            // Cache the result
            this.cache.set(actionKey, allowed);

            return allowed;
        } catch (error) {
            console.error(`Error checking permission for ${Array.isArray(action) ? JSON.stringify(action) : action}:`, error);
            return false;
        }
    }

    clearCache(action?: string): void {
        if (action) {
            this.cache.delete(action);
        } else {
            this.cache.clear();
        }
    }
} 