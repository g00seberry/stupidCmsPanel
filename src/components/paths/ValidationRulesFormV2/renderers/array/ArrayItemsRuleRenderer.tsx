import { Form, InputNumber } from 'antd';
import type { RuleRendererProps } from '../../types';

/**
 * Компонент рендеринга правил array_min_items и array_max_items.
 * Отображает поле ввода числа для минимального/максимального количества элементов массива.
 */
export const ArrayItemsRuleRenderer: React.FC<RuleRendererProps> = ({
  ruleKey,
  isReadonly,
}) => {
  const label =
    ruleKey === 'array_min_items'
      ? 'Минимальное количество элементов'
      : 'Максимальное количество элементов';
  const tooltip =
    ruleKey === 'array_min_items'
      ? 'Минимальное количество элементов в массиве'
      : 'Максимальное количество элементов в массиве';

  return (
    <Form.Item label="Значение" name={['validation_rules', ruleKey]} tooltip={tooltip}>
      <InputNumber disabled={isReadonly} className="w-full" placeholder="Не указано" min={0} />
    </Form.Item>
  );
};

