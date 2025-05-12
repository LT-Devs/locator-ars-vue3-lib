import { App, inject, InjectionKey } from 'vue'
import { PermissionsService, PermissionsOptions } from './services/permissionsService'

export const PermissionsKey: InjectionKey<PermissionsService> = Symbol('Permissions')

export function setupPermissions(options?: PermissionsOptions): PermissionsService {
    return new PermissionsService(options)
}

export const PermissionsPlugin = {
    install(app: App, options?: PermissionsOptions) {
        const permissionsService = setupPermissions(options)
        app.provide(PermissionsKey, permissionsService)
    }
}

export function usePermissionsService(): PermissionsService {
    const permissionsService = inject(PermissionsKey)
    if (!permissionsService) {
        throw new Error('Permissions plugin not installed!')
    }
    return permissionsService
} 