# План реализации универсальной схемо-ориентированной формы (30 задач)

## Фаза 1: Типизация и базовая инфраструктура (Задачи 1-8)

### Задача 1: Создать типы для схемы формы (FieldType, ValidationSpec, FieldSchema, EntitySchema)

**Описание:** Создать типы согласно документу 2.md в `src/types/schemaForm.ts`:

- `FieldType = 'string' | 'float' | 'bool' | 'text' | 'json' | 'int' | 'date' | 'datetime' | 'ref'`
- `Cardinality = 'one' | 'many'`
- `ValidationSpec` с типами: `'required' | 'min' | 'max' | 'regex' | 'enum' | 'custom'`
- `FieldSchema` с полями: `type`, `required`, `indexed`, `cardinality`, `validation`, `children`, `label`, `placeholder`, `uiWidget`, `uiProps`, `group`
- `EntitySchema` с полем `schema: Record<string, FieldSchema>`

**Файлы:** `src/types/schemaForm.ts`

**Зависимости:** Нет

---

### Задача 2: Создать утилиту преобразования ZBlueprintSchema в EntitySchema

**Описание:** Создать функцию `convertBlueprintSchemaToEntitySchema` в `src/utils/schemaConverter.ts`, которая:

- Преобразует `ZBlueprintSchema` (из API) в `EntitySchema` (для FormModel)
- Маппит типы данных: `'string'`, `'text'`, `'int'`, `'float'`, `'bool'`, `'date'`, `'datetime'`, `'json'`, `'ref'`
- Преобразует `ZValidationRule[]` в `ValidationSpec[]`
- Рекурсивно обрабатывает `children` для `json` полей
- Генерирует `label` из имени поля, если не указано

**Файлы:** `src/utils/schemaConverter.ts`

**Зависимости:** Задача 1

---

### Задача 3: Создать типы для вывода значений формы (InferFormValues)

**Описание:** Создать рекурсивные типы в `src/types/schemaForm.ts`:

- `InferFieldValue<F extends FieldSchema>` - выводит тип значения поля
- `InferFormValues<S extends Record<string, FieldSchema>>` - выводит тип значений формы
- `FormValues<E extends EntitySchema>` - алиас для удобства

**Логика:**

- `json` + `children` → рекурсивный `InferFormValues<children>`
- `string` | `text` → `string`
- `int` | `float` → `number`
- `bool` → `boolean`
- `date` | `datetime` → `string` (ISO формат)
- `ref` → `string | number`
- `cardinality: 'many'` → `Array<InferFieldValue>`
- `cardinality: 'one'` → `InferFieldValue`

**Файлы:** `src/types/schemaForm.ts`

**Зависимости:** Задача 1

---

### Задача 4: Создать утилиты для работы с путями (getValueByPath, setValueByPath, pathToString)

**Описание:** Создать функции в `src/utils/pathUtils.ts`:

- `getValueByPath(obj: any, path: PathSegment[]): any` - получение значения по пути
- `setValueByPath(obj: any, path: PathSegment[], value: any): void` - установка значения по пути
- `pathToString(path: PathSegment[]): string` - преобразование пути в строку вида `"rrrr[0].eeee[1]"`
- `type PathSegment = string | number`

**Особенности:**

- `setValueByPath` создаёт промежуточные объекты/массивы при необходимости
- `pathToString` форматирует индексы массивов как `[0]`, а строковые ключи как `.key`

**Файлы:** `src/utils/pathUtils.ts` (или расширить существующий)

**Зависимости:** Нет

---

### Задача 5: Создать функцию инициализации значений по умолчанию (createDefaultValues)

**Описание:** Создать функцию `createDefaultValues` в `src/utils/formModelUtils.ts`:

- Принимает `EntitySchema` и опциональные `initial` значения
- Рекурсивно обходит схему и создаёт значения по умолчанию:
  - `string` | `text` → `''` или значение из `initial`
  - `int` | `float` → `0` или значение из `initial`
  - `bool` → `false` или значение из `initial`
  - `date` | `datetime` → `''` или значение из `initial`
  - `ref` → `null` или значение из `initial`
  - `json` → рекурсивно создаёт объект из `children`
  - `cardinality: 'many'` → `[]` или значение из `initial`
  - `cardinality: 'one'` → значение по типу или из `initial`

**Файлы:** `src/utils/formModelUtils.ts`

**Зависимости:** Задачи 1, 3

---

