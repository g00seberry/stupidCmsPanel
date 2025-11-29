import { Form, Input, Select, Space, Radio } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import type { RuleRendererProps } from '../../types';
import { useSimpleExtendedMode } from '../../hooks/useSimpleExtendedMode';

/**
 * Компонент рендеринга условных правил (required_if, prohibited_unless, required_unless, prohibited_if).
 * Поддерживает простой (строка) и расширенный (объект) форматы.
 */
export const ConditionalRuleRenderer: React.FC<RuleRendererProps> = observer(({
  store,
  ruleKey,
  isReadonly,
}) => {
  const [form] = Form.useForm();
  const { mode, handleModeChange } = useSimpleExtendedMode({
    store,
    ruleKey,
    extractSimpleValue: (value: any) => value?.field || '',
    createExtendedValue: (simpleValue: string) => ({
      field: simpleValue.trim(),
      operator: '==',
    }),
    getObjectKey: () => 'field',
  });

  const ruleValue = store.getRule(ruleKey);

  useEffect(() => {
    if (mode === 'simple') {
      form.setFieldsValue({ value: typeof ruleValue === 'string' ? ruleValue : '' });
    } else {
      form.setFieldsValue({
        field: (ruleValue as any)?.field || '',
        operator: (ruleValue as any)?.operator || '==',
        value: (ruleValue as any)?.value || '',
      });
    }
  }, [ruleValue, mode, form]);

  const operatorOptions = [
    { label: 'Равно (==)', value: '==' },
    { label: 'Не равно (!=)', value: '!=' },
    { label: 'Больше (>)', value: '>' },
    { label: 'Меньше (<)', value: '<' },
    { label: 'Больше или равно (>=)', value: '>=' },
    { label: 'Меньше или равно (<=)', value: '<=' },
  ];

  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.setRule(ruleKey, e.target.value || undefined);
  };

  const handleExtendedChange = () => {
    const values = form.getFieldsValue();
    store.setRule(ruleKey, {
      field: values.field || '',
      operator: values.operator || '==',
      ...(values.value && { value: values.value }),
    });
  };

  return (
    <div>
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

      <Form form={form}>
        {mode === 'simple' ? (
          <Form.Item
            name="value"
            tooltip="Путь к полю для проверки условия (например, 'is_published')"
          >
            <Input
              disabled={isReadonly}
              placeholder="is_published"
              style={{ fontFamily: 'monospace' }}
              onChange={handleSimpleChange}
            />
          </Form.Item>
        ) : (
          <Space direction="vertical" className="w-full" size="small">
            <Form.Item
              label="Поле"
              name="field"
              rules={[{ required: true, message: 'Укажите поле' }]}
              tooltip="Путь к полю для проверки условия (например, 'is_published')"
            >
              <Input
                disabled={isReadonly}
                placeholder="is_published"
                style={{ fontFamily: 'monospace' }}
                onChange={handleExtendedChange}
              />
            </Form.Item>

            <Form.Item
              label="Оператор"
              name="operator"
              tooltip="Оператор сравнения. По умолчанию '=='"
              initialValue="=="
            >
              <Select disabled={isReadonly} options={operatorOptions} onChange={handleExtendedChange} />
            </Form.Item>

            <Form.Item
              label="Значение (опционально)"
              name="value"
              tooltip="Значение для сравнения. Если не указано, проверяется наличие поля"
            >
              <Input
                disabled={isReadonly}
                placeholder="true, 'active', 100..."
                style={{ fontFamily: 'monospace' }}
                onChange={handleExtendedChange}
              />
            </Form.Item>
          </Space>
        )}
      </Form>
    </div>
  );
});

