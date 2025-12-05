import { Form, Input } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import type { RuleRendererProps } from '../../types';

/**
 * Компонент рендеринга правила pattern.
 * Отображает поле ввода для регулярного выражения.
 */
export const PatternRuleRenderer: React.FC<RuleRendererProps> = observer(
  ({ store, ruleKey, isReadonly }) => {
    const [form] = Form.useForm();
    const value = store.getRule(ruleKey);

    useEffect(() => {
      form.setFieldsValue({ value: value ?? '' });
    }, [value, form]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      store.setRule(ruleKey, e.target.value || undefined);
    };

    return (
      <Form form={form}>
        <Form.Item
          label="Регулярное выражение"
          name="value"
          tooltip="Регулярное выражение для валидации строки. Формат: /pattern/flags"
        >
          <Input
            disabled={isReadonly}
            placeholder="/^[a-z]+$/i"
            style={{ fontFamily: 'monospace' }}
            onChange={handleChange}
          />
        </Form.Item>
      </Form>
    );
  }
);
