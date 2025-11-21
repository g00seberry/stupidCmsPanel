# Генерация форм редактирования на основе Path

> **Адаптировано под TypeScript + React + MobX + Ant Design**  
> Версия: 2.0  
> Дата: 2025-01-20

## Обзор

Документация описывает архитектуру и схему данных для создания форм редактирования Entry на основе структуры Path из Blueprint в контексте текущей системы (TypeScript, React, MobX, Ant Design).

## Схема Path

### Структура данных Path

Path представляет поле в Blueprint с материализованным `full_path`. Каждый Path имеет следующие характеристики:

**Важно:** `full_path` всегда использует точечную нотацию (например, `author.contacts.phone`), **без** `[]`. Символы `[]` используются только при генерации имени поля для формы (например, `gallery[]` для массива), но не в самом `full_path`.

**Тип данных:** `ZPathTreeNode` из `@/types/path`

```typescript
import type { ZPathTreeNode } from '@/types/path';

const path: ZPathTreeNode = {
  id: 1,
  blueprint_id: 1,
  parent_id: null,
  name: 'title',
  full_path: 'title',
  data_type: 'string',
  cardinality: 'one',
  is_required: true,
  is_indexed: true,
  is_readonly: false,
  sort_order: 0,
  validation_rules: ['min:1', 'max:500'],
  children: [],
};
```

### Типы данных (data_type)

- `string` - короткая строка (`Input` из Ant Design)
- `text` - длинный текст (`Input.TextArea` из Ant Design)
- `int` - целое число (`InputNumber` из Ant Design)
- `float` - число с плавающей точкой (`InputNumber` из Ant Design)
- `bool` - булево значение (`Switch` из Ant Design)
- `date` - дата (`DatePicker` из Ant Design)
- `datetime` - дата и время (`DatePicker` с `showTime` из Ant Design)
- `json` - группа полей (контейнер для вложенных paths, `Card` из Ant Design)
- `ref` - ссылка на другую Entry (`Select` с поиском из Ant Design)

### Кардинальность (cardinality)

- `one` - одно значение (по умолчанию)
- `many` - массив значений (`Form.List` из Ant Design)

### Формат данных в content_json

**Критически важно:** Данные в `content_json` хранятся в **плоском формате** с использованием `full_path` как ключей:

```typescript
// Пример для Path дерева:
// - title (string, one)
// - author (json, one)
//   - name (string, one)
//   - email (string, one)
// - tags (string, many)

const content_json: Record<string, unknown> = {
  title: 'Заголовок статьи',
  'author.name': 'Иван Иванов',
  'author.email': 'ivan@example.com',
  tags: ['технологии', 'cms', 'разработка'],
};
```

**НЕ** используется вложенная структура:

```typescript
// ❌ НЕПРАВИЛЬНО:
const content_json = {
  title: 'Заголовок',
  author: {
    name: 'Иван',
    email: 'ivan@example.com',
  },
};

// ✅ ПРАВИЛЬНО:
const content_json = {
  title: 'Заголовок',
  'author.name': 'Иван',
  'author.email': 'ivan@example.com',
};
```

## Примеры схем Path и их реализация

### 1. Простое поле (корневой уровень)

```typescript
const path: ZPathTreeNode = {
  id: 1,
  blueprint_id: 1,
  parent_id: null,
  name: 'title',
  full_path: 'title',
  data_type: 'string',
  cardinality: 'one',
  is_required: true,
  is_indexed: true,
  is_readonly: false,
  sort_order: 0,
  validation_rules: ['min:1', 'max:500'],
  children: [],
};
```

**Реализация в React (Ant Design):**

```tsx
import { Form, Input } from 'antd';

<Form.Item
  name={['blueprint_data', 'title']}
  label="Title"
  rules={[
    { required: true, message: 'Поле обязательно для заполнения' },
    { max: 500, message: 'Максимум 500 символов' },
  ]}
>
  <Input placeholder="Введите заголовок" />
</Form.Item>;
```

**content_json:**

```typescript
{
  title: 'Article Title';
}
```

### 2. Вложенное поле (один уровень вложенности)