### Задача 6: Создать базовую структуру FormModel класса

**Описание:** Создать класс `FormModel` в `src/stores/FormModel.ts`:

- Наследуется от MobX (использует `makeAutoObservable`)
- Поля: `schema: E`, `values: FormValues<E>`, `errors: Map<string, string[]>`
- Конструктор принимает `schema: E` и `initial?: Partial<FormValues<E>>`
- Методы-заглушки: `setValue`, `setAll`, `addArrayItem`, `removeArrayItem`, `validate`, `errorFor`
- Геттеры: `isValid`, `json`

**Файлы:** `src/stores/FormModel.ts`

**Зависимости:** Задачи 1, 3, 4, 5

---

### Задача 7: Реализовать методы работы со значениями в FormModel (setValue, setAll, addArrayItem, removeArrayItem)

**Описание:** Реализовать методы в `FormModel`:

- `setValue(path: PathSegment[], value: any): void` - устанавливает значение по пути через `setValueByPath`
- `setAll(values: Partial<FormValues<E>>): void` - обновляет все значения через spread
- `addArrayItem(path: PathSegment[], item: unknown): void` - добавляет элемент в массив по пути
- `removeArrayItem(path: PathSegment[], index: number): void` - удаляет элемент из массива по индексу

**Особенности:**

- Все методы должны работать с реактивностью MobX
- `addArrayItem` создаёт массив, если его нет
- `removeArrayItem` проверяет, что путь ведёт к массиву

**Файлы:** `src/stores/FormModel.ts`

**Зависимости:** Задача 6

---

### Задача 8: Создать базовую структуру валидации (ValidationSpec → валидатор)

**Описание:** Создать функцию `validateField` в `src/utils/validationUtils.ts`:

- Принимает `FieldSchema`, значение и путь
- Проверяет `required` (если `true` и значение пустое → ошибка)
- Обрабатывает `ValidationSpec[]`:
  - `type: 'min'` → проверка `value >= spec.value`
  - `type: 'max'` → проверка `value <= spec.value`
  - `type: 'regex'` → проверка через `RegExp`
  - `type: 'enum'` → проверка вхождения в массив
  - `type: 'custom'` → через реестр кастомных валидаторов (заглушка)
- Возвращает массив сообщений об ошибках или пустой массив

**Файлы:** `src/utils/validationUtils.ts`

**Зависимости:** Задача 1

---

## Фаза 2: Валидация и FormModel (Задачи 9-15)

### Задача 9: Реализовать рекурсивную валидацию в FormModel.validate()

**Описание:** Реализовать метод `validate()` в `FormModel`:

- Очищает `errors` перед валидацией
- Рекурсивно обходит `schema.schema` и `values`
- Для каждого поля вызывает `validateField`
- Для `json` полей рекурсивно валидирует `children`
- Для `cardinality: 'many'` валидирует каждый элемент массива
- Записывает ошибки в `errors` с ключами вида `"rrrr[0].eeee[1]"` через `pathToString`
- Возвращает `boolean` (true если ошибок нет)

**Файлы:** `src/stores/FormModel.ts`

**Зависимости:** Задачи 6, 8

---

### Задача 10: Реализовать методы errorFor и isValid в FormModel

**Описание:** Реализовать методы в `FormModel`:

- `errorFor(path: string): string | undefined` - возвращает первую ошибку для пути или `undefined`
- `get isValid(): boolean` - возвращает `errors.size === 0`

**Файлы:** `src/stores/FormModel.ts`

**Зависимости:** Задача 9

---

### Задача 11: Создать функцию генерации AntD правил из ValidationSpec (buildAntdRules)

**Описание:** Создать функцию `buildAntdRules` в `src/utils/antdRulesBuilder.ts`:

- Принимает `FieldSchema`
- Генерирует массив `Rule[]` для AntD Form:
  - Если `required: true` → добавляет `{ required: true, message: 'Обязательное поле' }`
  - Для каждого `ValidationSpec`:
    - `type: 'min'` → `{ type: 'number', min: value, message }`
    - `type: 'max'` → `{ type: 'number', max: value, message }`
    - `type: 'regex'` → `{ pattern: RegExp(pattern), message }`
    - `type: 'enum'` → `{ validator: (_, value) => enum.includes(value) ? Promise.resolve() : Promise.reject(message) }`
    - `type: 'custom'` → через реестр (заглушка)
- Возвращает `Rule[]`

