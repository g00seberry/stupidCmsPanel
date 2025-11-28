import { Form, InputNumber, Input, Switch, Collapse, Select, Space, Radio } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ZDataType, ZCardinality } from '@/types/path';
import { useMemo, useState, useCallback, useEffect } from 'react';
import type { CollapseProps } from 'antd';

type CollapseItem = NonNullable<CollapseProps['items']>[0];

/**
 * Пропсы компонента формы настройки правил валидации.
 */
export type PropsValidationRulesForm = {
  /** Экземпляр формы Ant Design. Должен содержать поле validation_rules типа ZValidationRules. */
  form: FormInstance<any>;
  /** Тип данных поля. */
  dataType?: ZDataType;
  /** Кардинальность поля (one или many). */
  cardinality?: ZCardinality;
  /** Флаг только для чтения. */
  isReadonly?: boolean;
};

/**
 * Компонент для условного правила с переключателем простой/расширенный формат.
 */
const ConditionalRuleField: React.FC<{
  form: FormInstance<any>;
  name: 'required_if' | 'prohibited_unless' | 'required_unless' | 'prohibited_if';
  label: string;
  tooltip: string;
  isReadonly?: boolean;
  operatorOptions: Array<{ label: string; value: string }>;
}> = ({ form, name, label, tooltip, isReadonly, operatorOptions }) => {
  const ruleValue = Form.useWatch(['validation_rules', name], form);
  const isSimple = typeof ruleValue === 'string' || ruleValue === undefined || ruleValue === null;
  const [mode, setMode] = useState<'simple' | 'extended'>(isSimple ? 'simple' : 'extended');

  // Синхронизируем mode с фактическим значением из формы
  useEffect(() => {
    const currentIsSimple =
      typeof ruleValue === 'string' || ruleValue === undefined || ruleValue === null;
    const newMode = currentIsSimple ? 'simple' : 'extended';
    if (mode !== newMode) {
      setMode(newMode);
    }
  }, [ruleValue, mode]);

  const handleModeChange = useCallback(
    (newMode: 'simple' | 'extended') => {
      setMode(newMode);
      if (newMode === 'simple') {
        if (ruleValue && typeof ruleValue === 'object' && ruleValue.field) {
          form.setFieldValue(['validation_rules', name], ruleValue.field);
        } else {
          form.setFieldValue(['validation_rules', name], '');
        }
      } else {
        if (typeof ruleValue === 'string' && ruleValue.trim()) {
          form.setFieldValue(['validation_rules', name], {
            field: ruleValue.trim(),
            operator: '==',
          });
        } else if (!ruleValue || (typeof ruleValue === 'object' && !ruleValue.field)) {
          form.setFieldValue(['validation_rules', name], {
            field: '',
            operator: '==',
          });
        }
      }
    },
    [form, name, ruleValue]
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Radio.Group
          size="small"
          value={mode}
          onChange={e => handleModeChange(e.target.value)}
          disabled={isReadonly}
        >
          <Radio.Button value="simple">Простой</Radio.Button>
          <Radio.Button value="extended">Расширенный</Radio.Button>
        </Radio.Group>
      </div>

      {mode === 'simple' ? (
        <Form.Item name={['validation_rules', name]} tooltip={tooltip}>
          <Input
            disabled={isReadonly}
            placeholder="is_published"
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>
      ) : (
        <Space direction="vertical" className="w-full" size="small">
          <Form.Item
            label="Поле"
            name={['validation_rules', name, 'field']}
            rules={[{ required: true, message: 'Укажите поле' }]}
            tooltip="Путь к полю для проверки условия (например, 'is_published')."
          >
            <Input
              disabled={isReadonly}
              placeholder="is_published"
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item
            label="Оператор"
            name={['validation_rules', name, 'operator']}
            tooltip="Оператор сравнения. По умолчанию '=='."
            initialValue="=="
          >
            <Select disabled={isReadonly} options={operatorOptions} />
          </Form.Item>

          <Form.Item
            label="Значение (опционально)"
            name={['validation_rules', name, 'value']}
            tooltip="Значение для сравнения. Если не указано, проверяется наличие поля."
          >
            <Input
              disabled={isReadonly}
              placeholder="true, 'active', 100..."
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>
        </Space>
      )}
    </div>
  );
};

