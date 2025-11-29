import { Form, Input, Select, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import type { RuleRendererProps } from '../../types';

/**
 * Компонент рендеринга правила field_comparison.
 * Отображает форму для настройки сравнения полей.
 */
export const FieldComparisonRuleRenderer: React.FC<RuleRendererProps> = observer(({
  store,
  ruleKey,
  isReadonly,
}) => {
  const [form] = Form.useForm();
  const ruleValue = store.getRule(ruleKey) as any;

  useEffect(() => {
    form.setFieldsValue({
      operator: ruleValue?.operator || '',
      field: ruleValue?.field || '',
      value: ruleValue?.value || '',
    });
  }, [ruleValue, form]);

  const handleChange = () => {
    const values = form.getFieldsValue();
    const result: any = {
      operator: values.operator || '',
    };
    if (values.field) result.field = values.field;
    if (values.value) result.value = values.value;
    store.setRule(ruleKey, result);
  };

  const operatorOptions = [
    { label: 'Равно (==)', value: '==' },
    { label: 'Не равно (!=)', value: '!=' },
    { label: 'Больше (>)', value: '>' },
    { label: 'Меньше (<)', value: '<' },
    { label: 'Больше или равно (>=)', value: '>=' },
    { label: 'Меньше или равно (<=)', value: '<=' },
  ];

  return (
    <Form form={form}>
      <Space direction="vertical" className="w-full" size="middle">
        <Form.Item
          label="Оператор"
          name="operator"
          rules={[{ required: true, message: 'Выберите оператор' }]}
          tooltip="Оператор сравнения"
        >
          <Select
            disabled={isReadonly}
            options={operatorOptions}
            placeholder="Выберите оператор"
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label="Путь к полю (опционально)"
          name="field"
          tooltip="Путь к другому полю для сравнения (например, 'content_json.start_date')"
          rules={[
            {
              validator: (_rule, value) => {
                const comparisonValue = form.getFieldValue('value');
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
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label="Константное значение (опционально)"
          name="value"
          tooltip="Константное значение для сравнения. Должно быть указано либо поле, либо значение"
          rules={[
            {
              validator: (_rule, value) => {
                const comparisonField = form.getFieldValue('field');
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
            onChange={handleChange}
          />
        </Form.Item>
      </Space>
    </Form>
  );
});
