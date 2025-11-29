import { Form, Input, Space } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import type { ZUniqueRule } from '@/types/path';
import type { RuleRendererProps } from '../../types';

/**
 * Компонент рендеринга правила unique.
 * Поддерживает только расширенный формат (объект с полями table, column, except, where).
 */
export const UniqueRuleRenderer: React.FC<RuleRendererProps> = observer(({ store, ruleKey, isReadonly }) => {
  const [form] = Form.useForm();
  const ruleValue = store.getRule(ruleKey) as ZUniqueRule | undefined;

  useEffect(() => {
    form.setFieldsValue({
      table: ruleValue?.table || '',
      column: ruleValue?.column || '',
      exceptColumn: ruleValue?.except?.column || '',
      exceptValue: ruleValue?.except?.value || '',
      whereColumn: ruleValue?.where?.column || '',
      whereValue: ruleValue?.where?.value || '',
    });
  }, [ruleValue, form]);

  const handleChange = () => {
    const values = form.getFieldsValue();
    const table = values.table?.trim();

    // Если обязательное поле пустое, удаляем правило
    if (!table) {
      store.setRule(ruleKey, undefined);
      return;
    }

    // Создаём валидное правило
    const rule: ZUniqueRule = {
      table,
    };

    // Добавляем опциональные поля только если они указаны
    if (values.column?.trim()) {
      rule.column = values.column.trim();
    }

    // Обрабатываем except только если указаны оба поля
    const exceptColumn = values.exceptColumn?.trim();
    const exceptValue = values.exceptValue;
    if (exceptColumn && exceptValue !== undefined && exceptValue !== null) {
      // Для строк проверяем, что они не пустые
      if (typeof exceptValue === 'string') {
        const trimmedValue = exceptValue.trim();
        if (trimmedValue !== '') {
          rule.except = {
            column: exceptColumn,
            value: trimmedValue,
          };
        }
      } else {
        // Для чисел, булевых значений и других типов сохраняем как есть
        rule.except = {
          column: exceptColumn,
          value: exceptValue,
        };
      }
    }

    // Обрабатываем where только если указаны оба поля
    const whereColumn = values.whereColumn?.trim();
    const whereValue = values.whereValue;
    if (whereColumn && whereValue !== undefined && whereValue !== null) {
      // Для строк проверяем, что они не пустые
      if (typeof whereValue === 'string') {
        const trimmedValue = whereValue.trim();
        if (trimmedValue !== '') {
          rule.where = {
            column: whereColumn,
            value: trimmedValue,
          };
        }
      } else {
        // Для чисел, булевых значений и других типов сохраняем как есть
        rule.where = {
          column: whereColumn,
          value: whereValue,
        };
      }
    }

    store.setRule(ruleKey, rule);
  };

  return (
    <Form form={form}>
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
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          label="Колонка (опционально)"
          name="column"
          tooltip="Колонка для проверки. По умолчанию используется имя поля"
        >
          <Input
            disabled={isReadonly}
            placeholder="slug"
            style={{ fontFamily: 'monospace' }}
            onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </Form.Item>
          </Space>
        </div>
      </Space>
    </Form>
  );
});
