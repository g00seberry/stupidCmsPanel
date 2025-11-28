import { Form, InputNumber } from 'antd';
import type { RuleRendererProps } from '../types';

/**
 * Компонент рендеринга правил min и max.
 * Отображает поле ввода числа для минимального/максимального значения.
 */
export const MinMaxRuleRenderer: React.FC<RuleRendererProps> = ({ form, ruleKey, isReadonly }) => {
  const label = ruleKey === 'min' ? 'Минимальное значение/длина' : 'Максимальное значение/длина';
  const tooltip =
    ruleKey === 'min'
      ? 'Минимальное значение для чисел или минимальная длина для строк'
      : 'Максимальное значение для чисел или максимальная длина для строк';

  return (
    <Form.Item label="Значение" name={['validation_rules', ruleKey]} tooltip={tooltip}>
      <InputNumber disabled={isReadonly} className="w-full" placeholder="Не указано" min={0} />
    </Form.Item>
  );
};
