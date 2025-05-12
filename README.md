# Locator ARS Lib

Библиотека для управления проверкой прав доступа во Vue 3 приложениях.

## Установка

```bash
npm install locator-ars-lib
```

или

```bash
yarn add locator-ars-lib
```

## Настройка

Добавьте плагин в ваше Vue приложение:

```typescript
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import LocatorArsLib from "locator-ars-lib";

const app = createApp(App);

// Установка с настройками (опционально)
app.use(LocatorArsLib, {
  baseUrl: "https://your-api.com", // Базовый URL для API (опционально)
  endpoint: "/api/v1/dashboard/access", // Путь для проверки прав (опционально)
});

app.mount("#app");
```

## Использование

### 1. Компонент Check

Оберните компоненты, требующие проверку прав:

```vue
<template>
  <Check action="edit_user">
    <button>Edit User</button>
  </Check>
</template>
```

С фолбэком при отсутствии прав:

```vue
<template>
  <Check action="delete_item">
    <button>Delete</button>

    <template #fallback>
      <span>You don't have permission to delete</span>
    </template>
  </Check>
</template>
```

С отображением загрузки:

```vue
<template>
  <Check action="create_project">
    <button>Create Project</button>

    <template #loading>
      <span>Checking permissions...</span>
    </template>

    <template #fallback>
      <span>No permission</span>
    </template>
  </Check>
</template>
```

### 2. Директива v-can

Используйте директиву для простой проверки на элементах:

```vue
<template>
  <button v-can="'edit_user'">Edit User</button>

  <div v-can="'view_analytics'">
    <!-- Аналитика будет видна только при наличии прав -->
  </div>
</template>
```

### 3. Композиция usePermissions

Для программного использования в компонентах:

```vue
<script setup>
import { usePermissions } from "locator-ars-lib";

// Проверка одного права
const { can, isLoading } = usePermissions("manage_users");

// Проверка с реактивным действием
const action = ref("edit_post");
const { can: canEditPost } = usePermissions(action);

// Ручная проверка
const { check, can: canDeleteUser } = usePermissions("delete_user", {
  autoCheck: false,
});

// Проверить вручную при необходимости
function handleDelete() {
  check().then(() => {
    if (canDeleteUser.value) {
      // Выполнить удаление
    }
  });
}
</script>
```

## API

### Компонент Check

| Prop     | Тип     | По умолчанию | Описание                                        |
| -------- | ------- | ------------ | ----------------------------------------------- |
| action   | string  |              | Название действия для проверки                  |
| fallback | boolean | false        | Показывать ли fallback слот при отсутствии прав |

### Директива v-can

```vue
v-can="'action_name'"
```

### usePermissions composable

```typescript
const {
  can, // Computed<boolean> - есть ли права
  isLoading, // Ref<boolean> - выполняется ли загрузка
  error, // Ref<Error | null> - ошибка, если есть
  check, // () => Promise<void> - функция для ручной проверки
} = usePermissions(action, options);
```

| Параметр          | Тип                   | По умолчанию | Описание                             |
| ----------------- | --------------------- | ------------ | ------------------------------------ |
| action            | string \| Ref<string> |              | Название действия для проверки       |
| options.autoCheck | boolean               | true         | Автоматически проверять при создании |

## Лицензия

MIT
