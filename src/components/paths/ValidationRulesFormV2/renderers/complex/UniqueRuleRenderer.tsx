import { Form, Input, Space, Radio } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import type { RuleRendererProps } from '../../types';
import { useSimpleExtendedMode } from '../../hooks/useSimpleExtendedMode';

/**
 * Компонент рендеринга правила unique.
 * Поддерживает простой (строка) и расширенный (объект) форматы.
 */
export const UniqueRuleRenderer: React.FC<RuleRendererProps> = observer(({ store, ruleKey, isReadonly }) => {
  const [form] = Form.useForm();
  const { mode, handleModeChange } = useSimpleExtendedMode({
    store,
    ruleKey,
    extractSimpleValue: (value: any) => value?.table || '',
    createExtendedValue: (simpleValue: string) => ({
      table: simpleValue.trim(),
    }),
    getObjectKey: () => 'table',
  });

  const ruleValue = store.getRule(ruleKey);

  useEffect(() => {
    if (mode === 'simple') {
      form.setFieldsValue({ value: typeof ruleValue === 'string' ? ruleValue : '' });
    } else {
      const value = ruleValue as any;
      form.setFieldsValue({
        table: value?.table || '',
        column: value?.column || '',
        exceptColumn: value?.except?.column || '',
        exceptValue: value?.except?.value || '',
        whereColumn: value?.where?.column || '',
        whereValue: value?.where?.value || '',
      });
    }
  }, [ruleValue, mode, form]);

  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.setRule(ruleKey, e.target.value || undefined);
  };

  const handleExtendedChange = () => {
    const values = form.getFieldsValue();
    const result: any = {
      table: values.table || '',
    };
    if (values.column) result.column = values.column;
    if (values.exceptColumn || values.exceptValue) {
      result.except = {};
      if (values.exceptColumn) result.except.column = values.exceptColumn;
      if (values.exceptValue) result.except.value = values.exceptValue;
    }
    if (values.whereColumn || values.whereValue) {
      result.where = {};
      if (values.whereColumn) result.where.column = values.whereColumn;
      if (values.whereValue) result.where.value = values.whereValue;
    }
    store.setRule(ruleKey, result);
  };

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

      <Form form={form}>
        {mode === 'simple' ? (
          <Form.Item
            name="value"
            tooltip="Название таблицы для проверки уникальности"
          >
            <Input
              disabled={isReadonly}
              placeholder="entries"
              style={{ fontFamily: 'monospace' }}
              onChange={handleSimpleChange}
            />
          </Form.Item>
        ) : (
          <Space direction="vertical" className="w-full" size="middle">
            <Form.Item
              label="Таблица"
              name="table"
              rules={[{ required: true, message: 'Укажите таблицу' }]}
              tooltip="Название таблицы для проверки уникальности"
            >
              <Input
                disabled={isReadonly}
                placeholder="entries"
                style={{ fontFamily: 'monospace' }}
                onChange={handleExtendedChange}
              />
            </Form.Item>

            <Form.Item
              label="Колонка (опционально)"
              name="column"
              tooltip="Колонка для проверки. По умолчанию используется 'id'"
            >
              <Input
                disabled={isReadonly}
                placeholder="slug"
                style={{ fontFamily: 'monospace' }}
                onChange={handleExtendedChange}
              />
            </Form.Item>

            <div className="rounded border border-border bg-muted p-3">
              <div className="mb-2 text-sm font-medium">Исключение (опционально)</div>
              <Space direction="vertical" className="w-full" size="small">
                <Form.Item
                  label="Колонка"
                  name="exceptColumn"
                  tooltip="Колонка для исключения (например, 'id' для исключения текущей записи)"
                >
                  <Input
                    disabled={isReadonly}
                    placeholder="id"
                    style={{ fontFamily: 'monospace' }}
                    onChange={handleExtendedChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Значение"
                  name="exceptValue"
                  tooltip="Значение для исключения"
                >
                  <Input
                    disabled={isReadonly}
                    placeholder="1"
                    style={{ fontFamily: 'monospace' }}
                    onChange={handleExtendedChange}
                  />
                </Form.Item>
              </Space>
            </div>

            <div className="rounded border border-border bg-muted p-3">
              <div className="mb-2 text-sm font-medium">Дополнительное условие (опционально)</div>
              <Space direction="vertical" className="w-full" size="small">
                <Form.Item
                  label="Колонка"
                  name="whereColumn"
                  tooltip="Колонка для дополнительного условия WHERE"
                >
                  <Input
                    disabled={isReadonly}
                    placeholder="status"
                    style={{ fontFamily: 'monospace' }}
                    onChange={handleExtendedChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Значение"
                  name="whereValue"
                  tooltip="Значение для условия WHERE"
                >
                  <Input
                    disabled={isReadonly}
                    placeholder="published"
                    style={{ fontFamily: 'monospace' }}
                    onChange={handleExtendedChange}
                  />
                </Form.Item>
              </Space>
            </div>
          </Space>
        )}
      </Form>
    </>
  );
});
