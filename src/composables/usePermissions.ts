import { ref, computed, Ref, watch, onUnmounted } from 'vue'
import { usePermissionsService } from '../plugin'

export interface UsePermissionsOptions {
    autoCheck?: boolean
}

export function usePermissions(action: string | Ref<string>, options: UsePermissionsOptions = {}) {
    const permissionsService = usePermissionsService()
    const isAllowed = ref<boolean | null>(null)
    const isLoading = ref(false)
    const error = ref<Error | null>(null)

    const actionValue = computed(() => {
        return typeof action === 'string' ? action : action.value
    })

    const checkPermission = async () => {
        if (!actionValue.value) return

        isLoading.value = true
        error.value = null

        try {
            isAllowed.value = await permissionsService.can(actionValue.value)
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err))
            isAllowed.value = false
        } finally {
            isLoading.value = false
        }
    }

    // Auto-check on mount if requested
    if (options.autoCheck !== false) {
        checkPermission()
    }

    // Re-check when action changes
    if (typeof action !== 'string') {
        const unwatch = watch(action, () => {
            checkPermission()
        })

        onUnmounted(() => {
            unwatch()
        })
    }

    return {
        isAllowed,
        isLoading,
        error,
        check: checkPermission,
        can: computed(() => isAllowed.value === true)
    }
} 