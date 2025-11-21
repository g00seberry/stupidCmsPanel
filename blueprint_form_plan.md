# План по созданию идеальной системы динамических форм на основе Blueprint/Path

## 1. Цели системы

- Единый способ описания структуры данных (Blueprint/Path) и форм на FE/BE.
- Строгая типизация (TypeScript + Zod) без `any`.
- Расширяемость по типам полей и UI-компонентам.
- Поддержка вложенных структур, списков, ссылок на другие сущности (ref).
- Единая валидация и предсказуемый UX для всех типов полей.
- Возможность визуального редактирования и версионирования Blueprint’ов.

---

## 2. Наведение порядка в типах и Zod-схемах

1. **Убрать `ZodType<any>` и `any` в целом**:
   - Разделить базовую схему Path и рекурсивную:
     - `zPathBase` без `children`.
     - `zPath` / `zPathTreeNode` с рекурсией на основе `zPathBase`.
   - Обеспечить корректный `z.infer` без превращения всего в `any`.

2. **Сделать валидационные правила типизированными**:
   - Ввести `zValidationRule` как `discriminatedUnion` по полю `type`:
     - Примеры: `min`, `max`, `regex`, `length`, `enum`, `custom` и т.п.
   - `validation_rules: z.array(zValidationRule).nullable()`.

3. **Сделать `ZPathTreeNode` дискриминированным union-ом по `data_type` (на уровне TS)**:
   - Для `data_type = 'json'` — обязательны `children`.
   - Для `data_type = 'ref'` — обязательны поля, описывающие целевую сущность (например, `target_blueprint`).
   - Для простых типов (`string`, `int`, `bool`, ...) — соответствующие спец. поля (например, `min`, `max` для чисел).

Результат: строгая типизация структуры Blueprint, отсутствие «чёрных дыр» с `any` и более безопасная эволюция схемы.

---

## 3. Внутренняя нормализованная модель формы

Ввести промежуточный слой: **форменную модель**, отделённую от сырого `ZPathTreeNode`:

```ts
type ScalarDataType = 'string' | 'text' | 'int' | 'float' | 'bool' | 'date' | 'datetime' | 'ref';

type BaseFieldNode = {
  id: number;
  name: string;
  fullPath: string[];
  dataType: ScalarDataType | 'json';
  cardinality: 'one' | 'many';
  label: string;
  required: boolean;
  readonly: boolean;
  helpText?: string;
  ui?: Record<string, unknown>;
};

type JsonFieldNode = BaseFieldNode & {
  dataType: 'json';
  children: FieldNode[];
};

type FieldNode = JsonFieldNode | (BaseFieldNode & { dataType: ScalarDataType });
```

Функция:

```ts
function buildFormSchema(paths: ZPathTreeNode[]): FieldNode[];
```

Задачи `buildFormSchema`:

- Сортировать детей по `sort_order` один раз, без мутирования исходного массива.
- Рассчитывать `fullPath` для каждого узла (массива сегментов имени).
- Применять дефолты (label из name, required по config и т.д.).
- Нормализовать все условные поля (`validation_rules`, `ui`, `helpText` и т.п.).

Результат: рендеринг и валидация работают поверх устойчивого, удобного в использовании типа `FieldNode`.

---

## 4. Реестр типов полей вместо `switch`

Вместо центрального `switch` по `data_type` в `PathField` — **реестр типов полей**:

```ts
interface FieldComponentProps<TValue = unknown> {
  node: FieldNode;
  name: (string | number)[];
  readonly?: boolean;
}

interface FieldDefinition<TValue = unknown> {
  Component: React.ComponentType<FieldComponentProps<TValue>>;
  getRules?: (node: FieldNode) => Rule[];
  getDefaultValue?: (node: FieldNode) => TValue | TValue[];
}

const fieldRegistry: Record<ScalarDataType | 'json', FieldDefinition<any>> = {
  string: { Component: StringField },
  text: { Component: TextAreaField },
  int: { Component: IntField },
  float: { Component: FloatField },
  bool: { Component: BoolField },
  date: { Component: DateField },
  datetime: { Component: DateTimeField },
  ref: { Component: RefField },
  json: { Component: JsonGroupField },
};
```

`PathField` становится тонким роутером:

```tsx
export const PathField: React.FC<PropsPathFieldBase> = ({ node, name, readonly }) => {
  const def = fieldRegistry[node.dataType];
  if (!def) {
    throw new Error(`Unknown dataType: ${node.dataType}`);
  }
  return <def.Component node={node} name={name} readonly={readonly} />;
};
```

Дополнительно:

- Вводим тип-проверку, что `keyof typeof fieldRegistry` == `ScalarDataType | 'json'`.
- Любой новый `data_type` добавляется через регистрацию в `fieldRegistry`, а не через правку `switch`.

Результат: расширяемость и статическая проверка согласованности типов.

---

## 5. Единый слой для cardinality (`one` / `many`)

Вынести логику работы со списками в отдельный компонент/обёртку:

```tsx
interface CardinalityWrapperProps {
  node: FieldNode;
  name: (string | number)[];
  readonly?: boolean;
  children: (itemName: (string | number)[]) => React.ReactNode;
}
```

Поведение:

- Если `node.cardinality === 'one'`:
  - Вызывает `children(name)` ровно один раз, без `Form.List`.
