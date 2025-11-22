# Схема-ориентированная форма с использованием Zod для типизации и валидации

В этом документе предыдущая идея "универсальной формы по схеме" адаптирована под **Zod**.  
Zod становится центральным источником правды по **структуре данных, типизации и базовой валидации**.

Мы строим архитектуру так, чтобы:
- форма работала с произвольной сущностью (например, товаром с полями `title`, `sku`, `price`, `in_stock`, `description`, вложенным `rrrr.eeee`);
- типы значений формы получались через `z.infer`;
- UI (Ant Design) читал метаданные отдельно, а не из Zod напрямую;
- MobX-FormModel использовал Zod для валидации и типизации.

---

## 1. Общая идея

1. **Zod-схема** описывает *данные* и правила валидации.
2. **UI-схема** (отдельно) описывает, *как* рендерить поля (лейблы, виджеты, `cardinality`, группы и т.п.).
3. **MobX FormModel**:
   - хранит значения типа `z.infer<typeof Schema>`,
   - валидирует через `Schema.safeParse`,
   - конвертирует ошибки Zod в плоские string-пути (`rrrr[0].eeee[1]`).
4. **SchemaForm (React + AntD)**:
   - рекурсивно обходит **Zod-схему** (через `ZodObject`, `ZodArray`, `ZodString`, ...),
   - смотрит на UI-схему, чтобы понять `label`, `cardinality`, виджет,
   - отображает ошибки из FormModel.

---

## 2. Zod-схема сущности товара

Пример Zod-схемы под ваш JSON (`rrrr[].eeee[]`, `title`, `sku`, `price`, `in_stock`, `description`):

```ts
import { z } from 'zod';

export const ProductSchema = z.object({
  rrrr: z
    .array(
      z.object({
        eeee: z.array(z.string())
      })
    )
    .optional(),

  title: z.string().min(1, 'Название обязательно'),
  sku: z.string().min(1, 'SKU обязателен'),
  price: z
    .number({ invalid_type_error: 'Цена должна быть числом' })
    .nonnegative('Цена не может быть отрицательной'),
  in_stock: z.boolean().default(false),
  description: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;
```

- `ProductFormValues` теперь строго типизирован через Zod.
- Все поля, включая вложенные `rrrr[].eeee[]`, описаны внутри одной Zod-схемы.

Если нужно сделать схему динамической (приходит с бэкенда в виде JSON), можно:
- либо на бэкенде тоже использовать Zod (или генерировать совместимую схему),  
- либо писать конвертер **"JSON схема → Zod-схема"**.

---

## 3. UI-схема (метаданные для рендера)

Zod описывает только структуру и валидацию данных. Для UI используем отдельную схему:

```ts
import type { ZodTypeAny } from 'zod';

export type FieldType = 'string' | 'float' | 'bool' | 'text' | 'json';

export interface FieldUiConfig {
  // --- отображение ---
  label?: string;
  placeholder?: string;
  group?: string;           // секция/группа
  uiWidget?: string;        // ключ виджета
  uiProps?: Record<string, any>;

  // --- служебные вещи ---
  type?: FieldType;         // можно указать руками, если автоопределение неудобно
  cardinality?: 'one' | 'many';
}

export interface UiSchemaObject {
  [fieldName: string]: FieldUiConfig | UiSchemaObject;
}
```

UI-схема для `ProductSchema`:

```ts
export const ProductUiSchema: UiSchemaObject = {
  rrrr: {
    label: 'RRRR',
    type: 'json',
    cardinality: 'many',
  },
  // для вложенных полей rrrr.eeee можно задать конфиг отдельно
  // (например, через отдельный объект или вычисление по пути)
  title: {
    label: 'Название',
    placeholder: 'Введите название товара',
    type: 'string',
    uiWidget: 'title',
    cardinality: 'one',
  },
  sku: {
    label: 'SKU',
    type: 'string',
    cardinality: 'one',
  },
  price: {
    label: 'Цена',
    type: 'float',
    uiWidget: 'price',
    cardinality: 'one',
  },
  in_stock: {
    label: 'В наличии',
    type: 'bool',
    cardinality: 'one',
  },
  description: {
    label: 'Описание',
    type: 'text',
    cardinality: 'one',
  },
};
```

