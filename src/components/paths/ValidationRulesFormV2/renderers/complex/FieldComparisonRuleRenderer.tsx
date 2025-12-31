import { Form, Input, Radio, Select, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import type { ZFieldComparisonRule } from '@/types/path/pathValidationRules';
import type { RuleRendererProps } from '../../types';

/**
 * Компонент рендеринга правила field_comparison.
 * Позволяет выбрать сравнение либо с другим полем, либо с константным значением (но не оба одновременно).
 */
export const FieldComparisonRuleRenderer: React.FC<RuleRendererProps> = observer(
  ({ store, ruleKey, isReadonly }) => {
    const [form] = Form.useForm();
    const ruleValue = store.getRule(ruleKey) as ZFieldComparisonRule | undefined;

    // Определяем тип сравнения на основе текущего значения
    const getComparisonType = (): 'field' | 'value' => {
      if (ruleValue?.field) return 'field';
      if (ruleValue?.value !== undefined && ruleValue?.value !== null) return 'value';
      return 'field'; // По умолчанию
    };

    const [comparisonType, setComparisonType] = useState<'field' | 'value'>(getComparisonType());

    useEffect(() => {
      const type = getComparisonType();
      setComparisonType(type);
      form.setFieldsValue({
        operator: ruleValue?.operator || '==',
        comparisonType: type,
        field: ruleValue?.field || '',
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

    const handleComparisonTypeChange = (newType: 'field' | 'value') => {
      setComparisonType(newType);
      // Очищаем противоположное поле при смене типа
      if (newType === 'field') {
        form.setFieldsValue({ value: '' });
      } else {
        form.setFieldsValue({ field: '' });
      }
      // Вызываем handleChange с новым типом
      handleChange(newType);
    };

    const handleChange = (typeOverride?: 'field' | 'value') => {
      const values = form.getFieldsValue();
      const operator = values.operator;
      const currentType = typeOverride || comparisonType;

      // Если оператор не указан, удаляем правило
      if (!operator) {
        store.setRule(ruleKey, undefined);
        return;
      }

      const rule: ZFieldComparisonRule = {
        operator,
      };

      // В зависимости от типа сравнения добавляем либо field, либо value
      if (currentType === 'field') {
        const field = values.field?.trim();
        if (!field) {
          // Если поле пустое, удаляем правило
          store.setRule(ruleKey, undefined);
          return;
        }
        rule.field = field;
      } else {
        const value = values.value;
        if (value === undefined || value === null) {
          // Если значение не указано, удаляем правило
          store.setRule(ruleKey, undefined);
          return;
        }
        // Для строк проверяем, что они не пустые
        if (typeof value === 'string') {
          const trimmedValue = value.trim();
          if (trimmedValue === '') {
            store.setRule(ruleKey, undefined);
            return;
          }
          rule.value = trimmedValue;
        } else {
          // Для чисел, булевых значений и других типов сохраняем как есть
          rule.value = value;
        }
      }

      store.setRule(ruleKey, rule);
    };

    // Обработчик для Select оператора
    const handleOperatorChange = () => {
      handleChange();
    };

    // Обработчик для Input полей
    const handleInputChange = () => {
      handleChange();
    };

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
              onChange={handleOperatorChange}
            />
          </Form.Item>

          <Form.Item
            label="Тип сравнения"
            name="comparisonType"
            tooltip="Выберите, с чем сравнивать: с другим полем или с константным значением"
          >
            <Radio.Group
              disabled={isReadonly}
              value={comparisonType}
              onChange={e => handleComparisonTypeChange(e.target.value)}
            >
              <Radio value="field">С другим полем</Radio>
              <Radio value="value">С константным значением</Radio>
            </Radio.Group>
          </Form.Item>

          {comparisonType === 'field' ? (
            <Form.Item
              label="Путь к полю"
              name="field"
              rules={[{ required: true, message: 'Укажите путь к полю' }]}
              tooltip="Путь к другому полю для сравнения (например, 'data_json.start_date')"
            >
              <Input
                disabled={isReadonly}
                placeholder="data_json.start_date"
                style={{ fontFamily: 'monospace' }}
                onChange={handleInputChange}
              />
            </Form.Item>
          ) : (
            <Form.Item
              label="Константное значение"
              name="value"
              rules={[{ required: true, message: 'Укажите значение' }]}
              tooltip="Константное значение для сравнения"
            >
              <Input
                disabled={isReadonly}
                placeholder="2024-01-01, 100, true..."
                style={{ fontFamily: 'monospace' }}
                onChange={handleInputChange}
              />
            </Form.Item>
          )}
        </Space>
      </Form>
    );
  }
);
