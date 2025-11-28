import { Form, Input, Space, Radio } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import type { RuleRendererProps } from '../types';

/**
 * Компонент рендеринга правила exists.
 * Поддерживает простой (строка) и расширенный (объект) форматы.
 */
export const ExistsRuleRenderer: React.FC<RuleRendererProps> = ({ form, ruleKey, isReadonly }) => {
  const existsValue = Form.useWatch(['validation_rules', ruleKey], form);
  const isSimple =
    typeof existsValue === 'string' || existsValue === undefined || existsValue === null;
  const [mode, setMode] = useState<'simple' | 'extended'>(isSimple ? 'simple' : 'extended');

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
          form.setFieldValue(['validation_rules', ruleKey], existsValue.table);
        } else {
          form.setFieldValue(['validation_rules', ruleKey], '');
        }
      } else {
        if (typeof existsValue === 'string' && existsValue.trim()) {
          form.setFieldValue(['validation_rules', ruleKey], {
            table: existsValue.trim(),
          });
        } else if (!existsValue || (typeof existsValue === 'object' && !existsValue.table)) {
          form.setFieldValue(['validation_rules', ruleKey], {
            table: '',
          });
        }
      }
    },
    [form, ruleKey, existsValue]
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
          name={['validation_rules', ruleKey]}
          tooltip="Название таблицы для проверки существования"
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
            name={['validation_rules', ruleKey, 'table']}
            rules={[{ required: true, message: 'Укажите таблицу' }]}
            tooltip="Название таблицы для проверки существования"
          >
            <Input
              disabled={isReadonly}
              placeholder="categories"
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item
            label="Колонка (опционально)"
            name={['validation_rules', ruleKey, 'column']}
            tooltip="Колонка для проверки. По умолчанию используется 'id'"
          >
            <Input disabled={isReadonly} placeholder="id" style={{ fontFamily: 'monospace' }} />
          </Form.Item>

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