**Файлы:** `src/utils/antdRulesBuilder.ts`

**Зависимости:** Задача 1

---

### Задача 12: Создать реестр кастомных валидаторов (validatorRegistry)

**Описание:** Создать реестр в `src/utils/validatorRegistry.ts`:

- Тип `CustomValidator = (value: any, spec: ValidationSpec) => string | undefined`
- Объект `validatorRegistry: Record<string, CustomValidator>`
- Функция `registerValidator(key: string, validator: CustomValidator): void`
- Функция `getValidator(key: string): CustomValidator | undefined`
- Интегрировать в `validateField` и `buildAntdRules`

**Файлы:** `src/utils/validatorRegistry.ts`

**Зависимости:** Задачи 8, 11

---

### Задача 13: Добавить поддержку UI-метаданных в схему (label, placeholder, uiWidget, uiProps, group)

**Описание:** Убедиться, что `FieldSchema` поддерживает все UI-метаданные:

- `label?: string` - отображаемое название поля
- `placeholder?: string` - placeholder для инпутов
- `uiWidget?: string` - ключ виджета в реестре
- `uiProps?: Record<string, any>` - дополнительные пропсы для виджета
- `group?: string` - логическая группа/секция для группировки полей

**Файлы:** `src/types/schemaForm.ts`

**Зависимости:** Задача 1

---

### Задача 14: Создать реестр виджетов по умолчанию (defaultRenderers)

**Описание:** Создать реестр в `src/components/schemaForm/widgetRegistry.ts`:

- Тип `FieldRenderer = (props: { schema: FieldSchema; namePath: (string | number)[] }) => React.ReactNode`
- Объект `defaultRenderers: Record<FieldType, FieldRenderer>`:
  - `string` → `<Input />`
  - `text` → `<Input.TextArea autoSize />`
  - `int` | `float` → `<InputNumber style={{ width: '100%' }} />`
  - `bool` → `<Switch />`
  - `date` → `<DatePicker style={{ width: '100%' }} />`
  - `datetime` → `<DatePicker showTime style={{ width: '100%' }} />`
  - `ref` → `<Select />` (базовая версия, будет расширена)
  - `json` → `null` (не рендерится как инпут)

**Файлы:** `src/components/schemaForm/widgetRegistry.ts`

**Зависимости:** Задача 1

---

### Задача 15: Создать расширяемый реестр кастомных виджетов (widgetRegistry)

**Описание:** Расширить реестр в `src/components/schemaForm/widgetRegistry.ts`:

- Объект `widgetRegistry: Record<string, FieldRenderer>` для кастомных виджетов
- Функция `registerWidget(key: string, renderer: FieldRenderer): void`
- Функция `getWidget(key: string): FieldRenderer | undefined`
- Функция `getFieldRenderer(schema: FieldSchema): FieldRenderer` - приоритет: `uiWidget` → `defaultRenderers[type]` → fallback

**Файлы:** `src/components/schemaForm/widgetRegistry.ts`

**Зависимости:** Задача 14

---

## Фаза 3: UI-слой и рекурсивный рендеринг (Задачи 16-23)

### Задача 16: Создать компонент SchemaForm (базовая структура)

**Описание:** Создать компонент `SchemaForm` в `src/components/schemaForm/SchemaForm.tsx`:

- Пропсы: `form: FormInstance`, `model: FormModel<E>`, `schema: E`
- Использует `observer` из `mobx-react-lite`
- Рендерит `<Form>` с `initialValues={model.values}`, `onValuesChange={(_, allValues) => model.setAll(allValues)}`
- Пока содержит только заглушку для рендеринга полей

**Файлы:** `src/components/schemaForm/SchemaForm.tsx`

**Зависимости:** Задачи 6, 11

---

### Задача 17: Реализовать рекурсивную функцию renderField для примитивных полей (one)

**Описание:** Реализовать функцию `renderField` в `SchemaForm`:

- Принимает `key: string`, `field: FieldSchema`, `parentPath: (string | number)[] = []`
- Для примитивных полей (`type !== 'json'`) с `cardinality: 'one'`:
  - Строит `namePath = [...parentPath, key]`
  - Получает `rules` через `buildAntdRules(field)`
  - Получает `renderer` через `getFieldRenderer(field)`
  - Рендерит `<Form.Item name={namePath} label={field.label ?? key} rules={rules} validateStatus={model.errorFor(pathStr) ? 'error' : undefined} help={model.errorFor(pathStr)}>{renderer({ schema: field, namePath })}</Form.Item>`

