# План рефакторинга: Устранение дублирования логики `cardinality: 'many'`

## Проблема

Каждый компонент поля (`PathStringField`, `PathTextAreaField`, `PathDateField`, `PathIntField`, `PathFloatField`) дублирует одинаковую логику:

1. Вычисление метаданных поля (label, rules, fieldName, disabled, tooltip, placeholder)
2. Проверка `if (path.cardinality === 'many')` с возвратом `PathListField`
3. Иначе возврат обычного `Form.Item` с полем

**Текущий паттерн в каждом компоненте:**

```typescript
const label = getFieldLabel(path);
const rules = getFormItemRules(path);
const fieldName = createFieldName(fieldNamePrefix, path.name);
const disabled = isFieldDisabled(path, readonly);
const tooltip = getFieldTooltip(path);
const placeholder = getFieldPlaceholder(path);

if (path.cardinality === 'many') {
  return (
    <PathListField
      fieldName={fieldName}
      label={label}
      rules={rules}
      disabled={disabled}
      renderField={() => <Input ... />}
      renderAddField={add => <Input ... />}
    />
  );
}

return (
  <Form.Item name={fieldName} label={label} rules={rules} tooltip={tooltip}>
    <Input ... />
  </Form.Item>
);
```

## Решение: Универсальный компонент-обёртка

Создать компонент `PathFieldWrapper`, который автоматически обрабатывает `cardinality` и принимает только рендер-функцию для поля.

## План реализации

### Этап 1: Создание базового компонента-обёртки

#### 1.1. Создать `PathFieldWrapper.tsx`

**Расположение**: `src/components/blueprintForm/fields/PathFieldWrapper.tsx`

**Функциональность**:

- Автоматически вычисляет метаданные поля
- Автоматически обрабатывает `cardinality: 'many'` через `PathListField`
- Принимает только рендер-функцию для компонента поля
- Поддерживает кастомизацию через опциональные пропсы

**Интерфейс**:

```typescript
interface PropsPathFieldWrapper {
  /** Поле Path. */
  path: ZPathTreeNode;
  /** Префикс для имени поля в форме. */
  fieldNamePrefix: (string | number)[];
  /** Флаг режима только для чтения. */
  readonly?: boolean;
  /** Функция рендера компонента поля для одного значения. */
  renderField: (props: {
    disabled: boolean;
    placeholder: string;
    tooltip?: string;
  }) => React.ReactNode;
  /** Опциональная функция рендера компонента для добавления нового элемента (для cardinality: many). */
  renderAddField?: (props: { add: () => void; placeholder: string }) => React.ReactNode;
  /** Опциональные дополнительные правила валидации. */
  additionalRules?: Rule[];
}
```

**Реализация**:

```typescript
export const PathFieldWrapper: React.FC<PropsPathFieldWrapper> = ({
  path,
  fieldNamePrefix,
  readonly,
  renderField,
  renderAddField,
  additionalRules = [],
}) => {
  const label = getFieldLabel(path);
  const rules = [...getFormItemRules(path), ...additionalRules];
  const fieldName = createFieldName(fieldNamePrefix, path.name);
  const disabled = isFieldDisabled(path, readonly);
  const tooltip = getFieldTooltip(path);
  const placeholder = getFieldPlaceholder(path);

  if (path.cardinality === 'many') {
    const defaultRenderAddField = (add: FormListOperation['add']) =>
      renderAddField ? (
        renderAddField({ add, placeholder: getFieldPlaceholder(path, 'Добавить') })
      ) : (
        <Input
          placeholder={getFieldPlaceholder(path, 'Добавить')}
          onPressEnter={e => {
            e.preventDefault();
            add();
          }}
        />
      );

    return (
      <PathListField
        fieldName={fieldName}
        label={label}
        rules={rules}
        disabled={disabled}
        renderField={(field, fieldDisabled) =>
          renderField({ disabled: fieldDisabled, placeholder, tooltip })
        }
        renderAddField={defaultRenderAddField}
      />
    );
  }

  return (
    <Form.Item name={fieldName} label={label} rules={rules} tooltip={tooltip}>
      {renderField({ disabled, placeholder, tooltip })}
    </Form.Item>
  );
};
```

#### 1.2. Создать хук `usePathFieldMeta` для мемоизации метаданных

**Расположение**: `src/components/blueprintForm/hooks/usePathFieldMeta.ts`

**Функциональность**:

- Мемоизирует вычисления метаданных поля
- Оптимизирует производительность при ре-рендерах

**Реализация**:

```typescript
export const usePathFieldMeta = (
  path: ZPathTreeNode,
  fieldNamePrefix: (string | number)[],
  readonly?: boolean
) => {
  return useMemo(
    () => ({
      label: getFieldLabel(path),
      rules: getFormItemRules(path),
      fieldName: createFieldName(fieldNamePrefix, path.name),
      disabled: isFieldDisabled(path, readonly),
      tooltip: getFieldTooltip(path),
      placeholder: getFieldPlaceholder(path),
    }),
    [path, fieldNamePrefix, readonly]
  );
};
```

