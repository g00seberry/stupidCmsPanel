import { Form, InputNumber } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import type { RuleRendererProps } from '../../types';

/**
 * Компонент рендеринга правил min и max.
 * Отображает поле ввода числа для минимального/максимального значения.
 */
export const MinMaxRuleRenderer: React.FC<RuleRendererProps> = observer(({ store, ruleKey, isReadonly }) => {
  const [form] = Form.useForm();
  const value = store.getRule(ruleKey);

  useEffect(() => {
    form.setFieldsValue({ value: value ?? undefined });
  }, [value, form]);

  const handleChange = (val: number | null) => {
    store.setRule(ruleKey, val ?? undefined);
  };

  const tooltip =
    ruleKey === 'min'
      ? 'Минимальное значение для чисел или минимальная длина для строк'
      : 'Максимальное значение для чисел или максимальная длина для строк';

  return (
    <Form form={form}>
      <Form.Item label="Значение" name="value" tooltip={tooltip}>
        <InputNumber
          disabled={isReadonly}
          className="w-full"
          placeholder="Не указано"
          min={0}
          onChange={handleChange}
        />
      </Form.Item>
    </Form>
  );
});