**Файлы:** `src/components/schemaForm/SchemaForm.tsx`

**Зависимости:** Задачи 15, 16

---

### Задача 18: Реализовать рендеринг примитивных полей с cardinality: 'many'

**Описание:** Расширить `renderField` для примитивных полей с `cardinality: 'many'`:

- Использует `<Form.List name={namePath}>`
- Рендерит `<Card>` с заголовком и кнопкой "Добавить"
- Для каждого элемента массива рендерит `<Space>` с полем и кнопкой "Удалить"
- Использует `renderer` для каждого элемента
- Применяет `rules` и `validateStatus`/`help` из `model.errorFor`

**Файлы:** `src/components/schemaForm/SchemaForm.tsx`

**Зависимости:** Задача 17

---

### Задача 19: Реализовать рендеринг json полей с cardinality: 'one'

**Описание:** Расширить `renderField` для `json` полей с `cardinality: 'one'`:

- Рендерит `<Card>` с заголовком `field.label ?? key`
- Рекурсивно вызывает `renderField` для каждого `child` из `field.children`
- Передаёт `namePath` как `parentPath` для дочерних полей

**Файлы:** `src/components/schemaForm/SchemaForm.tsx`

**Зависимости:** Задача 17

---

### Задача 20: Реализовать рендеринг json полей с cardinality: 'many'

**Описание:** Расширить `renderField` для `json` полей с `cardinality: 'many'`:

- Использует `<Form.List name={namePath}>`
- Рендерит `<Card>` с заголовком и кнопкой "Добавить"
- Для каждого элемента массива рендерит вложенный `<Card>` с кнопкой "Удалить"
- Внутри каждого элемента рекурсивно вызывает `renderField` для `field.children`
- Передаёт `itemPath = [...namePath, f.name]` как `parentPath`

**Файлы:** `src/components/schemaForm/SchemaForm.tsx`

**Зависимости:** Задача 19

---

### Задача 21: Интегрировать FormModel с AntD Form (синхронизация значений)

**Описание:** Обеспечить двустороннюю синхронизацию:

- При изменении значений в AntD → `model.setAll(allValues)` (уже есть в `onValuesChange`)
- При изменении значений в `model.values` → обновление формы через `form.setFieldsValue(model.values)`
- Использовать `useEffect` для отслеживания изменений `model.values` (с осторожностью, чтобы избежать циклов)

**Файлы:** `src/components/schemaForm/SchemaForm.tsx`

**Зависимости:** Задача 16

---

### Задача 22: Реализовать обработку сабмита формы с валидацией

**Описание:** Создать функцию `handleSubmit` в компоненте, использующем `SchemaForm`:

- Вызывает `await form.validateFields()` для быстрой валидации AntD
- Вызывает `model.validate()` для бизнес-валидации
- Если обе валидации прошли → возвращает `model.json`
- Если есть ошибки → показывает их через `model.errors` и `form.setFields`

**Файлы:** Пример использования в `src/pages/EntryEditorPage/EntryEditorPage.tsx` или отдельный хелпер

**Зависимости:** Задачи 9, 16

---

### Задача 23: Добавить поддержку группировки полей (group)

**Описание:** Расширить `SchemaForm` для поддержки `field.group`:

- Группировать поля по `group` перед рендерингом
- Рендерить каждую группу в отдельном `<Card>` или `<Collapse.Panel>`
- Поля без `group` рендерить в общей секции

**Файлы:** `src/components/schemaForm/SchemaForm.tsx`

**Зависимости:** Задача 16

---

## Фаза 4: Интеграция и расширения (Задачи 24-30)

### Задача 24: Создать адаптер для интеграции с существующим SchemaFormStore

**Описание:** Создать адаптер в `src/utils/schemaFormAdapter.ts`:

- Функция `createFormModelFromBlueprintSchema(blueprintId: number, initial?: Partial<FormValues>): Promise<FormModel>`
- Загружает схему через `getBlueprintSchema(blueprintId)`
- Преобразует через `convertBlueprintSchemaToEntitySchema`
- Создаёт `FormModel` с начальными значениями
- Возвращает готовый `FormModel` для использования в компонентах

**Файлы:** `src/utils/schemaFormAdapter.ts`

**Зависимости:** Задачи 2, 6

---

### Задача 25: Расширить виджет для ref полей (Select с загрузкой данных)