/**
 * Компонент для правила уникальности с переключателем простой/расширенный формат.
 */
const UniqueRuleField: React.FC<{
  form: FormInstance<any>;
  isReadonly?: boolean;
}> = ({ form, isReadonly }) => {
  const uniqueValue = Form.useWatch(['validation_rules', 'unique'], form);
  const isSimple =
    typeof uniqueValue === 'string' || uniqueValue === undefined || uniqueValue === null;
  const [mode, setMode] = useState<'simple' | 'extended'>(isSimple ? 'simple' : 'extended');

  // Синхронизируем mode с фактическим значением из формы
  useEffect(() => {
    const currentIsSimple =
      typeof uniqueValue === 'string' || uniqueValue === undefined || uniqueValue === null;
    const newMode = currentIsSimple ? 'simple' : 'extended';
    if (mode !== newMode) {
      setMode(newMode);
    }
  }, [uniqueValue, mode]);

  const handleModeChange = useCallback(
    (newMode: 'simple' | 'extended') => {
      setMode(newMode);
      if (newMode === 'simple') {
        if (uniqueValue && typeof uniqueValue === 'object' && uniqueValue.table) {
          form.setFieldValue(['validation_rules', 'unique'], uniqueValue.table);
        } else {
          form.setFieldValue(['validation_rules', 'unique'], '');
        }
      } else {
        if (typeof uniqueValue === 'string' && uniqueValue.trim()) {
          form.setFieldValue(['validation_rules', 'unique'], {
            table: uniqueValue.trim(),
          });
        } else if (!uniqueValue || (typeof uniqueValue === 'object' && !uniqueValue.table)) {
          form.setFieldValue(['validation_rules', 'unique'], {
            table: '',
          });
        }
      }
    },
    [form, uniqueValue]
  );

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">Формат</span>
        <Radio.Group
          size="small"
          value={mode}
          onChange={e => handleModeChange(e.target.value)}
          disabled={isReadonly}
        >
          <Radio.Button value="simple">Простой</Radio.Button>
          <Radio.Button value="extended">Расширенный</Radio.Button>
        </Radio.Group>
      </div>

      {mode === 'simple' ? (
        <Form.Item
          name={['validation_rules', 'unique']}
          tooltip="Название таблицы для проверки уникальности."
        >
          <Input disabled={isReadonly} placeholder="entries" style={{ fontFamily: 'monospace' }} />
        </Form.Item>
      ) : (
        <Space direction="vertical" className="w-full" size="middle">
          <Form.Item
            label="Таблица"
            name={['validation_rules', 'unique', 'table']}
            rules={[{ required: true, message: 'Укажите таблицу' }]}
            tooltip="Название таблицы для проверки уникальности."
          >
            <Input
              disabled={isReadonly}
              placeholder="entries"
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item
            label="Колонка (опционально)"
            name={['validation_rules', 'unique', 'column']}
            tooltip="Колонка для проверки. По умолчанию используется 'id'."
          >
            <Input disabled={isReadonly} placeholder="slug" style={{ fontFamily: 'monospace' }} />
          </Form.Item>

          <div className="rounded border border-border bg-muted p-3">
            <div className="mb-2 text-sm font-medium">Исключение (опционально)</div>
            <Space direction="vertical" className="w-full" size="small">
              <Form.Item
                label="Колонка"
                name={['validation_rules', 'unique', 'except', 'column']}
                tooltip="Колонка для исключения (например, 'id' для исключения текущей записи)."
              >
                <Input disabled={isReadonly} placeholder="id" style={{ fontFamily: 'monospace' }} />
              </Form.Item>
              <Form.Item
                label="Значение"
                name={['validation_rules', 'unique', 'except', 'value']}
                tooltip="Значение для исключения."
              >
                <Input disabled={isReadonly} placeholder="1" style={{ fontFamily: 'monospace' }} />
              </Form.Item>
            </Space>
          </div>

          <div className="rounded border border-border bg-muted p-3">
            <div className="mb-2 text-sm font-medium">Дополнительное условие (опционально)</div>
            <Space direction="vertical" className="w-full" size="small">
              <Form.Item
                label="Колонка"
                name={['validation_rules', 'unique', 'where', 'column']}
                tooltip="Колонка для дополнительного условия WHERE."
              >
                <Input
                  disabled={isReadonly}
                  placeholder="status"
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>
              <Form.Item
                label="Значение"
                name={['validation_rules', 'unique', 'where', 'value']}
                tooltip="Значение для условия WHERE."
              >
                <Input
                  disabled={isReadonly}
                  placeholder="published"
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>
            </Space>
          </div>
        </Space>
      )}
    </>
  );
};