```typescript
const path: ZPathTreeNode = {
  id: 2,
  blueprint_id: 1,
  parent_id: 3, // parent: author.contacts
  name: 'phone',
  full_path: 'author.contacts.phone',
  data_type: 'string',
  cardinality: 'one',
  is_required: false,
  is_indexed: true,
  is_readonly: false,
  sort_order: 0,
  validation_rules: ['pattern:^\\+?[1-9]\\d{1,14}$'],
  children: [],
};
```

**Реализация:**

```tsx
<Form.Item
  name={['blueprint_data', 'author.contacts.phone']}
  label="Phone"
  rules={[
    {
      pattern: /^\+?[1-9]\d{1,14}$/,
      message: 'Неверный формат телефона',
    },
  ]}
>
  <Input type="tel" placeholder="+1234567890" />
</Form.Item>
```

**content_json:**

```typescript
{
  'author.contacts.phone': '+1234567890'
}
```

### 3. Группа полей (data_type: json)

```typescript
const path: ZPathTreeNode = {
  id: 3,
  blueprint_id: 1,
  parent_id: null,
  name: 'author',
  full_path: 'author',
  data_type: 'json',
  cardinality: 'one',
  is_required: false,
  is_indexed: false,
  is_readonly: false,
  sort_order: 0,
  validation_rules: null,
  children: [
    {
      id: 4,
      name: 'name',
      full_path: 'author.name',
      data_type: 'string',
      is_required: true,
      children: [],
    },
    {
      id: 5,
      name: 'email',
      full_path: 'author.email',
      data_type: 'string',
      is_required: true,
      children: [],
    },
  ],
};
```

**Реализация:**

```tsx
import { Card } from 'antd';

<Card title="Author" className="mb-4">
  <Form.Item name={['blueprint_data', 'author.name']} label="Name" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
  <Form.Item
    name={['blueprint_data', 'author.email']}
    label="Email"
    rules={[{ required: true, type: 'email' }]}
  >
    <Input type="email" />
  </Form.Item>
</Card>;
```

**content_json:**

```typescript
{
  'author.name': 'John Doe',
  'author.email': 'john@example.com'
}
```

### 4. Массив значений (cardinality: many)

```typescript
const path: ZPathTreeNode = {
  id: 8,
  blueprint_id: 1,
  parent_id: null,
  name: 'tags',
  full_path: 'tags',
  data_type: 'string',
  cardinality: 'many',
  is_required: false,
  is_indexed: true,
  is_readonly: false,
  sort_order: 0,
  validation_rules: null,
  children: [],
};
```

**Реализация:**

```tsx
import { Form, Input, Button, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

<Form.List name={['blueprint_data', 'tags']}>
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
          <Form.Item
            {...restField}
            name={name}
            rules={[{ required: true, message: 'Тег обязателен' }]}
          >
            <Input placeholder="Тег" />
          </Form.Item>
          <MinusCircleOutlined onClick={() => remove(name)} />
        </Space>
      ))}
      <Form.Item>
        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
          Добавить тег
        </Button>
      </Form.Item>
    </>
  )}
</Form.List>;
```

**content_json:**

```typescript
{
  tags: ['технологии', 'cms', 'разработка'];
}
```

### 5. Массив групп (cardinality: many + data_type: json)

```typescript
const path: ZPathTreeNode = {
  id: 9,
  blueprint_id: 1,
  parent_id: null,
  name: 'gallery',
  full_path: 'gallery',
  data_type: 'json',
  cardinality: 'many',
  is_required: false,
  is_indexed: false,
  is_readonly: false,
  sort_order: 0,
  validation_rules: null,
  children: [
    {
      id: 10,
      name: 'image',
      full_path: 'gallery.image',
      data_type: 'ref',
      cardinality: 'one',
      is_required: true,
      children: [],
    },
    {
      id: 11,
      name: 'caption',
      full_path: 'gallery.caption',
      data_type: 'string',
      cardinality: 'one',
      is_required: false,
      children: [],
    },
  ],
};
```

**Реализация:**