### Этап 2: Рефакторинг существующих компонентов полей

#### 2.1. Рефакторинг `PathStringField`

**До**:

```typescript
export const PathStringField: React.FC<PropsPathFieldBase> = ({
  path,
  fieldNamePrefix,
  readonly,
}) => {
  const label = getFieldLabel(path);
  const rules = getFormItemRules(path);
  const fieldName = createFieldName(fieldNamePrefix, path.name);
  const disabled = isFieldDisabled(path, readonly);
  const tooltip = getFieldTooltip(path);
  const placeholder = getFieldPlaceholder(path);

  if (path.cardinality === 'many') {
    return (
      <PathListField
        fieldName={fieldName}
        label={label}
        rules={rules}
        disabled={disabled}
        renderField={() => <Input placeholder={placeholder} disabled={disabled} />}
        renderAddField={add => (
          <Input
            placeholder={getFieldPlaceholder(path, 'Добавить')}
            onPressEnter={e => {
              e.preventDefault();
              add();
            }}
          />
        )}
      />
    );
  }

  return (
    <Form.Item name={fieldName} label={label} rules={rules} tooltip={tooltip}>
      <Input placeholder={placeholder} disabled={disabled} />
    </Form.Item>
  );
};
```

**После**:

```typescript
export const PathStringField: React.FC<PropsPathFieldBase> = ({
  path,
  fieldNamePrefix,
  readonly,
}) => {
  return (
    <PathFieldWrapper
      path={path}
      fieldNamePrefix={fieldNamePrefix}
      readonly={readonly}
      renderField={({ disabled, placeholder }) => (
        <Input placeholder={placeholder} disabled={disabled} />
      )}
      renderAddField={({ add, placeholder }) => (
        <Input
          placeholder={placeholder}
          onPressEnter={e => {
            e.preventDefault();
            add();
          }}
        />
      )}
    />
  );
};
```

**Сокращение кода**: ~40 строк → ~15 строк (62% сокращение)

#### 2.2. Рефакторинг `PathTextAreaField`

**После**:

```typescript
export const PathTextAreaField: React.FC<PropsPathFieldBase> = ({
  path,
  fieldNamePrefix,
  readonly,
}) => {
  return (
    <PathFieldWrapper
      path={path}
      fieldNamePrefix={fieldNamePrefix}
      readonly={readonly}
      renderField={({ disabled, placeholder }) => (
        <Input.TextArea rows={4} placeholder={placeholder} disabled={disabled} />
      )}
      renderAddField={({ add, placeholder }) => (
        <Input.TextArea
          rows={4}
          placeholder={placeholder}
          onPressEnter={e => {
            if (e.shiftKey) {
              e.preventDefault();
              add();
            }
          }}
        />
      )}
    />
  );
};
```

#### 2.3. Рефакторинг `PathDateField`

**После**:

```typescript
export const PathDateField: React.FC<PropsPathFieldBase> = ({
  path,
  fieldNamePrefix,
  readonly,
}) => {
  return (
    <PathFieldWrapper
      path={path}
      fieldNamePrefix={fieldNamePrefix}
      readonly={readonly}
      renderField={({ disabled, placeholder }) => (
        <DatePicker
          style={{ width: '100%' }}
          format="YYYY-MM-DD"
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      renderAddField={({ add, placeholder }) => (
        <DatePicker
          style={{ width: '100%' }}
          format="YYYY-MM-DD"
          placeholder={placeholder}
          onChange={() => add()}
        />
      )}
    />
  );
};
```

#### 2.4. Рефакторинг `PathDateTimeField`

Аналогично `PathDateField`, но с форматом `"YYYY-MM-DD HH:mm"`.

#### 2.5. Рефакторинг `PathIntField`

**После**:

```typescript
export const PathIntField: React.FC<PropsPathFieldBase> = ({
  path,
  fieldNamePrefix,
  readonly,
}) => {
  return (
    <PathFieldWrapper
      path={path}
      fieldNamePrefix={fieldNamePrefix}
      readonly={readonly}
      renderField={({ disabled, placeholder }) => (
        <InputNumber
          style={{ width: '100%' }}
          step={1}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      renderAddField={({ add, placeholder }) => (
        <InputNumber
          style={{ width: '100%' }}
          step={1}
          placeholder={placeholder}
          onPressEnter={e => {
            e.preventDefault();
            add();
          }}
        />
      )}
    />
  );
};
```

#### 2.6. Рефакторинг `PathFloatField`

Аналогично `PathIntField`, но с `step={0.01}`.

#### 2.7. Специальные случаи

**`PathBoolField`**: Не требует изменений, так как не поддерживает `cardinality: 'many'`.

**`PathRefField`**: Требует особого подхода, так как имеет собственную логику загрузки данных. Можно использовать `PathFieldWrapper` с кастомной логикой в `renderField`.

**`PathJsonGroupField`**: Не требует изменений, так как имеет рекурсивную структуру и обрабатывает `cardinality` самостоятельно.

