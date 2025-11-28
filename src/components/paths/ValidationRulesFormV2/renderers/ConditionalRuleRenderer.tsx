import { Form, Input, Select, Space, Radio } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import type { RuleRendererProps } from '../types';
import type { ZConditionalRule } from '@/types/path';

/**
 * Компонент рендеринга условных правил (required_if, prohibited_unless, required_unless, prohibited_if).
 * Поддерживает простой (строка) и расширенный (объект) форматы.
 */
export const ConditionalRuleRenderer: React.FC<RuleRendererProps> = ({
  form,
  ruleKey,
  isReadonly,
}) => {
  const ruleValue = Form.useWatch(['validation_rules', ruleKey], form);
  const isSimple = typeof ruleValue === 'string' || ruleValue === undefined || ruleValue === null;
  const [mode, setMode] = useState<'simple' | 'extended'>(isSimple ? 'simple' : 'extended');

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
          form.setFieldValue(['validation_rules', ruleKey], ruleValue.field);
        } else {
          form.setFieldValue(['validation_rules', ruleKey], '');
        }
      } else {
        if (typeof ruleValue === 'string' && ruleValue.trim()) {
          form.setFieldValue(['validation_rules', ruleKey], {
            field: ruleValue.trim(),
            operator: '==',
          });
        } else if (!ruleValue || (typeof ruleValue === 'object' && !ruleValue.field)) {
          form.setFieldValue(['validation_rules', ruleKey], {
            field: '',
            operator: '==',
          });
        }
      }
    },
    [form, ruleKey, ruleValue]
  );

  const operatorOptions = [
    { label: 'Равно (==)', value: '==' },
    { label: 'Не равно (!=)', value: '!=' },
    { label: 'Больше (>)', value: '>' },
    { label: 'Меньше (<)', value: '<' },
    { label: 'Больше или равно (>=)', value: '>=' },
    { label: 'Меньше или равно (<=)', value: '<=' },
  ];

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

      {mode === 'simple' ? (
        <Form.Item
          name={['validation_rules', ruleKey]}
          tooltip="Путь к полю для проверки условия (например, 'is_published')"
        >
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
            name={['validation_rules', ruleKey, 'field']}
            rules={[{ required: true, message: 'Укажите поле' }]}
            tooltip="Путь к полю для проверки условия (например, 'is_published')"
          >
            <Input
              disabled={isReadonly}
              placeholder="is_published"
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item
            label="Оператор"
            name={['validation_rules', ruleKey, 'operator']}
            tooltip="Оператор сравнения. По умолчанию '=='"
            initialValue="=="
          >
            <Select disabled={isReadonly} options={operatorOptions} />
          </Form.Item>

          <Form.Item
            label="Значение (опционально)"
            name={['validation_rules', ruleKey, 'value']}
            tooltip="Значение для сравнения. Если не указано, проверяется наличие поля"
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
