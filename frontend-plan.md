# Детальный план реализации настройки формы компонентов (Фронтенд)

## Задача 1: Добавление кнопки "Настроить форму" на страницу редактирования типа контента

**Описание:** Добавить кнопку "Настроить форму" рядом с кнопкой "Настроить Blueprints" на странице `/content-types/:slug`.

**Действия:**

- Открыть файл `src/pages/PostTypeEditorPage/PostTypeEditorPage.tsx`
- Добавить кнопку "Настроить форму" в блок с кнопками действий (рядом с "Настроить Blueprints")
- Использовать иконку `Settings` из `lucide-react` (или другую подходящую)
- Кнопка должна быть видна только в режиме редактирования (`isEditMode`)
- Кнопка должна вести на новый маршрут `/content-types/:slug/form-config`

**Файлы для изменения:**

- `src/pages/PostTypeEditorPage/PostTypeEditorPage.tsx`

**Зависимости:** Нет

---

## Задача 2: Создание нового маршрута для страницы настройки формы

**Описание:** Добавить новый маршрут в роутер приложения для страницы настройки формы компонентов.

**Действия:**

- Найти файл с определением роутов (обычно `src/App.tsx` или `src/main.tsx`)
- Добавить новый маршрут `/content-types/:slug/form-config`
- Маршрут должен рендерить компонент `FormConfigPage` (будет создан в следующей задаче)
- Добавить новый URL в `src/PageUrl.ts`: `ContentTypesFormConfig: '/content-types/:slug/form-config'`

**Файлы для изменения:**

- `src/PageUrl.ts` (добавить новый URL)
- Файл с роутингом (найти и добавить маршрут)

**Зависимости:** Задача 1

---

## Задача 3: Создание страницы настройки формы компонентов (FormConfigPage)

**Описание:** Создать новую страницу для настройки формы компонентов, аналогичную `BlueprintSchemaPage`.

**Действия:**

- Создать директорию `src/pages/FormConfigPage/`
- Создать файл `FormConfigPage.tsx` с базовой структурой страницы
- Реализовать:
  - Breadcrumbs навигацию (Типы контента / Редактирование / Настройка формы)
  - Загрузку схемы blueprint для текущего типа контента
  - Отображение списка узлов схемы
  - Для каждого узла: выбор компонента и настройка его параметров
- Использовать структуру, аналогичную `BlueprintSchemaPage.tsx`
- Добавить состояние загрузки и обработку ошибок

**Файлы для создания:**

- `src/pages/FormConfigPage/FormConfigPage.tsx`

**Зависимости:** Задача 2

---

## Задача 4: Создание Store для управления состоянием настройки формы (FormConfigStore)

**Описание:** Создать MobX store для управления состоянием страницы настройки формы компонентов.

**Действия:**

- Создать файл `src/pages/FormConfigPage/FormConfigStore.ts`
- Реализовать класс `FormConfigStore` с использованием `makeAutoObservable`
- Добавить свойства:
  - `pending: boolean` - флаг выполнения операции
  - `initialLoading: boolean` - флаг начальной загрузки
  - `blueprintSchema: ZBlueprintSchema | null` - загруженная схема blueprint
  - `formConfig: Record<string, ZEditComponent> | null` - текущая конфигурация формы (ключ - путь к узлу)
  - `postTypeSlug: string | null` - slug текущего типа контента
- Добавить методы:
  - `loadBlueprintSchema(blueprintId: number): Promise<void>` - загрузка схемы blueprint
  - `loadFormConfig(postTypeSlug: string, blueprintId: number): Promise<void>` - загрузка сохранённой конфигурации формы
  - `saveFormConfig(postTypeSlug: string, blueprintId: number, config: Record<string, ZEditComponent>): Promise<void>` - сохранение конфигурации
  - `setComponentForNode(nodePath: string, component: ZEditComponent): void` - установка компонента для узла
  - `getComponentForNode(nodePath: string): ZEditComponent | undefined` - получение компонента для узла

**Файлы для создания:**

- `src/pages/FormConfigPage/FormConfigStore.ts`

**Зависимости:** Задача 3

---

## Задача 5: Создание API функций для работы с конфигурацией формы

**Описание:** Создать API функции для загрузки и сохранения конфигурации формы компонентов.

**Действия:**

- Создать файл `src/api/apiFormConfig.ts`
- Реализовать функции:
  - `getFormConfig(postTypeSlug: string, blueprintId: number): Promise<Record<string, ZEditComponent>>` - получение конфигурации
  - `saveFormConfig(postTypeSlug: string, blueprintId: number, config: Record<string, ZEditComponent>): Promise<void>` - сохранение конфигурации
- Использовать составной ключ `postTypeSlug-blueprintId` для идентификации конфигурации
- Использовать `rest` из `@/api/rest` для HTTP запросов
- Добавить валидацию ответов через Zod схемы
- Обработать случай, когда конфигурация ещё не существует (возвращать пустой объект)

**Файлы для создания:**

- `src/api/apiFormConfig.ts`
- `src/types/formConfig.ts` (Zod схемы для валидации)

**Зависимости:** Задача 4

---

## Задача 6: Создание компонента для отображения и выбора компонента для узла схемы

