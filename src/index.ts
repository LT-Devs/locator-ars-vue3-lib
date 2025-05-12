import { App } from 'vue'
import Check from './components/Check.vue'
import { usePermissions } from './composables/usePermissions'
import { PermissionsPlugin, setupPermissions, usePermissionsService } from './plugin'
import { vCan, vCant, setPermissionsService } from './directives/vCan'

// Именованные экспорты
export {
    Check,
    usePermissions,
    setupPermissions,
    vCan,
    vCant,
    usePermissionsService,
    setPermissionsService
}

// Создаем основной объект плагина
const plugin = {
    install(app: App, options?: { baseUrl?: string }) {
        // Важно: сначала нужно инициализировать PermissionsPlugin для provide/inject механизма
        app.use(PermissionsPlugin, options)

        // Затем регистрируем компонент и директивы
        app.component('Check', Check)
        app.directive('can', vCan)
        app.directive('cant', vCant)
    }
}

// Экспортируем плагин как по умолчанию
export default plugin 