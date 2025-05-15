import { App, inject, InjectionKey } from 'vue'
import { PermissionsService, PermissionsOptions } from './services/permissionsService'
import { setPermissionsService } from './directives/vCan'

export const PermissionsKey: InjectionKey<PermissionsService> = Symbol('Permissions')

/**
 * Setup permissions service with provided options
 * @param options Configuration options
 * @param options.baseUrl Base URL for API requests
 * @param options.endpoint Custom endpoint for permission checks
 * @param options.application Application identifier to be sent as a header
 * @returns Configured PermissionsService instance
 */
export function setupPermissions(options?: PermissionsOptions): PermissionsService {
    const service = new PermissionsService(options);
    // Устанавливаем глобальный сервис для директивы
    setPermissionsService(service);
    return service;
}

export const PermissionsPlugin = {
    install(app: App, options?: PermissionsOptions) {
        const permissionsService = setupPermissions(options);
        app.provide(PermissionsKey, permissionsService);

        // Добавим сервис в глобальные свойства Vue для доступа откуда угодно
        app.config.globalProperties.$permissions = permissionsService;
    }
}

export function usePermissionsService(): PermissionsService {
    const permissionsService = inject(PermissionsKey);
    if (!permissionsService) {
        throw new Error('Permissions plugin not installed!');
    }
    return permissionsService;
} 