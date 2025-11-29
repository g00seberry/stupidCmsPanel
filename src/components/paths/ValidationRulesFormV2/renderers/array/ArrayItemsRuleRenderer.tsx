import { Form, InputNumber } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import type { RuleRendererProps } from '../../types';

/**
 * Компонент рендеринга правил array_min_items и array_max_items.
 * Отображает поле ввода числа для минимального/максимального количества элементов массива.
 */
export const ArrayItemsRuleRenderer: React.FC<RuleRendererProps> = observer(({
  store,
  ruleKey,
  isReadonly,
}) => {
  const [form] = Form.useForm();
  const value = store.getRule(ruleKey);

  useEffect(() => {
    form.setFieldsValue({ value: value ?? undefined });
  }, [value, form]);

  const handleChange = (val: number | null) => {
    store.setRule(ruleKey, val ?? undefined);
  };

  const tooltip =
    ruleKey === 'array_min_items'
      ? 'Минимальное количество элементов в массиве'
      : 'Максимальное количество элементов в массиве';

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