Важно:
- **структура данных** — в Zod,
- **как рисовать** — в UI-схеме,
- ничего не мешает хранить UI-схему тоже на бэкенде или в БД.

---

## 4. FormModel на MobX + Zod

### 4.1. Вспомогательные функции для путей

```ts
type PathSegment = string | number;

const getValueByPath = (obj: any, path: PathSegment[]): any =>
  path.reduce((acc, seg) => (acc == null ? acc : acc[seg]), obj);

const setValueByPath = (obj: any, path: PathSegment[], value: any) => {
  if (!path.length) return;
  const last = path[path.length - 1];
  const parent = path.slice(0, -1).reduce((acc, seg) => {
    if (acc[seg] == null) acc[seg] = typeof seg === 'number' ? [] : {};
    return acc[seg];
  }, obj);
  parent[last] = value;
};

const pathToString = (path: PathSegment[]): string =>
  path
    .map((seg, idx) =>
      typeof seg === 'number' ? `[${seg}]` : idx === 0 ? seg : `.${seg}`,
    )
    .join('')
    .replace('.[', '[');
```

### 4.2. FormModel

```ts
import { makeAutoObservable } from 'mobx';
import type { ZodTypeAny, ZodError } from 'zod';

type ZodValues<S extends ZodTypeAny> = z.infer<S>;

export class FormModel<S extends ZodTypeAny> {
  schema: S;
  values: ZodValues<S>;
  errors: Map<string, string[]>;

  constructor(schema: S, initial?: Partial<ZodValues<S>>) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.schema = schema;
    // базовая инициализация — можно усложнить при необходимости
    this.values = {
      ...(initial as any),
    };
    this.errors = new Map();
  }

  setValue(path: PathSegment[], value: any) {
    setValueByPath(this.values, path, value);
  }

  setAll(values: Partial<ZodValues<S>>) {
    this.values = { ...this.values, ...values } as ZodValues<S>;
  }

  addArrayItem(path: PathSegment[], item: unknown) {
    const arr = getValueByPath(this.values, path) as unknown[];
    if (Array.isArray(arr)) {
      arr.push(item);
    } else {
      setValueByPath(this.values, path, [item]);
    }
  }

  removeArrayItem(path: PathSegment[], index: number) {
    const arr = getValueByPath(this.values, path) as unknown[];
    if (Array.isArray(arr)) {
      arr.splice(index, 1);
    }
  }

  private collectZodErrors(error: ZodError) {
    this.errors.clear();
    for (const issue of error.issues) {
      const pathStr = pathToString(issue.path as PathSegment[]);
      const list = this.errors.get(pathStr) ?? [];
      list.push(issue.message);
      this.errors.set(pathStr, list);
    }
  }

  validate(): boolean {
    this.errors.clear();
    const result = this.schema.safeParse(this.values);
    if (!result.success) {
      this.collectZodErrors(result.error);
      return false;
    }
    // можно обновить values нормализованными данными из Zod
    this.values = result.data;
    return true;
  }

  get isValid() {
    return this.errors.size === 0;
  }

  errorFor(path: string): string | undefined {
    const list = this.errors.get(path);
    return list?.[0];
  }

  get json(): ZodValues<S> {
    return this.values;
  }
}
```

- Вся серьёзная валидация и нормализация данных делается Zod'ом.
- MobX хранит только `values` и `errors`, не дублируя правила.

---

## 5. Рендеринг формы по Zod-схеме (SchemaForm)

### 5.1. Автоопределение типа поля из Zod

Нам нужно понять, что за тип: строка, число, bool, объект, массив и т.п.

Пример вспомогательных функций:

