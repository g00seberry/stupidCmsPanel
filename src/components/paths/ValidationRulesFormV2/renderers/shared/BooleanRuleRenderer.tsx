import { Form, Switch } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import type { RuleRendererProps } from '../../types';

/**
 * Пропсы компонента рендеринга boolean правил.
 */
export type PropsBooleanRuleRenderer = RuleRendererProps & {
  /** Текст подсказки для правила. */
  tooltip?: string;
};

/**
 * Компонент рендеринга boolean правил (required, array_unique).
 * Отображает переключатель для boolean значений.
 */
export const BooleanRuleRenderer: React.FC<PropsBooleanRuleRenderer> = observer(({
  store,
  ruleKey,
  isReadonly,
  tooltip,
}) => {
  const [form] = Form.useForm();
  const value = store.getRule(ruleKey);

  useEffect(() => {
    form.setFieldsValue({ value: value ?? false });
  }, [value, form]);

  const handleChange = (checked: boolean) => {
    store.setRule(ruleKey, checked);
  };

  return (
    <Form form={form}>
      <Form.Item
        label="Значение"
        name="value"
        valuePropName="checked"
        tooltip={tooltip}
      >
        <Switch disabled={isReadonly} onChange={handleChange} />
      </Form.Item>
    </Form>
  );
});

