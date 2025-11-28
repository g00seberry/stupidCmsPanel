import { Form, Input, Select, Space } from 'antd';
import type { RuleRendererProps } from '../types';

/**
 * Компонент рендеринга правила field_comparison.
 * Отображает форму для настройки сравнения полей.
 */
export const FieldComparisonRuleRenderer: React.FC<RuleRendererProps> = ({
  form,
  ruleKey,
  isReadonly,
}) => {
  const operatorOptions = [
    { label: 'Равно (==)', value: '==' },
    { label: 'Не равно (!=)', value: '!=' },
    { label: 'Больше (>)', value: '>' },
    { label: 'Меньше (<)', value: '<' },
    { label: 'Больше или равно (>=)', value: '>=' },
    { label: 'Меньше или равно (<=)', value: '<=' },
  ];

  return (
    <Space direction="vertical" className="w-full" size="middle">
      <Form.Item
        label="Оператор"
        name={['validation_rules', ruleKey, 'operator']}
        rules={[{ required: true, message: 'Выберите оператор' }]}
        tooltip="Оператор сравнения"
      >
        <Select disabled={isReadonly} options={operatorOptions} placeholder="Выберите оператор" />
      </Form.Item>

      <Form.Item
        label="Путь к полю (опционально)"
        name={['validation_rules', ruleKey, 'field']}
        tooltip="Путь к другому полю для сравнения (например, 'content_json.start_date')"
        rules={[
          {
            validator: (_rule, value) => {
              const comparisonValue = form.getFieldValue(['validation_rules', ruleKey, 'value']);
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
        name={['validation_rules', ruleKey, 'value']}
        tooltip="Константное значение для сравнения. Должно быть указано либо поле, либо значение"
        rules={[
          {
            validator: (_rule, value) => {
              const comparisonField = form.getFieldValue(['validation_rules', ruleKey, 'field']);
              if (!value && !comparisonField) {
                return Promise.reject(new Error('Укажите либо поле, либо значение'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input disabled={isReadonly} placeholder="2024-01-01" style={{ fontFamily: 'monospace' }} />
      </Form.Item>
    </Space>
  );
};
