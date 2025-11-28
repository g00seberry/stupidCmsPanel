import { Form, Input, Space, Radio } from 'antd';
import type { RuleRendererProps } from '../../types';
import { useSimpleExtendedMode } from '../../hooks/useSimpleExtendedMode';

/**
 * Компонент рендеринга правила unique.
 * Поддерживает простой (строка) и расширенный (объект) форматы.
 */
export const UniqueRuleRenderer: React.FC<RuleRendererProps> = ({ form, ruleKey, isReadonly }) => {
  const { mode, handleModeChange } = useSimpleExtendedMode({
    form,
    ruleKey,
    extractSimpleValue: (value: any) => value?.table || '',
    createExtendedValue: (simpleValue: string) => ({
      table: simpleValue.trim(),
    }),
    getObjectKey: () => 'table',
  });

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
          name={['validation_rules', ruleKey]}
          tooltip="Название таблицы для проверки уникальности"
        >
          <Input disabled={isReadonly} placeholder="entries" style={{ fontFamily: 'monospace' }} />
        </Form.Item>
      ) : (
        <Space direction="vertical" className="w-full" size="middle">
          <Form.Item
            label="Таблица"
            name={['validation_rules', ruleKey, 'table']}
            rules={[{ required: true, message: 'Укажите таблицу' }]}
            tooltip="Название таблицы для проверки уникальности"
          >
            <Input
              disabled={isReadonly}
              placeholder="entries"
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item
            label="Колонка (опционально)"
            name={['validation_rules', ruleKey, 'column']}
            tooltip="Колонка для проверки. По умолчанию используется 'id'"
          >
            <Input disabled={isReadonly} placeholder="slug" style={{ fontFamily: 'monospace' }} />
          </Form.Item>

          <div className="rounded border border-border bg-muted p-3">
            <div className="mb-2 text-sm font-medium">Исключение (опционально)</div>
            <Space direction="vertical" className="w-full" size="small">
              <Form.Item
                label="Колонка"
                name={['validation_rules', ruleKey, 'except', 'column']}
                tooltip="Колонка для исключения (например, 'id' для исключения текущей записи)"
              >
                <Input disabled={isReadonly} placeholder="id" style={{ fontFamily: 'monospace' }} />
              </Form.Item>
              <Form.Item
                label="Значение"
                name={['validation_rules', ruleKey, 'except', 'value']}
                tooltip="Значение для исключения"
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
                name={['validation_rules', ruleKey, 'where', 'column']}
                tooltip="Колонка для дополнительного условия WHERE"
              >
                <Input
                  disabled={isReadonly}
                  placeholder="status"
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>
              <Form.Item
                label="Значение"
                name={['validation_rules', ruleKey, 'where', 'value']}
                tooltip="Значение для условия WHERE"
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

