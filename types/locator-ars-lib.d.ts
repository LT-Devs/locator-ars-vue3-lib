declare module 'locator-ars-lib' {
    import { App, Component, Ref, ComputedRef, ObjectDirective } from 'vue'

    export interface PermissionsOptions {
        baseUrl?: string
        endpoint?: string
        application?: string
    }

    export interface UsePermissionsOptions {
        autoCheck?: boolean
    }

    export interface UsePermissionsResult {
        isAllowed: Ref<boolean | null>
        isLoading: Ref<boolean>
        error: Ref<Error | null>
        check: () => Promise<void>
        can: ComputedRef<boolean>
    }

    export class PermissionsService {
        constructor(options?: PermissionsOptions)
        can(action: string | string[]): Promise<boolean>
        clearCache(action?: string): void
    }

    export const Check: Component
    export const vCan: ObjectDirective

    export function usePermissions(
        action: string | string[] | Ref<string | string[]>,
        options?: UsePermissionsOptions
    ): UsePermissionsResult

    export function setupPermissions(
        options?: PermissionsOptions
    ): PermissionsService

    export function usePermissionsService(): PermissionsService

    const plugin: {
        install(app: App, options?: PermissionsOptions): void
    }

    export default plugin
} 