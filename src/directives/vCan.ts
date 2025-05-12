import { ObjectDirective, DirectiveBinding } from 'vue'
import { usePermissionsService } from '../plugin'

interface CanHTMLElement extends HTMLElement {
    _permission_data?: {
        action: string
        originalDisplay: string
    }
}

export const vCan: ObjectDirective = {
    async mounted(el: CanHTMLElement, binding: DirectiveBinding) {
        // Store original display value
        const originalDisplay = el.style.display

        // Store action and original display for updates
        el._permission_data = {
            action: binding.value,
            originalDisplay
        }

        const permissionsService = usePermissionsService()
        const hasPermission = await permissionsService.can(binding.value)

        if (!hasPermission) {
            el.style.display = 'none'
        }
    },

    async updated(el: CanHTMLElement, binding: DirectiveBinding) {
        if (!el._permission_data || el._permission_data.action !== binding.value) {
            // Action has changed or directive is new
            el._permission_data = {
                action: binding.value,
                originalDisplay: el.style.display || ''
            }

            const permissionsService = usePermissionsService()
            const hasPermission = await permissionsService.can(binding.value)

            if (!hasPermission) {
                el.style.display = 'none'
            } else {
                el.style.display = el._permission_data.originalDisplay
            }
        }
    },

    unmounted(el: CanHTMLElement) {
        if (el._permission_data) {
            el.style.display = el._permission_data.originalDisplay
            delete el._permission_data
        }
    }
} 