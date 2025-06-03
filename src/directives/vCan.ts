import { ObjectDirective, DirectiveBinding } from 'vue'
import { PermissionsService } from '../services/permissionsService'

interface CanHTMLElement extends HTMLElement {
    _permission_data?: {
        action: string | string[]
        originalDisplay: string
        permissionChecked?: boolean
    }
}

// Глобальный сервис проверки прав
let globalPermissionsService: PermissionsService | null = null;

// Кэш результатов проверки прав для избежания дублирования запросов
const permissionsCache: Map<string, Promise<boolean>> = new Map();

// Функция для установки экземпляра сервиса (будет вызываться при инициализации плагина)
export function setPermissionsService(service: PermissionsService): void {
    globalPermissionsService = service;
}

// Общая функция проверки прав для обеих директив
async function checkPermission(action: string): Promise<boolean> {
    if (!globalPermissionsService) {
        console.warn('Permissions service not initialized yet.');
        return false;
    }

    // Проверяем есть ли запрос с таким же action уже в процессе выполнения
    if (!permissionsCache.has(action)) {
        // Создаем Promise для проверки прав и сохраняем в кэш
        const permissionPromise = globalPermissionsService.can(action)
            .catch(error => {
                console.error('Error checking permission:', error);
                permissionsCache.delete(action);
                return false;
            });

        permissionsCache.set(action, permissionPromise);
    }

    // Возвращаем результат из кэша (либо готовый, либо ожидающий Promise)
    return permissionsCache.get(action) as Promise<boolean>;
}

// Функция для проверки массива разрешений
async function checkPermissions(actions: string | string[]): Promise<boolean> {
    if (!globalPermissionsService) {
        console.warn('Permissions service not initialized yet.');
        return false;
    }

    if (typeof actions === 'string') {
        return checkPermission(actions);
    }

    // Если передан пустой массив, считаем что прав нет
    if (actions.length === 0) {
        return false;
    }

    // Используем кэш для массива, чтобы избежать повторных запросов
    const cacheKey = JSON.stringify(actions);
    if (!permissionsCache.has(cacheKey)) {
        // Отправляем один запрос с массивом разрешений
        const permissionPromise = globalPermissionsService.can(actions)
            .catch(error => {
                console.error('Error checking permissions:', error);
                permissionsCache.delete(cacheKey);
                return false;
            });

        permissionsCache.set(cacheKey, permissionPromise);
    }

    return permissionsCache.get(cacheKey) as Promise<boolean>;
}

// Общая логика для обработки элементов, применяемая обеими директивами
async function processElement(el: CanHTMLElement, action: string | string[], showWhenAllowed: boolean) {
    const originalDisplay = el.style.display;

    // Store action and original display for updates
    el._permission_data = {
        action,
        originalDisplay,
        permissionChecked: false
    };

    // Скрываем элемент изначально до проверки прав
    el.style.display = 'none';

    try {
        const hasPermission = await checkPermissions(action);

        // Показываем элемент в зависимости от режима и результата проверки
        if ((showWhenAllowed && hasPermission) || (!showWhenAllowed && !hasPermission)) {
            el.style.display = originalDisplay || '';
        }

        el._permission_data.permissionChecked = true;
    } catch (error) {
        console.error('Error in directive processing:', error);
        // При ошибке для v-cant показываем элемент
        if (!showWhenAllowed) {
            el.style.display = originalDisplay || '';
        }
    }
}

export const vCan: ObjectDirective = {
    async mounted(el: CanHTMLElement, binding: DirectiveBinding) {
        await processElement(el, binding.value, true);
    },

    async updated(el: CanHTMLElement, binding: DirectiveBinding) {
        // Проверяем изменение значения, учитывая возможность массива
        const actionChanged = !el._permission_data ||
            (typeof el._permission_data.action !== typeof binding.value) ||
            (typeof binding.value === 'string' && el._permission_data.action !== binding.value) ||
            (Array.isArray(binding.value) &&
                (!Array.isArray(el._permission_data.action) ||
                    JSON.stringify(el._permission_data.action) !== JSON.stringify(binding.value)));

        if (actionChanged) {
            await processElement(el, binding.value, true);
        }
    },

    unmounted(el: CanHTMLElement) {
        if (el._permission_data) {
            el.style.display = el._permission_data.originalDisplay;
            delete el._permission_data;
        }
    }
}

// Директива vCant - противоположность vCan, показывает элемент только если прав НЕТ
export const vCant: ObjectDirective = {
    async mounted(el: CanHTMLElement, binding: DirectiveBinding) {
        await processElement(el, binding.value, false);
    },

    async updated(el: CanHTMLElement, binding: DirectiveBinding) {
        // Проверяем изменение значения, учитывая возможность массива
        const actionChanged = !el._permission_data ||
            (typeof el._permission_data.action !== typeof binding.value) ||
            (typeof binding.value === 'string' && el._permission_data.action !== binding.value) ||
            (Array.isArray(binding.value) &&
                (!Array.isArray(el._permission_data.action) ||
                    JSON.stringify(el._permission_data.action) !== JSON.stringify(binding.value)));

        if (actionChanged) {
            await processElement(el, binding.value, false);
        }
    },

    unmounted(el: CanHTMLElement) {
        if (el._permission_data) {
            el.style.display = el._permission_data.originalDisplay;
            delete el._permission_data;
        }
    }
} 