import axios, { AxiosInstance } from 'axios'

export interface PermissionsOptions {
    baseUrl?: string
    endpoint?: string
}

export class PermissionsService {
    private axios: AxiosInstance
    private cache: Map<string, boolean> = new Map()
    private endpoint: string

    constructor(options?: PermissionsOptions) {
        this.axios = axios.create({
            baseURL: options?.baseUrl || ''
        })
        this.endpoint = options?.endpoint || '/api/v1/dashboard/access'
    }

    async can(action: string): Promise<boolean> {
        // Check if we have a cached result
        if (this.cache.has(action)) {
            return this.cache.get(action) as boolean
        }

        try {
            const response = await this.axios.get(this.endpoint, {
                params: { action }
            })

            const allowed = response.data.allowed || false

            // Cache the result
            this.cache.set(action, allowed)

            return allowed
        } catch (error) {
            console.error(`Error checking permission for ${action}:`, error)
            return false
        }
    }

    clearCache(action?: string): void {
        if (action) {
            this.cache.delete(action)
        } else {
            this.cache.clear()
        }
    }
} 