import { Form, Input, Select, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import type { ZConditionalRule } from '@/types/path';
import type { RuleRendererProps } from '../../types';

/**
 * Компонент рендеринга условных правил (required_if, prohibited_unless, required_unless, prohibited_if).
 * Поддерживает только расширенный формат (объект с полями field, operator, value).
 */
export const ConditionalRuleRenderer: React.FC<RuleRendererProps> = observer(
  ({ store, ruleKey, isReadonly }) => {
    const [form] = Form.useForm();
    const ruleValue = store.getRule(ruleKey) as ZConditionalRule | undefined;

    useEffect(() => {
      form.setFieldsValue({
        field: ruleValue?.field || '',
        operator: ruleValue?.operator || '==',
        value: ruleValue?.value || '',
      });
    }, [ruleValue, form]);

    const operatorOptions = [
      { label: 'Равно (==)', value: '==' },
      { label: 'Не равно (!=)', value: '!=' },
      { label: 'Больше (>)', value: '>' },
      { label: 'Меньше (<)', value: '<' },
      { label: 'Больше или равно (>=)', value: '>=' },
      { label: 'Меньше или равно (<=)', value: '<=' },
    ];

    const handleChange = () => {
      const values = form.getFieldsValue();
      const field = values.field?.trim();

      // Если обязательное поле пустое, удаляем правило
      if (!field) {
        store.setRule(ruleKey, undefined);
        return;
      }

      // Сохраняем валидное правило
      const rule: ZConditionalRule = {
        field,
        operator: values.operator || '==',
      };

      // Добавляем value только если оно указано (обрабатываем строки, числа, булевы значения)
      const value = values.value;
      if (value !== undefined && value !== null) {
        // Для строк проверяем, что они не пустые
        if (typeof value === 'string') {
          const trimmedValue = value.trim();
          if (trimmedValue !== '') {
            rule.value = trimmedValue;
          }
        } else {
          // Для чисел, булевых значений и других типов сохраняем как есть
          rule.value = value;
        }
      }

      store.setRule(ruleKey, rule);
    };

    return (
      <Form form={form}>
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
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item
            label="Оператор"
            name="operator"
            tooltip="Оператор сравнения. По умолчанию '=='"
            initialValue="=="
          >
            <Select disabled={isReadonly} options={operatorOptions} onChange={handleChange} />
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
              onChange={handleChange}
            />
          </Form.Item>
        </Space>
      </Form>
    );
  }
);