```tsx
<Form.List name={['blueprint_data', 'gallery']}>
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Card key={key} title={`Изображение ${name + 1}`} className="mb-4">
          <Form.Item
            {...restField}
            name={[name, 'gallery.image']}
            label="Image"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Выберите Entry"
              // Загрузка Entry через API
            />
          </Form.Item>
          <Form.Item {...restField} name={[name, 'gallery.caption']} label="Caption">
            <Input />
          </Form.Item>
          <Button onClick={() => remove(name)}>Удалить</Button>
        </Card>
      ))}
      <Button type="dashed" onClick={() => add()} block>
        Добавить изображение
      </Button>
    </>
  )}
</Form.List>
```

**content_json:**

```typescript
{
  'gallery.0.image': 5,
  'gallery.0.caption': 'Image 1',
  'gallery.1.image': 7,
  'gallery.1.caption': 'Image 2'
}
```

**Примечание:** Для массивов групп используется индексация в ключах: `gallery.0.image`, `gallery.1.image` и т.д.

### 6. Ссылка на Entry (data_type: ref)

```typescript
const path: ZPathTreeNode = {
  id: 12,
  blueprint_id: 1,
  parent_id: null,
  name: 'featured_image',
  full_path: 'featured_image',
  data_type: 'ref',
  cardinality: 'one',
  is_required: false,
  is_indexed: true,
  is_readonly: false,
  sort_order: 0,
  validation_rules: null,
  children: [],
};
```

**Реализация:**

```tsx
import { Select } from 'antd';
import { listEntries } from '@/api/apiEntries';
import { useEffect, useState } from 'react';

const PathRefField: React.FC<PropsPathRefField> = ({ path, value, onChange }) => {
  const [entries, setEntries] = useState<ZEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);
      try {
        const result = await listEntries({ per_page: 100 });
        setEntries(result.data);
      } catch (error) {
        onError(error);
      } finally {
        setLoading(false);
      }
    };
    loadEntries();
  }, []);

  return (
    <Form.Item
      name={['blueprint_data', path.full_path]}
      label={path.name}
      rules={path.is_required ? [{ required: true }] : []}
    >
      <Select
        showSearch
        placeholder="Выберите Entry"
        loading={loading}
        value={value}
        onChange={onChange}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={entries.map(entry => ({
          value: entry.id,
          label: entry.title,
        }))}
      />
    </Form.Item>
  );
};
```

**content_json:**

```typescript
{
  featured_image: 42; // ID Entry
}
```

### 7. Ссылка на массив Entry (data_type: ref, cardinality: many)

```typescript
const path: ZPathTreeNode = {
  id: 13,
  blueprint_id: 1,
  parent_id: null,
  name: 'related_articles',
  full_path: 'related_articles',
  data_type: 'ref',
  cardinality: 'many',
  is_required: false,
  is_indexed: true,
  is_readonly: false,
  sort_order: 0,
  validation_rules: null,
  children: [],
};
```

**Реализация:**

```tsx
<Form.Item name={['blueprint_data', 'related_articles']} label="Related Articles">
  <Select
    mode="multiple"
    showSearch
    placeholder="Выберите Entry"
    options={entries.map(entry => ({
      value: entry.id,
      label: entry.title,
    }))}
  />
</Form.Item>
```

**content_json:**

```typescript
{
  related_articles: [1, 2, 3]; // Массив ID Entry
}
```

### 8. Скопированное поле (is_readonly: true)

```typescript
const path: ZPathTreeNode = {
  id: 14,
  blueprint_id: 2,
  parent_id: 3,
  name: 'phone',
  full_path: 'author.contacts.phone',
  data_type: 'string',
  cardinality: 'one',
  is_required: false,
  is_indexed: true,
  is_readonly: true,
  sort_order: 0,
  validation_rules: null,
  source_blueprint_id: 1,
  source_blueprint: {
    id: 1,
    code: 'contact_info',
    name: 'Contact Info',
  },
  blueprint_embed_id: 5,
  children: [],
};
```

**Реализация:**