- Если `node.cardinality === 'many'`:
  - Использует `Form.List` (или аналог) и предоставляет:
    - функции `add`, `remove`, `move`,
    - поддержку `minItems`, `maxItems` (из `validation_rules` или `ui`),
    - единые кнопки «Добавить», «Удалить», «Копировать элемент»,
    - чистый UX для списков (никаких «добавлений по Enter в пустоту»).

Тогда `StringField/IntField/FloatField/...` отвечают **только за рендер одного значения**, а списковость — за отдельным слоем.

Результат: единое поведение всех списков, проще поддерживать и улучшать UX.

---

## 6. Валидация: одна схема правит всеми

### 6.1. Генерация Zod-схемы из Blueprint

Создать модуль:

```ts
function buildZodSchemaFromPaths(paths: FieldNode[]): z.ZodType<any>;
```

- Использовать `validation_rules` для генерации Zod-валидаторов:
  - числа: `z.number().min(...).max(...)`,
  - строки: `z.string().min(...).max(...).regex(...)`,
  - массивы: `z.array(schema).min(minItems).max(maxItems)`,
  - json-группы: `z.object({ childName: childSchema, ... })`.
- Учитывать `required`: `required ? schema : schema.optional().nullable()`.

### 6.2. Использование Zod в форме

- Или использовать React Hook Form + `zodResolver(schema)`,
- Или в AntD `Form` вызывать Zod-схему в `onFinish` и/или в кастомных валидационных правилах (`validator`), чтобы проверки были одинаковые для FE и BE.

Результат: единый источник истинны для валидации, меньше несоответствий и дублирования логики.

---

## 7. Асинхронные и ссылочные поля (ref) через data-provider

### 7.1. Абстракция данных для справочников

Вместо того чтобы `PathRefField` сам дергал API, ввести слой:

```ts
interface ReferenceQuery {
  resource: 'entries' | 'users' | 'categories' | string;
  params?: Record<string, unknown>;
}

interface ReferenceOption {
  value: string | number;
  label: string;
}

interface ReferenceDataProvider {
  useReferenceData(query: ReferenceQuery): {
    loading: boolean;
    error?: Error;
    options: ReferenceOption[];
    loadMore?: () => void;
    search?: (term: string) => void;
  };
}
```

- Реализовать это через React Query / SWR / контекст.
- `RefField` принимает `query` (из `node`, например `node.refConfig`) и использует `useReferenceData`.

### 7.2. Кэширование и поиск

- Кэшировать результаты по ключу `resource + params`.
- Для больших справочников использовать серверный поиск (передавать `search` в API, debounce).

Результат: одно место для работы со справочными данными, отсутствие дублирующихся запросов и предсказуемое поведение ссылочных полей.

---

## 8. UI-конфигурация и локализация

### 8.1. UI-конфигурация

Ввести для FieldNode поле `ui`:

```ts
ui?: {
  width?: number;              // для layout (колонки)
  widget?: string;             // например, 'textarea', 'select', 'radio-group'
  placeholderKey?: string;     // ключ локализации
  labelKey?: string;           // ключ локализации
  helpKey?: string;            // ключ локализации
  [key: string]: unknown;
};
```

- На уровне Blueprints/Path конфигурировать внешний вид полей.
- Слой рендера интерпретирует `ui` и выбирает конкретные AntD-компоненты или кастомные виджеты.

### 8.2. Локализация

- Вынести все строки в i18n (`t('blueprint.addItem')`, `t(ui.labelKey)` и т.п.).
- Поддерживать разные языки для label/placeholder/help без правки кода.

Результат: гибкий UI, адаптация под разные проекты/языки без постоянного вмешательства разработчика.

---

## 10. Тестирование и качество

1. **Unit-тесты**:
   - `buildFormSchema(paths)` — разные сценарии вложенности/списков/required.
   - `buildZodSchemaFromPaths` — проверка, что `validation_rules` корректно превращаются в Zod.
   - типизация `FieldNode` и корректность дискриминированных union-ов.

2. **Типовые проверки/утилиты**:
   - Проверка, что `ScalarDataType | 'json'` совпадает с ключами `fieldRegistry`.
   - Проверка, что все `data_type` имеют реализованный компонент.

3. **Интеграционные тесты**:
   - Рендер реального Blueprint, создание/редактирование записи, работа массивов и json-групп.

Результат: система, устойчиво переживающая изменения и расширения, без регрессий в базовых сценариях.

---

## 11. Переход к новой архитектуре по шагам

1. **Шаг 1:** Починить Zod-схемы и типы (`ZPathTreeNode`, `validation_rules`) без изменения рендера.
2. **Шаг 2:** Ввести `buildFormSchema` и постепенно переключить рендер с `ZPathTreeNode` на `FieldNode`.
3. **Шаг 3:** Реализовать `fieldRegistry` и переписать `PathField` на использование реестра.
4. **Шаг 4:** Вынести логику `cardinality` в `CardinalityWrapper`, перевести существующие поля на модель «одно значение + обёртка».
5. **Шаг 5:** Реализовать генерацию Zod-схемы и начать использовать её для валидации формы.
6. **Шаг 6:** Внедрить `ReferenceDataProvider` и переписать `RefField` и другие справочные поля.
7. **Шаг 7:** Добавить `ui`-конфиг и i18n, заменить хардкоженные строки и layout’ы.
8. **Шаг 8:** (Параллельно или позже) построить редактор Blueprint’ов и версионирование схем.

Такой план позволит эволюционировать текущую реализацию до «идеальной» системы без одномоментного переписывания всего проекта, последовательно укрепляя типы, слой рендера, валидацию и управление схемами.
