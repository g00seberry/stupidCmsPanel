# План реализации ValidationRulesForm v2

## Обзор
Полная переделка формы валидации правил с новым UX: теги для правил, модальное окно выбора, регистр правил для рендеринга компонентов.

## Задачи

### 1. Создать типы для регистра правил
**Файл:** `src/types/validationRuleRegistry.ts`
- Создать тип `RuleKey` - ключ правила (required, min, max, pattern, etc.)
- Создать тип `RuleMeta` - метаданные правила (label, description, category)
- Создать тип `RuleConfig` - конфигурация правила (компонент рендера, валидация, зависимости)
- Создать тип `ValidationRuleRegistry` - регистр всех правил

### 2. Создать утилиту для определения доступных правил
**Файл:** `src/utils/validationRuleRegistry.ts`
- Функция `getAvailableRules(dataType, cardinality)` - возвращает список доступных правил
- Функция `getRuleMeta(ruleKey)` - возвращает метаданные правила
- Функция `isRuleAvailable(ruleKey, dataType, cardinality)` - проверяет доступность правила

### 3. Создать базовые компоненты рендеринга правил
**Файл:** `src/components/paths/validationRules/RuleRenderers.tsx`
- Компонент `RequiredRuleRenderer` - для правила required (Switch)
- Компонент `MinMaxRuleRenderer` - для правил min/max (InputNumber)
- Компонент `PatternRuleRenderer` - для правила pattern (Input)
- Компонент `ArrayItemsRuleRenderer` - для array_min_items/array_max_items (InputNumber)
- Компонент `ArrayUniqueRuleRenderer` - для array_unique (Switch)

### 4. Создать компоненты для сложных правил
**Файл:** `src/components/paths/validationRules/ConditionalRuleRenderer.tsx`
- Компонент `ConditionalRuleRenderer` - для required_if, prohibited_unless, required_unless, prohibited_if
- Поддержка простого (строка) и расширенного (объект) форматов
- Переключатель простой/расширенный формат

### 5. Создать компонент для правила unique
**Файл:** `src/components/paths/validationRules/UniqueRuleRenderer.tsx`
- Компонент `UniqueRuleRenderer` - для правила unique
- Поддержка простого (строка) и расширенного (объект) форматов
- Поля: table, column, except, where

### 6. Создать компонент для правила exists
**Файл:** `src/components/paths/validationRules/ExistsRuleRenderer.tsx`
- Компонент `ExistsRuleRenderer` - для правила exists
- Поддержка простого (строка) и расширенного (объект) форматов
- Поля: table, column, where

### 7. Создать компонент для правила field_comparison
**Файл:** `src/components/paths/validationRules/FieldComparisonRuleRenderer.tsx`
- Компонент `FieldComparisonRuleRenderer` - для правила field_comparison
- Поля: operator, field, value
- Валидация: должно быть указано либо field, либо value

### 8. Создать регистр правил
**Файл:** `src/utils/validationRuleRegistry.ts` (расширение)
- Объект `validationRuleRegistry` - регистр всех правил
- Каждое правило содержит: key, meta, renderer, dependencies
- Функция `getRuleRenderer(ruleKey)` - возвращает компонент рендера
- Функция `getRuleCategory(ruleKey)` - возвращает категорию правила

### 9. Создать компонент тега правила
**Файл:** `src/components/paths/validationRules/RuleTag.tsx`
- Компонент `RuleTag` - отображает правило в виде тега
- Показывает название правила и иконку удаления
- При клике открывает модальное окно редактирования
- Поддержка readonly режима

### 10. Создать компонент списка тегов правил
**Файл:** `src/components/paths/validationRules/RuleTagsList.tsx`
- Компонент `RuleTagsList` - отображает все активные правила в виде тегов
- Использует `RuleTag` для каждого правила
- Пустое состояние, если правил нет
- Синхронизация с формой через Form.useWatch

### 11. Создать модальное окно выбора правил
**Файл:** `src/components/paths/validationRules/RuleSelectorModal.tsx`
- Компонент `RuleSelectorModal` - модальное окно для выбора правил
- Список доступных правил с чекбоксами (можно выбрать несколько)
- Группировка по категориям (Базовые, Массивы, Условные, и т.д.)
- Фильтрация уже выбранных правил
- Кнопки "Добавить" и "Отмена"