```tsx
<Form.Item
  name={['blueprint_data', 'author.contacts.phone']}
  label="Phone"
  tooltip={`Скопировано из Blueprint: ${path.source_blueprint?.name}`}
>
  <Input disabled />
</Form.Item>
```

### 9. Многоуровневая вложенность

```typescript
const path: ZPathTreeNode = {
  id: 15,
  blueprint_id: 1,
  parent_id: null,
  name: 'content',
  full_path: 'content',
  data_type: 'json',
  cardinality: 'one',
  is_required: false,
  is_indexed: false,
  is_readonly: false,
  sort_order: 0,
  validation_rules: null,
  children: [
    {
      id: 16,
      name: 'sections',
      full_path: 'content.sections',
      data_type: 'json',
      cardinality: 'many',
      children: [
        {
          id: 17,
          name: 'title',
          full_path: 'content.sections.title',
          data_type: 'string',
          is_required: true,
          children: [],
        },
        {
          id: 18,
          name: 'blocks',
          full_path: 'content.sections.blocks',
          data_type: 'json',
          cardinality: 'many',
          children: [
            {
              id: 19,
              name: 'type',
              full_path: 'content.sections.blocks.type',
              data_type: 'string',
              is_required: true,
              children: [],
            },
            {
              id: 20,
              name: 'data',
              full_path: 'content.sections.blocks.data',
              data_type: 'json',
              cardinality: 'one',
              children: [
                {
                  id: 21,
                  name: 'text',
                  full_path: 'content.sections.blocks.data.text',
                  data_type: 'text',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
```

**content_json для многоуровневой структуры:**

```typescript
{
  'content.sections.0.title': 'Section 1',
  'content.sections.0.blocks.0.type': 'paragraph',
  'content.sections.0.blocks.0.data.text': 'Text content',
  'content.sections.1.title': 'Section 2',
  'content.sections.1.blocks.0.type': 'heading',
  'content.sections.1.blocks.0.data.text': 'Heading text',
}
```

## Архитектура системы генерации форм

### Компоненты системы

#### 1. Источник данных: Blueprint Paths

**API Endpoint:** `GET /api/v1/admin/blueprints/{blueprintId}/paths`

**Функция:** `listPaths(blueprintId: number): Promise<ZPathTreeNode[]>`

**Расположение:** `src/api/pathApi.ts`

**Пример использования:**

```typescript
import { listPaths } from '@/api/pathApi';

const paths = await listPaths(1);
// paths - массив ZPathTreeNode с рекурсивной структурой children
```

#### 2. Трансформация Path → Form Schema

**Процесс:**

1. **Получение дерева Paths** из API через `listPaths(blueprintId)`
2. **Рекурсивная обработка** дерева paths
3. **Генерация компонентов формы** с учетом:
   - Типа данных (`data_type`)
   - Кардинальности (`cardinality`)
   - Вложенности (`parent_id`, `children`)
   - Валидации (`is_required`, `validation_rules`)
   - Только для чтения (`is_readonly`)

**Компонент:** `BlueprintForm` из `src/components/blueprintForm/BlueprintForm.tsx`

#### 3. Преобразование данных

**content_json → FormValues (для формы):**

```typescript
/**
 * Преобразует плоский content_json в иерархическую структуру для формы.
 * @param contentJson Плоский объект с ключами full_path.
 * @param paths Дерево Path для определения структуры.
 * @returns Иерархический объект для Ant Design Form.
 */
const contentJsonToFormValues = (
  contentJson: Record<string, unknown> | null,
  paths: ZPathTreeNode[]
): BlueprintFormValues => {
  // Реализация в src/components/blueprintForm/utils/formDataToContent.ts
};
```

**FormValues → content_json (для сохранения):**

```typescript
/**
 * Преобразует иерархическую структуру формы в плоский content_json.
 * @param formValues Значения формы.
 * @param paths Дерево Path для определения структуры.
 * @returns Плоский объект с ключами full_path.
 */
const formValuesToContentJson = (
  formValues: BlueprintFormValues,
  paths: ZPathTreeNode[]
): Record<string, unknown> => {
  // Реализация в src/components/blueprintForm/utils/formDataToContent.ts
};
```