/**
 * Компонент для правила существования с переключателем простой/расширенный формат.
 */
const ExistsRuleField: React.FC<{
  form: FormInstance<any>;
  isReadonly?: boolean;
}> = ({ form, isReadonly }) => {
  const existsValue = Form.useWatch(['validation_rules', 'exists'], form);
  const isSimple =
    typeof existsValue === 'string' || existsValue === undefined || existsValue === null;
  const [mode, setMode] = useState<'simple' | 'extended'>(isSimple ? 'simple' : 'extended');

  // Синхронизируем mode с фактическим значением из формы
  useEffect(() => {
    const currentIsSimple =
      typeof existsValue === 'string' || existsValue === undefined || existsValue === null;
    const newMode = currentIsSimple ? 'simple' : 'extended';
    if (mode !== newMode) {
      setMode(newMode);
    }
  }, [existsValue, mode]);

  const handleModeChange = useCallback(
    (newMode: 'simple' | 'extended') => {
      setMode(newMode);
      if (newMode === 'simple') {
        if (existsValue && typeof existsValue === 'object' && existsValue.table) {
          form.setFieldValue(['validation_rules', 'exists'], existsValue.table);
        } else {
          form.setFieldValue(['validation_rules', 'exists'], '');
        }
      } else {
        if (typeof existsValue === 'string' && existsValue.trim()) {
          form.setFieldValue(['validation_rules', 'exists'], {
            table: existsValue.trim(),
          });
        } else if (!existsValue || (typeof existsValue === 'object' && !existsValue.table)) {
          form.setFieldValue(['validation_rules', 'exists'], {
            table: '',
          });
        }
      }
    },
    [form, existsValue]
  );

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">Формат</span>
        <Radio.Group
          size="small"
          value={mode}
          onChange={e => handleModeChange(e.target.value)}
          disabled={isReadonly}
        >
          <Radio.Button value="simple">Простой</Radio.Button>
          <Radio.Button value="extended">Расширенный</Radio.Button>
        </Radio.Group>
      </div>

      {mode === 'simple' ? (
        <Form.Item
          name={['validation_rules', 'exists']}
          tooltip="Название таблицы для проверки существования."
        >
          <Input
            disabled={isReadonly}
            placeholder="categories"
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>
      ) : (
        <Space direction="vertical" className="w-full" size="middle">
          <Form.Item
            label="Таблица"
            name={['validation_rules', 'exists', 'table']}
            rules={[{ required: true, message: 'Укажите таблицу' }]}
            tooltip="Название таблицы для проверки существования."
          >
            <Input
              disabled={isReadonly}
              placeholder="categories"
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item
            label="Колонка (опционально)"
            name={['validation_rules', 'exists', 'column']}
            tooltip="Колонка для проверки. По умолчанию используется 'id'."
          >
            <Input disabled={isReadonly} placeholder="id" style={{ fontFamily: 'monospace' }} />
          </Form.Item>

          <div className="rounded border border-border bg-muted p-3">
            <div className="mb-2 text-sm font-medium">Дополнительное условие (опционально)</div>
            <Space direction="vertical" className="w-full" size="small">
              <Form.Item
                label="Колонка"
                name={['validation_rules', 'exists', 'where', 'column']}
                tooltip="Колонка для дополнительного условия WHERE."
              >
                <Input
                  disabled={isReadonly}
                  placeholder="status"
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>
              <Form.Item
                label="Значение"
                name={['validation_rules', 'exists', 'where', 'value']}
                tooltip="Значение для условия WHERE."
              >
                <Input
                  disabled={isReadonly}
                  placeholder="active"
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>
            </Space>
          </div>
        </Space>
      )}
    </>
  );
};