**Описание:** Создать компонент, который отображает узел схемы blueprint и позволяет выбрать компонент для этого узла.

**Действия:**

- Создать файл `src/components/formConfig/NodeComponentSelector.tsx`
- Компонент должен:
  - Принимать узел схемы (`ZBlueprintSchemaField`) и путь к узлу
  - Определять доступные компоненты через `getAllowedComponents(dataType, cardinality)`
  - Отображать Select для выбора типа компонента
  - При выборе компонента показывать форму настроек компонента (на основе `ZEditComponent`)
  - Использовать `zEditComponent` для валидации выбранного компонента
- Использовать Ant Design компоненты (`Select`, `Form`)
- Интегрировать с `FormConfigStore` для сохранения выбора

**Файлы для создания:**

- `src/components/formConfig/NodeComponentSelector.tsx`

**Зависимости:** Задача 4, Задача 5

---

## Задача 7: Создание компонента формы настроек компонента

**Описание:** Создать компонент, который динамически генерирует форму настроек выбранного компонента на основе его метаданных.

**Действия:**

- Создать файл `src/components/formConfig/ComponentSettingsForm.tsx`
- Компонент должен:
  - Принимать тип компонента (`ZEditComponent['name']`)
  - Генерировать форму на основе схемы `zEditComponent` (из `ZComponent.ts`)
  - Для каждого типа компонента (inputText, inputNumber и т.д.) создавать соответствующие поля формы
  - Использовать Ant Design `Form` и соответствующие контролы (`Input`, `InputNumber` и т.д.)
  - Валидировать данные через Zod схему
  - Сохранять настройки в `FormConfigStore`
- Использовать `zEditComponent` для определения структуры формы

**Файлы для создания:**

- `src/components/formConfig/ComponentSettingsForm.tsx`

**Зависимости:** Задача 6

---

## Задача 8: Реализация отображения дерева узлов схемы с возможностью настройки

**Описание:** Создать компонент для отображения иерархической структуры узлов схемы blueprint с возможностью настройки компонентов для каждого узла.

**Действия:**

- Создать файл `src/components/formConfig/SchemaTree.tsx`
- Компонент должен:
  - Принимать схему blueprint (`ZBlueprintSchema`)
  - Рекурсивно отображать дерево узлов схемы
  - Для каждого узла использовать `NodeComponentSelector`
  - Отображать путь к узлу (например, "title", "author.name")
  - Показывать тип данных узла и его кардинальность (one/many)
  - Использовать Ant Design `Tree` или кастомную реализацию с `Card` компонентами
- Интегрировать с `FormConfigStore` для загрузки и сохранения конфигурации

**Файлы для создания:**

- `src/components/formConfig/SchemaTree.tsx`

**Зависимости:** Задача 6, Задача 7

---

## Задача 9: Реализация логики сохранения конфигурации формы

**Описание:** Реализовать функциональность сохранения конфигурации формы на бэкенд при нажатии кнопки "Сохранить".

**Действия:**

- В `FormConfigPage.tsx` добавить кнопку "Сохранить" в header страницы
- При нажатии на кнопку:
  - Собрать всю конфигурацию из `FormConfigStore`
  - Валидировать конфигурацию через `zEditComponent` для каждого узла
  - Вызвать метод `saveFormConfig` из `FormConfigStore`
  - Показать уведомление об успешном сохранении или ошибке
  - Обработать ошибки валидации и сетевые ошибки
- Использовать `notificationService` для показа уведомлений
- Добавить состояние загрузки во время сохранения

**Файлы для изменения:**

- `src/pages/FormConfigPage/FormConfigPage.tsx`
- `src/pages/FormConfigPage/FormConfigStore.ts`

**Зависимости:** Задача 5, Задача 8

---

## Задача 10: Интеграция загрузки конфигурации при открытии страницы

**Описание:** Реализовать автоматическую загрузку схемы blueprint и сохранённой конфигурации формы при открытии страницы настройки формы.

**Действия:**

- В `FormConfigPage.tsx` добавить `useEffect` для загрузки данных при монтировании
- Загрузить:
  1. Тип контента по slug (для получения `blueprint_id`)
  2. Схему blueprint через `getBlueprintSchema(blueprintId)`
  3. Сохранённую конфигурацию формы через `getFormConfig(postTypeSlug, blueprintId)`
- Обработать случаи:
  - Тип контента не имеет привязанного blueprint (показать сообщение)
  - Конфигурация ещё не существует (начать с пустой конфигурации)
  - Ошибки загрузки (показать ошибку пользователю)
- Использовать `FormConfigStore` для управления состоянием загрузки

**Файлы для изменения:**

- `src/pages/FormConfigPage/FormConfigPage.tsx`
- `src/pages/FormConfigPage/FormConfigStore.ts`

**Зависимости:** Задача 3, Задача 4, Задача 5

---

## Дополнительные замечания

- Все компоненты должны быть обёрнуты в `observer` из `mobx-react-lite` для реактивности
- Использовать существующие утилиты (`onError`, `notificationService`) для обработки ошибок
- Следовать правилам стиля кода проекта (TypeScript, React, MobX, AntD, Tailwind)
- Добавить JSDoc комментарии для всех публичных функций и компонентов
- Использовать существующие паттерны из `BlueprintSchemaPage` как референс