#### 4. Маппинг data_type → Ant Design компонент

| data_type  | cardinality | Ant Design компонент                  |
| ---------- | ----------- | ------------------------------------- |
| `string`   | `one`       | `Input`                               |
| `string`   | `many`      | `Form.List` с `Input`                 |
| `text`     | `one`       | `Input.TextArea`                      |
| `text`     | `many`      | `Form.List` с `Input.TextArea`        |
| `int`      | `one`       | `InputNumber` (step: 1)               |
| `int`      | `many`      | `Form.List` с `InputNumber`           |
| `float`    | `one`       | `InputNumber` (step: 0.01)            |
| `float`    | `many`      | `Form.List` с `InputNumber`           |
| `bool`     | `one`       | `Switch`                              |
| `bool`     | `many`      | `Form.List` с `Switch`                |
| `date`     | `one`       | `DatePicker`                          |
| `date`     | `many`      | `Form.List` с `DatePicker`            |
| `datetime` | `one`       | `DatePicker` с `showTime`             |
| `datetime` | `many`      | `Form.List` с `DatePicker` (showTime) |
| `json`     | `one`       | `Card` с вложенными полями            |
| `json`     | `many`      | `Form.List` с `Card`                  |
| `ref`      | `one`       | `Select` с загрузкой Entry            |
| `ref`      | `many`      | `Select` с `mode="multiple"`          |

### Поток данных

```
┌─────────────────┐
│   Entry         │
│   (content_json)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostType      │
│   (blueprint_id)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GET /paths     │
│  API Endpoint   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Path Tree      │
│  (ZPathTreeNode)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Transform      │
│  content_json → │
│  FormValues     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  BlueprintForm  │
│  (React)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User Input     │
│  (FormValues)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Transform      │
│  FormValues →   │
│  content_json   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PUT /entries   │
│  API Endpoint   │
└─────────────────┘
```

### Особые случаи

#### 1. Скопированные поля (is_readonly: true)

- **Отображение:** Поле только для чтения (`disabled`)
- **Валидация:** Не применяется (поле не редактируется)
- **Источник:** Указывается `source_blueprint.name` для подсказки пользователю через `tooltip`

#### 2. Вложенные массивы

- **full_path:** `content.sections.blocks.type` (без `[]`)
- **Имя поля в форме:** Используется `Form.List` с вложенными индексами
- **content_json ключ:** `content.sections.0.blocks.0.type` (с индексами)
- **Обработка:** Рекурсивная обработка индексов массивов через `Form.List`
- **Валидация:** Применяется к каждому элементу массива

**Примечание:** `full_path` не содержит `[]` - это просто путь через точки. Индексы добавляются только при сохранении в `content_json` для массивов.

#### 3. Ссылки на Entry (ref)

- **Одиночная ссылка:** `featured_image` → `content_json.featured_image = entry_id`
- **Множественные ссылки:** `related_articles` → `content_json.related_articles = [entry_id1, entry_id2]`
- **Компонент:** `Select` из Ant Design с загрузкой Entry через `listEntries()`

#### 4. Валидация

- **is_required:** Добавляет правило `{ required: true }` в `Form.Item`
- **validation_rules:** Преобразуются в правила Ant Design Form:
  - `min:1` → `{ min: 1 }`
  - `max:500` → `{ max: 500 }`
  - `pattern:^\\+?[1-9]\\d{1,14}$` → `{ pattern: /^\+?[1-9]\d{1,14}$/ }`

## Реализация

### Frontend (TypeScript/React)

#### 1. Компонент BlueprintForm

**Файл:** `src/components/blueprintForm/BlueprintForm.tsx`

```typescript
import { Form } from 'antd';
import type { ZPathTreeNode } from '@/types/path';
import { PathField } from './fields/PathField';

interface PropsBlueprintForm {
  paths: ZPathTreeNode[];
  initialValues?: BlueprintFormValues;
  readonly?: boolean;
}

export const BlueprintForm: React.FC<PropsBlueprintForm> = ({
  paths,
  initialValues,
  readonly,
}) => {
  return (
    <>
      {paths
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(path => (
          <PathField
            key={path.id}
            path={path}
            readonly={readonly}
            fieldNamePrefix={['blueprint_data']}
          />
        ))}
    </>
  );
};
```

