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
  application: "my-app-name", // Идентификатор приложения для заголовка Application (опционально)
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

С массивом разрешений:

```vue
<template>
  <Check :action="['edit_user', 'manage_users']">
    <button>Edit User</button>

    <template #fallback>
      <span>You need edit_user or manage_users permission</span>
    </template>
  </Check>
</template>
```

> **Важно:** Компонент Check изначально скрывает основной контент до получения подтверждения о правах доступа. Только после успешной проверки прав происходит отображение контента. До этого момента отображается слот `loading`, если он предоставлен.
>
> **Массив разрешений:** При передаче массива разрешений компонент отобразит основной контент, если у пользователя есть хотя бы одно из указанных разрешений. Это позволяет реализовать логику "ИЛИ" для проверки прав.

### 2. Директивы v-can и v-cant

#### Директива v-can

Используйте директиву для простой проверки на элементах:

```vue
<template>
  <button v-can="'edit_user'">Edit User</button>

  <div v-can="'view_analytics'">
    <!-- Аналитика будет видна только при наличии прав -->
  </div>

  <!-- Использование массива разрешений -->
  <button v-can="['edit_user', 'manage_users']">Edit User</button>
</template>
```

> **Важно:** Директива v-can изначально скрывает элементы, к которым она применена. Элементы отображаются только после успешной проверки прав доступа.
>
> **Массив разрешений:** При передаче массива разрешений элемент будет отображен, если у пользователя есть хотя бы одно из указанных разрешений. Это позволяет реализовать логику "ИЛИ" для проверки прав.

#### Директива v-cant

Используйте директиву v-cant для отображения элементов только при отсутствии прав (противоположность v-can):

```vue
<template>
  <button v-can="'edit_user'">Редактировать</button>
  <div v-cant="'edit_user'" class="no-permission-message">
    У вас нет прав на редактирование
  </div>

  <!-- Использование массива разрешений -->
  <div v-cant="['edit_user', 'manage_users']" class="no-permission-message">
    У вас нет ни одного из необходимых прав
  </div>
</template>
```

> **Оптимизация:** Директивы v-can и v-cant используют общий механизм кеширования запросов на проверку прав. Это значит, что если на странице есть несколько элементов с проверкой одного и того же права, будет отправлен только один запрос к серверу.

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

// Ручная проверка (не выполняется автоматически)
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

| Prop     | Тип                | По умолчанию | Описание                                           |
| -------- | ------------------ | ------------ | -------------------------------------------------- |
| action   | string \| string[] |              | Название действия или массив действий для проверки |
| fallback | boolean            | false        | Показывать ли fallback слот при отсутствии прав    |

### Директивы

#### Директива v-can

```vue
v-can="'action_name'" // или v-can="['action_name1', 'action_name2']"
```

Показывает элемент только при наличии прав доступа. При передаче массива разрешений элемент будет отображен, если у пользователя есть хотя бы одно из указанных разрешений.

#### Директива v-cant

```vue
v-cant="'action_name'" // или v-cant="['action_name1', 'action_name2']"
```

Показывает элемент только при отсутствии прав доступа (противоположность v-can). При передаче массива разрешений элемент будет отображен только если у пользователя нет ни одного из указанных разрешений.

### usePermissions composable

```typescript
const {
  can, // Computed<boolean> - есть ли права
  isLoading, // Ref<boolean> - выполняется ли загрузка
  error, // Ref<Error | null> - ошибка, если есть
  check, // () => Promise<void> - функция для ручной проверки
} = usePermissions(action, options);
```

| Параметр          | Тип                                           | По умолчанию | Описание                                           |
| ----------------- | --------------------------------------------- | ------------ | -------------------------------------------------- |
| action            | string \| string[] \| Ref<string \| string[]> |              | Название действия или массив действий для проверки |
| options.autoCheck | boolean                                       | true         | Автоматически проверять при создании               |

## Особенности реализации

### Кеширование запросов

Библиотека реализует оптимизацию запросов проверки прав для снижения нагрузки на сервер:

- Запросы на проверку одинаковых прав объединяются и выполняются один раз
- Результаты кешируются в памяти в рамках текущей сессии
- При перезагрузке страницы кеш автоматически очищается

### Поведение при загрузке

Все компоненты и директивы по умолчанию скрывают контент до получения подтверждения о правах доступа:

- Компонент Check показывает слот loading во время запроса
- Директивы v-can и v-cant держат элементы скрытыми до получения результата

## Лицензия

MIT
