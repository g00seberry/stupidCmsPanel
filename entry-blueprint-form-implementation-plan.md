# План реализации формы редактирования данных Entry на основе схемы Blueprint

> **Система динамических форм для заполнения данных Entry по схеме Path**  
> Версия: 1.0  
> Дата: 2025-01-20

---

## Содержание

1. [Обзор](#обзор)
2. [Архитектурный подход](#архитектурный-подход)
3. [Структура данных](#структура-данных)
4. [Компоненты и модули](#компоненты-и-модули)
5. [Утилиты и преобразования](#утилиты-и-преобразования)
6. [Интеграция с EntryEditorPage](#интеграция-с-entryeditorpage)
7. [Валидация](#валидация)
8. [Обработка ошибок](#обработка-ошибок)
9. [Производительность](#производительность)
10. [Этапы реализации](#этапы-реализации)
11. [Тестирование](#тестирование)

---

## Обзор

### Цель

Реализовать динамическую форму для редактирования данных Entry на основе иерархической схемы Path, возвращаемой API `/api/admin/v1/blueprints/{blueprintId}/paths`. Форма должна:

- Автоматически генерироваться на основе структуры Path
- Поддерживать все типы данных (`string`, `text`, `int`, `float`, `bool`, `date`, `datetime`, `json`, `ref`)
- Обрабатывать кардинальность полей (`one` / `many`)
- Отображать вложенные структуры (поля типа `json` с дочерними полями)
- Учитывать флаги `is_required`, `is_readonly`, `is_indexed`
- Сохранять данные в поле `content_json` Entry

### Контекст

- **Entry** содержит поле `content_json` (тип: `Record<string, unknown> | null`), где хранятся данные по схеме Blueprint
- **Path** — иерархическая структура полей с метаданными (тип, кардинальность, обязательность и т.д.)
- **Blueprint** привязан к **PostType**, который используется для Entry
- Форма должна быть интегрирована в существующую страницу `EntryEditorPage`

### Связь с API

```
Entry → PostType → Blueprint → Path (дерево)
                              ↓
                    content_json (данные Entry)
```

---

## Архитектурный подход

### Принципы

1. **Декларативность**: Форма генерируется из схемы Path без жёстко закодированных полей
2. **Рекурсивность**: Поддержка вложенных структур через рекурсивные компоненты
3. **Типобезопасность**: Использование Zod для валидации и TypeScript для типизации
4. **Разделение ответственности**: Отдельные компоненты для каждого типа поля
5. **Переиспользование**: Утилиты для преобразования данных между форматом Path и форматом формы

### Архитектурные слои

```
┌─────────────────────────────────────────┐
│   EntryEditorPage (UI Layer)           │
│   - Интеграция формы в страницу         │
│   - Управление состоянием формы         │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   BlueprintForm (Form Layer)            │
│   - Генерация формы из Path дерева     │
│   - Управление вложенными структурами   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   PathField Components (Field Layer)    │
│   - PathStringField, PathIntField, etc. │
│   - PathJsonGroupField (рекурсивный)    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   Utils (Data Layer)                    │
│   - pathToFormData, formDataToContent   │
│   - Валидация по схеме Path             │
└─────────────────────────────────────────┘
```

### Поток данных

```
1. Загрузка Entry → content_json (JSON объект)
2. Загрузка Blueprint → Path дерево
3. Преобразование: content_json + Path → FormValues
4. Рендеринг формы на основе Path дерева
5. Редактирование пользователем
6. Преобразование: FormValues → content_json
7. Сохранение в Entry.content_json
```

---

## Структура данных

### Формат данных в content_json

Данные в `content_json` хранятся в плоском формате с использованием `full_path` как ключей:

```typescript
// Пример для Path дерева:
// - title (string, one)
// - author (json, one)
//   - name (string, one)
//   - email (string, one)
// - tags (string, many)

content_json = {
  title: 'Заголовок статьи',
  'author.name': 'Иван Иванов',
  'author.email': 'ivan@example.com',
  tags: ['технологии', 'cms', 'разработка'],
};
```

### Формат данных формы

Для удобства работы с формой данные преобразуются в иерархическую структуру:

```typescript
// FormValues для примера выше:
formValues = {
  title: 'Заголовок статьи',
  author: {
    name: 'Иван Иванов',
    email: 'ivan@example.com',
  },
  tags: ['технологии', 'cms', 'разработка'],
};
```

### Типы данных

```typescript
/**
 * Значения формы для полей Blueprint.
 * Ключи соответствуют full_path полей Path.
 */
type BlueprintFormValues = Record<string, unknown>;

/**
 * Значения формы для одного поля.
 * Зависит от типа данных и кардинальности.
 */
type PathFieldValue =
  | string // string, text
  | number // int, float
  | boolean // bool
  | string
  | null // date, datetime
  | Record<string, unknown> // json (объект)
  | number
  | null // ref (ID Entry)
  | Array<PathFieldValue> // cardinality: many
  | null; // необязательные поля
```

---

## Компоненты и модули

### 1. BlueprintForm

**Назначение**: Главный компонент формы, генерирующий поля на основе Path дерева.

**Расположение**: `src/components/blueprintForm/BlueprintForm.tsx`

**Пропсы**:

```typescript
interface PropsBlueprintForm {
  /** Дерево полей Path для генерации формы. */
  paths: ZPathTreeNode[];
  /** Начальные значения формы (из content_json). */
  initialValues?: BlueprintFormValues;
  /** Обработчик изменения значений. */
  onChange?: (values: BlueprintFormValues) => void;
  /** Флаг режима только для чтения. */
  readonly?: boolean;
  /** Префикс для имён полей формы (для вложенных структур). */
  fieldNamePrefix?: string;
}
```

**Реализация**:

- Рекурсивно обходит Path дерево
- Для каждого Path создаёт соответствующий компонент поля
- Обрабатывает `sort_order` для сортировки полей
- Учитывает `is_readonly` для отключения редактирования

### 2. PathField (базовый компонент)

**Назначение**: Базовый компонент для рендеринга одного поля Path.

**Расположение**: `src/components/blueprintForm/fields/PathField.tsx`

**Логика выбора компонента**:

```typescript
const getFieldComponent = (path: ZPathTreeNode): React.ComponentType => {
  if (path.data_type === 'json') {
    return PathJsonGroupField; // Рекурсивный компонент для групп
  }

  switch (path.data_type) {
    case 'string':
      return PathStringField;
    case 'text':
      return PathTextAreaField;
    case 'int':
      return PathIntField;
    case 'float':
      return PathFloatField;
    case 'bool':
      return PathBoolField;
    case 'date':
      return PathDateField;
    case 'datetime':
      return PathDateTimeField;
    case 'ref':
      return PathRefField;
    default:
      return PathStringField; // fallback
  }
};
```

### 3. Компоненты полей по типам

#### PathStringField

- **Компонент**: `Input` из Ant Design
- **Валидация**: `max: 500` (согласно документации)
- **Особенности**: Поддержка `cardinality: many` через `Form.List`

#### PathTextAreaField

- **Компонент**: `Input.TextArea` из Ant Design
- **Валидация**: Без ограничений по длине (или из `validation_rules`)

#### PathIntField

- **Компонент**: `InputNumber` из Ant Design
- **Валидация**: Только целые числа, правила из `validation_rules`

#### PathFloatField

- **Компонент**: `InputNumber` из Ant Design
- **Валидация**: Числа с плавающей точкой, правила из `validation_rules`

#### PathBoolField

- **Компонент**: `Switch` из Ant Design
- **Особенности**: Всегда `cardinality: one`

#### PathDateField

- **Компонент**: `DatePicker` из Ant Design
- **Формат**: `YYYY-MM-DD`
- **Особенности**: Поддержка `null` для необязательных полей

#### PathDateTimeField

- **Компонент**: `DatePicker` с `showTime` из Ant Design
- **Формат**: `YYYY-MM-DD HH:mm:ss`
- **Особенности**: Поддержка `null` для необязательных полей

#### PathRefField

- **Компонент**: `Select` с поиском из Ant Design
- **Особенности**:
  - Загрузка списка Entry через API
  - Отображение `title` Entry в опциях
  - Сохранение только `id` Entry
  - Поддержка `cardinality: many` через `mode: "multiple"`

#### PathJsonGroupField

- **Компонент**: Рекурсивный `Card` с вложенными полями
- **Особенности**:
  - Рекурсивно рендерит дочерние Path через `BlueprintForm`
  - Поддержка `cardinality: many` через `Form.List`
  - Отображение заголовка группы (имя поля или `full_path`)

### 4. Структура файлов

```
src/components/blueprintForm/
├── BlueprintForm.tsx              # Главный компонент формы
├── BlueprintFormStore.ts           # Store для управления состоянием
├── fields/
│   ├── PathField.tsx               # Базовый компонент выбора поля
│   ├── PathStringField.tsx         # Поле типа string
│   ├── PathTextAreaField.tsx      # Поле типа text
│   ├── PathIntField.tsx            # Поле типа int
│   ├── PathFloatField.tsx          # Поле типа float
│   ├── PathBoolField.tsx           # Поле типа bool
│   ├── PathDateField.tsx           # Поле типа date
│   ├── PathDateTimeField.tsx       # Поле типа datetime
│   ├── PathRefField.tsx            # Поле типа ref
│   └── PathJsonGroupField.tsx      # Группа полей (json)
├── utils/
│   ├── pathToFormData.ts           # Преобразование Path → FormValues
│   ├── formDataToContent.ts        # Преобразование FormValues → content_json
│   ├── validatePathField.ts       # Валидация одного поля
│   └── getFieldLabel.ts            # Генерация метки поля
└── index.ts                        # Экспорты
```

---

## Утилиты и преобразования

### 1. Преобразование content_json → FormValues

**Функция**: `contentJsonToFormValues`

**Расположение**: `src/components/blueprintForm/utils/formDataToContent.ts`

**Логика**:

```typescript
/**
 * Преобразует плоский content_json в иерархическую структуру FormValues.
 * @param contentJson Плоский объект с ключами full_path.
 * @param paths Дерево Path для определения структуры.
 * @returns Иерархический объект FormValues.
 */
const contentJsonToFormValues = (
  contentJson: Record<string, unknown> | null,
  paths: ZPathTreeNode[]
): BlueprintFormValues => {
  if (!contentJson) return {};

  const result: BlueprintFormValues = {};

  // Рекурсивно обходим Path дерево
  const processPath = (path: ZPathTreeNode, parentPath: string = '') => {
    const fullPath = parentPath ? `${parentPath}.${path.name}` : path.name;
    const value = contentJson[fullPath];

    if (path.data_type === 'json') {
      // Для json создаём вложенный объект
      result[path.name] = {};
      if (path.children) {
        path.children.forEach(child => {
          processPath(child, fullPath);
        });
      }
    } else {
      // Для простых типов сохраняем значение
      result[path.name] = value ?? getDefaultValue(path);
    }
  };

  paths.forEach(path => processPath(path));
  return result;
};
```

### 2. Преобразование FormValues → content_json

**Функция**: `formValuesToContentJson`

**Расположение**: `src/components/blueprintForm/utils/formDataToContent.ts`

**Логика**:

```typescript
/**
 * Преобразует иерархическую структуру FormValues в плоский content_json.
 * @param formValues Иерархический объект FormValues.
 * @param paths Дерево Path для определения структуры.
 * @returns Плоский объект с ключами full_path.
 */
const formValuesToContentJson = (
  formValues: BlueprintFormValues,
  paths: ZPathTreeNode[]
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  // Рекурсивно обходим FormValues и Path дерево
  const processValue = (value: unknown, path: ZPathTreeNode, parentPath: string = '') => {
    const fullPath = parentPath ? `${parentPath}.${path.name}` : path.name;

    if (path.data_type === 'json') {
      // Для json рекурсивно обрабатываем вложенные значения
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const obj = value as Record<string, unknown>;
        if (path.children) {
          path.children.forEach(child => {
            const childValue = obj[child.name];
            processValue(childValue, child, fullPath);
          });
        }
      }
    } else {
      // Для простых типов сохраняем значение по full_path
      if (value !== null && value !== undefined) {
        result[fullPath] = value;
      }
    }
  };

  paths.forEach(path => {
    const value = formValues[path.name];
    processValue(value, path);
  });

  return result;
};
```

### 3. Получение значения по умолчанию

**Функция**: `getDefaultValue`

**Логика**:

```typescript
const getDefaultValue = (path: ZPathTreeNode): unknown => {
  if (path.cardinality === 'many') {
    return [];
  }

  switch (path.data_type) {
    case 'string':
    case 'text':
      return '';
    case 'int':
    case 'float':
      return 0;
    case 'bool':
      return false;
    case 'date':
    case 'datetime':
      return null;
    case 'json':
      return {};
    case 'ref':
      return null;
    default:
      return null;
  }
};
```

### 4. Генерация метки поля

**Функция**: `getFieldLabel`

**Логика**:

```typescript
const getFieldLabel = (path: ZPathTreeNode): string => {
  // Используем name как метку, можно расширить для локализации
  return path.name;
};
```

---

## Интеграция с EntryEditorPage

### 1. Обновление EntryEditorStore

**Добавление полей**:

```typescript
export class EntryEditorStore {
  // ... существующие поля ...

  /** Дерево Path для текущего Blueprint. */
  paths: ZPathTreeNode[] = [];
  /** Флаг загрузки Path. */
  loadingPaths = false;
  /** Blueprint ID из PostType. */
  blueprintId: number | null = null;
}
```

**Добавление методов**:

```typescript
/**
 * Загружает Path дерево для Blueprint PostType.
 */
async loadPaths(): Promise<void> {
  if (!this.postType?.blueprint_id) {
    this.paths = [];
    return;
  }

  this.loadingPaths = true;
  try {
    this.blueprintId = this.postType.blueprint_id;
    this.paths = await listPaths(this.blueprintId);
  } catch (error) {
    onError(error);
    this.paths = [];
  } finally {
    this.loadingPaths = false;
  }
}

/**
 * Обновляет init() для загрузки Path.
 */
async init(): Promise<void> {
  // ... существующий код ...
  await this.loadPaths();
}
```

### 2. Обновление FormValues

**Расширение типа**:

```typescript
export interface FormValues {
  // ... существующие поля ...
  /** Данные Blueprint (content_json). */
  blueprint_data?: BlueprintFormValues;
}
```

**Обновление преобразований**:

```typescript
const toFormValues = (entry: ZEntry, termIds: ZId[] = []): FormValues => {
  return {
    // ... существующие поля ...
    blueprint_data: entry.content_json
      ? contentJsonToFormValues(entry.content_json, []) // Path загрузится позже
      : undefined,
  };
};

// После загрузки Path нужно пересчитать blueprint_data
```

### 3. Обновление EntryEditorPage

**Добавление компонента формы**:

```typescript
<Form<FormValues> form={form} ...>
  {/* ... существующие поля ... */}

  {store.paths.length > 0 && (
    <Card className="p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-6">Данные Blueprint</h2>
      <BlueprintForm
        paths={store.paths}
        initialValues={store.formValues.blueprint_data}
        onChange={(values) => {
          form.setFieldValue('blueprint_data', values);
        }}
        readonly={store.pending || store.loading}
      />
    </Card>
  )}
</Form>
```

### 4. Обновление сохранения

**Обновление saveEntry**:

```typescript
async saveEntry(...): Promise<ZEntry | null> {
  // ... существующий код ...

  const payload: ZEntryPayload = {
    // ... существующие поля ...
    content_json: values.blueprint_data && store.paths.length > 0
      ? formValuesToContentJson(values.blueprint_data, store.paths)
      : null,
  };

  // ... остальной код ...
}
```

---

## Валидация

### 1. Валидация на уровне формы

**Использование Ant Design Form Rules**:

```typescript
const getFormItemRules = (path: ZPathTreeNode): FormRule[] => {
  const rules: FormRule[] = [];

  // Обязательность
  if (path.is_required) {
    rules.push({
      required: true,
      message: `Поле "${getFieldLabel(path)}" обязательно для заполнения`,
    });
  }

  // Правила из validation_rules
  if (path.validation_rules) {
    path.validation_rules.forEach(rule => {
      // Парсинг Laravel правил (например, "max:255", "min:1")
      if (typeof rule === 'string') {
        const [type, value] = rule.split(':');
        switch (type) {
          case 'max':
            rules.push({ max: Number(value), message: `Максимум ${value} символов` });
            break;
          case 'min':
            rules.push({ min: Number(value), message: `Минимум ${value} символов` });
            break;
          // ... другие правила
        }
      }
    });
  }

  // Тип-специфичные правила
  switch (path.data_type) {
    case 'string':
      rules.push({ max: 500, message: 'Максимум 500 символов' });
      break;
    case 'int':
      rules.push({ type: 'number', message: 'Должно быть целым числом' });
      break;
    case 'float':
      rules.push({ type: 'number', message: 'Должно быть числом' });
      break;
  }

  return rules;
};
```

### 2. Валидация на уровне Zod

**Создание схемы валидации из Path**:

```typescript
/**
 * Создаёт Zod схему валидации на основе Path дерева.
 */
const createPathValidationSchema = (paths: ZPathTreeNode[]): z.ZodObject<any> => {
  const shape: Record<string, z.ZodTypeAny> = {};

  const processPath = (path: ZPathTreeNode): z.ZodTypeAny => {
    let schema: z.ZodTypeAny;

    switch (path.data_type) {
      case 'string':
        schema = z.string().max(500);
        break;
      case 'text':
        schema = z.string();
        break;
      case 'int':
        schema = z.number().int();
        break;
      case 'float':
        schema = z.number();
        break;
      case 'bool':
        schema = z.boolean();
        break;
      case 'date':
      case 'datetime':
        schema = z.string().nullable();
        break;
      case 'json':
        // Рекурсивно создаём схему для дочерних полей
        const childShape: Record<string, z.ZodTypeAny> = {};
        if (path.children) {
          path.children.forEach(child => {
            childShape[child.name] = processPath(child);
          });
        }
        schema = z.object(childShape);
        break;
      case 'ref':
        schema = z.number().nullable();
        break;
      default:
        schema = z.unknown();
    }

    // Применяем кардинальность
    if (path.cardinality === 'many') {
      schema = z.array(schema);
    }

    // Применяем обязательность
    if (!path.is_required) {
      schema = schema.nullable().optional();
    }

    return schema;
  };

  paths.forEach(path => {
    shape[path.name] = processPath(path);
  });

  return z.object(shape);
};
```

---

## Обработка ошибок

### 1. Ошибки валидации API

**Обработка в saveEntry**:

```typescript
try {
  const nextEntry = await updateEntry(entryId, payload);
  // ...
} catch (error) {
  // Обработка ошибок валидации полей Blueprint
  if (isValidationError(error)) {
    const fieldErrors = extractBlueprintFieldErrors(error);
    // Установка ошибок в форму
    fieldErrors.forEach(({ field, message }) => {
      form.setFields([
        {
          name: ['blueprint_data', ...field.split('.')],
          errors: [message],
        },
      ]);
    });
  }
  onError(error);
  return null;
}
```

### 2. Ошибки загрузки Path

**Обработка в loadPaths**:

```typescript
async loadPaths(): Promise<void> {
  // ... код загрузки ...
  catch (error) {
    onError(error);
    notificationService.showError({
      message: 'Ошибка загрузки схемы Blueprint',
      description: 'Не удалось загрузить структуру полей. Форма может работать некорректно.',
    });
    this.paths = [];
  }
}
```

### 3. Ошибки преобразования данных

**Валидация при преобразовании**:

```typescript
const formValuesToContentJson = (
  formValues: BlueprintFormValues,
  paths: ZPathTreeNode[]
): Record<string, unknown> => {
  try {
    // ... код преобразования ...
  } catch (error) {
    console.error('Ошибка преобразования FormValues в content_json:', error);
    throw new Error('Не удалось преобразовать данные формы');
  }
};
```

---

## Производительность

### 1. Оптимизация рендеринга

**Мемоизация компонентов полей**:

```typescript
const PathStringField = React.memo<PropsPathStringField>(({ path, value, onChange }) => {
  // ...
});
```

**Ленивая загрузка для больших форм**:

```typescript
// Использование React.lazy для компонентов полей
const PathJsonGroupField = React.lazy(() => import('./PathJsonGroupField'));
```

### 2. Оптимизация преобразований

**Кэширование схем валидации**:

```typescript
const validationSchemaCache = new Map<number, z.ZodObject<any>>();

const getValidationSchema = (blueprintId: number, paths: ZPathTreeNode[]): z.ZodObject<any> => {
  if (!validationSchemaCache.has(blueprintId)) {
    validationSchemaCache.set(blueprintId, createPathValidationSchema(paths));
  }
  return validationSchemaCache.get(blueprintId)!;
};
```

### 3. Виртуализация для больших списков

**Для полей с cardinality: many**:

```typescript
// Использование react-window для больших массивов
import { FixedSizeList } from 'react-window';

const PathManyField = ({ path, values, onChange }) => {
  if (values.length > 50) {
    // Виртуализация для больших списков
    return <VirtualizedList ... />;
  }
  // Обычный рендеринг для маленьких списков
  return <Form.List ... />;
};
```

---

## Этапы реализации

### Этап 1: Базовая инфраструктура (2-3 дня)

1. ✅ Создать структуру папок `src/components/blueprintForm/`
2. ✅ Реализовать утилиты преобразования данных:
   - `contentJsonToFormValues`
   - `formValuesToContentJson`
   - `getDefaultValue`
   - `getFieldLabel`
3. ✅ Создать типы и интерфейсы
4. ✅ Написать unit-тесты для утилит

### Этап 2: Компоненты простых полей (3-4 дня)

1. ✅ Реализовать `PathField` (базовый компонент выбора)
2. ✅ Реализовать компоненты для простых типов:
   - `PathStringField`
   - `PathTextAreaField`
   - `PathIntField`
   - `PathFloatField`
   - `PathBoolField`
   - `PathDateField`
   - `PathDateTimeField`
3. ✅ Добавить поддержку `cardinality: many` для всех типов
4. ✅ Добавить валидацию через Ant Design Form Rules

### Этап 3: Сложные компоненты (2-3 дня)

1. ✅ Реализовать `PathJsonGroupField` (рекурсивный компонент)
2. ✅ Реализовать `PathRefField` с загрузкой Entry
3. ✅ Реализовать `BlueprintForm` (главный компонент)
4. ✅ Добавить обработку `is_readonly` и `sort_order`

### Этап 4: Интеграция (2 дня)

1. ✅ Обновить `EntryEditorStore` для загрузки Path
2. ✅ Интегрировать `BlueprintForm` в `EntryEditorPage`
3. ✅ Обновить сохранение Entry с преобразованием данных
4. ✅ Добавить обработку ошибок

### Этап 5: Валидация и обработка ошибок (2 дня)

1. ✅ Реализовать Zod схемы валидации
2. ✅ Добавить обработку ошибок API
3. ✅ Добавить отображение ошибок в форме
4. ✅ Протестировать все сценарии ошибок

### Этап 6: Оптимизация и полировка (1-2 дня)

1. ✅ Добавить мемоизацию компонентов
2. ✅ Оптимизировать преобразования данных
3. ✅ Добавить loading состояния
4. ✅ Улучшить UX (подсказки, иконки, тултипы)

### Этап 7: Тестирование и документация (2 дня)

1. ✅ Написать интеграционные тесты
2. ✅ Протестировать на реальных данных
3. ✅ Обновить документацию
4. ✅ Code review и рефакторинг

**Общее время**: ~14-18 дней

---

## Тестирование

### 1. Unit-тесты для утилит

**Файл**: `src/components/blueprintForm/utils/__tests__/formDataToContent.test.ts`

**Тесты**:

- Преобразование плоского content_json в иерархическую структуру
- Преобразование иерархической структуры в плоский content_json
- Обработка вложенных структур (json)
- Обработка массивов (cardinality: many)
- Обработка null и undefined значений
- Обработка пустого content_json

### 2. Unit-тесты для компонентов полей

**Файл**: `src/components/blueprintForm/fields/__tests__/PathStringField.test.tsx`

**Тесты**:

- Рендеринг поля с разными типами данных
- Валидация обязательных полей
- Валидация правил из validation_rules
- Обработка cardinality: many
- Обработка is_readonly

### 3. Интеграционные тесты

**Файл**: `src/pages/EntryEditorPage/__tests__/BlueprintFormIntegration.test.tsx`

**Тесты**:

- Загрузка Path и отображение формы
- Сохранение данных Blueprint в Entry
- Обработка ошибок валидации
- Обновление формы при изменении Entry

### 4. E2E тесты (опционально)

**Сценарии**:

- Создание Entry с данными Blueprint
- Редактирование Entry с данными Blueprint
- Валидация полей при сохранении
- Обработка ошибок API

---

## Дополнительные соображения

### 1. Локализация

- Метки полей можно вынести в отдельный файл локализации
- Сообщения об ошибках валидации также локализуются

### 2. Расширяемость

- Компоненты полей можно расширять через пропсы
- Возможность добавления кастомных типов полей

### 3. Доступность (a11y)

- Все поля должны иметь правильные `aria-label`
- Группы полей должны иметь `aria-labelledby`
- Ошибки валидации должны быть связаны с полями через `aria-describedby`

### 4. Мобильная адаптивность

- Форма должна корректно отображаться на мобильных устройствах
- Использовать адаптивные компоненты Ant Design

---

## Заключение

Данный план описывает полную реализацию динамической формы для редактирования данных Entry на основе схемы Blueprint. Реализация следует принципам минималистичного кода, типобезопасности и переиспользования компонентов.

Ключевые моменты:

- Рекурсивная структура для поддержки вложенных полей
- Преобразование данных между плоским и иерархическим форматами
- Типобезопасность через Zod и TypeScript
- Интеграция с существующей архитектурой проекта

---

## Приложения

### Приложение A: Примеры использования

#### Пример 1: Простая форма

```typescript
// Path дерево:
[
  { name: 'title', data_type: 'string', cardinality: 'one', is_required: true },
  { name: 'content', data_type: 'text', cardinality: 'one', is_required: false }
]

// content_json:
{
  "title": "Заголовок",
  "content": "Текст статьи"
}

// FormValues:
{
  "title": "Заголовок",
  "content": "Текст статьи"
}
```

#### Пример 2: Вложенная структура

```typescript
// Path дерево:
[
  {
    name: 'author',
    data_type: 'json',
    children: [
      { name: 'name', data_type: 'string' },
      { name: 'email', data_type: 'string' }
    ]
  }
]

// content_json:
{
  "author.name": "Иван",
  "author.email": "ivan@example.com"
}

// FormValues:
{
  "author": {
    "name": "Иван",
    "email": "ivan@example.com"
  }
}
```

#### Пример 3: Массив значений

```typescript
// Path дерево:
[
  { name: 'tags', data_type: 'string', cardinality: 'many' }
]

// content_json:
{
  "tags": ["технологии", "cms", "разработка"]
}

// FormValues:
{
  "tags": ["технологии", "cms", "разработка"]
}
```

### Приложение B: Схема данных

```
Entry
├── id
├── post_type (slug)
├── title
├── slug
├── content_json (Record<string, unknown> | null)
│   ├── "field1" → value
│   ├── "nested.field" → value
│   └── "array_field" → [value1, value2]
└── ...

PostType
├── id
├── slug
├── blueprint_id (nullable)
└── ...

Blueprint
├── id
├── code
└── ...

Path (дерево)
├── id
├── name
├── full_path
├── data_type
├── cardinality
├── is_required
├── is_readonly
├── children (Path[])
└── ...
```

---

**Конец документа**