**Описание:** Расширить виджет `ref` в `defaultRenderers`:

- Использовать `SchemaFormStore.getReferenceData` для загрузки опций
- Рендерить `<Select>` с `options`, `loading`, `onSearch` (debounce)
- Поддерживать `field.uiProps` для кастомизации (например, `mode: 'multiple'`)

**Файлы:** `src/components/schemaForm/widgets/RefFieldWidget.tsx`, обновить `widgetRegistry.ts`

**Зависимости:** Задачи 14, 15

---

### Задача 26: Создать кастомные виджеты (title, price и др.)

**Описание:** Создать примеры кастомных виджетов:

- `title` → `<Input maxLength={200} />`
- `price` → `<InputNumber prefix="₽" min={0} style={{ width: '100%' }} />`
- Зарегистрировать их в `widgetRegistry` через `registerWidget`

**Файлы:** `src/components/schemaForm/widgets/TitleWidget.tsx`, `PriceWidget.tsx`, обновить `widgetRegistry.ts`

**Зависимости:** Задача 15

---

### Задача 27: Добавить поддержку readonly полей

**Описание:** Расширить `SchemaForm` для поддержки readonly:

- Добавить проп `readonly?: boolean` в `SchemaForm`
- Передавать `readonly` в `renderField`
- Для readonly полей устанавливать `disabled={true}` или использовать `<Input readOnly />`
- Для `json` полей с readonly скрывать кнопки "Добавить"/"Удалить"

**Файлы:** `src/components/schemaForm/SchemaForm.tsx`

**Зависимости:** Задача 16

---

### Задача 28: Создать хелпер для инициализации формы из существующих данных Entry

**Описание:** Создать функцию `initializeFormFromEntry` в `src/utils/formInitialization.ts`:

- Принимает `entry: ZEntry` и `blueprintSchema: ZBlueprintSchema`
- Преобразует данные Entry в формат `FormValues`
- Обрабатывает вложенные структуры и массивы
- Возвращает `Partial<FormValues>` для передачи в `FormModel` конструктор

**Файлы:** `src/utils/formInitialization.ts`

**Зависимости:** Задачи 2, 3

---

### Задача 29: Интегрировать новую систему в EntryEditorPage

**Описание:** Обновить `EntryEditorPage` для использования новой системы:

- Заменить использование старого `SchemaForm` на новый `FormModel` + `SchemaForm`
- Использовать `createFormModelFromBlueprintSchema` для создания модели
- Использовать `initializeFormFromEntry` для загрузки существующих данных
- Обновить обработчик сабмита для использования `model.json`

**Файлы:** `src/pages/EntryEditorPage/EntryEditorPage.tsx`, `EntryEditorStore.ts`

**Зависимости:** Задачи 24, 28

---

### Задача 30: Написать тесты для FormModel и утилит

**Описание:** Создать тесты в `src/stores/FormModel.test.ts` и `src/utils/*.test.ts`:

- Тесты для `FormModel`: инициализация, `setValue`, `setAll`, `addArrayItem`, `removeArrayItem`, `validate`
- Тесты для `pathUtils`: `getValueByPath`, `setValueByPath`, `pathToString`
- Тесты для `validationUtils`: различные типы валидации
- Тесты для `schemaConverter`: преобразование схем
- Тесты для `formModelUtils`: создание значений по умолчанию

**Файлы:** `src/stores/FormModel.test.ts`, `src/utils/pathUtils.test.ts`, `src/utils/validationUtils.test.ts`, и др.

**Зависимости:** Все предыдущие задачи

---

## Дополнительные заметки

### Приоритеты выполнения:

1. **Критический путь:** Задачи 1-6, 9-11, 16-20 (базовая функциональность)
2. **Важно:** Задачи 7-8, 12-15, 21-22 (валидация и UI)
3. **Желательно:** Задачи 23-29 (расширения и интеграция)
4. **Опционально:** Задача 30 (тесты можно писать параллельно)

### Миграция:

- Старый `SchemaForm` с `FieldNode` можно оставить для обратной совместимости
- Новый `FormModel` + `SchemaForm` использовать для новых страниц
- Постепенно мигрировать существующие страницы

### Расширяемость:

- Все реестры (виджеты, валидаторы) можно расширять без изменения кода
- Новые типы полей добавляются через расширение `FieldType` и `defaultRenderers`
- UI-метаданные позволяют кастомизировать рендеринг без изменения схемы
