# Система динамических форм на основе Blueprint/Path

> **Версия:** 1.0.0  
> **Статус:** ✅ Готово к использованию  
> **Последнее обновление:** 2025-01-10

## Краткое описание

Система динамических форм - это комплексное решение для автоматической генерации форм на основе структуры Blueprint/Path. Система обеспечивает строгую типизацию, единую валидацию, расширяемость и локализацию.

### Быстрый старт

```tsx
import { BlueprintForm, ReferenceDataProvider } from '@/components/blueprintForm';

<ReferenceDataProvider>
  <Form onFinish={handleSubmit}>
    <BlueprintForm paths={paths} fieldNamePrefix={['data']} />
  </Form>
</ReferenceDataProvider>;
```

## Содержание

1. [Обзор системы](#обзор-системы)
2. [Архитектура](#архитектура)
3. [Типы и интерфейсы](#типы-и-интерфейсы)
4. [Основные компоненты](#основные-компоненты)
5. [Использование](#использование)
6. [Расширение системы](#расширение-системы)
7. [API Reference](#api-reference)
8. [Примеры использования](#примеры-использования)
9. [Типы валидации](#типы-валидации)
10. [Производительность](#производительность)
11. [Миграция со старой системы](#миграция-со-старой-системы)
12. [Диаграммы](#диаграммы)
13. [Troubleshooting](#troubleshooting)
14. [Best Practices](#best-practices)
15. [Ограничения системы](#ограничения-системы)
16. [FAQ](#faq)
17. [Сравнение со старой системой](#сравнение-со-старой-системой)
18. [Changelog](#changelog)

---

## Обзор системы

Система динамических форм позволяет автоматически генерировать формы на основе структуры Blueprint/Path, полученной с сервера. Система обеспечивает:

- **Строгую типизацию** без использования `any`
- **Единую валидацию** через Zod-схемы
- **Расширяемость** по типам полей и UI-компонентам
- **Поддержку вложенных структур**, списков и ссылок на другие сущности
- **Локализацию** всех строк интерфейса
- **Кэширование** справочных данных

### Основные принципы

1. **Разделение слоёв**:
   - `ZPathTreeNode` (сырые данные с сервера) → `FieldNode` (нормализованная модель) → React-компоненты

2. **Реестр типов полей**:
   - Вместо `switch` используется реестр `fieldRegistry` для выбора компонентов

3. **Единая обработка cardinality**:
   - Компонент `CardinalityWrapper` обрабатывает `one`/`many` для всех типов полей

4. **Централизованная валидация**:
   - Zod-схемы генерируются автоматически из `FieldNode[]`

---

## Архитектура

### Поток данных

```
ZPathTreeNode[] (с сервера)
    ↓
buildFormSchema()
    ↓
FieldNode[] (нормализованная модель)
    ↓
PathField (роутер через fieldRegistry)
    ↓
Конкретные компоненты полей (PathStringFieldNode, PathIntFieldNode и т.д.)
    ↓
CardinalityWrapper (обработка one/many)
    ↓
Ant Design Form.Item + Input/Select/DatePicker и т.д.
```

### Слои абстракции

1. **Слой данных (ZPathTreeNode)**
   - Сырые данные с сервера
   - Могут содержать `any` в `validation_rules`
   - Рекурсивная структура через `children`

2. **Слой нормализации (FieldNode)**
   - Нормализованные данные без `any`
   - Типизированные `validation_rules`
   - Рассчитанные `fullPath` и дефолты

3. **Слой рендеринга (React компоненты)**
   - Компоненты работают только с `FieldNode`
   - Используют реестр для выбора компонента
   - Единая обработка `cardinality` через `CardinalityWrapper`

4. **Слой валидации (Zod)**
   - Автоматическая генерация схем из `FieldNode[]`
   - Единая валидация для FE и BE

### Структура модулей

```
src/components/blueprintForm/
├── BlueprintForm.tsx          # Главный компонент формы
├── fields/
│   ├── PathField.tsx          # Роутер полей через реестр
│   ├── fieldRegistry.ts       # Реестр типов полей
│   ├── PathStringFieldNode.tsx
│   ├── PathIntFieldNode.tsx
│   └── ...                    # Компоненты для всех типов полей
├── components/
│   └── CardinalityWrapper.tsx # Обработка one/many
├── types/
│   ├── formField.ts           # Типы FieldNode
│   └── uiConfig.ts            # Типы UI-конфигурации
├── utils/
│   ├── buildFormSchema.ts     # Преобразование ZPathTreeNode → FieldNode
│   ├── buildZodSchemaFromPaths.ts  # Генерация Zod-схем
│   ├── fieldNodeUtils.ts      # Утилиты для FieldNode
│   ├── getFormItemRulesFromNode.ts # Правила валидации
│   ├── getFieldLabel.ts       # Генерация label
│   └── i18n.ts                # Локализация
├── providers/
│   └── ReferenceDataProvider.tsx  # Провайдер справочных данных
└── hooks/
    ├── useZodValidation.ts    # Хук для Zod-схемы
    └── useReferenceData.ts    # Хук для справочных данных
```

---

## Типы и интерфейсы

### FieldNode

Основной тип для представления поля формы:

```typescript
type ScalarDataType = 'string' | 'text' | 'int' | 'float' | 'bool' | 'date' | 'datetime' | 'ref';

interface BaseFieldNode {
  id: number;
  name: string;
  fullPath: string[];
  dataType: ScalarDataType | 'json';
  cardinality: 'one' | 'many';
  label: string;
  required: boolean;
  readonly: boolean;
  helpText?: string;
  ui?: FieldUIConfig;
  sortOrder: number;
}

interface JsonFieldNode extends BaseFieldNode {
  dataType: 'json';
  children: FieldNode[];
}

type ScalarFieldNode = BaseFieldNode & {
  dataType: ScalarDataType;
  children?: never;
};

type FieldNode = JsonFieldNode | ScalarFieldNode;
```

### FieldUIConfig

Конфигурация UI для поля:

```typescript
interface FieldUIConfig {
  width?: number; // Ширина в колонках
  widget?: string; // Тип виджета ('textarea', 'select', 'radio-group')
  placeholderKey?: string; // Ключ локализации для placeholder
  labelKey?: string; // Ключ локализации для label
  helpKey?: string; // Ключ локализации для help text
  refConfig?: {
    // Конфигурация для ref-полей
    resource?: string;
    params?: Record<string, unknown>;
  };
  validationRules?: Array<{
    // Нормализованные правила валидации
    type: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}
```

### ReferenceQuery

Запрос на получение справочных данных:

```typescript
interface ReferenceQuery {
  resource: string; // 'entries', 'users', 'categories' и т.д.
  params?: Record<string, unknown>;
}

interface ReferenceOption {
  value: string | number;
  label: string;
}

interface ReferenceDataResult {
  loading: boolean;
  error?: Error;
  options: ReferenceOption[];
  loadMore?: () => void;
  search?: (term: string) => void;
}
```

---

## Основные компоненты

### BlueprintForm

Главный компонент формы, который принимает `ZPathTreeNode[]` и генерирует форму:

```tsx
<BlueprintForm
  paths={paths}
  fieldNamePrefix={['blueprint_data']}
  readonly={false}
  onSchemaReady={schema => {
    // Схема для валидации
  }}
/>
```

**Пропсы:**

- `paths: ZPathTreeNode[]` - дерево полей Path с сервера
- `fieldNamePrefix?: (string | number)[]` - префикс для имён полей (по умолчанию `[]`)
- `readonly?: boolean` - флаг режима только для чтения
- `onSchemaReady?: (schema) => void` - callback для получения Zod-схемы валидации

### PathField

Роутер полей, который выбирает компонент из реестра на основе `dataType`:

```tsx
<PathField node={fieldNode} name={['blueprint_data', 'title']} readonly={false} />
```

### CardinalityWrapper

Компонент-обёртка для единой обработки `cardinality`:

```tsx
<CardinalityWrapper node={node} name={name} readonly={readonly}>
  {itemName => (
    <Form.Item name={itemName}>
      <Input />
    </Form.Item>
  )}
</CardinalityWrapper>
```

**Поведение:**

- Если `cardinality === 'one'`: вызывает `children(name)` один раз
- Если `cardinality === 'many'`: использует `Form.List` для списка полей

### ReferenceDataProvider

Провайдер для работы со справочными данными (entries, users и т.д.):

```tsx
<ReferenceDataProvider>
  <BlueprintForm paths={paths} />
</ReferenceDataProvider>
```

Обеспечивает:

- Кэширование данных (TTL: 5 минут)
- Серверный поиск с debounce (300ms)
- Единообразный доступ к справочникам

---

## Использование

### Базовое использование

```tsx
import { BlueprintForm, ReferenceDataProvider } from '@/components/blueprintForm';
import type { ZPathTreeNode } from '@/types/path';

const MyForm = () => {
  const [paths, setPaths] = useState<ZPathTreeNode[]>([]);

  useEffect(() => {
    // Загрузка paths с сервера
    loadPaths().then(setPaths);
  }, []);

  return (
    <ReferenceDataProvider>
      <Form onFinish={handleSubmit}>
        <BlueprintForm paths={paths} fieldNamePrefix={['content_json']} />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </ReferenceDataProvider>
  );
};
```

### Использование Zod-схемы для валидации

```tsx
import { BlueprintForm, useZodValidation } from '@/components/blueprintForm';
import { buildFormSchema } from '@/components/blueprintForm';

const MyForm = () => {
  const [paths, setPaths] = useState<ZPathTreeNode[]>([]);
  const [form] = Form.useForm();

  const fieldNodes = useMemo(() => buildFormSchema(paths), [paths]);
  const zodSchema = useZodValidation(fieldNodes);

  const handleSubmit = async (values: unknown) => {
    // Валидация через Zod
    const result = zodSchema.safeParse(values);
    if (!result.success) {
      // Обработка ошибок валидации
      console.error(result.error);
      return;
    }

    // Отправка данных
    await saveData(result.data);
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <BlueprintForm paths={paths} />
    </Form>
  );
};
```

### Локализация

```tsx
import { setTranslations } from '@/components/blueprintForm';

// Установка переводов
setTranslations({
  'blueprint.addItem': 'Add',
  'blueprint.removeItem': 'Remove',
  'blueprint.field.required': 'Field "{field}" is required',
  'blueprint.field.enter': 'Enter',
  'blueprint.entry.select': 'Select Entry',
});

// Использование в компонентах
import { t } from '@/components/blueprintForm';
const label = t('blueprint.addItem'); // 'Add'
```

### Работа со справочными данными

```tsx
import { useReferenceData } from '@/components/blueprintForm';

const MyRefField = () => {
  const { loading, options, search } = useReferenceData({
    resource: 'entries',
    params: { per_page: 50, post_type: 'article' },
  });

  return <Select loading={loading} options={options} onSearch={search} filterOption={false} />;
};
```

---

## Расширение системы

### Добавление нового типа поля

1. **Создайте компонент поля:**

```tsx
// src/components/blueprintForm/fields/PathCustomFieldNode.tsx
import { Form, Input } from 'antd';
import type { FieldComponentProps } from './fieldRegistry';
import { getFormItemRulesFromNode } from '../utils/getFormItemRulesFromNode';
import { isFieldDisabled, getFieldPlaceholder, createFieldName } from '../utils/fieldNodeUtils';
import { CardinalityWrapper } from '../components/CardinalityWrapper';

export const PathCustomFieldNode: React.FC<FieldComponentProps> = ({ node, name, readonly }) => {
  if (node.dataType !== 'custom') {
    return null;
  }

  const label = node.label;
  const rules = getFormItemRulesFromNode(node);
  const fieldName = createFieldName(name, node.name);
  const disabled = isFieldDisabled(node, readonly);
  const placeholder = getFieldPlaceholder(node);

  return (
    <CardinalityWrapper node={node} name={fieldName} readonly={readonly}>
      {itemName => (
        <Form.Item name={itemName} label={label} rules={rules}>
          <Input placeholder={placeholder} disabled={disabled} />
        </Form.Item>
      )}
    </CardinalityWrapper>
  );
};
```

2. **Добавьте тип в ScalarDataType:**

```typescript
// src/components/blueprintForm/types/formField.ts
export type ScalarDataType =
  | 'string'
  | 'text'
  | 'int'
  | 'float'
  | 'bool'
  | 'date'
  | 'datetime'
  | 'ref'
  | 'custom'; // Новый тип
```

3. **Зарегистрируйте в fieldRegistry:**

```typescript
// src/components/blueprintForm/fields/fieldRegistry.ts
import { PathCustomFieldNode } from './PathCustomFieldNode';

export const fieldRegistry: Record<ScalarDataType | 'json', FieldDefinition> = {
  // ... существующие типы
  custom: {
    Component: PathCustomFieldNode,
  },
  // ...
};
```

4. **Добавьте поддержку в buildZodSchemaFromPaths:**

```typescript
// src/components/blueprintForm/utils/buildZodSchemaFromPaths.ts
const buildScalarSchema = (node: ScalarFieldNode): z.ZodTypeAny => {
  switch (node.dataType) {
    // ... существующие типы
    case 'custom':
      schema = z.string(); // или другой тип
      break;
  }
  // ...
};
```

### Добавление нового ресурса в ReferenceDataProvider

```typescript
// src/components/blueprintForm/providers/ReferenceDataProvider.tsx
const loadReferenceData = async (query: ReferenceQuery): Promise<ReferenceOption[]> => {
  switch (query.resource) {
    case 'entries':
      return loadEntriesData(query.params);
    case 'users': // Новый ресурс
      return loadUsersData(query.params);
    case 'categories': // Новый ресурс
      return loadCategoriesData(query.params);
    default:
      console.warn(`Unknown reference resource: ${query.resource}`);
      return [];
  }
};

const loadUsersData = async (params?: Record<string, unknown>): Promise<ReferenceOption[]> => {
  // Реализация загрузки пользователей
  const result = await listUsers(params);
  return result.data.map(user => ({
    value: user.id,
    label: user.name,
  }));
};
```

### Добавление нового виджета

Компоненты полей могут проверять `node.ui?.widget` для выбора виджета:

```tsx
export const PathStringFieldNode: React.FC<FieldComponentProps> = ({ node, name, readonly }) => {
  // ...

  // Выбор виджета на основе ui.widget
  const widget = node.ui?.widget || 'input';

  if (widget === 'textarea') {
    return (
      <CardinalityWrapper node={node} name={fieldName} readonly={readonly}>
        {itemName => (
          <Form.Item name={itemName} label={label} rules={rules}>
            <Input.TextArea rows={4} placeholder={placeholder} disabled={disabled} />
          </Form.Item>
        )}
      </CardinalityWrapper>
    );
  }

  // Дефолтный виджет
  return (
    <CardinalityWrapper node={node} name={fieldName} readonly={readonly}>
      {itemName => (
        <Form.Item name={itemName} label={label} rules={rules}>
          <Input placeholder={placeholder} disabled={disabled} />
        </Form.Item>
      )}
    </CardinalityWrapper>
  );
};
```

---

## API Reference

### buildFormSchema

Преобразует `ZPathTreeNode[]` в `FieldNode[]` с нормализацией данных.

```typescript
function buildFormSchema(paths: ZPathTreeNode[], parentPath?: string[]): FieldNode[];
```

**Параметры:**

- `paths: ZPathTreeNode[]` - дерево полей Path
- `parentPath?: string[]` - путь родительского поля (для рекурсии)

**Возвращает:** Массив нормализованных узлов полей формы

**Пример:**

```typescript
const fieldNodes = buildFormSchema(paths);
// [{ id: 1, name: 'title', fullPath: ['title'], dataType: 'string', ... }, ...]
```

### buildZodSchemaFromPaths

Генерирует Zod-схему для валидации формы на основе `FieldNode[]`.

```typescript
function buildZodSchemaFromPaths(nodes: FieldNode[]): z.ZodObject<Record<string, z.ZodTypeAny>>;
```

**Параметры:**

- `nodes: FieldNode[]` - массив узлов полей формы

**Возвращает:** Zod-схему объекта для валидации

**Пример:**

```typescript
const schema = buildZodSchemaFromPaths(fieldNodes);
const result = schema.safeParse(formData);
if (result.success) {
  // Данные валидны
}
```

### useZodValidation

Хук для генерации Zod-схемы валидации.

```typescript
function useZodValidation(fieldNodes: FieldNode[]): z.ZodObject<Record<string, z.ZodTypeAny>>;
```

**Параметры:**

- `fieldNodes: FieldNode[]` - массив узлов полей формы

**Возвращает:** Zod-схему для валидации

**Пример:**

```typescript
const fieldNodes = useMemo(() => buildFormSchema(paths), [paths]);
const zodSchema = useZodValidation(fieldNodes);
```

### useReferenceData

Хук для получения справочных данных (должен использоваться внутри `ReferenceDataProvider`).

```typescript
function useReferenceData(query: ReferenceQuery): ReferenceDataResult;
```

**Параметры:**

- `query: ReferenceQuery` - запрос на получение данных

**Возвращает:** Результат загрузки справочных данных

**Пример:**

```typescript
const { loading, options, search } = useReferenceData({
  resource: 'entries',
  params: { per_page: 50 },
});
```

### t (i18n)

Функция для получения переведённой строки.

```typescript
function t(key: string, params?: Record<string, string>): string;
```

**Параметры:**

- `key: string` - ключ локализации
- `params?: Record<string, string>` - параметры для подстановки

**Возвращает:** Переведённую строку

**Пример:**

```typescript
t('blueprint.addItem'); // 'Добавить'
t('blueprint.field.required', { field: 'title' }); // 'Поле "title" обязательно для заполнения'
```

### setTranslations

Устанавливает словарь переводов.

```typescript
function setTranslations(translations: Record<string, string>): void;
```

**Параметры:**

- `translations: Record<string, string>` - словарь переводов

**Пример:**

```typescript
setTranslations({
  'blueprint.addItem': 'Add',
  'blueprint.removeItem': 'Remove',
});
```

### Утилиты для FieldNode

#### isFieldDisabled

Проверяет, должно ли поле быть отключено.

```typescript
function isFieldDisabled(node: FieldNode, readonly?: boolean): boolean;
```

#### getFieldPlaceholder

Генерирует placeholder для поля с поддержкой локализации.

```typescript
function getFieldPlaceholder(node: FieldNode, action?: string): string;
```

#### getLocalizedLabel

Получает локализованный label для поля.

```typescript
function getLocalizedLabel(node: FieldNode): string;
```

#### getLocalizedHelpText

Получает локализованный help text для поля.

```typescript
function getLocalizedHelpText(node: FieldNode): string | undefined;
```

#### createFieldName

Создаёт полное имя поля для формы.

```typescript
function createFieldName(
  fieldNamePrefix: (string | number)[],
  fieldName: string
): (string | number)[];
```

#### getFormItemRulesFromNode

Генерирует правила валидации для Form.Item на основе FieldNode.

```typescript
function getFormItemRulesFromNode(node: FieldNode): Rule[];
```

---

## Примеры использования

### Пример 1: Простая форма

```tsx
import { Form } from 'antd';
import { BlueprintForm, ReferenceDataProvider } from '@/components/blueprintForm';
import type { ZPathTreeNode } from '@/types/path';

const SimpleForm = ({ paths }: { paths: ZPathTreeNode[] }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: unknown) => {
    console.log('Form values:', values);
  };

  return (
    <ReferenceDataProvider>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <BlueprintForm paths={paths} fieldNamePrefix={['data']} />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </ReferenceDataProvider>
  );
};
```

### Пример 2: Форма с валидацией через Zod

```tsx
import { Form } from 'antd';
import {
  BlueprintForm,
  ReferenceDataProvider,
  useZodValidation,
  buildFormSchema,
} from '@/components/blueprintForm';
import { useMemo } from 'react';

const ValidatedForm = ({ paths }: { paths: ZPathTreeNode[] }) => {
  const [form] = Form.useForm();
  const fieldNodes = useMemo(() => buildFormSchema(paths), [paths]);
  const zodSchema = useZodValidation(fieldNodes);

  const handleSubmit = async (values: unknown) => {
    // Валидация через Zod
    const result = zodSchema.safeParse(values);
    if (!result.success) {
      // Показываем ошибки валидации
      result.error.errors.forEach(error => {
        const fieldPath = error.path.join('.');
        form.setFields([
          {
            name: fieldPath.split('.'),
            errors: [error.message],
          },
        ]);
      });
      return;
    }

    // Данные валидны, отправляем на сервер
    await saveData(result.data);
  };

  return (
    <ReferenceDataProvider>
      <Form form={form} onFinish={handleSubmit}>
        <BlueprintForm paths={paths} />
      </Form>
    </ReferenceDataProvider>
  );
};
```

### Пример 3: Форма с кастомной локализацией

```tsx
import { BlueprintForm, setTranslations } from '@/components/blueprintForm';
import { useEffect } from 'react';

const LocalizedForm = ({ paths }: { paths: ZPathTreeNode[] }) => {
  useEffect(() => {
    // Устанавливаем переводы при монтировании
    setTranslations({
      'blueprint.addItem': 'Add Item',
      'blueprint.removeItem': 'Remove',
      'blueprint.field.required': 'Field "{field}" is required',
      'blueprint.field.enter': 'Enter',
      'blueprint.entry.select': 'Select Entry',
    });
  }, []);

  return (
    <ReferenceDataProvider>
      <BlueprintForm paths={paths} />
    </ReferenceDataProvider>
  );
};
```

### Пример 4: Работа с вложенными структурами

Система автоматически обрабатывает вложенные структуры (json-группы):

```tsx
// Если paths содержат:
// [
//   {
//     id: 1,
//     name: 'author',
//     data_type: 'json',
//     children: [
//       { id: 2, name: 'name', data_type: 'string' },
//       { id: 3, name: 'email', data_type: 'string' }
//     ]
//   }
// ]

// BlueprintForm автоматически создаст:
// - Группу "author" с Card
// - Поля "name" и "email" внутри группы
// - Правильную структуру имён полей: ['author', 'name'], ['author', 'email']
```

### Пример 5: Работа с массивами (cardinality: many)

Система автоматически обрабатывает массивы через `CardinalityWrapper`:

```tsx
// Если path имеет cardinality: 'many':
// - Для скалярных типов: создаётся Form.List с возможностью добавления/удаления элементов
// - Для json-групп: создаётся Form.List с Card для каждого элемента
// - Для ref: используется mode="multiple" в Select
```

---

## Типы валидации

### Поддерживаемые типы правил валидации

1. **min** - минимальное значение/длина

   ```typescript
   { type: 'min', value: 5 }
   ```

2. **max** - максимальное значение/длина

   ```typescript
   { type: 'max', value: 100 }
   ```

3. **regex** - регулярное выражение

   ```typescript
   { type: 'regex', pattern: '^[a-z]+$' }
   ```

4. **length** - длина строки/массива

   ```typescript
   { type: 'length', min: 5, max: 100 }
   ```

5. **enum** - перечисление допустимых значений

   ```typescript
   { type: 'enum', values: ['option1', 'option2', 'option3'] }
   ```

6. **custom** - кастомное правило
   ```typescript
   { type: 'custom', validator: 'customValidator', message: 'Custom error' }
   ```

### Старый формат (строки)

Система поддерживает старый формат правил валидации (строки) для обратной совместимости:

```typescript
// Старый формат: "type:value"
validation_rules: ['min:5', 'max:100', 'pattern:^[a-z]+$'];

// Автоматически преобразуется в:
validation_rules: [
  { type: 'min', value: 5 },
  { type: 'max', value: 100 },
  { type: 'regex', pattern: '^[a-z]+$' },
];
```

---

## Производительность

### Оптимизации

1. **Мемоизация**: `buildFormSchema` и `useZodValidation` используют `useMemo` для предотвращения пересчётов

2. **Кэширование справочных данных**: `ReferenceDataProvider` кэширует данные на 5 минут

3. **Debounce поиска**: Поиск в справочниках имеет debounce 300ms

4. **Сортировка без мутации**: `buildFormSchema` не мутирует исходный массив `paths`

### Рекомендации

- Используйте `useMemo` для `buildFormSchema` при работе с большими формами
- Оберните формы в `ReferenceDataProvider` для кэширования справочных данных
- Используйте Zod-схему для валидации только при необходимости (не на каждое изменение поля)

---

## Миграция со старой системы

Если у вас есть код, использующий старые компоненты (`PathStringField`, `PathTextAreaField` и т.д.), выполните следующие шаги:

1. **Замените импорты:**

   ```typescript
   // Старое
   import { PathStringField } from '@/components/blueprintForm/fields/PathStringField';

   // Новое
   import { BlueprintForm } from '@/components/blueprintForm';
   ```

2. **Оберните форму в ReferenceDataProvider:**

   ```tsx
   // Старое
   <BlueprintForm paths={paths} />

   // Новое
   <ReferenceDataProvider>
     <BlueprintForm paths={paths} />
   </ReferenceDataProvider>
   ```

3. **Используйте новые утилиты:**

   ```typescript
   // Старое
   import { getFormItemRules } from '@/components/blueprintForm/utils/getFormItemRules';

   // Новое (если нужно напрямую)
   import { getFormItemRulesFromNode } from '@/components/blueprintForm/utils/getFormItemRulesFromNode';
   ```

---

## Диаграммы

### Схема работы системы

```
┌─────────────────────────────────────────────────────────────┐
│                    BlueprintForm                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  buildFormSchema(ZPathTreeNode[])                    │   │
│  │  → FieldNode[]                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  PathField (для каждого FieldNode)                   │   │
│  │  → fieldRegistry[node.dataType]                      │   │
│  │  → Component (PathStringFieldNode и т.д.)            │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  CardinalityWrapper                                  │   │
│  │  → one: children(name)                               │   │
│  │  → many: Form.List                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Form.Item + Input/Select/DatePicker                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Схема валидации

```
┌─────────────────────────────────────────────────────────────┐
│  FieldNode[]                                                 │
│       ↓                                                      │
│  buildZodSchemaFromPaths()                                   │
│       ↓                                                      │
│  z.object({                                                  │
│    fieldName: z.string().min(5).max(100),                   │
│    ...                                                       │
│  })                                                          │
│       ↓                                                      │
│  schema.safeParse(formData)                                  │
│       ↓                                                      │
│  { success: true, data: {...} }                              │
│  или { success: false, error: ZodError }                     │
└─────────────────────────────────────────────────────────────┘
```

### Схема работы ReferenceDataProvider

```
┌─────────────────────────────────────────────────────────────┐
│  ReferenceDataProvider                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Кэш (Map<key, {data, timestamp}>)                  │   │
│  │  TTL: 5 минут                                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  useReferenceData({ resource: 'entries', params: {...} })    │
│                          ↓                                   │
│  Проверка кэша → Загрузка данных → Сохранение в кэш          │
│                          ↓                                   │
│  { loading, options, search }                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Проблема: Поля не отображаются

**Решение:**

- Убедитесь, что `paths` не пустой массив
- Проверьте, что `paths` содержит валидные `ZPathTreeNode`
- Убедитесь, что форма обёрнута в `ReferenceDataProvider` (для ref-полей)

### Проблема: Ошибки валидации не отображаются

**Решение:**

- Проверьте, что используется `getFormItemRulesFromNode` для генерации правил
- Убедитесь, что `required` правильно установлен в `FieldNode`
- Проверьте, что Zod-схема корректно генерируется

### Проблема: Справочные данные не загружаются

**Решение:**

- Убедитесь, что форма обёрнута в `ReferenceDataProvider`
- Проверьте, что `resource` указан правильно в `ui.refConfig`
- Проверьте консоль на наличие ошибок загрузки

### Проблема: Локализация не работает

**Решение:**

- Убедитесь, что вызван `setTranslations` перед использованием компонентов
- Проверьте, что ключи локализации совпадают с используемыми в компонентах
- Убедитесь, что используется функция `t()` для получения переводов

---

## Дополнительные ресурсы

- [Типы Path](../src/types/path.ts) - описание типов ZPathTreeNode
- [Примеры использования](../src/pages/EntryEditorPage) - примеры использования в реальных страницах
- [План рефакторинга](../blueprint_form_plan.md) - детальный план создания системы

---

## Best Practices

### 1. Использование мемоизации

Всегда используйте `useMemo` для `buildFormSchema` при работе с большими формами:

```tsx
const fieldNodes = useMemo(() => buildFormSchema(paths), [paths]);
```

### 2. Обработка ошибок валидации

Используйте `safeParse` для безопасной валидации:

```tsx
const result = zodSchema.safeParse(formData);
if (!result.success) {
  // Обработка ошибок
  result.error.errors.forEach(error => {
    // Показ ошибок пользователю
  });
}
```

### 3. Локализация

Устанавливайте переводы один раз при инициализации приложения:

```tsx
// В корневом компоненте или провайдере
useEffect(() => {
  setTranslations({
    'blueprint.addItem': 'Add',
    // ...
  });
}, []);
```

### 4. Работа с большими формами

Для форм с большим количеством полей:

- Используйте виртуализацию списков (если нужно)
- Разбивайте форму на вкладки/секции
- Используйте `Form.useWatch` для условного рендеринга

### 5. Кастомизация компонентов

Если нужно кастомизировать конкретное поле, используйте `ui.widget`:

```typescript
// В PathStringFieldNode
if (node.ui?.widget === 'custom-input') {
  return <CustomInputComponent />;
}
```

---

## Ограничения системы

### Текущие ограничения

1. **Поддержка виджетов**:
   - Базовая поддержка через `ui.widget`, но требуется ручная реализация в компонентах

2. **Версионирование Blueprint'ов**:
   - Не реализовано (шаг 8 из плана)

3. **Редактор Blueprint'ов**:
   - Не реализован (шаг 8 из плана)

4. **Миграции данных**:
   - Не реализованы (шаг 8 из плана)

5. **Тестирование**:
   - Unit-тесты не написаны (шаг 10 из плана)

### Планируемые улучшения

- Добавление поддержки условных полей (показывать/скрывать на основе других полей)
- Поддержка зависимых справочников (каскадные select'ы)
- Визуальный редактор Blueprint'ов
- Версионирование и миграции схем

---

## FAQ

### Q: Как добавить кастомное правило валидации?

**A:** Добавьте обработку в `buildZodSchemaFromPaths`:

```typescript
case 'custom':
  if (typeof rule.validator === 'string') {
    // Вызовите кастомный валидатор
    schema = schema.refine(
      (value) => customValidator(value, rule.params),
      { message: rule.message || 'Validation failed' }
    );
  }
  break;
```

### Q: Как использовать разные виджеты для одного типа поля?

**A:** Проверяйте `node.ui?.widget` в компоненте поля:

```tsx
if (node.ui?.widget === 'textarea') {
  return <Input.TextArea />;
}
return <Input />;
```

### Q: Как добавить поддержку нового ресурса в ReferenceDataProvider?

**A:** Добавьте case в `loadReferenceData`:

```typescript
case 'users':
  return loadUsersData(query.params);
```

И реализуйте функцию загрузки:

```typescript
const loadUsersData = async (params?: Record<string, unknown>): Promise<ReferenceOption[]> => {
  const result = await listUsers(params);
  return result.data.map(user => ({
    value: user.id,
    label: user.name,
  }));
};
```

### Q: Можно ли использовать систему без ReferenceDataProvider?

**A:** Да, но ref-поля не будут работать. Для остальных типов полей провайдер не обязателен.

### Q: Как обработать условные поля (показывать/скрывать)?

**A:** Используйте `Form.useWatch` для отслеживания значений и условного рендеринга:

```tsx
const fieldValue = Form.useWatch('fieldName', form);
if (fieldValue === 'someValue') {
  return <PathField node={conditionalNode} name={name} />;
}
```

### Q: Как интегрировать систему с существующими формами?

**A:** Используйте `fieldNamePrefix` для изоляции полей Blueprint:

```tsx
<Form>
  {/* Существующие поля */}
  <Form.Item name="title">
    <Input />
  </Form.Item>

  {/* Поля Blueprint */}
  <BlueprintForm paths={paths} fieldNamePrefix={['blueprint_data']} />
</Form>
```

---

## Сравнение со старой системой

### Что изменилось

| Аспект                | Старая система                  | Новая система                                     |
| --------------------- | ------------------------------- | ------------------------------------------------- |
| Типизация             | `any` в `validation_rules`      | Типизированные правила через `discriminatedUnion` |
| Выбор компонента      | `switch` по `data_type`         | Реестр `fieldRegistry`                            |
| Обработка cardinality | В каждом компоненте отдельно    | Единый `CardinalityWrapper`                       |
| Валидация             | Правила в компонентах           | Единая Zod-схема                                  |
| Справочные данные     | Прямые вызовы API в компонентах | Централизованный `ReferenceDataProvider`          |
| Локализация           | Хардкоженные строки             | Система i18n                                      |
| Модель данных         | Прямая работа с `ZPathTreeNode` | Нормализованная модель `FieldNode`                |

### Преимущества новой системы

1. **Расширяемость**: Новые типы полей добавляются через регистрацию в реестр
2. **Типобезопасность**: Полное отсутствие `any`, строгая типизация
3. **Единообразие**: Все поля обрабатываются одинаково через `CardinalityWrapper`
4. **Валидация**: Единая схема для FE и BE
5. **Производительность**: Кэширование справочных данных
6. **Локализация**: Легкая смена языков без изменения кода

---

## Changelog

### Версия 1.0.0 (текущая)

- ✅ Реализована полная система динамических форм
- ✅ Типизированные Zod-схемы без `any`
- ✅ Реестр типов полей через `fieldRegistry`
- ✅ Единая обработка `cardinality` через `CardinalityWrapper`
- ✅ Генерация Zod-схем для валидации
- ✅ `ReferenceDataProvider` для справочных данных
- ✅ UI-конфигурация и локализация
- ✅ Удалён весь legacy-код

---

## Дополнительные ресурсы

- [Исходный план рефакторинга](../blueprint_form_plan.md) - детальный план создания системы
- [Анализ архитектуры](../blueprint-form-architecture-analysis.md) - анализ текущей архитектуры
- [Типы Path](../src/types/path.ts) - описание типов ZPathTreeNode
- [Примеры использования](../src/pages/EntryEditorPage) - примеры использования в реальных страницах