### 12. Создать модальное окно редактирования правила
**Файл:** `src/components/paths/validationRules/RuleEditModal.tsx`
- Компонент `RuleEditModal` - модальное окно для редактирования правила
- Динамический рендеринг формы на основе типа правила (через регистр)
- Кнопки "Сохранить" и "Удалить"
- Валидация формы перед сохранением

### 13. Создать хук для управления правилами
**Файл:** `src/components/paths/validationRules/useValidationRules.ts`
- Хук `useValidationRules` - управление состоянием правил
- Функции: addRule, removeRule, updateRule, getActiveRules
- Синхронизация с формой Ant Design
- Нормализация данных при сохранении

### 14. Создать основной компонент ValidationRulesFormV2
**Файл:** `src/components/paths/ValidationRulesFormV2.tsx`
- Компонент `ValidationRulesFormV2` - новая версия формы
- Использует `RuleTagsList` для отображения правил
- Кнопка "Добавить правило" открывает `RuleSelectorModal`
- Интеграция с формой через пропсы (form, dataType, cardinality, isReadonly)
- Обработка изменений dataType/cardinality (скрытие недоступных правил)

### 15. Обновить нормализацию правил для новой структуры
**Файл:** `src/utils/validationRules.ts` (обновление)
- Убедиться, что функции нормализации работают с новой структурой
- Добавить функции для работы с массивом активных правил
- Функция `getActiveRulesFromForm(form)` - извлекает активные правила из формы

### 16. Добавить утилиты для работы с правилами
**Файл:** `src/utils/validationRules.ts` (расширение)
- Функция `getRuleValue(form, ruleKey)` - получает значение правила из формы
- Функция `setRuleValue(form, ruleKey, value)` - устанавливает значение правила
- Функция `removeRule(form, ruleKey)` - удаляет правило из формы
- Функция `hasRule(form, ruleKey)` - проверяет наличие правила

### 17. Интегрировать ValidationRulesFormV2 в NodeFormTabs
**Файл:** `src/components/paths/NodeFormTabs.tsx`
- Заменить `ValidationRulesForm` на `ValidationRulesFormV2`
- Обновить импорты
- Убедиться, что пропсы передаются корректно
- Проверить работу в режимах create/edit

### 18. Добавить стилизацию компонентов
**Файл:** `src/components/paths/validationRules/*.tsx`
- Использовать Tailwind классы для стилизации
- Адаптивный дизайн для модальных окон
- Состояния hover/focus для интерактивных элементов
- Иконки для типов правил (через Ant Design Icons)

### 19. Добавить обработку ошибок и валидацию
**Файл:** `src/components/paths/validationRules/*.tsx`
- Валидация форм в модальных окнах
- Обработка ошибок при сохранении правил
- Показ сообщений об ошибках через Ant Design message
- Валидация зависимостей между правилами (например, min <= max)

### 20. Тестирование и финальная полировка
**Файл:** Все файлы
- Проверить работу всех типов правил
- Проверить работу в разных комбинациях dataType/cardinality
- Проверить режим readonly
- Проверить нормализацию данных при сохранении
- Удалить старый ValidationRulesForm (или оставить для обратной совместимости)
- Обновить документацию компонентов

## Структура файлов

```
src/
├── components/
│   └── paths/
│       ├── ValidationRulesFormV2.tsx (основной компонент)
│       └── validationRules/
│           ├── RuleTag.tsx
│           ├── RuleTagsList.tsx
│           ├── RuleSelectorModal.tsx
│           ├── RuleEditModal.tsx
│           ├── RuleRenderers.tsx
│           ├── ConditionalRuleRenderer.tsx
│           ├── UniqueRuleRenderer.tsx
│           ├── ExistsRuleRenderer.tsx
│           └── FieldComparisonRuleRenderer.tsx
├── utils/
│   ├── validationRuleRegistry.ts (регистр правил)
│   └── validationRules.ts (обновление)
└── types/
    └── validationRuleRegistry.ts (типы для регистра)
```

## Приоритеты реализации

1. **Высокий приоритет:** Задачи 1-8 (базовая инфраструктура)
2. **Средний приоритет:** Задачи 9-14 (UI компоненты)
3. **Низкий приоритет:** Задачи 15-20 (интеграция и полировка)

## Заметки

- Минималистичный код: избегать избыточных абстракций
- Использовать существующие утилиты нормализации из `validationRules.ts`
- Следовать правилам проекта: стрелочные функции, const, JSDoc
- Не создавать кастомные хуки без необходимости (использовать локальную логику)
- Использовать Ant Design компоненты и Tailwind для стилизации

