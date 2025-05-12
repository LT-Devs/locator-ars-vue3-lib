import { App } from 'vue'
import Check from './components/Check.vue'
import { usePermissions } from './composables/usePermissions'
import { PermissionsPlugin, setupPermissions } from './plugin'
import { vCan } from './directives/vCan'

export {
    Check,
    usePermissions,
    setupPermissions,
    vCan
}

export default {
    install(app: App, options?: { baseUrl?: string }) {
        app.use(PermissionsPlugin, options)
        app.component('Check', Check)
        app.directive('can', vCan)
    }
} 