#### 2. Компонент PathField (базовый)

**Файл:** `src/components/blueprintForm/fields/PathField.tsx`

```typescript
import type { ZPathTreeNode } from '@/types/path';
import { PathStringField } from './PathStringField';
import { PathTextAreaField } from './PathTextAreaField';
import { PathIntField } from './PathIntField';
import { PathFloatField } from './PathFloatField';
import { PathBoolField } from './PathBoolField';
import { PathDateField } from './PathDateField';
import { PathDateTimeField } from './PathDateTimeField';
import { PathRefField } from './PathRefField';
import { PathJsonGroupField } from './PathJsonGroupField';

const getFieldComponent = (path: ZPathTreeNode): React.ComponentType<any> => {
  if (path.data_type === 'json') {
    return PathJsonGroupField;
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
      return PathStringField;
  }
};

export const PathField: React.FC<PropsPathField> = ({ path, ...props }) => {
  const Component = getFieldComponent(path);
  return <Component path={path} {...props} />;
};
```

#### 3. Интеграция в EntryEditorPage

**Файл:** `src/pages/EntryEditorPage/EntryEditorPage.tsx`

```typescript
import { BlueprintForm } from '@/components/blueprintForm/BlueprintForm';
import { contentJsonToFormValues, formValuesToContentJson } from '@/components/blueprintForm/utils/formDataToContent';

// В компоненте:
{store.paths.length > 0 && (
  <Card className="p-6 mt-6">
    <h2 className="text-2xl font-semibold mb-6">Данные Blueprint</h2>
    <BlueprintForm
      paths={store.paths}
      initialValues={store.formValues.blueprint_data}
      readonly={store.pending || store.loading}
    />
  </Card>
)}
```

#### 4. Сохранение данных

**В EntryEditorStore:**

```typescript
import { formValuesToContentJson } from '@/components/blueprintForm/utils/formDataToContent';

async saveEntry(...): Promise<ZEntry | null> {
  const payload: ZEntryPayload = {
    // ... другие поля ...
    content_json: values.blueprint_data && store.paths.length > 0
      ? formValuesToContentJson(values.blueprint_data, store.paths)
      : null,
  };

  // ... сохранение ...
}
```

## Структура файлов

```
src/
├── components/
│   └── blueprintForm/
│       ├── BlueprintForm.tsx
│       ├── fields/
│       │   ├── PathField.tsx
│       │   ├── PathStringField.tsx
│       │   ├── PathTextAreaField.tsx
│       │   ├── PathIntField.tsx
│       │   ├── PathFloatField.tsx
│       │   ├── PathBoolField.tsx
│       │   ├── PathDateField.tsx
│       │   ├── PathDateTimeField.tsx
│       │   ├── PathRefField.tsx
│       │   └── PathJsonGroupField.tsx
│       └── utils/
│           ├── formDataToContent.ts
│           ├── getFieldLabel.ts
│           └── validatePathField.ts
├── api/
│   └── pathApi.ts (listPaths)
└── types/
    └── path.ts (ZPathTreeNode)
```

## Заключение

Система генерации форм на основе Path обеспечивает:

1. **Гибкость:** Поддержка всех типов данных и структур
2. **Расширяемость:** Легко добавлять новые типы полей
3. **Валидация:** Автоматическая генерация правил валидации через Ant Design Form
4. **Типобезопасность:** Строгая типизация через TypeScript и Zod
5. **Производительность:** Эффективная обработка больших структур через MobX
6. **Плоский формат данных:** Использование `full_path` как ключей в `content_json` для простоты хранения

**Ключевые особенности:**

- Данные в `content_json` хранятся в плоском формате с `full_path` как ключами
- Форма использует иерархическую структуру для удобства работы
- Преобразование между форматами выполняется утилитами `contentJsonToFormValues` и `formValuesToContentJson`
- Все компоненты используют Ant Design для единообразия UI