```ts
import {
  ZodTypeAny,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodArray,
  ZodObject,
  ZodOptional,
  ZodNullable,
  ZodEffects,
} from 'zod';

const unwrapZodType = (schema: ZodTypeAny): ZodTypeAny => {
  // снимаем обёртки optional/nullable/effects, чтобы добраться до "голого" типа
  if (schema instanceof ZodOptional || schema instanceof ZodNullable || schema instanceof ZodEffects) {
    // @ts-ignore
    return unwrapZodType(schema._def.schema || schema._def.innerType);
  }
  return schema;
};

const inferFieldTypeFromZod = (schema: ZodTypeAny): FieldType => {
  const s = unwrapZodType(schema);
  if (s instanceof ZodString) return 'string';
  if (s instanceof ZodNumber) return 'float';
  if (s instanceof ZodBoolean) return 'bool';
  if (s instanceof ZodObject) return 'json';
  // по умолчанию строка
  return 'string';
};

const isObjectSchema = (schema: ZodTypeAny): schema is ZodObject<any> =>
  unwrapZodType(schema) instanceof ZodObject;

const isArraySchema = (schema: ZodTypeAny): schema is ZodArray<any> =>
  unwrapZodType(schema) instanceof ZodArray;
```

### 5.2. Реестр виджетов

```ts
type FieldRenderer = (props: {
  schema: ZodTypeAny;
  ui: FieldUiConfig;
  namePath: (string | number)[];
}) => React.ReactNode;

const defaultRenderers: Record<FieldType, FieldRenderer> = {
  string: ({ ui }) => <Input {...ui.uiProps} />,
  text: ({ ui }) => <Input.TextArea autoSize {...ui.uiProps} />,
  float: ({ ui }) => <InputNumber style={{ width: '100%' }} {...ui.uiProps} />,
  bool: ({ ui }) => <Switch {...ui.uiProps} />,
  json: () => null,
};

const widgetRegistry: Record<string, FieldRenderer> = {
  // price: (props) => <PriceInput {...props} />,
};
```

### 5.3. Рекурсивный `SchemaForm`

```tsx
import { Form, Card, Button, Space } from 'antd';
import type { FormInstance } from 'antd';
import { observer } from 'mobx-react-lite';

interface SchemaFormProps<S extends ZodTypeAny> {
  form: FormInstance;
  model: FormModel<S>;
  schema: S;           // ZodObject
  uiSchema: UiSchemaObject;
}

export const SchemaForm = observer(<S extends ZodTypeAny>({
  form,
  model,
  schema,
  uiSchema,
}: SchemaFormProps<S>) => {
  const renderObject = (
    objSchema: ZodObject<any>,
    parentPath: (string | number)[] = [],
    parentUi?: UiSchemaObject,
  ): React.ReactNode => {
    const shape = objSchema.shape;

    return Object.entries(shape).map(([key, fieldSchema]) => {
      const namePath = [...parentPath, key];
      const pathStr = pathToString(namePath);

      const fieldUi = (parentUi?.[key] as FieldUiConfig) ?? {};
      const baseType = inferFieldTypeFromZod(fieldSchema);
      const cardinality: 'one' | 'many' =
        fieldUi.cardinality ?? (isArraySchema(fieldSchema) ? 'many' : 'one');

      // json-объекты
      if (isObjectSchema(fieldSchema) && cardinality === 'one') {
        return (
          <Card key={pathStr} title={fieldUi.label ?? key}>
            {renderObject(
              unwrapZodType(fieldSchema) as ZodObject<any>,
              namePath,
              // для вложенных объектов можно передавать uiSchema по пути,
              // но здесь для простоты используем тот же объект
              uiSchema,
            )}
          </Card>
        );
      }

      // json + many (array of objects)
      if (isArraySchema(fieldSchema) && isObjectSchema(fieldSchema._def.type)) {
        const itemSchema = unwrapZodType(fieldSchema._def.type) as ZodObject<any>;
        return (
          <Form.List key={pathStr} name={namePath}>
            {(fields, { add, remove }) => (
              <Card
                title={fieldUi.label ?? key}
                extra={<Button onClick={() => add()}>Добавить</Button>}
              >
                {fields.map((f) => {
                  const itemPath = [...namePath, f.name];
                  const itemPathStr = pathToString(itemPath);
                  return (
                    <Card
                      key={itemPathStr}
                      size="small"
                      style={{ marginBottom: 8 }}
                      extra={<Button onClick={() => remove(f.name)}>Удалить</Button>}
                    >
                      {renderObject(itemSchema, itemPath, uiSchema)}
                    </Card>
                  );
                })}
              </Card>
            )}
          </Form.List>
        );
      }

      // примитивный тип (или массив примитивов)
      const renderer =
        (fieldUi.uiWidget && widgetRegistry[fieldUi.uiWidget]) ||
        defaultRenderers[fieldUi.type ?? baseType];

      if (cardinality === 'one') {
        return (
          <Form.Item
            key={pathStr}
            name={namePath}
            label={fieldUi.label ?? key}
            validateStatus={model.errorFor(pathStr) ? 'error' : undefined}
            help={model.errorFor(pathStr)}
          >
            {renderer({ schema: fieldSchema, ui: fieldUi, namePath })}
          </Form.Item>
        );
      }

      // many + примитивы (array)
      return (
        <Form.List key={pathStr} name={namePath}>
          {(fields, { add, remove }) => (
            <Card
              title={fieldUi.label ?? key}
              extra={<Button onClick={() => add()}>Добавить</Button>}
            >
              {fields.map((f) => {
                const itemPath = [...namePath, f.name];
                const itemPathStr = pathToString(itemPath);
                return (
                  <Space key={itemPathStr} align="baseline">
                    <Form.Item
                      name={itemPath}
                      validateStatus={model.errorFor(itemPathStr) ? 'error' : undefined}
                      help={model.errorFor(itemPathStr)}
                    >
                      {renderer({
                        schema: fieldSchema,
                        ui: fieldUi,
                        namePath: itemPath,
                      })}
                    </Form.Item>
                    <Button onClick={() => remove(f.name)}>Удалить</Button>
                  </Space>
                );
              })}
            </Card>
          )}
        </Form.List>
      );
    });
  };

  const rootObject = unwrapZodType(schema);
  if (!(rootObject instanceof ZodObject)) {
    throw new Error('SchemaForm поддерживает только ZodObject в корне');
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={model.values}
      onValuesChange={(_, allValues) => model.setAll(allValues as any)}
    >
      {renderObject(rootObject, [], uiSchema)}
    </Form>
  );
});
```