### Этап 3: Оптимизация и улучшения

#### 3.1. Добавить поддержку кастомных обработчиков для `renderAddField`

Для полей, которые требуют особого поведения при добавлении (например, `PathTextAreaField` с `Shift+Enter`), можно передать кастомный `renderAddField`.

#### 3.2. Добавить поддержку дополнительных правил валидации

Через проп `additionalRules` можно добавлять специфичные правила для конкретных полей.

#### 3.3. Мемоизация рендер-функций

Для оптимизации производительности можно мемоизировать рендер-функции через `useCallback` в компонентах полей.

## Преимущества решения

1. **Устранение дублирования**: Код обработки `cardinality` находится в одном месте
2. **Упрощение компонентов полей**: Каждый компонент поля фокусируется только на рендеринге UI
3. **Единообразие**: Все поля ведут себя одинаково для `cardinality: 'many'`
4. **Легкость изменений**: Изменение логики списков требует правки только в `PathFieldWrapper`
5. **Производительность**: Мемоизация метаданных через `usePathFieldMeta`
6. **Расширяемость**: Легко добавить новые типы полей, используя `PathFieldWrapper`

## Метрики улучшения

- **Сокращение кода**: ~60% в каждом компоненте поля
- **Устранение дублирования**: ~200 строк кода → ~50 строк в `PathFieldWrapper`
- **Улучшение поддерживаемости**: Изменения в логике списков в одном месте
- **Производительность**: Мемоизация метаданных уменьшает вычисления при ре-рендерах

## План тестирования

1. **Unit-тесты для `PathFieldWrapper`**:
   - Проверка рендеринга для `cardinality: 'one'`
   - Проверка рендеринга для `cardinality: 'many'`
   - Проверка передачи метаданных в рендер-функции
   - Проверка кастомных `renderAddField`

2. **Интеграционные тесты для рефакторированных компонентов**:
   - Проверка работы каждого типа поля с `cardinality: 'one'`
   - Проверка работы каждого типа поля с `cardinality: 'many'`
   - Проверка валидации
   - Проверка режима readonly

3. **Регрессионные тесты**:
   - Проверка, что поведение не изменилось после рефакторинга
   - Проверка работы в `EntryEditorPage`

## Риски и митигация

### Риск 1: Breaking changes в поведении

**Митигация**:

- Тщательное тестирование перед рефакторингом
- Сохранение обратной совместимости API
- Постепенный рефакторинг по одному компоненту

### Риск 2: Потеря гибкости для специальных случаев

**Митигация**:

- Поддержка кастомных `renderAddField`
- Поддержка `additionalRules`
- Возможность не использовать `PathFieldWrapper` для особых случаев

### Риск 3: Проблемы с производительностью

**Митигация**:

- Использование `useMemo` для метаданных
- Профилирование после рефакторинга
- Оптимизация при необходимости

## Оценка трудозатрат

- **Этап 1**: Создание `PathFieldWrapper` и `usePathFieldMeta` - 2-3 часа
- **Этап 2**: Рефакторинг 6 компонентов полей - 3-4 часа
- **Этап 3**: Оптимизация и улучшения - 1-2 часа
- **Тестирование**: 2-3 часа

**Итого**: 8-12 часов (1-1.5 рабочих дня)

## Порядок выполнения

1. ✅ Создать `PathFieldWrapper.tsx`
2. ✅ Создать `usePathFieldMeta.ts` (опционально, для оптимизации)
3. ✅ Рефакторить `PathStringField` (как пример)
4. ✅ Протестировать изменения
5. ✅ Рефакторить остальные компоненты по одному
6. ✅ Финальное тестирование
7. ✅ Обновить документацию

## Примеры использования после рефакторинга

### Простое поле (string)

```typescript
export const PathStringField: React.FC<PropsPathFieldBase> = (props) => (
  <PathFieldWrapper
    {...props}
    renderField={({ disabled, placeholder }) => (
      <Input placeholder={placeholder} disabled={disabled} />
    )}
  />
);
```

### Поле с кастомным поведением добавления

```typescript
export const PathTextAreaField: React.FC<PropsPathFieldBase> = (props) => (
  <PathFieldWrapper
    {...props}
    renderField={({ disabled, placeholder }) => (
      <Input.TextArea rows={4} placeholder={placeholder} disabled={disabled} />
    )}
    renderAddField={({ add, placeholder }) => (
      <Input.TextArea
        rows={4}
        placeholder={placeholder}
        onPressEnter={e => {
          if (e.shiftKey) {
            e.preventDefault();
            add();
          }
        }}
      />
    )}
  />
);
```

### Поле с дополнительными правилами валидации

```typescript
export const PathEmailField: React.FC<PropsPathFieldBase> = (props) => (
  <PathFieldWrapper
    {...props}
    additionalRules={[
      { type: 'email', message: 'Неверный формат email' }
    ]}
    renderField={({ disabled, placeholder }) => (
      <Input type="email" placeholder={placeholder} disabled={disabled} />
    )}
  />
);
```
