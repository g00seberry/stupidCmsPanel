import { Form, Input, Select, Space, Radio } from 'antd';
import type { RuleRendererProps } from '../../types';
import { useSimpleExtendedMode } from '../../hooks/useSimpleExtendedMode';

/**
 * Компонент рендеринга условных правил (required_if, prohibited_unless, required_unless, prohibited_if).
 * Поддерживает простой (строка) и расширенный (объект) форматы.
 */
export const ConditionalRuleRenderer: React.FC<RuleRendererProps> = ({
  form,
  ruleKey,
  isReadonly,
}) => {
  const { mode, handleModeChange } = useSimpleExtendedMode({
    form,
    ruleKey,
    extractSimpleValue: (value: any) => value?.field || '',
    createExtendedValue: (simpleValue: string) => ({
      field: simpleValue.trim(),
      operator: '==',
    }),
    getObjectKey: () => 'field',
  });

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