Важные моменты:
- Форма рендерится **по Zod-схеме**, а не по самодельной JSON-схеме.
- UI-шный конфиг (`UiSchemaObject`) используется только для визуальных настроек.
- Валидация выполняется через Zod → ошибки попадают в `FormModel.errors` → AntD показывает их.

---

## 6. Жизненный цикл формы с Zod

1. **Определяем Zod-схему и UI-схему**
   ```ts
   const model = new FormModel(ProductSchema, initialValues);
   const [form] = Form.useForm<ProductFormValues>();
   ```

2. **Рендерим SchemaForm**
   ```tsx
   <SchemaForm
     form={form}
     model={model}
     schema={ProductSchema}
     uiSchema={ProductUiSchema}
   />
   ```

3. **Редактирование**
   - пользователь изменяет поля,
   - AntD вызывает `onValuesChange` → `model.setAll(allValues)`,
   - MobX-объекты обновляются, `observer`-компоненты перерендериваются.

4. **Валидация и сабмит**
   ```ts
   const handleSubmit = async () => {
     // Можно использовать AntD для basic-проверок, но в этом подходе
     // главная правда — Zod, поэтому главное:
     const ok = model.validate();
     if (!ok) return;

     const payload = model.json; // типизированный ProductFormValues
     // отправляем на backend
   };
   ```

---

## 7. Почему Zod делает решение лучше

1. **Типизация "из коробки"**  
   `z.infer` прозрачно даёт типы значений формы, не нужно городить свой `InferFormValues`.

2. **Один источник правил**  
   Вся валидация и структура — в Zod; FormModel и UI только используют результат.

3. **Гибкость**  
   - Можно добавлять `refine`, `superRefine` для сложной бизнес-валидации,
   - легко переиспользовать ту же схему на бэкенде (если он на TypeScript/Node).

4. **Чистое разделение ответственности**  
   - Zod отвечает за данные,
   - UI-схема — за отображение,
   - MobX — за состояние и orchestration.

5. **Масштабируемость**  
   - Новые сущности — просто новые Zod-схемы + UI-схемы.
   - Общие компоненты формы/редактора работают с любым `ZodObject`.

Это даёт тебе гибкую, удобную и элегантную архитектуру формы, уже полностью опирающуюся на Zod для типизации и валидации.