/**
 * Компонент формы для настройки правил валидации поля Path.
 * Отображает различные типы правил валидации в зависимости от типа данных и кардинальности.
 */
export const ValidationRulesForm: React.FC<PropsValidationRulesForm> = ({
  form,
  dataType,
  cardinality,
  isReadonly = false,
}) => {
  const isArray = cardinality === 'many';
  const isStringType = dataType === 'string' || dataType === 'text';
  const isNumericType = dataType === 'int' || dataType === 'float';

  const operatorOptions = useMemo(
    () => [
      { label: 'Равно (==)', value: '==' },
      { label: 'Не равно (!=)', value: '!=' },
      { label: 'Больше (>)', value: '>' },
      { label: 'Меньше (<)', value: '<' },
      { label: 'Больше или равно (>=)', value: '>=' },
      { label: 'Меньше или равно (<=)', value: '<=' },
    ],
    []
  );

  const renderBasicRules = (): CollapseItem => ({
    key: 'basic',
    label: 'Базовые правила',
    children: (
      <Space direction="vertical" className="w-full" size="middle">
        <Form.Item
          label="Обязательное поле"
          name={['validation_rules', 'required']}
          valuePropName="checked"
          tooltip="Поле обязательно к заполнению."
        >
          <Switch disabled={isReadonly} />
        </Form.Item>

        {(isStringType || isNumericType) && (
          <>
            <Form.Item
              label="Минимальное значение/длина"
              name={['validation_rules', 'min']}
              tooltip="Минимальное значение для чисел или минимальная длина для строк."
            >
              <InputNumber
                disabled={isReadonly}
                className="w-full"
                placeholder="Не указано"
                min={0}
              />
            </Form.Item>

            <Form.Item
              label="Максимальное значение/длина"
              name={['validation_rules', 'max']}
              tooltip="Максимальное значение для чисел или максимальная длина для строк."
            >
              <InputNumber
                disabled={isReadonly}
                className="w-full"
                placeholder="Не указано"
                min={0}
              />
            </Form.Item>
          </>
        )}

        {isStringType && (
          <Form.Item
            label="Регулярное выражение"
            name={['validation_rules', 'pattern']}
            tooltip="Регулярное выражение для валидации строки. Формат: /pattern/flags"
          >
            <Input
              disabled={isReadonly}
              placeholder="/^[a-z]+$/i"
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>
        )}
      </Space>
    ),
  });

  const renderArrayRules = (): CollapseItem | null => {
    if (!isArray) return null;

    return {
      key: 'array',
      label: 'Правила для массивов',
      children: (
        <Space direction="vertical" className="w-full" size="middle">
          <Form.Item
            label="Минимальное количество элементов"
            name={['validation_rules', 'array_min_items']}
            tooltip="Минимальное количество элементов в массиве."
          >
            <InputNumber
              disabled={isReadonly}
              className="w-full"
              placeholder="Не указано"
              min={0}
            />
          </Form.Item>

          <Form.Item
            label="Максимальное количество элементов"
            name={['validation_rules', 'array_max_items']}
            tooltip="Максимальное количество элементов в массиве."
          >
            <InputNumber
              disabled={isReadonly}
              className="w-full"
              placeholder="Не указано"
              min={0}
            />
          </Form.Item>

          <Form.Item
            label="Уникальность элементов"
            name={['validation_rules', 'array_unique']}
            valuePropName="checked"
            tooltip="Требовать уникальность всех элементов в массиве."
          >
            <Switch disabled={isReadonly} />
          </Form.Item>
        </Space>
      ),
    };
  };

  const renderConditionalRules = (): CollapseItem => ({
    key: 'conditional',
    label: 'Условные правила',
    children: (
      <Space direction="vertical" className="w-full" size="large">
        <ConditionalRuleField
          form={form}
          name="required_if"
          label="Обязательно, если"
          tooltip="Поле становится обязательным, если указанное условие выполнено."
          isReadonly={isReadonly}
          operatorOptions={operatorOptions}
        />

        <ConditionalRuleField
          form={form}
          name="prohibited_unless"
          label="Запрещено, если не"
          tooltip="Поле запрещено, если указанное условие не выполнено."
          isReadonly={isReadonly}
          operatorOptions={operatorOptions}
        />

        <ConditionalRuleField
          form={form}
          name="required_unless"
          label="Обязательно, если не"
          tooltip="Поле становится обязательным, если указанное условие не выполнено."
          isReadonly={isReadonly}
          operatorOptions={operatorOptions}
        />

        <ConditionalRuleField
          form={form}
          name="prohibited_if"
          label="Запрещено, если"
          tooltip="Поле запрещено, если указанное условие выполнено."
          isReadonly={isReadonly}
          operatorOptions={operatorOptions}
        />
      </Space>
    ),
  });

  const renderUniqueRule = (): CollapseItem => ({
    key: 'unique',
    label: 'Правило уникальности',
    children: <UniqueRuleField form={form} isReadonly={isReadonly} />,
  });

  const renderExistsRule = (): CollapseItem => ({
    key: 'exists',
    label: 'Правило существования',
    children: <ExistsRuleField form={form} isReadonly={isReadonly} />,
  });

  const renderFieldComparison = (): CollapseItem => ({
    key: 'field_comparison',
    label: 'Сравнение полей',
    children: (
      <Space direction="vertical" className="w-full" size="middle">
        <Form.Item
          label="Оператор"
          name={['validation_rules', 'field_comparison', 'operator']}
          rules={[{ required: true, message: 'Выберите оператор' }]}
          tooltip="Оператор сравнения."
        >
          <Select disabled={isReadonly} options={operatorOptions} placeholder="Выберите оператор" />
        </Form.Item>

        <Form.Item
          label="Путь к полю (опционально)"
          name={['validation_rules', 'field_comparison', 'field']}
          tooltip="Путь к другому полю для сравнения (например, 'content_json.start_date')."
          rules={[
            {
              validator: (_rule, value) => {
                const comparisonValue = form.getFieldValue([
                  'validation_rules',
                  'field_comparison',
                  'value',
                ]);
                if (!value && !comparisonValue) {
                  return Promise.reject(new Error('Укажите либо поле, либо значение'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            disabled={isReadonly}
            placeholder="content_json.start_date"
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>

        <Form.Item
          label="Константное значение (опционально)"
          name={['validation_rules', 'field_comparison', 'value']}
          tooltip="Константное значение для сравнения. Должно быть указано либо поле, либо значение."
          rules={[
            {
              validator: (_rule, value) => {
                const comparisonField = form.getFieldValue([
                  'validation_rules',
                  'field_comparison',
                  'field',
                ]);
                if (!value && !comparisonField) {
                  return Promise.reject(new Error('Укажите либо поле, либо значение'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            disabled={isReadonly}
            placeholder="2024-01-01"
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>
      </Space>
    ),
  });

  const collapseItems = useMemo(() => {
    if (!dataType) return [];
    const items: CollapseItem[] = [
      renderBasicRules(),
      renderArrayRules(),
      renderConditionalRules(),
      renderUniqueRule(),
      renderExistsRule(),
      renderFieldComparison(),
    ].filter((item): item is CollapseItem => item !== null);

    return items;
  }, [isArray, isStringType, isNumericType, isReadonly, form, operatorOptions, dataType]);

  if (!dataType) {
    return (
      <div className="text-muted-foreground text-sm">
        Выберите тип данных для настройки правил валидации.
      </div>
    );
  }

  return <Collapse defaultActiveKey={['basic']} ghost items={collapseItems} />;
};
