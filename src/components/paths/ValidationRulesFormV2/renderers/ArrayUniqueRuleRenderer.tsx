import { Form, Switch } from 'antd';
import type { RuleRendererProps } from '../types';

/**
 * Компонент рендеринга правила array_unique.
 * Отображает переключатель для требования уникальности элементов массива.
 */
export const ArrayUniqueRuleRenderer: React.FC<RuleRendererProps> = ({
  form,
  ruleKey,
  isReadonly,
}) => {
  return (
    <Form.Item
      label="Значение"
      name={['validation_rules', ruleKey]}
      valuePropName="checked"
      tooltip="Требовать уникальность всех элементов в массиве"
    >
      <Switch disabled={isReadonly} />
    </Form.Item>
  );
};
