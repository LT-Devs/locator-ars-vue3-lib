import { App } from 'vue'
import Check from './components/Check.vue'
import { usePermissions } from './composables/usePermissions'
import { PermissionsPlugin, setupPermissions, usePermissionsService } from './plugin'
import { vCan } from './directives/vCan'

// Именованные экспорты
export {
    Check,
    usePermissions,
    setupPermissions,
    vCan,
    usePermissionsService
}

// Создаем основной объект плагина
const plugin = {
    install(app: App, options?: { baseUrl?: string }) {
        app.use(PermissionsPlugin, options)
        app.component('Check', Check)
        app.directive('can', vCan)
    }
}

// Экспортируем плагин как по умолчанию
export default plugin 